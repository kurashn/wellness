"use client";

import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RecommendationCard from "@/components/RecommendationCard";

export default function DashboardPage() {
    const t = useTranslations("HomePage");
    const tDash = useTranslations("Dashboard");
    const tDiag = useTranslations("diagnostic");
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to check if a string is a valid translation key
    const isTranslationKey = (key: string) => /^[a-z]\d{2}_/.test(key);
    const getTranslatedText = (key: string, prefix: string = 'items.') => {
        if (isTranslationKey(key)) {
            return tDiag(`${prefix}${key}` as any);
        }
        return key; // Already translated text from old DB entries
    };

    // Real Data State
    const [latestLog, setLatestLog] = useState<any>(null);
    const [previousLog, setPreviousLog] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Streak & Check-in state
    const [streak, setStreak] = useState(0);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);



    // Daily Habits State
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    const [habitBonuses, setHabitBonuses] = useState({ totalCpuBonus: 0, totalBatteryBonus: 0, totalStabilityBonus: 0, efficiency: 40 });

    useEffect(() => {
        if (status === "loading") return;

        const fetchData = async () => {
            try {
                const { getLatestDiagnosticLog, getPreviousDiagnosticLog, getDiagnosticHistory, getUserStreak, getTodaysCheckinStatus, getTodaysCompletedHabits } = await import('@/app/actions/diagnostic');
                const latest = await getLatestDiagnosticLog();
                const previous = await getPreviousDiagnosticLog();
                const hist = await getDiagnosticHistory();
                const streakCount = await getUserStreak();
                const checkinStatus = await getTodaysCheckinStatus();
                const todaysHabits = await getTodaysCompletedHabits();
                const bonuses = calculateHabitBonuses(todaysHabits, streakCount);

                if (latest) setLatestLog(latest);
                if (previous) setPreviousLog(previous);
                if (hist) setHistory(hist);
                setStreak(streakCount);
                setHasCheckedIn(checkinStatus.hasCheckedIn);
                setCompletedHabits(todaysHabits);
                setHabitBonuses(bonuses);
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session, status]);

    const handleQuickScan = async () => {
        setIsLoading(true);
        try {
            const { performDailyCheckin } = await import('@/app/actions/diagnostic');
            // Simplified "quick scan" just logs a neutral mood for now or random
            await performDailyCheckin(70);
            setHasCheckedIn(true);
            setStreak(s => s + (hasCheckedIn ? 0 : 1)); // Optimistic update
        } catch (e) {
            console.error("Quick scan failed", e);
        } finally {
            setIsLoading(false);
        }
    };





    // Handle habit completion toggle with Optimistic Update
    const handleHabitToggle = async (habitId: string) => {
        const isCompleted = completedHabits.includes(habitId);

        // 1. Optimistic Update
        let newCompleted: string[];
        if (isCompleted) {
            newCompleted = completedHabits.filter(h => h !== habitId);
        } else {
            newCompleted = [...completedHabits, habitId];
        }

        // Apply state immediately
        setCompletedHabits(newCompleted);
        setHabitBonuses(calculateHabitBonuses(newCompleted, streak));

        // 2. Server Action
        try {
            if (isCompleted) {
                const { uncompleteHabit } = await import('@/app/actions/diagnostic');
                await uncompleteHabit(habitId);
            } else {
                const { completeHabit } = await import('@/app/actions/diagnostic');
                await completeHabit(habitId);
            }
        } catch (e) {
            console.error("Habit toggle failed", e);
            // Revert on error
            setCompletedHabits(completedHabits);
            setHabitBonuses(calculateHabitBonuses(completedHabits, streak));
            // Optional: Show toast error here
        }
    };

    // Efficiency Calculation (Streak-based)
    const calculateEfficiency = (streakCount: number) => {
        // Start at 40%, inc +2% per day, max 100% at 30 days
        const base = 0.40;
        const growth = streakCount * 0.02;
        const efficiency = Math.min(1.0, base + growth);
        return Math.floor(efficiency * 100) / 100; // 2 decimal places
    };

    // Helper for bonus calculation (client-side)
    // Bonuses reduce Fatigue (Lower is better), so we calculate positive bonus values to subtract later.
    const calculateHabitBonuses = (completedHabitIds: string[], currentStreak: number = 0) => {
        const efficiency = calculateEfficiency(currentStreak);

        const habitsData = [
            { id: 'morning_sun', cpuBonus: 5, batteryBonus: 10, stabilityBonus: 5 },
            { id: 'walk', cpuBonus: 5, batteryBonus: 10, stabilityBonus: 10 },
            { id: 'workout', cpuBonus: 10, batteryBonus: 15, stabilityBonus: 5 },
            { id: 'meditation', cpuBonus: 15, batteryBonus: 5, stabilityBonus: 15 },
            { id: 'sauna', cpuBonus: 10, batteryBonus: 10, stabilityBonus: 10 },
            { id: 'massage', cpuBonus: 5, batteryBonus: 15, stabilityBonus: 10 },
            { id: 'digital_detox', cpuBonus: 10, batteryBonus: 5, stabilityBonus: 10 },
            { id: 'sleep', cpuBonus: 15, batteryBonus: 20, stabilityBonus: 15 },
        ];
        let totalCpuBonus = 0, totalBatteryBonus = 0, totalStabilityBonus = 0;
        for (const habitId of completedHabitIds) {
            const habit = habitsData.find(h => h.id === habitId);
            if (habit) {
                totalCpuBonus += habit.cpuBonus * efficiency;
                totalBatteryBonus += habit.batteryBonus * efficiency;
                totalStabilityBonus += habit.stabilityBonus * efficiency;
            }
        }
        // Round totals
        return {
            totalCpuBonus: Math.round(totalCpuBonus),
            totalBatteryBonus: Math.round(totalBatteryBonus),
            totalStabilityBonus: Math.round(totalStabilityBonus),
            efficiency: Math.round(efficiency * 100)
        };
    };

    // Calculate comparison with previous log
    const getComparison = (current: number, previous: number | undefined, isInverse: boolean = false) => {
        if (previous === undefined) return { diff: 0, status: 'none' };
        const diff = current - previous;
        // For CPU (stress), lower is better, so inverse the comparison
        const adjustedDiff = isInverse ? -diff : diff;
        return {
            diff: Math.abs(diff),
            status: adjustedDiff > 0 ? 'improved' : adjustedDiff < 0 ? 'declined' : 'unchanged'
        };
    };

    // Time-aware greeting
    const getGreetingKey = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        if (hour < 22) return 'evening';
        return 'night';
    };

    const BackgroundEffects = () => (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
            <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[100px] mix-blend-screen" />

            {/* Grain texture overlay - Local pattern */}
            <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}></div>
        </div>
    );

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center relative overflow-hidden">
                <BackgroundEffects />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-emerald-500/50 text-xs font-mono animate-pulse">SYSTEM INITIALIZING...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex flex-col pt-16 font-sans relative overflow-hidden">
                <BackgroundEffects />
                <Header theme="dark" />
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-md w-full"
                    >
                        <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
                                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-3 tracking-tight">
                                        Human OS
                                    </h1>
                                    <p className="text-slate-400 mb-10 leading-relaxed font-light">
                                        あなたの生体データを同期して<br />心身のパフォーマンスを最適化します
                                    </p>
                                </motion.div>

                                <button
                                    onClick={() => signIn("line")}
                                    disabled={isLoading}
                                    className="w-full group/btn relative overflow-hidden rounded-xl bg-[#06C755] p-[1px] transition-all hover:bg-[#06C755] active:scale-[0.98]"
                                >
                                    <div className="relative flex items-center justify-center gap-3 rounded-xl bg-[#06C755] px-4 py-4 transition-all group-hover/btn:bg-opacity-90">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                                </svg>
                                                <span className="font-bold text-white text-lg tracking-wide">LINEでログイン</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <p className="text-[10px] text-slate-500 mt-6 max-w-xs mx-auto">
                                    続行することで、利用規約およびプライバシーポリシーに同意したものとみなされます。
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Use latest log or blank defaults, with habit bonuses applied
    // Use latest log or blank defaults, with habit bonuses applied
    const baseCpu = latestLog?.cpu_load ?? 0;
    const baseBattery = latestLog?.battery_level ?? 0;
    const baseStability = latestLog?.os_stability ?? 0;

    // Apply habit bonuses (All metrics are "Fatigue", so bonuses REDUCE usage -> Subtract)
    const cpu = Math.max(0, Math.min(100, baseCpu - habitBonuses.totalCpuBonus));
    const battery = Math.max(0, Math.min(100, baseBattery - habitBonuses.totalBatteryBonus));
    const stability = Math.max(0, Math.min(100, baseStability - habitBonuses.totalStabilityBonus));
    const userName = session.user?.name || "User";

    // Habits data for rendering
    const habitsConfig = [
        { id: 'morning_sun', difficulty: 1, cpuBonus: 5, batteryBonus: 10, stabilityBonus: 5 },
        { id: 'walk', difficulty: 1, cpuBonus: 5, batteryBonus: 10, stabilityBonus: 10 },
        { id: 'workout', difficulty: 3, cpuBonus: 10, batteryBonus: 15, stabilityBonus: 5 },
        { id: 'meditation', difficulty: 2, cpuBonus: 15, batteryBonus: 5, stabilityBonus: 15 },
        { id: 'sauna', difficulty: 3, cpuBonus: 10, batteryBonus: 10, stabilityBonus: 10 },
        { id: 'massage', difficulty: 4, cpuBonus: 5, batteryBonus: 15, stabilityBonus: 10 },
        { id: 'digital_detox', difficulty: 2, cpuBonus: 10, batteryBonus: 5, stabilityBonus: 10 },
        { id: 'sleep', difficulty: 1, cpuBonus: 15, batteryBonus: 20, stabilityBonus: 15 },
    ];

    // Smart Suggestion Logic
    // 1. Identify worst fatigue (highest value)
    const fatigues = [
        { id: 'cpu', val: cpu, label: tDash('cpu') },
        { id: 'battery', val: battery, label: tDash('battery') },
        { id: 'stability', val: stability, label: tDash('stability') }
    ];
    // Default to CPU if all equal
    const worstMetric = fatigues.reduce((prev, current) => (prev.val > current.val) ? prev : current);

    // 2. Find best habit for this metric
    // Map metric ID to bonus field name
    const metricToBonusField: Record<string, 'cpuBonus' | 'batteryBonus' | 'stabilityBonus'> = {
        'cpu': 'cpuBonus',
        'battery': 'batteryBonus',
        'stability': 'stabilityBonus'
    };
    const targetField = metricToBonusField[worstMetric.id];

    // Get habit with max bonus for this metric which is NOT completed yet? 
    // Actually recommendation should probably be constant until completed, or just show best general one.
    // Let's show best one regardless of completion, or maybe prioritize uncompleted.
    // Let's filter uncompleted first. If all completed, show best overall.
    const uncompleted = habitsConfig.filter(h => !completedHabits.includes(h.id));
    const candidates = uncompleted.length > 0 ? uncompleted : habitsConfig;

    const recommendedHabit = [...candidates].sort((a, b) => b[targetField] - a[targetField])[0];

    // Progress
    const progress = Math.round((completedHabits.length / habitsConfig.length) * 100);
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    // System Diagnosis Logic
    const getSystemDiagnosis = (c: number, b: number, s: number, specifics?: any) => {
        // High Resolution Diagnosis (Priority)
        if (specifics) {
            // Priority 1: Specific Symptoms
            if (specifics.main === 'eyes') return {
                key: 'digital_overload',
                color: 'text-cyan-400',
                dot: 'bg-cyan-400',
                bg: 'bg-cyan-500/10',
                border: 'border-cyan-500/20'
            };
            if (specifics.body === 'tense') return {
                key: 'physical_tension',
                color: 'text-rose-400',
                dot: 'bg-rose-400',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/20'
            };
            if (specifics.body === 'heavy') return {
                key: 'deep_exhaustion',
                color: 'text-indigo-400',
                dot: 'bg-indigo-400',
                bg: 'bg-indigo-500/10',
                border: 'border-indigo-500/20'
            };
            if (specifics.focus === 'distracted') return {
                key: 'scattered_mind',
                color: 'text-lime-400',
                dot: 'bg-lime-400',
                bg: 'bg-lime-500/10',
                border: 'border-lime-500/20'
            };
        }

        // Critical
        if (c > 80 || b > 80 || s > 80) return {
            key: 'critical',
            color: 'text-red-500',
            dot: 'bg-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        };
        // Brain Dominant
        if (c > 60 && b < 50) return {
            key: 'brain_fog',
            color: 'text-orange-400',
            dot: 'bg-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        };
        // Body Dominant
        if (b > 60 && c < 50) return {
            key: 'low_battery',
            color: 'text-yellow-400',
            dot: 'bg-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        };
        // High Stress
        if (s > 60) return {
            key: 'high_stress',
            color: 'text-pink-400',
            dot: 'bg-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20'
        };
        // Balanced Fatigue
        if (c > 50 && b > 50 && s > 50) return {
            key: 'balanced_fatigue',
            color: 'text-purple-400',
            dot: 'bg-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        };
        // Optimal
        if (c < 30 && b < 30 && s < 30) return {
            key: 'optimal',
            color: 'text-emerald-400',
            dot: 'bg-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        };

        // Default (Normal) - reuse balanced or optimal for now, or add normal
        return {
            key: 'balanced_fatigue', // Fallback to general
            color: 'text-slate-400',
            dot: 'bg-slate-400', // Dot color
            bg: 'bg-slate-500/10',
            border: 'border-slate-500/20',
        };
    };

    const diagnosis = getSystemDiagnosis(cpu, battery, stability, latestLog?.result?.humanOS?.specifics);

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col pt-16 font-sans relative overflow-hidden text-slate-200">
            <BackgroundEffects />
            <Header theme="dark" />

            <main className="relative max-w-lg mx-auto w-full p-6 space-y-8 z-10 pb-24">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-5 p-2"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-black">
                            <Image
                                src={session.user?.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${session.user?.email || 'guest'}`}
                                alt="Avatar"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0A0A0B] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg font-bold text-white tracking-tight"
                        >
                            {tDash(`greetings.${getGreetingKey()}`, { name: userName })}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 mt-1"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className={`flex w-1.5 h-1.5 rounded-full ${streak > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-500"}`} />
                                <p className="text-xs font-mono text-emerald-500/80 uppercase tracking-wider">
                                    {tDash('system_status')}
                                </p>
                            </div>

                            {/* Streak Badge */}
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 2L3 14h9v8l10-12h-9l9-8z" />
                                </svg>
                                <span className="text-[10px] font-mono text-slate-300">
                                    {tDash('streak.label')}: <span className="text-white font-bold">{streak} {tDash('streak.unit')}</span>
                                </span>
                            </div>

                            {/* Efficiency Badge */}
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-[10px] font-mono text-slate-300">
                                    {tDash('recovery_efficiency')}: <span className="text-white font-bold">{habitBonuses.efficiency}%</span>
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>



                {/* System Diagnosis Report */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className={`rounded-[2rem] p-6 border backdrop-blur-xl transition-all duration-500 ${diagnosis.bg} ${diagnosis.border}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${diagnosis.dot}`} />
                            <h2 className={`text-xs font-bold tracking-wider uppercase ${diagnosis.color}`}>
                                {tDash('diagnosis.title')}
                            </h2>
                        </div>
                        <span className={`text-[10px] font-mono opacity-70 ${diagnosis.color}`}>
                            {tDash(`diagnosis.${diagnosis.key}.title`)}
                        </span>
                    </div>

                    <p className="text-sm font-medium text-white mb-3">
                        {tDash(`diagnosis.${diagnosis.key}.desc`)}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Action:</span>
                        <span className={`text-xs font-bold ${diagnosis.color} px-2 py-0.5 rounded-full bg-white/5 border border-white/5`}>
                            {tDash(`diagnosis.${diagnosis.key}.action`)}
                        </span>
                    </div>
                </motion.div>

                {/* Quick Update Button */}


                {/* Core Metrics Cards */}
                {/* Core Metrics Cards (All use isInverse=true because Lower Fatigue is improved) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="grid grid-cols-3 gap-3"
                >
                    <MetricCard
                        label={tDash('cpu')}
                        value={cpu}
                        unit="%"
                        color="emerald"
                        icon="cpu"
                        delay={0}
                        comparison={getComparison(cpu, previousLog?.cpu_load, true)}
                        tDash={tDash}
                    />
                    <MetricCard
                        label={tDash('battery')}
                        value={battery}
                        unit="%"
                        color="cyan"
                        icon="battery"
                        delay={0.1}
                        comparison={getComparison(battery, previousLog?.battery_level, true)}
                        tDash={tDash}
                    />
                    <MetricCard
                        label={tDash('stability')}
                        value={stability}
                        unit="%"
                        color="violet"
                        icon="shield"
                        delay={0.2}
                        comparison={getComparison(stability, previousLog?.os_stability, true)}
                        tDash={tDash}
                    />
                </motion.div>

                {/* Daily Habits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-6 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-2">
                                <span className="text-lg">🎯</span> {tDash('habits.title')}
                                <span className="text-[11px] text-slate-400 font-normal ml-2 bg-white/5 px-2 py-0.5 rounded-full">
                                    {new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                                </span>
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <p className="text-[10px] text-slate-500">{tDash('habits.desc')}</p>
                                <span className="text-[9px] text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {tDash('habits.reset_notice') || "Resets at 00:00"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* UX Enhancement: Progress & Recommendation */}
                    <div className="flex gap-3 h-28 mb-6">
                        {/* Progress Ring */}
                        <div className="bg-white/[0.03] rounded-2xl p-3 flex-1 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2 z-10">{tDash('habits.progress') || 'Progress'}</span>
                            <div className="relative w-16 h-16 flex items-center justify-center z-10">
                                {/* Track */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                    <circle
                                        cx="32" cy="32" r={radius}
                                        fill="none"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="6"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#34d399" />
                                            <stop offset="100%" stopColor="#22d3ee" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-white">{completedHabits.length}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">/ {habitsConfig.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="flex-[2] bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden flex flex-col justify-center group cursor-pointer"
                            onClick={() => recommendedHabit && !completedHabits.includes(recommendedHabit.id) && handleHabitToggle(recommendedHabit.id)}
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>

                            <div className="flex items-center gap-2 mb-2 z-10">
                                <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/20">
                                    {tDash('habits.recommended') || 'Recommended'}
                                </span>
                            </div>

                            <h4 className="text-lg font-bold text-white mb-1 z-10 group-hover:text-indigo-300 transition-colors">
                                {recommendedHabit ? tDash(`habits.${recommendedHabit.id}`) : 'Loading...'}
                            </h4>
                            <p className="text-[10px] text-slate-400 z-10 leading-snug max-w-[90%]">
                                <span className="text-white font-medium">{worstMetric?.label || 'General'}</span> {tDash('habits.recommended_desc') || 'Care'}
                            </p>

                            {recommendedHabit && completedHabits.includes(recommendedHabit.id) && (
                                <div className="absolute bottom-3 right-3 z-10">
                                    <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg shadow-emerald-500/50">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {habitsConfig.map((habit, index) => {
                            const isCompleted = completedHabits.includes(habit.id);
                            return (
                                <motion.div
                                    key={habit.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    onClick={() => handleHabitToggle(habit.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 group ${isCompleted
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : 'bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isCompleted
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-slate-600 group-hover:border-slate-400'
                                            }`}>
                                            {isCompleted && (
                                                <motion.svg
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </motion.svg>
                                            )}
                                        </div>
                                        <div>
                                            <span className={`text-sm font-medium transition-all ${isCompleted ? 'text-emerald-400 line-through opacity-70' : 'text-white'}`}>
                                                {tDash(`habits.${habit.id}` as any)}
                                            </span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {Array.from({ length: habit.difficulty }).map((_, i) => (
                                                    <span key={i} className="text-[8px] text-amber-400">⭐</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-mono">
                                        <span className="text-emerald-400/70">-{habit.cpuBonus}%</span>
                                        <span className="text-cyan-400/70">-{habit.batteryBonus}%</span>
                                        <span className="text-violet-400/70">-{habit.stabilityBonus}%</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Total Bonus Display */}
                    {completedHabits.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center"
                        >
                            <span className="text-xs text-slate-400 font-bold">{tDash('habits.bonus')}</span>
                            <div className="flex items-center gap-3 text-xs font-mono font-bold">
                                <span className="text-emerald-400">-{habitBonuses.totalCpuBonus}%</span>
                                <span className="text-cyan-400">-{habitBonuses.totalBatteryBonus}%</span>
                                <span className="text-violet-400">-{habitBonuses.totalStabilityBonus}%</span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stress Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-6 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-wider uppercase mb-1">{tDash('stress_level')}</h2>
                            <p className="text-[10px] text-slate-500 font-mono">{tDash('stress_history')}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${history.length > 0
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-slate-800/50 border-white/5 text-slate-400"
                            }`}>
                            <span className="relative flex h-2 w-2">
                                {history.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${history.length > 0 ? "bg-emerald-500" : "bg-slate-500"}`}></span>
                            </span>
                            <span className="text-[10px] font-bold tracking-wide uppercase">
                                {history.length > 0 ? tDash('live') : tDash('no_data')}
                            </span>
                        </div>
                    </div>

                    <div className="h-32 w-full flex items-end justify-between gap-3 px-1">
                        {history.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-slate-600 text-xs font-mono">{tDash('no_logs')}</p>
                            </div>
                        )}
                        {history.map((h: any, i: number) => {
                            const height = Math.max(h.cpu_load, 10);
                            const isHigh = h.cpu_load > 60;
                            // Format date to show month/day
                            const date = new Date(h.created_at);
                            const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${height}%`, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                                    className="w-full flex flex-col justify-end group/bar relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {h.cpu_load}%
                                    </div>
                                    <div
                                        className={`w-full rounded-t-sm relative overflow-hidden transition-all duration-500 ${isHigh
                                            ? 'bg-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                                            : 'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            }`}
                                        style={{ height: "100%" }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className={`h-[2px] w-full mt-1 rounded-full ${isHigh ? 'bg-rose-500' : 'bg-emerald-500'} opacity-50`} />
                                    <span className="text-[9px] text-slate-500 text-center mt-1 font-mono">{dateLabel}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recommended Upgrades / Products */}
                {latestLog?.result_json?.recommendations?.products?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase pl-2">{tDash('upgrades')}</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {latestLog.result_json.recommendations.products.map((rec: any, i: number) => (
                                <RecommendationCard key={rec.id} rec={rec} delay={i * 0.1} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommended Actions / Protocols */}
                {latestLog?.result_json?.recommendations?.today?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase pl-2">{tDash('protocols')}</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {latestLog.result_json.recommendations.today.map((rec: any, i: number) => (
                                <RecommendationCard key={rec.id} rec={rec} delay={i * 0.1} isAction />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Weekly Picks - Places, Facilities & Events */}
                {(latestLog?.result_json?.recommendations?.week?.length > 0 || latestLog?.result_json?.recommendations?.weekend?.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-bold text-slate-400 tracking-wider">{tDash('weekly_picks')}</h2>
                            <span className="text-[10px] font-mono text-emerald-500/60">{tDash('for_you')}</span>
                        </div>
                        <div className="space-y-3">
                            {/* Places & Facilities */}
                            {latestLog?.result_json?.recommendations?.week?.map((rec: any, i: number) => (
                                <motion.a
                                    key={rec.id}
                                    href={rec.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group block relative overflow-hidden rounded-[1.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                            {rec.image ? (
                                                <Image
                                                    src={rec.image}
                                                    alt={rec.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {rec.badge && (
                                                <div className="absolute top-0 left-0 bg-emerald-500 text-[8px] font-bold text-black px-1.5 py-0.5 rounded-br-lg">
                                                    {rec.badge}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-bold text-emerald-500/80 tracking-wider">{tDash('spot')}</span>
                                            </div>
                                            <h3 className="text-white font-bold truncate group-hover:text-emerald-400 transition-colors">{getTranslatedText(rec.title)}</h3>
                                            <p className="text-xs text-slate-500 truncate">{getTranslatedText(rec.description)}</p>
                                            {rec.location && (
                                                <div className="flex items-center gap-1 mt-1.5">
                                                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <span className="text-[10px] text-slate-500">{rec.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {rec.price && (
                                                <span className="text-xs font-bold text-emerald-400">{rec.price}</span>
                                            )}
                                            <svg className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}

                            {/* Events */}
                            {latestLog?.result_json?.recommendations?.weekend?.map((rec: any, i: number) => (
                                <motion.a
                                    key={rec.id}
                                    href={rec.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group block relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-500/10 to-purple-500/5 backdrop-blur-xl border border-violet-500/20 hover:border-violet-500/40 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                            {rec.image ? (
                                                <Image
                                                    src={rec.image}
                                                    alt={rec.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {rec.badge && (
                                                <div className="absolute top-0 left-0 bg-violet-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-br-lg">
                                                    {rec.badge}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-bold text-violet-400/80 tracking-wider">{tDash('event')}</span>
                                            </div>
                                            <h3 className="text-white font-bold truncate group-hover:text-violet-400 transition-colors">{getTranslatedText(rec.title)}</h3>
                                            <p className="text-xs text-slate-500 truncate">{getTranslatedText(rec.description)}</p>
                                            {rec.location && (
                                                <div className="flex items-center gap-1 mt-1.5">
                                                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <span className="text-[10px] text-slate-500">{rec.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {rec.price && (
                                                <span className="text-xs font-bold text-violet-400">{rec.price}</span>
                                            )}
                                            <svg className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Quick Update Modal */}

            </main>
        </div >
    );
}

function MetricCard({ label, value, unit, color, icon, delay, comparison, tDash }: any) {
    const variants = {
        emerald: { from: "from-emerald-500/20", to: "to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", shadow: "shadow-emerald-500/20" },
        cyan: { from: "from-cyan-500/20", to: "to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", shadow: "shadow-cyan-500/20" },
        violet: { from: "from-violet-500/20", to: "to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400", shadow: "shadow-violet-500/20" },
    };

    // @ts-ignore
    const theme = variants[color] || variants.emerald;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.2, type: "spring" }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative overflow-hidden bg-gradient-to-br ${theme.from} ${theme.to} backdrop-blur-md p-4 rounded-[1.5rem] border ${theme.border} flex flex-col items-center justify-center aspect-[4/5] group cursor-pointer`}
        >
            <div className={`absolute inset-0 bg-${color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className={`mb-auto w-full flex justify-between items-start`}>
                {/* Comparison Indicator */}
                {comparison && comparison.status !== 'none' && comparison.diff > 0 && (
                    <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold ${comparison.status === 'improved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                        }`}>
                        {comparison.status === 'improved' ? '↑' : '↓'}
                        {comparison.diff}%
                    </div>
                )}
                {(!comparison || comparison.status === 'none' || comparison.diff === 0) && <div />}

                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 ${theme.text}`}>
                    {icon === 'cpu' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>}
                    {icon === 'battery' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    {icon === 'shield' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                </div>
            </div>

            <div className="flex flex-col items-center z-10 my-1">
                <span className="text-3xl font-bold text-white tracking-tighter filter drop-shadow-lg">{value}</span>
                <span className={`text-xs font-bold ${theme.text} uppercase tracking-wider`}>{unit}</span>
            </div>

            <div className="mt-auto text-[10px] text-slate-400 font-medium uppercase tracking-widest">{label}</div>
        </motion.div>
    );
}
