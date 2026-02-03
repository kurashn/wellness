"use client";

import { Link } from "@/i18n/routing";
import { MessageSquare } from "lucide-react";

interface FacilityProps {
    id: string;
    name: string;
    category: string;
    image: string; // Placeholder color or URL
    rating: number;
    reviewCount: number;
    location: string;
    tags: string[];
}

export default function FacilityCard({ facility }: { facility: FacilityProps }) {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-secondary/20">
            {/* Image Placeholder */}
            <div className={`h-48 w-full ${facility.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                    {facility.category}
                </span>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                            {facility.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span className="text-accent">★</span> {facility.rating} ({facility.reviewCount}) • {facility.location}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {facility.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-secondary text-primary-foreground rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/explore/${facility.id}`}
                        className="flex-1 text-center py-2 rounded-lg border border-primary/20 text-primary font-medium hover:bg-secondary transition-colors"
                    >
                        Details
                    </Link>
                    <button className="px-3 py-2 bg-[#06C755] text-white rounded-lg hover:bg-[#05b34c] transition-colors" title="Book via LINE">
                        {/* LINE icon color */}
                        <MessageSquare size={18} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}
