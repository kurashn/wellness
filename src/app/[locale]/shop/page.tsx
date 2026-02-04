import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { MOCK_RECOMMENDATIONS } from "@/lib/diagnostic/data";
import RecommendationCard from "@/components/RecommendationCard";
import Image from "next/image";

export default function ShopPage() {
    const t = useTranslations("ShopPage");

    const products = MOCK_RECOMMENDATIONS.filter(r => r.type === 'product');

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-[#0A0A0B] text-slate-200">
            <Header theme="dark" />

            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero_bg.png"
                        alt="Shop background"
                        fill
                        quality={75}
                        sizes="100vw"
                        className="object-cover object-center"
                        style={{ filter: 'grayscale(0.6) brightness(0.5)' }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0B]" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg">{t("title")}</h1>
                    <p className="text-xl md:text-2xl font-light text-slate-300 tracking-wide">{t("subtitle")}</p>
                </div>
            </section>

            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-10">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                    <h2 className="text-2xl font-bold text-white tracking-wide">{t("bestsellers_title")}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <RecommendationCard key={product.id} rec={product} delay={index * 0.1} />
                    ))}
                </div>
            </section>
        </div>
    );
}
