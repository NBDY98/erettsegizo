"use client";

import React from 'react';
import { motion } from "motion/react";
import Image from 'next/image';

const STEPS = [
    {
        number: "01",
        title: "Korszakról korszakra haladunk.",
        desc: "A kronologikus felépítés segít, hogy a fejed képes legyen összefüggő képet alkotni – ne csak szigetelten emlékezz nevekre és dátumokra.",
        image: "/images/Literature-1.png",
        label: "Korszakok",
    },
    {
        number: "02",
        title: "Megmutatjuk az ok–okozati láncokat.",
        desc: 'Nem csak "mi van", hanem "miért és hogyan". Az összekapcsolt tudás messze felülmúlja az elszigetelt tények memorizálását.',
        image: "/images/Literature-2.png",
        label: "ok–okozat",
    },
    {
        number: "03",
        title: "Rögzítjük a lényeget minden témánál.",
        desc: "Egy este nem elég az egész tananyagra – de elég arra, hogy a fontos dolgok biztonságosan a helyükre kerüljenek.",
        image: "/images/Literature-3.png",
        label: "Lényegek",
    },
    {
        number: "04",
        title: "Kimondjuk a kulcsfogalmakat és összefüggéseket.",
        desc: "Ars poetica, motívum, korszakjegy – ha hallod a szót az érettségin, tudod pontosan, mit jelent és hova kapcsolódik.",
        image: "/images/Literature-4.png",
        label: "Összefüggések",
    },
];

function StepCard({ step }: { step: typeof STEPS[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                    <h2 className="text-4xl sm:text-[2.5rem] md:text-6xl lg:text-[4.75rem] text-black leading-[1.1] tracking-tight">
                        <span className="font-poppins-extrab">Magyar nyelv és irodalom</span>
                        <br />
                        <span className="font-poppins-med text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] text-black/70 tracking-normal">
                            korszakok és{" "}
                            <span className="italic font-light text-black/50">művek rendszerben</span>
                        </span>
                    </h2>
                </div>
            </div>

            {/* Grid Section - Itt váltottunk a scrollról gridre */}
            <div className="container-main px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {STEPS.map((step, i) => (
                        <StepCard key={i} step={step} />
                    ))}
                </div>
            </div>

            {/* Bottom closing section */}
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