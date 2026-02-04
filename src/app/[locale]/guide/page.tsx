import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Image from "next/image";

export default function GuidePage() {
    const t = useTranslations("GuidePage");

    const articles = [
        {
            id: "bkk_guide",
            category: "general",
            image: "/images/guide_bkk_general.png",
            readMinutes: 5
        },
        {
            id: "meditation_101",
            category: "mind",
            image: "/images/guide_meditation_101.png",
            readMinutes: 8
        },
        {
            id: "thai_massage",
            category: "body",
            image: "/images/retreat_healing.png",
            readMinutes: 6
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-stone-50">
            <Header />

            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero_bg.png"
                        alt="Guide background"
                        fill
                        quality={75}
                        sizes="100vw"
                        className="object-cover object-center"
                        style={{ filter: 'sepia(0.4)' }}
                    />
                </div>
                <div className="absolute inset-0 bg-black/30 md:backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-exo drop-shadow-lg mb-4">{t("title")}</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">{t("subtitle")}</p>
                </div>
            </section>

            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-primary font-exo mb-8">{t("articles_title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${article.image})` }}
                                />
                                <div className="absolute top-3 left-3 bg-white/90 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                    {t(`categories.${article.category}`)}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-stone-400 text-xs mb-2 flex items-center justify-end">
                                    <span>{t("read_time", { min: article.readMinutes })}</span>
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-primary transition-colors">
                                    {t(`items.${article.id}.title`)}
                                </h3>
                                <p className="text-stone-500 text-sm line-clamp-3 mb-4 flex-1">
                                    {t(`items.${article.id}.desc`)}
                                </p>
                                <span className="text-accent text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    {t("read_more")} →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
