/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function PaperShred({ delay, x, size, rotation, drift }: { delay: number; x: number; size: number; rotation: number; drift: number }) {
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${x}%`,
                top: "-8%",
                width: size,
                height: size * 2.2,
                animation: `shred-fall ${8 + drift}s linear ${delay}s infinite`,
            }}
        >
            <div
                className="w-full h-full rounded-sm shadow-md bg-gradient-to-br from-amber-50 to-orange-200 [clip-path:polygon(8%_0%,_92%_4%,_100%_38%,_88%_100%,_12%_96%,_0%_52%)]"
                style={{
                    animation: `shred-spin ${3 + drift}s ease-in-out ${delay}s infinite alternate`,
                    transform: `rotate(${rotation}deg)`,
                }}
            />
        </div>
    );
}

function BookOpenIcon({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
    );
}

function TornBookIllustration() {
    const [pageWidths, setPageWidths] = useState<number[]>([]);

    useEffect(() => {
        setPageWidths(Array.from({ length: 5 }).map(() => 40 + Math.random() * 35));
    }, []);

    return (
        <div className="relative w-[340px] h-[380px]">
            {/* Book body */}
            <div
                className="absolute bottom-0 left-1/2 w-[240px] -translate-x-1/2"
                style={{ animation: "book-wobble 4s ease-in-out infinite" }}
            >
                <div className="absolute left-1/2 rounded-full -bottom-4 -translate-x-1/2 w-[90%] h-6 bg-black/10 blur-[12px]" />

                {/* Back cover */}
                <div className="absolute rounded-lg shadow-xl inset-0 translate-x-1 translate-y-1 bg-gradient-to-br from-red-900 to-[#450a0a] h-[220px] w-full" />

                {/* Pages */}
                <div className="absolute rounded-r-sm shadow-inner top-1 right-0 w-[94%] h-[216px] bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute left-4 right-6 h-[1px] bg-black/5" style={{ top: 30 + i * 22 }} />
                    ))}
                    {pageWidths.length > 0 ? pageWidths.map((w, i) => (
                        <div key={`t-${i}`} className="absolute rounded-full left-4 h-[2px] bg-black/5" style={{ top: 32 + i * 22, width: `${w}%` }} />
                    )) : Array.from({ length: 5 }).map((_, i) => (
                        <div key={`t-${i}`} className="absolute rounded-full left-4 h-[2px] bg-black/5 w-[60%]" style={{ top: 32 + i * 22 }} />
                    ))}
                </div>

                {/* Front cover */}
                <div className="relative rounded-lg shadow-2xl overflow-hidden h-[220px] w-full bg-gradient-to-br from-red-700 via-red-800 to-red-900">
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
                    <div className="absolute rounded inset-3 border border-amber-400/30" />
                    <div className="absolute rounded inset-4 border border-amber-400/20" />

                    <div className="absolute flex flex-col items-center justify-center gap-2 p-6 inset-0">
                        <BookOpenIcon className="text-amber-400/70 size-32" strokeWidth={1.5} />
                        <span className="text-amber-300/80 text-[11px] tracking-[0.25em] uppercase font-medium">
                            Történelem
                        </span>
                        <div className="w-12 h-[1px] bg-amber-400/30" />
                    </div>

                    {/* Torn corner */}
                    <div className="absolute -top-1 -right-1 w-[60%] h-[45%]">
                        <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="none">
                            <path d="M 60,0 L 200,0 L 200,150 L 180,140 L 170,150 L 155,130 L 140,148 L 125,128 L 108,145 L 95,125 L 80,142 L 68,120 L 55,138 L 45,115 L 38,130 L 30,108 L 22,125 L 15,100 L 8,118 L 0,95 L 10,80 L 2,65 L 12,50 L 5,35 L 15,22 L 8,10 L 20,5 L 30,15 L 40,2 L 60,0 Z" fill="#1a0a0a" />
                        </svg>
                    </div>
                </div>

                <div className="absolute rounded-l-lg left-0 top-0 w-3 h-[220px] bg-gradient-to-r from-[#450a0a] to-transparent" />
            </div>

            {/* Flying torn page */}
            <div className="absolute -top-2 right-2 w-[160px]" style={{ animation: "page-fly 5s ease-in-out infinite" }}>
                <div className="relative">
                    <div className="absolute rounded inset-0 translate-x-2 translate-y-2 bg-black/10 blur-[8px] h-[200px] [clip-path:polygon(5%_8%,_95%_0%,_100%_42%,_88%_98%,_12%_100%,_0%_55%)]" />
                    <div className="relative shadow-xl w-full h-[200px] bg-gradient-to-br from-amber-50 via-white to-amber-50 rotate-12 [clip-path:polygon(5%_8%,_95%_0%,_100%_42%,_88%_98%,_12%_100%,_0%_55%,_3%_30%)]">
                        <div className="absolute rounded-bl-2xl top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#d9b464]/30 to-transparent" />
                        <div className="absolute flex flex-col items-center justify-center inset-0">
                            <span className="text-[72px] font-black leading-none text-nav-text font-poppins-extrab">
                                404
                            </span>
                            <svg viewBox="0 0 120 12" className="w-20 mt-1 opacity-40">
                                <path d="M 5,8 Q 20,2 35,8 Q 50,14 65,6 Q 80,0 95,7 Q 105,12 115,5" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                        </div>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="absolute left-3 right-3 h-[0.5px] bg-blue-300/25" style={{ top: 28 + i * 24 }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NotFound() {
    const [shreds, setShreds] = useState<any[]>([]);

    useEffect(() => {
        const items = Array.from({ length: 14 }, (_, i) => (
            <PaperShred key={i} delay={rand(0, 10)} x={rand(5, 95)} size={rand(8, 22)} rotation={rand(-40, 40)} drift={rand(0, 4)} />
        ));
        setShreds(items);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 bg-[#faf8f5]">
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8" style={{ animation: "fade-up 0.8s ease-out both" }}>
                <TornBookIllustration />

                <div className="flex flex-col items-center gap-3 text-center" style={{ animation: "fade-up-delay 1.2s ease-out both" }}>
                    <h1 className="text-[28px] font-extrabold text-[#111827] leading-[1.3] font-sans">
                        Ezt az oldalt{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10">kitépték</span>
                            <span className="absolute rounded-full bg-green bottom-0 left-0 right-0 h-[0.35em] z-0" />
                        </span>
                        {" "}a könyvből
                    </h1>
                    <p className="max-w-[400px] text-[15px] text-gray-500 leading-relaxed font-sans">
                        Úgy tűnik, ez a fejezet hiányzik. De ne aggódj — a többi oldal a helyén van, és várja, hogy felfedezd!
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-2" style={{ animation: "fade-up-delay 1.6s ease-out both" }}>
                    <button className="group inline-flex items-center gap-2.5 rounded-full text-white shadow-lg px-4 py-2 bg-nav-button hover:bg-nav-button/80 text-[14px] font-semibold border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Vissza a főoldalra
                    </button>
                </div>
            </div>
            <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-red-300/35 to-transparent" />
        </div>
    );
}