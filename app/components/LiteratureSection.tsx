"use client";

import React from 'react';
import { motion } from "motion/react";
import Image from 'next/image';

const STEPS = [
    {
        number: "01",
        title: "Szövegértési–nyelvi feladatsor",
        desc: "Az érettségi első része a pontos szövegértésen és nyelvi ismereteken múlik. Átvesszük a típuskérdéseket és a leggyakoribb hibákat.",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073",
        label: "Szövegértés",
    },
    {
        number: "02",
        title: "Irodalmi feladatlap",
        desc: "Rendszerezzük a legfontosabb irodalmi fogalmakat, korszakokat és életműveket, amelyek szükségesek a feladatlap sikeres megoldásához.",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070",
        label: "Műveltség",
    },
    {
        number: "03",
        title: "Műértelmező szövegalkotás",
        desc: "Megtanulod, hogyan elemezz egy művet motívumok, témák és szerkezet alapján, és hogyan építs fel egy jól strukturált, érettségi-kompatibilis esszét.",
        image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=2070",
        label: "Elemzés",
    },
    {
        number: "04",
        title: "Összehasonlító elemzés",
        desc: "Megmutatjuk, hogyan találd meg a művek közötti tartalmi és formai kapcsolódásokat, és hogyan érvelj világosan és logikusan.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
        label: "Összevetés",
    },
];

function StepCard({ step }: { step: typeof STEPS[0] }) {
    return (
        <motion.div
            className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5"
        >
            <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-8 md:p-10 flex flex-col flex-1">
                <span className="text-xs font-poppins-bold uppercase tracking-[0.2em] text-black/40 mb-3">
                    {step.label}
                </span>
                <h3 className="text-xl md:text-2xl font-poppins-bold text-black leading-tight mb-4">
                    {step.title}
                </h3>
                <p className="text-[15px] md:text-base font-poppins-med text-black/60 leading-relaxed">
                    {step.desc}
                </p>
            </div>
        </motion.div>
    );
}

export default function LiteratureSection() {
    return (
        <section id="magyar" className="w-full bg-[#f8f9fa] scroll-mt-20">
            {/* Heading */}
            <div className="pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-20 container-main px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <div className="w-full text-center">
                    <h2 className="font-poppins-extrab text-3xl md:text-4xl lg:text-5xl leading-tight text-black">
                        Középszintű Magyar nyelv és irodalom
                        <br />
                        <span className="font-poppins-med text-2xl md:text-3xl lg:text-4xl text-black/70">
                            korszakok és{" "}
                            <span className="italic font-poppins-bold text-black/50">művek rendszerben</span>
                        </span>
                    </h2>
                </div>
            </div>

            <div className="container-main px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {STEPS.map((step, i) => (
                        <StepCard key={i} step={step} />
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 container-main px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-16 md:pb-24 lg:pb-32 pt-16">
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                    <div
                        className="inline-block bg-[#CEFF06] py-2 md:py-4 px-4 md:px-8 pr-8 md:pr-16 relative mb-6 md:mb-8 shadow-sm text-center lg:text-left"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)' }}
                    >
                        <h3 className="text-black font-poppins-bold text-xl md:text-3xl tracking-tight">Miért segít ez másnap?</h3>
                    </div>

                    <div className="flex flex-col gap-2 items-center lg:items-start text-center lg:text-left w-full">
                        <p className="text-[1.15rem] md:text-xl text-black/80 font-light italic">
                            Az utolsó este nem tanulásról szól – hanem aktiválásról.
                        </p>
                        <p className="text-[1.15rem] md:text-xl text-black/80 font-light italic">
                            Amit az érettségi előtti órákban strukturáltan átnézel, az nagyobb eséllyel lesz elérhető másnap.
                        </p>
                        <p className="text-[1.15rem] md:text-xl text-black font-poppins-bold italic mt-3">
                            Ez nem plusz terhelés.
                        </p>
                        <p className="text-[1.15rem] md:text-xl text-black font-poppins-bold italic">
                            Ez mentális elrendezés.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end lg:pr-[10%] mt-8 lg:mt-0 text-center lg:text-right">
                    <h2 className="text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[9rem] font-poppins-bold leading-none tracking-tighter text-black">
                        21:00
                    </h2>
                    <div className="flex flex-col items-center lg:items-start mt-2 sm:mt-4 text-center lg:text-left">
                        <p className="text-2xl sm:text-3xl md:text-5xl font-poppins-bold tracking-tight text-black mb-1">
                            -kor lezárjuk
                        </p>
                        <div className="relative inline-block mt-1 sm:mt-2">
                            <span className="relative z-10 text-2xl sm:text-3xl md:text-[2.75rem] font-poppins-bold tracking-tight text-black">
                                és készen vagy.
                            </span>
                            <div className="absolute bottom-1 sm:bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#CEFF06] z-0 opacity-80 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}