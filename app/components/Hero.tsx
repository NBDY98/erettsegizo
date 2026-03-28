"use client";

import React, { useState, useEffect } from 'react';
import Device from './bits/device';
import StaggeredText from './bits/staggered-text';
import { CheckCircle, Clock, Zap, Lightbulb, Moon } from 'lucide-react';
import GlitterWarp from './bits/glitter-warp';
import Image from 'next/image';
import { getActiveSubjects } from '@/app/lib/pricing';
import TikTokFeed from './TikTokFeed';
import MessengerChat from './MessengerChat';

const appleContentItems = [
    {
        label: "Felkészülés",
        title: "Vezetett, Rendszeres áttekintés",
        Icon: CheckCircle,
        color: "from-[#152331] to-[#000000]"
    },
    {
        label: "Hatékonyság",
        title: "Teljes tananyag kronologikusan átlátva",
        Icon: Clock,
        color: "from-[#81ff8a] to-[#64965e]"
    },
    {
        label: "Fókusz",
        title: "Csak a lényeg – amit valóban tudnod kell",
        Icon: Zap,
        color: "from-[#2774ae] via-[#002E5D] to-[#002E5D]"
    },
    {
        label: "Tipp",
        title: "Vizsgastratégiai emlékeztetők",
        Icon: Lightbulb,
        color: "from-[#1f4037] to-[#99f2c8]"
    },
    {
        label: "Lezárás",
        title: "21:00-kor lezárjuk – és mehetsz aludni",
        Icon: Moon,
        color: "from-[#554023] to-[#c99846]"
    }
];

export default function Hero() {
    const [subjects, setSubjects] = useState<string[]>([]);

    useEffect(() => {
        setSubjects(getActiveSubjects());
    }, []);

    return (
        <div className="w-full bg-white relative overflow-x-hidden">
            <section className="relative w-full bg-primary rounded-b-none lg:rounded-b-[6rem] pt-32 pb-56 lg:pb-80 xl:pb-96 overflow-hidden z-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">

                    <GlitterWarp
                        speed={1.5}
                        color="#CEFF06"
                        density={20}
                        brightness={1.5}
                        starSize={0.15}
                    />

                </div>

                <div className="container-main relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:pt-8">
                        <div className="flex flex-col items-center lg:items-start mb-6 w-full">
                            {subjects.length > 0 && (
                                <div className="mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 inline-flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                                    <span className="text-white font-poppins-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                                        Aktuális tantárgy: {subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ")}
                                    </span>
                                </div>
                            )}
                            <h1 className="text-white flex flex-col items-center lg:items-start">
                                <span className="font-poppins-semib text-4xl md:text-5xl xl:text-[4rem] leading-tight mb-1">
                                    Az utolsó este az
                                </span>
                                <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-x-4 mt-2">
                                    <span className="relative inline-block font-poppins-extrab text-5xl md:text-6xl xl:text-[5.5rem] leading-[1.1]">
                                        érettségi
                                        <span className="absolute bottom-[0.1em] left-1 w-[calc(100%-0.5rem)] h-[0.25em] bg-[rgba(206,255,6,0.6)] -z-10 rounded-sm"></span>
                                    </span>
                                    <span className="font-poppins-semib text-4xl md:text-5xl xl:text-[4.5rem] leading-[1.1]">
                                        előtt
                                    </span>
                                </div>
                            </h1>
                        </div>
                        <StaggeredText
                            text="rendszerezve, strukturáltan, nyugodtan"
                            segmentBy="words"
                            separator="|"
                            direction="top"
                            delay={80}
                            duration={0.6}
                            blur={true}
                            staggerDirection="forward"
                            exitOnScrollOut={true}
                            className="mt-8 font-poppins-semib tracking-tighter sm:tracking-[0.15em] md:tracking-[0.25em] text-[13px] sm:text-[14px] md:text-base uppercase text-white/90"
                        />
                    </div>

                    <div className="w-full lg:w-[35%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 gap-8 lg:pt-12 mt-8 lg:mt-0">
                        <p className="text-white/80 text-base lg:text-lg leading-relaxed font-poppins-med">
                            <span className="font-poppins-bold text-white/90">Az érettségi előtti este, Online formában, 16:30 és 21:00 között</span> végigmegyünk a teljes anyagon, hogy másnapra minden a helyén legyen a fejedben.
                        </p>

                        <button className="bg-green text-black font-poppins-bold text-sm md:text-base px-8 py-5 rounded-full w-full sm:w-fit hover:scale-105 transition-transform flex items-center justify-center">
                            Ott a helyem az utolsó esti ismétlésen
                        </button>

                        <div className="flex items-center justify-center lg:justify-start gap-4 mt-2 lg:mt-6 w-full">
                            <div className="flex -space-x-3">
                                <Image
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-primary object-cover"
                                    src="https://i.pravatar.cc/100?img=1"
                                    alt="Avatar"
                                    width={48}
                                    height={48}
                                />
                                <Image
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-primary object-cover"
                                    src="https://i.pravatar.cc/100?img=2"
                                    alt="Avatar"
                                    width={48}
                                    height={48}
                                />
                                <Image
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-primary object-cover"
                                    src="https://i.pravatar.cc/100?img=3"
                                    alt="Avatar"
                                    width={48}
                                    height={48}
                                />
                            </div>
                            <div className="flex flex-col justify-center items-start text-left">
                                <span className="text-white text-2xl md:text-3xl font-poppins-bold leading-none -mb-1">10.000+</span>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green" />
                                    <span className="text-secondary text-xs md:text-sm font-poppins-med">Sikeres érettségi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <div className="relative z-20 flex justify-center w-full mt-[-180px] sm:mt-[-190px] md:mt-[-190px] lg:mt-[-350px] xl:mt-[-400px] pointer-events-none px-4">
                <div className="h-[600px] sm:h-[620px] md:h-[640px] lg:h-[700px] xl:h-[720px] flex justify-center pointer-events-auto">
                    <div className="origin-top scale-[0.56] sm:scale-[0.56] md:scale-[0.55] lg:scale-[0.6] xl:scale-[0.62] rounded-[6rem] relative">
                        {/* <Device
                            isScrollable={true}
                            scale={1}
                            enableParallax={false}
                            enableRotate={false}
                        >
                            <div className="flex flex-col gap-5 px-6 bg-[#F5F5F7] min-h-full pb-[20px] pt-[80px] relative">
                                {appleContentItems.map((item, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-transform hover:scale-[1.02] cursor-pointer">
                                        <div className="w-full text-center pt-7 pb-4">
                                            <span className="text-[11px] font-poppins-bold tracking-[0.18em] uppercase text-black/30">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-7 px-8 pb-8">
                                            <div className={`w-[5.5rem] h-[5.5rem] rounded-[1.6rem] flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${item.color} shadow-md`}>
                                                <item.Icon className="w-9 h-9 text-white" strokeWidth={1.8} />
                                            </div>
                                            <p className="font-poppins-bold text-[#1d1d1f] text-[1.25rem] leading-snug flex-1">
                                                {item.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Device> */}
                        <Device
                            isScrollable={false}
                            scale={1}
                            enableParallax={false}
                            enableRotate={false}
                        >
                            {/* <TikTokFeed /> */}
                            <MessengerChat />
                        </Device>
                    </div>
                </div>
            </div>

        </div>
    );
}
