"use client";

import { useState, useRef, useEffect } from 'react';
import { Recommendation, DiagnosticState, Question, AnswerValue } from '@/lib/diagnostic/types';
import { QUESTIONS } from '@/lib/diagnostic/data';
import { calculateScores, generateResult } from '@/lib/diagnostic/engine';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function ChatInterface() {
    const t = useTranslations('diagnostic');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentQuestion = QUESTIONS[currentQIndex];
    const progress = (currentQIndex / QUESTIONS.length) * 100;

    const handleAnswer = (value: AnswerValue) => {
        const newAnswers = { ...answers, [currentQuestion.id]: value };
        setAnswers(newAnswers);

        if (currentQIndex < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQIndex(prev => prev + 1), 300);
        } else {
            finish(newAnswers);
        }
    };


    const finish = async (finalAnswers: Record<string, AnswerValue>) => {
        setIsAnalyzing(true);
        // Simulate AI thinking time
        setTimeout(async () => {
            const scores = calculateScores(finalAnswers);
            const res = generateResult(scores);
            setResult(res);
            setIsAnalyzing(false);

            // Auto-save to Supabase
            try {
                // Dynamically import to avoid server/client issues if needed, 
                // but Next.js handles server actions in client components well.
                const { saveDiagnosticResult } = await import('@/app/actions/diagnostic');
                await saveDiagnosticResult(res);
                console.log("Diagnostic result saved to Human OS database.");
            } catch (error) {
                console.error("Failed to auto-save result:", error);
            }
        }, 1500);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentQIndex, result, isAnalyzing]);

    if (result) {
        return <ResultView result={result} />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col relative border border-white/10">
            {/* Progress Bar */}
            <div className="h-1 bg-white/5 w-full">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-6" ref={scrollRef}>
                {/* Virtual Agent Intro */}
                <div className="flex gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-xl md:text-2xl shrink-0 border border-white/10 shadow-lg">
                        🌿
                    </div>
                    <div className="bg-white/[0.05] backdrop-blur-md p-4 md:p-5 rounded-2xl rounded-tl-none max-w-[90%] md:max-w-[80%] text-sm md:text-base text-slate-300 leading-relaxed border border-white/[0.08]">
                        {t('intro.bubble')}
                    </div>
                </div>

                {/* Current Question */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-3 md:gap-4"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-xl md:text-2xl shrink-0 border border-white/10 shadow-lg">
                            🌿
                        </div>
                        <div className="space-y-4 w-full">
                            <div className="bg-white/[0.06] backdrop-blur-md p-4 md:p-5 rounded-2xl rounded-tl-none text-base md:text-lg font-medium text-white border border-white/[0.1] shadow-lg">
                                {t(`questions.${currentQuestion.text}` as any)}
                            </div>

                            {/* Options */}
                            <div className="flex flex-col gap-3 pl-0 md:pl-4 w-full">
                                {currentQuestion.options.map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => handleAnswer(opt.value)}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-5 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-sm font-medium text-slate-200 hover:text-white text-left backdrop-blur-sm group cursor-pointer"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                {String.fromCharCode(65 + currentQuestion.options.indexOf(opt))}
                                            </span>
                                            {t(`options.${opt.label}` as any)}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 gap-4"
                    >
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-emerald-500/70 text-sm font-mono uppercase tracking-wider">{t('intro.analyzing')}</span>
                    </motion.div>
                )}
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    Question {currentQIndex + 1} / {QUESTIONS.length}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-500/70 font-mono">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}

function ResultView({ result }: { result: any }) {
    const t = useTranslations('diagnostic');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] p-6 md:p-8 border border-white/10"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">分析完了</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-2 tracking-tight">
                    {t('results.title')}
                </h2>
                <p className="text-emerald-400/80 text-xs md:text-sm font-medium uppercase tracking-widest">
                    {t(`results.themes.${result.theme}` as any)}
                </p>
            </div>

            {/* Human OS Status Display */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {/* CPU Load */}
                {/* CPU Load (Brain Fatigue) - No change needed (High is already bad) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 rounded-[1.5rem] border border-emerald-500/20 flex flex-col items-center"
                >
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">脳の疲れ</div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                            <circle
                                cx="28" cy="28" r="24"
                                fill="none"
                                stroke={result.humanOS.cpuLoad > 70 ? '#ef4444' : result.humanOS.cpuLoad > 40 ? '#f59e0b' : '#22c55e'}
                                strokeWidth="4"
                                strokeDasharray={150}
                                strokeDashoffset={150 - (150 * result.humanOS.cpuLoad) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">{result.humanOS.cpuLoad}%</span>
                    </div>
                    <div className={`text-[9px] mt-2 font-medium ${result.humanOS.cpuLoad > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {result.humanOS.cpuLoad > 70 ? 'オーバーヒート' : '正常'}
                    </div>
                </motion.div>

                {/* Battery */}
                {/* Body Fatigue (was Battery/Energy) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-4 rounded-[1.5rem] border border-cyan-500/20 flex flex-col items-center"
                >
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">体の疲れ</div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="w-7 h-12 border-2 border-cyan-500/50 rounded-lg p-1 relative flex flex-col justify-end bg-cyan-500/5">
                            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-[3px] bg-cyan-500/50 rounded-t-sm" />
                            <div
                                // High fatigue (>70) is Red. Low fatigue (<=70) is Cyan.
                                className={`w-full rounded-sm transition-all duration-1000 ease-out ${result.humanOS.batteryLevel > 70 ? 'bg-red-400' : 'bg-cyan-400'}`}
                                style={{ height: `${result.humanOS.batteryLevel}%` }}
                            />
                        </div>
                    </div>
                    {/* High fatigue -> "Tired" (Red). Low -> "Good" (Cyan) */}
                    <div className={`text-[9px] mt-2 font-medium ${result.humanOS.batteryLevel > 70 ? 'text-red-400' : 'text-cyan-400'}`}>
                        {result.humanOS.batteryLevel}%
                    </div>
                </motion.div>

                {/* Stability */}
                {/* Mental Fatigue (was Stability) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-4 rounded-[1.5rem] border border-violet-500/20 flex flex-col items-center"
                >
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">心の疲れ</div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                            <circle
                                cx="28" cy="28" r="24"
                                fill="none"
                                // High fatigue (>50) -> Red.
                                stroke={result.humanOS.osStability > 50 ? '#ef4444' : '#8b5cf6'}
                                strokeWidth="4"
                                strokeDasharray={150}
                                strokeDashoffset={150 - (150 * result.humanOS.osStability) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">{result.humanOS.osStability}%</span>
                    </div>
                    <div className={`text-[9px] mt-2 font-medium ${result.humanOS.osStability > 50 ? 'text-red-400' : 'text-violet-400'}`}>
                        {/* High fatigue -> Unstable. Low -> Stable. */}
                        {result.humanOS.osStability > 50 ? '不安定' : '安定'}
                    </div>
                </motion.div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6 text-red-400 text-sm backdrop-blur-sm"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-bold text-xs uppercase tracking-wider">注意</span>
                    </div>
                    {result.warnings.map((w: string) => t(`results.${w}` as any)).join(' ')}
                </motion.div>
            )}

            {/* Summary & Reasoning */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] p-6 rounded-2xl mb-8 border border-white/[0.08]"
            >
                {/* Logic-based Observations */}
                {result.observations && result.observations.length > 0 && (
                    <ul className="list-none mb-4 text-slate-400 text-sm space-y-2">
                        {result.observations.map((obs: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                {t(`results.observations.${obs}` as any)}
                            </li>
                        ))}
                    </ul>
                )}

                <p className="text-lg leading-relaxed text-slate-200 font-medium">
                    {t(`results.${result.summary}` as any)}
                </p>
            </motion.div>

            {/* Recommendations */}
            <div className="space-y-6">
                <Section title={t('results.sections.today')} items={result.recommendations.today} color="emerald" />
                <Section title={t('results.sections.week')} items={result.recommendations.week} color="cyan" />
                <Section title={t('results.sections.weekend')} items={result.recommendations.weekend} color="violet" />
                <Section title={t('results.sections.products')} items={result.recommendations.products} color="amber" />
            </div>

            <div className="mt-10 text-center">
                <motion.a
                    href="/ja/dashboard"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
                >
                    {t('results.cta')}
                </motion.a>
                <p className="text-xs text-slate-500 mt-4">
                    {t('results.disclaimer')}
                </p>
            </div>
        </motion.div>
    );
}

function Section({ title, items, color = 'emerald' }: { title: string, items: Recommendation[], color?: string }) {
    const t = useTranslations('diagnostic');

    const colorClasses: Record<string, { border: string, hover: string, badge: string }> = {
        emerald: { border: 'border-emerald-500/20', hover: 'hover:border-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-400' },
        cyan: { border: 'border-cyan-500/20', hover: 'hover:border-cyan-500/40', badge: 'bg-cyan-500/10 text-cyan-400' },
        violet: { border: 'border-violet-500/20', hover: 'hover:border-violet-500/40', badge: 'bg-violet-500/10 text-violet-400' },
        amber: { border: 'border-amber-500/20', hover: 'hover:border-amber-500/40', badge: 'bg-amber-500/10 text-amber-400' },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    if (items.length === 0) return null;
    return (
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{title}</h3>
            <div className="space-y-3">
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01, x: 3 }}
                        className={`bg-white/[0.02] border ${colors.border} ${colors.hover} p-4 rounded-xl transition-all cursor-pointer group backdrop-blur-sm`}
                    >
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {t(`items.${item.title}` as any)}
                                </h4>
                                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                    {t(`items.${item.description}` as any)}
                                </p>
                            </div>
                            <span className={`text-[9px] px-2 py-1 rounded-full ${colors.badge} font-bold uppercase tracking-wider shrink-0`}>
                                {item.intensity}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
