"use client";

import { Check, Clock, Minus, X, History, BookOpen, Sparkles } from 'lucide-react';
import { NavCountdown } from './Navbar';
import { getCurrentPriceTier, formatPrice } from '@/app/lib/pricing';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PricingSection() {
    const [tier, setTier] = useState<any>(null);

    useEffect(() => {
        setTier(getCurrentPriceTier());
    }, []);

    if (!tier) return null;

    return (
        <section className="w-full py-16 md:py-24">
            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 flex flex-col items-center text-center shadow-sm">
                    <p className="font-poppins-bold text-black text-lg md:text-xl mb-2">Részvételi Díj</p>
                    <h2 className="font-poppins-extrab text-[3.25rem] sm:text-6xl md:text-[5.5rem] text-black mb-10 sm:mb-14 leading-none origin-bottom border-b-4 border-green pb-2">
                        {formatPrice(tier.price)}
                    </h2>

                    {/* Informational Cards Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-14 w-full max-w-4xl">
                        {[
                            { id: "töri", label: "Történelem", icon: History, active: true, price: tier.price },
                        ]
                            .filter(p => p.active)
                            .map((prod) => (
                                <div
                                    key={prod.id}
                                    className={`
                                    relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[2rem] border-[1.5px] transition-all duration-300 text-center min-w-[200px] flex-1
                                    ${prod.isCombo
                                            ? "border-green bg-green/[0.04] shadow-lg shadow-green/5"
                                            : "border-black/[0.06] bg-black/[0.01]"
                                        }
                                `}
                                >
                                    <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300
                                    ${prod.isCombo ? "bg-green text-black" : "bg-black/[0.04] text-black/30"}
                                `}>
                                        <prod.icon size={22} strokeWidth={2.5} />
                                    </div>
                                    <span className="font-poppins-bold text-black text-[15px]">{prod.label}</span>
                                    <span className="text-sm font-poppins-extrab mt-1 text-black">
                                        {formatPrice(prod.price)}
                                    </span>
                                    {prod.isCombo && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-poppins-bold px-3 py-1.5 rounded-lg uppercase tracking-wider whitespace-nowrap shadow-xl">
                                            Legjobb érték
                                        </span>
                                    )}
                                </div>
                            ))}
                    </div>

                    <div className="w-full text-left bg-transparent flex flex-col gap-4 max-w-3xl mb-12">
                        <p className="font-poppins-extrab text-black text-[1.15rem] md:text-[1.4rem] mb-1">Ez kevesebb, mint:</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <Minus className="w-5 h-5 text-black mt-1 shrink-0" strokeWidth={4} />
                                <p className="font-poppins-med text-black text-[1.05rem] md:text-[1.25rem] leading-snug">egyetlen magánóra ára egy népszerű tanárnál</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Minus className="w-5 h-5 text-black mt-1 shrink-0" strokeWidth={4} />
                                <p className="font-poppins-med text-black text-[1.05rem] md:text-[1.25rem] leading-snug">2 túlárazott Fluffy palacsinta</p>
                            </div>
                        </div>

                        <div className="mt-2 sm:mt-3">
                            <div className="bg-[#111] rounded-2xl p-4 sm:px-6 sm:py-4 inline-block shadow-xl border border-white/10 ring-1 ring-black/5">
                                <p className="font-poppins-med text-white/90 text-[0.95rem] sm:text-[1.15rem] leading-[1.6] sm:leading-snug">
                                    <span className="font-poppins-bold text-white uppercase tracking-wider text-xs block mb-1 opacity-60">Vagy ami a legfontosabb:</span>
                                    <span className="font-poppins-bold text-white text-[1.1rem] sm:text-[1.3rem]">töredéke annak, </span><br className="hidden lg:block" /> mint ha pár pont elvesztése miatt fizetős szakra kerülnél
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-3xl mb-10 text-center">
                        <p className="font-poppins-med text-black text-sm md:text-base leading-relaxed">
                            Cserébe kapsz egy teljes, vezetett áttekintést az egész anyagról pont az érettségi előtti estén.
                        </p>
                        <p className="font-poppins-bold text-black text-sm md:text-base leading-relaxed">
                            Ha ettől csak 1-2 feladatnál érzed magad magabiztosabbnak, már megtérült.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl mb-6 flex flex-col items-center gap-2">
                        <p className="flex items-center gap-2 text-sm font-poppins-bold uppercase tracking-[0.15em] text-red-700">
                            <Clock className="w-4 h-4 shrink-0" strokeWidth={3} /> {tier.label} {tier.deadlineLabel}-ig: {formatPrice(tier.price)}
                        </p>
                        <NavCountdown dark large />
                    </div>

                    <Link
                        href="/jelentkezes"
                        className="bg-[#cc2b20] text-white font-poppins-bold text-sm md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-full hover:scale-105 transition-transform flex flex-col items-center justify-center shadow-lg cursor-pointer"
                    >
                        <span>Jelentkezem</span>
                    </Link>
                </div>

                <div className="w-full max-w-5xl mt-32 flex flex-col items-center">

                    <p className="text-gray-600 font-poppins-med text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.35em] uppercase mb-4 md:mb-6">
                        Rólad van szó
                    </p>

                    <h2 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[4rem] font-poppins-bold text-black text-center mb-12 sm:mb-16 md:mb-20 leading-tight">
                        Kinek <span className="bg-green px-3 py-1 md:px-4 md:py-2 rounded-xl ml-1 sm:ml-2">való?</span>
                    </h2>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-2 sm:px-0">
                        <div className="bg-[#222222] rounded-[2rem] p-6 sm:p-8 md:p-12 flex flex-col items-start shadow-2xl">
                            <div className="flex items-center gap-4 mb-8 sm:mb-10">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-green rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Check className="w-6 h-6 md:w-7 md:h-7 text-black" strokeWidth={3.5} />
                                </div>
                                <h3 className="text-white font-poppins-bold text-[1.15rem] sm:text-xl md:text-2xl pt-1">Való annak, aki:</h3>
                            </div>

                            <ul className="flex flex-col gap-5 sm:gap-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-green/20 rounded-[.4rem] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-green" strokeWidth={3.5} />
                                    </div>
                                    <span className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed">Már tanult, de bizonytalan.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-green/20 rounded-[.4rem] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-green" strokeWidth={3.5} />
                                    </div>
                                    <span className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed">Szeretne rendszert a fejében.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-green/20 rounded-[.4rem] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-green" strokeWidth={3.5} />
                                    </div>
                                    <span className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed">Nyugodtan akar lefeküdni.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-12 flex flex-col items-start shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4 mb-8 sm:mb-10">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ffebee] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <X className="w-6 h-6 md:w-7 md:h-7 text-[#ff3b30]" strokeWidth={3.5} />
                                </div>
                                <h3 className="text-black font-poppins-bold text-[1.15rem] sm:text-xl md:text-2xl pt-1">Nem annak, aki:</h3>
                            </div>

                            <ul className="flex flex-col gap-5 sm:gap-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-[#ffebee] rounded-[.4rem] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <X className="w-4 h-4 text-[#ff3b30]" strokeWidth={3.5} />
                                    </div>
                                    <span className="text-gray-600 font-poppins-med text-sm md:text-base leading-relaxed">Nem hajlandó 4 órán keresztül koncentrálni.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-[#ffebee] rounded-[.4rem] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <X className="w-4 h-4 text-[#ff3b30]" strokeWidth={3.5} />
                                    </div>
                                    <span className="text-gray-600 font-poppins-med text-sm md:text-base leading-relaxed">Egyáltalán nem érdekli az érettségi, az se baj, ha megbukik.</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}