"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
    const t = useTranslations("nav");
    const f = useTranslations("footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0A0A0B] border-t border-white/10 text-slate-400 py-12 relative z-10 font-sans">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="inline-block mb-4">
                        <h2 className="text-2xl font-bold font-exo text-white tracking-tight">
                            SABAI ALIGN
                        </h2>
                    </Link>
                    <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                        {f("tagline1")} <br />
                        {f("tagline2")}
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-4">{f("platform")}</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/diagnostic" className="hover:text-emerald-400 transition-colors">{t('diagnostic')}</Link></li>
                        <li><Link href="/explore" className="hover:text-emerald-400 transition-colors">{t('explore')}</Link></li>
                        <li><Link href="/tourism" className="hover:text-emerald-400 transition-colors">{t('tours')}</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-4">{f("company")}</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/business" className="hover:text-emerald-400 transition-colors">{t('business')}</Link></li>
                        <li><Link href="/guide" className="hover:text-emerald-400 transition-colors">{t('guide')}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <p>&copy; {currentYear} SABAI ALIGN. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">{f("privacy")}</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">{f("terms")}</Link>
                </div>
            </div>
        </footer>
    );
}
