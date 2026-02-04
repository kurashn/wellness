"use client";

import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface HeaderProps {
    theme?: 'light' | 'dark';
}

export default function Header({ theme = 'light' }: HeaderProps) {
    const t = useTranslations("nav");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { key: 'diagnostic', href: '/diagnostic', variant: 'primary' },
        { key: 'dashboard', href: '/dashboard', variant: 'secondary' },
        { key: 'explore', href: '/explore', variant: 'default' },
        { key: 'tours', href: '/tourism', variant: 'default' },
        { key: 'events', href: '/events', variant: 'default' },
        { key: 'guide', href: '/guide', variant: 'default' },
    ];

    // If dark theme (dark bg) and NOT scrolled and NOT mobile menu open -> text-white
    // Otherwise -> text-primary (dark)
    const textColorClass = (theme === 'dark' && !isScrolled && !isMobileMenuOpen) ? 'text-white' : 'text-primary';
    const mobileMenuColorClass = (theme === 'dark' && !isScrolled && !isMobileMenuOpen) ? 'text-white' : 'text-primary';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMobileMenuOpen
                ? 'bg-stone-50 py-3'
                : isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-[1920px] mx-auto px-6 xl:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-50 group">
                    <h1 className={`text-lg md:text-xl lg:text-2xl font-bold font-exo tracking-tight transition-colors whitespace-nowrap ${textColorClass}`}>
                        SABAI ALIGN
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-stone-200/50 shadow-sm">
                    {navItems.map((item) => {
                        const isPrimary = item.variant === 'primary';
                        const isSecondary = item.variant === 'secondary';

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isPrimary
                                    ? 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                                    : isSecondary
                                        ? 'bg-stone-100 text-stone-900 border border-stone-200/50 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                                    }`}
                            >
                                {t(item.key)}
                            </Link>
                        );
                    })}

                    <div className="w-px h-6 bg-stone-300 mx-3" />

                    <div className="scale-90 origin-left">
                        <LanguageSwitcher theme={isScrolled ? 'light' : theme} />
                    </div>

                    <AuthButton />
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 xl:hidden">
                    <div className={`scale-90 origin-right`}>
                        <LanguageSwitcher theme={isScrolled ? 'light' : (isMobileMenuOpen ? 'light' : theme)} />
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 hover:bg-stone-100/10 rounded-full transition-colors relative z-50 ${mobileMenuColorClass}`}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-stone-50 z-40 transition-all duration-500 xl:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}>
                    {/* Mobile Nav Items */}
                    <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`py-4 border-b border-stone-200 text-lg font-medium transition-all flex justify-between items-center group ${item.variant === 'primary' ? 'text-accent border-accent/20' : 'text-stone-800'
                                    }`}
                            >
                                {t(item.key)}
                                <span className={`text-2xl transition-transform duration-300 group-hover:translate-x-2 ${item.variant === 'primary' ? 'text-accent' : 'text-stone-300'
                                    }`}>→</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Auth (if needed locally, though mostly handled by desktop nav logic or separate mobile auth) */}
                    <div className="mt-8">
                        {/* Mobile auth logic could go here if separate from Desktop */}
                    </div>

                    <div className="mt-auto mb-12">
                        <p className="text-stone-400 text-sm mb-4">Socials</p>
                        <div className="flex gap-4">
                            {/* Social placeholders */}
                            <div className="w-10 h-10 rounded-full bg-stone-200" />
                            <div className="w-10 h-10 rounded-full bg-stone-200" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AuthButton() {
    const t = useTranslations("nav");
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
                <div className="flex items-center gap-2 bg-stone-100/50 hover:bg-stone-100 pr-1 pl-1 py-1 rounded-full border border-stone-200/50 transition-all duration-300 group">
                    {session.user?.image && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm">
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={32}
                                height={32}
                            />
                        </div>
                    )}
                    <button
                        onClick={() => signOut()}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                        title="Log out"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("line")}
            className="ml-2 bg-[#06C755] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#05b34c] transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
            <span className="text-white text-lg leading-none">L</span>
            <span className="leading-none pt-0.5">{t("login")}</span>
        </button>
    );
}
