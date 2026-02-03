import { useTranslations } from "next-intl";
import Header from "@/components/Header";

export default function EventsPage() {
    const t = useTranslations("EventsPage");

    const events = [
        {
            id: "yoga_park",
            image: "/images/events_yoga_park.png",
            location: "Lumpini Park",
            isFree: true
        },
        {
            id: "sound_bath",
            image: "/images/events_sound_bath.png",
            location: "Akasha Wellness (Riverside)",
            price: "฿500"
        },
        {
            id: "nutrition",
            image: "/images/events_nutrition.png",
            location: "Rasayana Retreat (Phrom Phong)",
            price: "฿300"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-stone-50">
            <Header />

            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/hero_bg.png)', filter: 'hue-rotate(15deg) sepia(0.2)' }}
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-exo drop-shadow-lg mb-4">{t("title")}</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">{t("subtitle")}</p>
                </div>
            </section>

            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-primary font-exo mb-8">{t("upcoming_title")}</h2>
                <div className="space-y-6">
                    {events.map((event) => (
                        <div key={event.id} className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-full md:w-64 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <div className="text-accent font-bold text-sm mb-2">{t("date_tba")}</div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">{t(`items.${event.id}.title`)}</h3>
                                <p className="text-stone-500 mb-4">{t(`items.${event.id}.desc`)}</p>
                                <div className="flex items-center gap-4 text-sm text-stone-400">
                                    <span className="flex items-center gap-1">📍 {event.location}</span>
                                    <span className="flex items-center gap-1">🎟 {event.isFree ? t("price_free") : event.price}</span>
                                </div>
                            </div>
                            <div className="p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-stone-100">
                                <button className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                                    {t("join_button")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
