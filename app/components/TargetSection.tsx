"use client";

import Image from 'next/image';
import React from 'react';

export default function TargetSection() {
    return (
        <section className="w-full bg-[#f8f9fa] py-16 md:py-24">
            <div className="container-main flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-[1.8rem] sm:text-4xl md:text-5xl lg:text-[4rem] font-poppins-bold text-black text-center mb-12 sm:mb-16 leading-tight max-w-5xl px-2">
                    4 óra alatt végigérünk <br className="hidden md:block" />
                    <span className="inline-block mt-2 md:mt-4">
                        az{' '}
                        <span className="relative inline-block font-poppins-extrab">
                            <span className="relative z-10">egész tananyagon</span>
                            <span className="absolute bottom-[0.1em] left-0 w-[100%] h-[0.25em] bg-green opacity-90 z-0 rounded-sm"></span>
                        </span>
                    </span>
                </h2>

                <div className="w-full max-w-5xl bg-[#111111] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-20 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="absolute -bottom-20 -right-20 lg:-bottom-10 lg:-right-10 opacity-[0.15] transform rotate-12 pointer-events-none z-0">
                        <Image src="/svg/logo.svg" alt="Logo" width={450} height={450} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-10 lg:gap-14 max-w-3xl">

                        <h3 className="text-white text-[1.6rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-poppins-med leading-tight">
                            <i className="text-white font-poppins-med">A cél:</i> <span className="font-poppins-bold"> másnap minden téma „ismerős” legyen.</span>
                        </h3>

                        <div className="flex flex-col gap-8">
                            <div>
                                <h4 className="text-white font-poppins-bold text-lg md:text-xl mb-1.5">Időrendi és logikai sorrendben haladunk.</h4>
                                <p className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed max-w-xl">Minden témánál csak a lényeget emeljük ki – azt, amit másnap tudnod kell.</p>
                            </div>

                            <div>
                                <h4 className="text-white font-poppins-bold text-lg md:text-xl mb-1.5">Nem részletezünk túl.</h4>
                                <p className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed max-w-xl">Nem adunk új jegyzetet.</p>
                            </div>

                            <div>
                                <h4 className="text-white font-poppins-bold text-lg md:text-xl mb-1.5">Neked csak figyelned kell.</h4>
                                <p className="text-gray-300 font-poppins-med text-sm md:text-base leading-relaxed max-w-xl">És hagyni, hogy összeálljon a kép.</p>
                            </div>

                            <div className="mt-8 md:mt-4 w-full text-center md:text-left">
                                <h3 className="text-white font-poppins-med text-base leading-relaxed">
                                    A végén nyitunk egy kérdések blokkot, és addig nem lépünk ki, <br className="hidden md:block" />
                                    <span className="relative inline-block mt-2 lg:mt-4 whitespace-normal sm:whitespace-nowrap">
                                        <span className="relative z-10">ameddig nem válaszoltunk meg mindent!</span>
                                        <span className="absolute bottom-[0.3em] left-0 w-full h-[0.4em] bg-green opacity-60 z-0 rounded-sm"></span>
                                    </span>
                                </h3>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
