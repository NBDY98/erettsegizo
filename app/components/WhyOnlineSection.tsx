"use client";

import Image from "next/image";
import React from "react";

const CARDS = [
    {
        title: "Nincs utazás",
        desc: "Nem kell utazni. Az már nem férne bele.",
        img: "https://images.unsplash.com/photo-1645225400050-541fa1bf3131?q=80&w=2070",
        gridClass: "md:col-span-2 flex flex-col md:flex-row items-center",
        textClass: "md:w-1/2 p-6 sm:p-8 md:p-14 text-center md:text-left",
        imgContainerClass: "md:w-1/2 h-64 md:h-full w-full p-4 md:p-6",
        imgClass: "w-full h-full object-cover rounded-3xl md:rounded-[2.5rem]",
    },
    {
        title: "21:00-kor vége",
        desc: "21:00-kor vége. Az esti kakaó után már aludhatsz is!",
        img: "https://images.unsplash.com/photo-1663416827757-c98066d93625?q=80&w=2037",
        gridClass: "flex flex-col items-center",
        textClass: "p-6 sm:p-8 md:p-10 text-center flex-grow",
        imgContainerClass: "w-full h-64 md:h-72 p-4 md:p-6 pt-0",
        imgClass: "w-full h-full object-cover rounded-3xl",
    },
    {
        title: "Pihenés",
        desc: "Azonnal tudsz pihenni a saját ágyadban.",
        img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
        gridClass: "flex flex-col items-center",
        textClass: "p-6 sm:p-8 md:p-10 text-center flex-grow",
        imgContainerClass: "w-full h-64 md:h-72 p-4 md:p-6 pt-0",
        imgClass: "w-full h-full object-cover rounded-3xl",
    },
];

export default function WhyOnlineSection() {
    return (
        <section className="w-full py-20 md:py-32 bg-white overflow-hidden relative">
            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="w-full max-w-5xl mb-12 sm:mb-16 md:mb-24 text-center md:text-left px-2">
                    <h2 className="font-poppins-extrab text-[2.2rem] sm:text-4xl md:text-6xl text-black mb-6 tracking-tight leading-tight">
                        Miért online az utolsó este?
                    </h2>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {CARDS.map((card, i) => (
                        <div
                            key={i}
                            className={`bg-[#f4f5f8] shadow-[inset_0_1px_0_rgba(255,255,255,1),_0_15px_30px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),_0_25px_50px_rgba(0,0,0,0.1)] border border-neutral-200/50 rounded-[2rem] md:rounded-[3rem] hover:-translate-y-1 transition-all duration-300 overflow-hidden ${card.gridClass}`}
                        >
                            <div className={card.textClass}>
                                <h3 className="font-poppins-bold text-3xl md:text-4xl text-black mb-4 leading-tight">
                                    {card.title}
                                </h3>
                                <p className="font-poppins-med text-gray-500 text-lg md:text-xl leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>
                            <div className={card.imgContainerClass}>
                                <Image
                                    src={card.img}
                                    alt={card.title}
                                    width={800}
                                    height={600}
                                    className={`shadow-md ${card.imgClass}`}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-4xl mt-20 sm:mt-24 md:mt-36 text-center flex flex-col items-center px-2">
                    <h3 className="font-poppins-med text-[1.35rem] sm:text-3xl md:text-4xl text-black mb-8 sm:mb-10 leading-snug">
                        Menj be úgy az érettségire, hogy tudod <br className="block sm:hidden" /><span className="font-poppins-bold">mindenen végigmentél.</span>
                    </h3>

                    <p className="font-poppins-med text-lg sm:text-xl md:text-2xl text-black mb-10 sm:mb-14">
                        Az utolsó este nem a kapkodásról kell szóljon.<br />
                        <span className="font-poppins-bold text-[1.7rem] sm:text-3xl md:text-5xl mt-3 inline-block">
                            Hanem a <span className="bg-green px-2 sm:px-3 rounded-lg shadow-sm">lezárásról.</span>
                        </span>
                    </p>

                    <button className="bg-black text-white font-poppins-bold text-[15px] sm:text-lg md:text-xl px-8 sm:px-10 md:px-14 py-4 md:py-5 rounded-full hover:scale-105 transition-transform flex items-center justify-center shadow-2xl w-full sm:w-auto">
                        Csatlakozom az utolsó esti ismétléshez
                    </button>
                </div>

            </div>
        </section>
    );
}
