import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function ExplorePage() {
    const t = useTranslations("ExplorePage");

    const popularExperiences = [
        {
            key: "holistic",
            image: "/images/explore_loft_thai.png",
            category: "Mind & Spirit"
        },
        {
            key: "medical",
            image: "/images/explore_divana.png",
            category: "Medical & Wisdom"
        },
        {
            key: "active",
            image: "/images/explore_absolute_yoga.png",
            category: "Active Recovery"
        }
    ];

    const categories = [
        { key: "recovery", icon: "🛁" },
        { key: "mind", icon: "🧘" },
        { key: "body", icon: "💪" },
        { key: "nature", icon: "🌿" },
        { key: "food", icon: "🥗" },
        { key: "community", icon: "🤝" }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-stone-50">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero_bg.png"
                        alt="Explore background"
                        fill
                        quality={75}
                        sizes="100vw"
                        className="object-cover object-center"
                        style={{ filter: 'sepia(0.2) contrast(1.1)' }}
                    />
                </div>
                <div className="absolute inset-0 bg-black/30 md:backdrop-blur-[2px]" />

                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-exo drop-shadow-lg mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
                        {t("subtitle")}
                    </p>
                </div>
            </section>

            {/* Popular Section (Top 3) */}
            <section className="py-16 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary font-exo">
                        {t("popular_title")}
                    </h2>
                    <span className="text-stone-500 text-sm hidden md:inline-block">
                        {t("popular_subtitle")}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {popularExperiences.map((exp, index) => (
                        <div key={exp.key} className="group cursor-pointer">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-4">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${exp.image})` }}
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {exp.category}
                                </div>
                                <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow">
                                    #{index + 1} Popular
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-1 group-hover:text-primary transition-colors">
                                {t(`items.${exp.key}.title`)}
                            </h3>
                            <p className="text-stone-500 text-sm line-clamp-2">
                                {t(`items.${exp.key}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-primary mb-8 font-exo">{t("categories_title")}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                className="flex flex-col items-center justify-center p-6 rounded-xl bg-stone-50 border border-stone-100 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="text-4xl mb-3">{cat.icon}</span>
                                <span className="font-medium text-stone-700">{t(`categories.${cat.key}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search/Filter Teaser */}
            <section className="py-24 px-6 max-w-4xl mx-auto text-center">
                <div className="p-8 md:p-12 rounded-3xl bg-primary text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("search_cta_title")}</h2>
                        <p className="opacity-90 mb-8 max-w-lg mx-auto">
                            {t("search_cta_desc")}
                        </p>
                        <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-lg">
                            {t("search_button")}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
