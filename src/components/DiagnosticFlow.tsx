"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Moon, Activity, ArrowRight, RotateCcw } from "lucide-react";

export default function DiagnosticFlow() {
    const t = useTranslations("Diagnostic");
    const [step, setStep] = useState(0);
    const [answer, setAnswer] = useState<string | null>(null);

    const handleSelect = (choice: string) => {
        setAnswer(choice);
        // Simulate thinking delay
        setTimeout(() => setStep(1), 500);
    };

    const getResult = () => {
        switch (answer) {
            case "stress":
                return {
                    title: "RECOMMENDATION: Deep Rest",
                    desc: "Your nervous system is overloaded. We recommend floatation therapy or a silent onsen retreat.",
                    link: "/explore?category=Spa",
                    label: "View Spas & Onsens"
                };
            case "pain":
                return {
                    title: "RECOMMENDATION: Recovery Tech",
                    desc: "For physical inflammation, Cryotherapy and Red Light Therapy are your best allies.",
                    link: "/explore?category=Cryotherapy",
                    label: "View Recovery Hubs"
                };
            default:
                return {
                    title: "RECOMMENDATION: Balance",
                    desc: "To wake up your body and mind, try a Morning Yoga flow.",
                    link: "/explore?category=Yoga",
                    label: "View Yoga Studios"
                };
        }
    };

    const result = getResult();

    return (
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 max-w-2xl w-full mx-auto min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 text-center"
                    >
                        <h2 className="text-3xl font-bold text-primary">
                            How are you feeling today?
                        </h2>
                        <p className="text-gray-500">Let "Nong Pono" analyze your bio-rhythm.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <button
                                onClick={() => handleSelect("stress")}
                                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                            >
                                <div className="p-4 bg-teal-50 rounded-full text-teal-600 group-hover:scale-110 transition-transform">
                                    <Moon size={32} />
                                </div>
                                <span className="font-semibold text-gray-700">Stressed / Tired</span>
                            </button>

                            <button
                                onClick={() => handleSelect("pain")}
                                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                            >
                                <div className="p-4 bg-red-50 rounded-full text-red-500 group-hover:scale-110 transition-transform">
                                    <Activity size={32} />
                                </div>
                                <span className="font-semibold text-gray-700">Body Pain</span>
                            </button>

                            <button
                                onClick={() => handleSelect("dull")}
                                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                            >
                                <div className="p-4 bg-amber-50 rounded-full text-amber-500 group-hover:scale-110 transition-transform">
                                    <Brain size={32} />
                                </div>
                                <span className="font-semibold text-gray-700">Brain Fog</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <Brain size={48} />
                        </div>

                        <h3 className="text-2xl font-bold text-primary">{result.title}</h3>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto">
                            {result.desc}
                        </p>

                        <div className="pt-8 flex justify-center gap-4">
                            <button
                                onClick={() => setStep(0)}
                                className="px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 font-medium flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> Restart
                            </button>

                            <Link
                                href={result.link}
                                className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-lg flex items-center gap-2"
                            >
                                {result.label} <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
