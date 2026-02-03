"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Recommendation } from "@/lib/diagnostic/types";
import { Zap, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface RecommendationCardProps {
    rec: Recommendation;
    delay?: number;
    isAction?: boolean;
}

export default function RecommendationCard({ rec, delay = 0, isAction = false }: RecommendationCardProps) {
    const t = useTranslations('diagnostic');
    const [imageError, setImageError] = useState(false);

    // Check if this is a valid translation key (e.g., "a01_title", "p02_desc")
    const isTranslationKey = (key: string) => /^[a-z]\d{2}_/.test(key);

    // rec.title and rec.description are now translation keys like "a01_title", "a01_desc"
    // However, old DB entries might have already-translated text, so we need a fallback
    const translatedTitle = isTranslationKey(rec.title)
        ? t(`items.${rec.title}` as any)
        : rec.title;
    const translatedDescription = isTranslationKey(rec.description)
        ? t(`items.${rec.description}` as any)
        : rec.description;

    const showFallbackIcon = !rec.image || imageError;

    return (
        <motion.a
            href={rec.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="block group relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[1.2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className={`relative bg-[#131316] p-1 rounded-[1.2rem] overflow-hidden`}>
                <div className="bg-[#1A1A1E] border border-white/5 rounded-xl flex items-center gap-4 p-3 transition-colors group-hover:border-white/20 group-hover:bg-[#202025]">
                    {showFallbackIcon ? (
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl flex-shrink-0`}>
                            {isAction ? (
                                <Zap className="w-8 h-8 text-yellow-500/80" />
                            ) : (
                                <Package className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image
                                src={rec.image!}
                                alt={translatedTitle}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            {rec.badge && (
                                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-500/20">
                                    {rec.badge}
                                </span>
                            )}
                            <h3 className="font-bold text-white text-sm truncate">{translatedTitle}</h3>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{translatedDescription}</p>
                        {rec.price && (
                            <p className="text-xs text-emerald-400 font-mono mt-1">{rec.price}</p>
                        )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.a>
    );
}
