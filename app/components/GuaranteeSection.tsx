"use client";

import React, { useState, useEffect } from "react";
import About1 from "./bits/about-1";
import { NavCountdown } from "./Navbar";
import { getCurrentPriceTier, formatPrice } from "@/app/lib/pricing";
import { Clock } from "lucide-react";
import Carousel from "./bits/carousel";

function PriceUrgencyBlock() {
    const [tier, setTier] = useState<any>(null);

    useEffect(() => {
        setTier(getCurrentPriceTier());
    }, []);

    if (!tier) return null;

    return (
        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col items-center gap-4">
            <p className="flex items-center gap-2 text-sm font-poppins-bold uppercase tracking-[0.15em] text-red-500">
                <Clock className="w-4 h-4 shrink-0" strokeWidth={3} /> {tier.label} {tier.deadlineLabel}-ig: {formatPrice(tier.isCombo ? tier.comboPrice : tier.price)}
            </p>
            <NavCountdown dark />
            <button className="bg-[#ff3b30] text-white font-poppins-bold text-sm md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-full hover:scale-105 transition-transform flex flex-col items-center justify-center shadow-lg">
                <span>Jelentkezem {formatPrice(tier.isCombo ? tier.comboPrice : tier.price)}-ért</span>
                {tier.isCombo && <span className="text-xs opacity-80 mt-1">(Töri + Magyar ismétlés)</span>}
            </button>
        </div>
    );
}

export default function GuaranteeSection() {
    const slideData = [
        {
            title: "Ceo Csaba",
            button: "CEO & Alapító",
            src: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687",
        },
        {
            title: "Múlt Márta",
            button: "Történelem tanár",
            src: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=687",
        },
        {
            title: "Magyar Péter",
            button: "Magyar tanár",
            src: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=687",
        },
        {
            title: "Teszt Titanilla",
            button: "Magyar-történelem szakos tanár",
            src: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=687",
        },
    ];
    return (
        <section className="w-full py-16 md:py-24 bg-[#FAFAFA]">
            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8 text-center">

                {/* Guarantee Heading */}
                <h1 className="font-poppins-extrab text-[2.2rem] sm:text-5xl md:text-6xl text-black mb-6 tracking-tight leading-tight px-2">
                    <span className="bg-green px-3 sm:px-4 py-1 inline-block">Kockázatmentes</span> részvétel
                </h1>

                {/* Guarantee Subtext */}
                <p className="font-poppins-med text-lg md:text-xl text-black max-w-2xl mb-8 leading-relaxed">
                    Ha a program első <span className="font-poppins-bold">45 percében</span> azt érzed, hogy számodra ez nem ad valódi rendszert vagy értéket,
                </p>

                <h2 className="font-poppins-med text-2xl sm:text-3xl md:text-5xl text-black mb-10 leading-tight">
                    Írj nekünk aznap este,<br />
                    és visszautaljuk a teljes <span className="bg-green px-2 py-0.5 inline-block mt-1 sm:mt-0">részvételi díjat.</span>
                </h2>

                <p className="font-poppins-med text-gray-500 italic text-lg md:text-xl mb-12">
                    Nincs kérdés.<br />
                    Nincs magyarázkodás.
                </p>
                <PriceUrgencyBlock />

                <h2 className="font-poppins-extrab text-4xl sm:text-5xl md:text-6xl text-black mb-6 mt-16 tracking-tight leading-tight px-2">
                    <span className="px-3 sm:px-4 py-1 inline-block">Ki tartja?</span>
                </h2>

            </div>

            <div className="relative overflow-hidden w-full h-full py-20">
                <Carousel slides={slideData} />
            </div>
        </section>
    );
}
