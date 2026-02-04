import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  Dna,
  Sparkles,
  Leaf,
  Waves,
  Brain,
  Dumbbell,
  Trees,
  Salad,
  Handshake
} from "lucide-react";

export default function Home() {
  const t = useTranslations("HomePage");
  const tExplore = useTranslations("ExplorePage");
  const tCategories = useTranslations("categories");

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Header />

      {/* Hero Section - Keep existing but ensure closing tag is correct */}
      <section className="relative flex-1 flex flex-col items-center justify-center p-8 text-center overflow-hidden min-h-[90vh]">
        {/* Background Image - optimized with Next.js Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_bg.png"
            alt="Hero background"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 md:backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-lg font-exo">
            {t("title")}
          </h1>
          <p className="text-xl md:text-3xl text-gray-100 max-w-2xl mx-auto font-light tracking-wide leading-relaxed drop-shadow-md">
            {t("hero")}
          </p>
          <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto font-medium tracking-normal leading-relaxed drop-shadow-sm mt-4 opacity-90">
            {t("subhero")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/explore"
              className="px-10 py-4 bg-accent hover:bg-accent/90 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              {t("buttons.search")}
            </Link>
            <Link
              href="/diagnostic"
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
            >
              {t("buttons.diagnostic")}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator - simplified animation for mobile */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 hidden md:block md:animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0A0A0B] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-exo bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              {t("features.title")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Dna, key: "data_driven", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", glow: "emerald" },
              { icon: Sparkles, key: "curated", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", glow: "cyan" },
              { icon: Leaf, key: "holistic", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", glow: "violet" }
            ].map((feature, i) => (
              <div key={feature.key} className={`relative group p-8 rounded-3xl bg-gradient-to-br ${feature.color} border ${feature.border} backdrop-blur-sm transition-all duration-500 hover:-translate-y-2`}>
                <div className={`absolute inset-0 bg-${feature.glow}-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="mb-6 inline-block p-3 rounded-2xl bg-white/5">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{t(`features.${feature.key}.title` as any)}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {t(`features.${feature.key}.desc` as any)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences Section */}
      <section className="py-20 bg-[#111115] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{t("popular_title")}</h2>
              <div className="w-16 h-1 bg-emerald-500 rounded-full" />
            </div>
            <Link href="/explore" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors flex items-center gap-1 group">
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                key: "holistic",
                image: "/images/explore_loft_thai.png",
                tag: "Recovery",
                color: "emerald",
                price: "฿1,500+",
                location: "Phra Khanong"
              },
              {
                key: "medical",
                image: "/images/explore_divana.png",
                tag: "Medical",
                color: "cyan",
                price: "฿2,500+",
                location: "Thong Lor"
              },
              {
                key: "active",
                image: "/images/explore_absolute_yoga.png",
                tag: "Active",
                color: "violet",
                price: "฿500+",
                location: "Asoke"
              }
            ].map((item) => (
              <div key={item.key} className="bg-[#1A1A1E] rounded-2xl overflow-hidden border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                <div className="h-48 bg-slate-800 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1E] to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`bg-${item.color}-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`text-white font-bold text-lg mb-2 group-hover:text-${item.color}-400 transition-colors`}>
                    {tExplore(`items.${item.key}.title`)}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {tExplore(`items.${item.key}.desc`)}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`text-${item.color}-400 font-mono`}>{item.price}</span>
                    <span className="text-slate-500">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#0A0A0B] relative">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-exo">
              {t("categories_title")}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {t("categories_desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'recovery', icon: Waves, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              { id: 'mind', icon: Brain, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
              { id: 'body', icon: Dumbbell, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
              { id: 'nature', icon: Trees, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
              { id: 'food', icon: Salad, color: 'bg-lime-500/10 text-lime-400 border-lime-500/20' },
              { id: 'community', icon: Handshake, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.id}`}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${cat.color} backdrop-blur-sm transition-all hover:scale-105 hover:bg-opacity-20 cursor-pointer aspect-square`}
              >
                <span className="mb-3 p-3 rounded-full bg-white/5">
                  <cat.icon className="w-8 h-8" />
                </span>
                <span className="font-bold text-sm tracking-wide capitalize">{tCategories(cat.id)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
