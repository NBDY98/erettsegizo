"use client";

import { useEffect, useState } from "react";
import { PRICING_SCHEDULE } from "@/app/lib/pricing";

export default function TestPricingControls() {
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedDate = localStorage.getItem("pricing_test_date");
        setActiveDate(savedDate);
    }, []);

    const setDate = (date: Date | null) => {
        if (date) {
            localStorage.setItem("pricing_test_date", date.toISOString());
            setActiveDate(date.toISOString());
        } else {
            localStorage.removeItem("pricing_test_date");
            setActiveDate(null);
        }
        window.location.reload();
    };

    if (process.env.NODE_ENV === "production" && !isOpen) {
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-full shadow-2xl font-poppins-bold text-xs"
                >
                    DEBUG
                </button>
            ) : (
                <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-2xl w-72 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-poppins-extrab text-sm uppercase tracking-wider">Teszt Időpont</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">&times;</button>
                    </div>

                    <button
                        onClick={() => setDate(null)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-poppins-med transition-colors ${!activeDate ? "bg-green text-black" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        Valós idő (Ma: {new Date().toLocaleDateString('hu-HU')})
                    </button>

                    <div className="h-px bg-gray-100 my-1" />

                    {PRICING_SCHEDULE.map((tier, idx) => {
                        const tierDateStr = tier.date.toISOString();
                        const isActive = activeDate === tierDateStr;
                        return (
                            <button
                                key={idx}
                                onClick={() => setDate(tier.date)}
                                className={`text-left px-3 py-2 rounded-xl text-[10px] sm:text-xs font-poppins-med transition-colors flex flex-col ${isActive ? "bg-green text-black" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                            >
                                <span className="font-poppins-bold uppercase opacity-60 text-[8px] mb-0.5">{tier.label}</span>
                                <span>{tier.date.toLocaleString('hu-HU')}</span>
                                <span className="text-[10px] mt-0.5 opacity-80">{tier.subjects.join(", ")}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
