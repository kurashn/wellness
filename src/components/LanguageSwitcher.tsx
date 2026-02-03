"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";
import clsx from "clsx";

interface LanguageSwitcherProps {
    theme?: 'light' | 'dark';
}

export default function LanguageSwitcher({ theme = 'light' }: LanguageSwitcherProps) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    const languages = [
        { code: "en", label: "EN" },
        { code: "ja", label: "JA" },
        { code: "th", label: "TH" },
    ];

    // Style configurations
    const activeClass = theme === 'dark' ? 'text-emerald-400 font-bold' : 'text-primary font-bold';
    const inactiveClass = theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-primary';
    const dividerClass = theme === 'dark' ? 'text-slate-600' : 'text-gray-300';

    return (
        <div className="flex gap-2 text-xs md:text-sm font-medium">
            {languages.map((lang, index) => (
                <div key={lang.code} className="flex items-center">
                    <button
                        onClick={() => onSelectChange(lang.code)}
                        disabled={isPending}
                        className={clsx(
                            "transition-colors",
                            locale === lang.code ? activeClass : inactiveClass
                        )}
                    >
                        {lang.label}
                    </button>
                    {index < languages.length - 1 && (
                        <span className={`ml-2 ${dividerClass}`}>|</span>
                    )}
                </div>
            ))}
        </div>
    );
}
