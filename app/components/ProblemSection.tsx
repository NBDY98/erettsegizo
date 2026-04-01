"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FileText, AlertCircle, Brain, ListCollapse, BookX, BookOpen } from 'lucide-react';

const useCanHover = () => {
    const [canHover, setCanHover] = useState(false);
    useEffect(() => {
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setCanHover(!isTouch);
    }, []);
    return canHover;
}

const CARDS = [
    {
        icon: FileText,
        text: <>Úgy érzed,<br />biztos maradt ki valami.</>,
    },
    {
        icon: AlertCircle,
        text: <>Túl sok az információ,<br />nincs rendszer.</>,
    },
    {
        icon: Brain,
        text: <>egyre<br /><strong className="text-black">bizonytalanabb</strong><br />leszel</>,
    },
    {
        icon: ListCollapse,
        text: <>Jegyzetek mindenhol.</>,
    },
    {
        icon: BookX,
        text: <>Nem tudod, mit vegyél át még.</>,
    },
    {
        icon: BookOpen,
        text: <>Kezdesz pánikolni.</>,
    },
];

const ScatterWord = ({ text }: { text: string }) => {
    const letters = text.split("");
    const scatterVariants = [
        { y: -30, x: 0, rotate: 30 },
        { y: -10, x: 0, rotate: 30 },
        { y: 5, x: 0, rotate: 30 },
        { y: 20, x: 0, rotate: 30 },
        { y: 20, x: 5, rotate: -30 },
        { y: 5, x: 0, rotate: -30 },
        { y: -10, x: 5, rotate: -30 },
        { y: -30, x: 10, rotate: -30 },
    ];

    return (
        <span className="inline-flex font-poppins-bold whitespace-nowrap">
            {letters.map((char, index) => {
                const variant = scatterVariants[index % scatterVariants.length];
                return (
                    <motion.span
                        key={index}
                        className="inline-block origin-center"
                        initial={{ y: 0, x: 0, rotate: 0 }}
                        whileInView={variant}
                        viewport={{ once: true }}
                        transition={{
                            type: "spring",
                            damping: 12,
                            stiffness: 200,
                            delay: index * 0.05,
                        }}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </span>
    );
};

function ProblemCard({ card, index, canHover }: { card: typeof CARDS[0]; index: number; canHover: boolean }) {
    const Icon = card.icon;

    return (
        <motion.div
            className="group relative p-8 sm:p-10 flex flex-col items-center text-center bg-white border border-gray-100 overflow-hidden transition-all duration-300"
        >
            <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-br from-[#AAFFA9] to-[#11FFBD] z-0 ${canHover ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`} />

            <div className="relative z-10 flex flex-col items-center">
                <div className={`mb-4 p-4 rounded-full bg-gray-50 transition-colors duration-300 ${canHover ? "group-hover:bg-white/50" : ""}`}>
                    <Icon
                        className={`w-8 h-8 text-black transition-transform duration-500 ${canHover ? "group-hover:scale-110 group-hover:rotate-12" : ""}`}
                        strokeWidth={1.5}
                    />
                </div>
                <p className={`text-gray-600 transition-colors duration-300 text-[15px] md:text-base font-poppins-med leading-relaxed ${canHover ? "group-hover:text-black" : ""}`}>
                    {card.text}
                </p>
            </div>
        </motion.div>
    );
}

export default function ProblemSection() {
    const canHover = useCanHover();

    return (
        <section className="w-full bg-[#f8f9fa] pb-24 md:pb-32">
            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] font-poppins-bold text-black text-center mb-12 md:mb-20 w-full flex flex-col xl:flex-row justify-center items-center gap-y-12 xl:gap-y-0 gap-x-5 px-4">
                    <span>Az utolsó este könnyen</span>
                    <ScatterWord text="szétesik" />
                </h2>
            </div>

            <div className="container-main px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-200">
                    {CARDS.map((card, i) => (
                        <ProblemCard key={i} card={card} index={i} canHover={canHover} />
                    ))}
                </div>
            </div>

            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
                <div className="w-full max-w-4xl relative flex flex-col items-center px-2">
                    <div className="w-full bg-[#fde5e5] rounded-[2rem] p-6 sm:p-8 md:p-12 pb-24 md:pb-28 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 text-center md:text-left z-0">
                        <div className="text-red-500 shrink-0">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff3b30]">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-black font-poppins-med text-lg md:text-2xl leading-relaxed max-w-2xl">
                            A probléma nem az, hogy nem tanultál <span className="font-poppins-bold">(jobb esetben)</span>.<br />
                            Hanem az, hogy nincs lezárva a fejedben az egész.
                        </p>
                    </div>

                    <div className="w-full bg-black rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 md:p-16 flex items-center justify-center text-center shadow-2xl z-10 -mt-16 md:-mt-20">
                        <h3 className="text-white font-poppins-bold text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] leading-tight">
                            Az utolsó este nem új tanulásról kellene szóljon – <br className="hidden md:block" />
                            <span className="relative inline-block mt-3 lg:mt-4">
                                hanem rendszerezésről.
                                <span className="absolute -bottom-[0.1em] left-1 w-[calc(100%-0.7rem)] h-[0.3em] bg-[#CEFF06] opacity-90 -z-10 rounded-sm"></span>
                            </span>
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}