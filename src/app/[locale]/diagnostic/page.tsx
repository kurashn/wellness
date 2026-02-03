import ChatInterface from '@/components/diagnostic/ChatInterface';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import { getLatestDiagnosticLog } from '@/app/actions/diagnostic';

export default async function DiagnosticPage() {
    const t = await getTranslations('nav');
    const t2 = await getTranslations('diagnostic');
    const tDash = await getTranslations('Dashboard');

    try {
        // Check last diagnosis date
        const latestLog = await getLatestDiagnosticLog();
        let isRestricted = false;
        let daysRemaining = 0;

        if (latestLog) {
            const lastDate = new Date(latestLog.created_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 7) {
                isRestricted = true;
                daysRemaining = 7 - diffDays;
                // Prevent 0 or negative days remaining if calc is slightly off
                if (daysRemaining <= 0) daysRemaining = 1;
            }
        }

        if (isRestricted) {
            return (
                <div className="min-h-screen bg-[#0A0A0B] pt-16 relative overflow-hidden flex flex-col items-center justify-center">
                    {/* Background Effects */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
                    </div>

                    <Header theme="dark" />

                    <div className="relative z-10 max-w-md w-full px-6 text-center">
                        <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700 mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{t2('cooldown.title')}</h1>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            {t2('cooldown.desc', { days: daysRemaining })}
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            {tDash('back_to_dashboard')}
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-[#0A0A0B] pt-16 relative overflow-hidden">
                {/* Background Effects - Same as Dashboard */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
                </div>

                <Header theme="dark" />

                <main className="relative z-10 pt-8 pb-20 px-4 md:px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8 md:mb-10 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI診断</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-3 tracking-tight">
                                {t('diagnostic')}
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto font-light">
                                {t2('intro.subtitle')}
                            </p>
                        </div>
                        <ChatInterface />
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        console.error("DIAGNOSTIC PAGE ERROR:", error);
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="p-4 bg-red-500/10 rounded border border-red-500/20">
                    <h1 className="text-xl font-bold text-red-400 mb-2">System Error</h1>
                    <p className="text-sm text-slate-300">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </p>
                    <Link href="/dashboard" className="mt-4 inline-block text-sm underline text-red-300">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }
}
