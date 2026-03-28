"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#050505] text-white py-12 sm:py-16 md:py-20 px-4 md:px-8 relative overflow-hidden snap-start">

            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 border-b border-white/10 pb-10 md:pb-14 mb-10 md:mb-14">
                    <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Link href="/">
                            <Image
                                src="/svg/erettsegizo-w.svg"
                                alt="Érettségiző.hu"
                                width={200}
                                height={64}
                                className="h-12 md:h-16 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[15px] font-poppins-med text-white/50">
                        <Link href="#magyar" className="hover:text-white transition-colors duration-300">Magyar</Link>
                        <Link href="#tortenelem" className="hover:text-white transition-colors duration-300">Történelem</Link>
                        <Link href="#gyik" className="hover:text-white transition-colors duration-300">GYIK</Link>
                        <Link href="/jelentkezes" className="hover:text-white transition-colors duration-300">Jelentkezés</Link>
                    </div>
                </div>

                <div className="flex items-center justify-center text-center">
                    <p className="text-white/60 font-poppins-med tracking-wide text-[15px] uppercase">
                        Az oldalt készítette: {" "}
                        <Link
                            href="https://netbazis.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-poppins-bold text-white hover:text-green transition-colors duration-300 relative inline-block group"
                        >
                            Netbázis
                            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-green rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </p>
                </div>

                <div className="mt-12 text-center text-[13px] text-white/30 font-poppins tracking-wider uppercase">
                    &copy; {new Date().getFullYear()} Érettségiző. Minden jog fenntartva.
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(150%) skewX(-15deg); }
                }
            `}</style>
        </footer>
    );
}
