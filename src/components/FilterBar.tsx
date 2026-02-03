"use client";

import clsx from "clsx";

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function FilterBar({
    categories,
    activeCategory,
    onCategoryChange,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-2 pb-4 overflow-x-auto no-scrollbar">
            <button
                onClick={() => onCategoryChange("All")}
                className={clsx(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    activeCategory === "All"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50"
                )}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                        activeCategory === cat
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
