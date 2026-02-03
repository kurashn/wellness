import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { Link } from "@/i18n/routing";

export default function TourismPage() {
    const t = useTranslations("TourismPage");

    const packages = ["rakxa", "sindhorn", "greenroom"] as const;
    const images = {
        rakxa: "/images/retreat_urban.png",
        sindhorn: "/images/retreat_mindfulness.png",
        greenroom: "/images/retreat_healing.png"
    };

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-stone-50">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/hero_bg.png)', filter: 'sepia(0.3) contrast(1.1)' }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-exo drop-shadow-lg mb-4">
                        {t("hero_title")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
                        {t("hero_subtitle")}
                    </p>
                </div>
            </section>

            {/* Package List */}
            <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto space-y-24">
                {packages.map((pkg, index) => (
                    <div
                        key={pkg}
                        className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Image Side */}
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${images[pkg]})` }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary px-4 py-2 rounded-full font-bold shadow-lg">
                                    {t(`packages.${pkg}.duration`)}
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                {t(`packages.${pkg}.title`)}
                            </h2>
                            <div className="text-2xl text-accent font-semibold">
                                {t(`packages.${pkg}.price`)}
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {t(`packages.${pkg}.description`)}
                            </p>

                            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t("includes_label")}:
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {/* @ts-ignore */}
                                    {t.raw(`packages.${pkg}.inclusions`).map((item: string, i: number) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-accent mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg w-full md:w-auto">
                                {t("book_button")}
                            </button>
                        </div>
                    </div>
                ))}
            </section>

        </div>
    );
}
