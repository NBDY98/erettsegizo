"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentPriceTier, getActiveSubjects } from "@/app/lib/pricing";

function useDeadlineCountdown() {
    const getTimeLeft = () => {
        const tier = getCurrentPriceTier();
        const now = new Date();
        const next = tier.deadlineDate;
        const diff = Math.max(0, next.getTime() - now.getTime());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return {
            days, hours, minutes, seconds,
            tierLabel: tier.label,
            deadlineLabel: tier.deadlineLabel,
        };
    };

    const [state, setState] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0,
        tierLabel: "", deadlineLabel: "",
    });

    useEffect(() => {
        setState(getTimeLeft());
        const id = setInterval(() => setState(getTimeLeft()), 1000);
        return () => clearInterval(id);
    }, []);

    return state;
}

function CountdownBlock({ value, label, large }: { value: number; label: string; large?: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <span className={`font-poppins-extrab leading-none tabular-nums ${large ? "text-[20px] md:text-[28px] lg:text-[36px]" : "text-[14px] md:text-[18px] lg:text-[20px]"
                }`}>
                {String(value).padStart(2, "0")}
            </span>
            <span className={`uppercase tracking-[0.15em] font-poppins opacity-70 mt-0.5 ${large ? "text-[10px] md:text-[12px] lg:text-[14px]" : "text-[7px] md:text-[9px] lg:text-[10px]"
                }`}>
                {label}
            </span>
        </div>
    );
}

function NavCountdown({ dark, large, monochrome }: { dark?: boolean; large?: boolean; monochrome?: boolean }) {
    const { days, hours, minutes, seconds, tierLabel, deadlineLabel } = useDeadlineCountdown();

    const glowColor = monochrome ? "bg-white/20" : (dark ? "bg-black/20" : "bg-[#CEFF06]/40");
    const wrapperClasses = monochrome
        ? "border-white/10 bg-white/5 text-white"
        : (dark
            ? "border-black/10 bg-black/5 text-black"
            : "border-[#CEFF06]/30 bg-[#CEFF06]/5 text-[#CEFF06]");

    return (
        <div className={`relative group cursor-default`}>
            <div className={`absolute -inset-[1px] rounded-2xl opacity-40 blur-md transition-opacity 
                ${glowColor} animate-pulse`}
            />

            <div className={`relative flex flex-col md:flex-row items-center transition-colors duration-300 rounded-2xl border backdrop-blur-sm ${wrapperClasses} ${large ? "gap-3 md:gap-6 lg:gap-8 px-6 md:px-10 py-3 md:py-4" : "gap-1.5 md:gap-3 lg:gap-4 px-3 md:px-5 py-1.5 md:py-2"
                }`}>
                <span className={`block md:hidden uppercase tracking-[0.15em] font-bold leading-none opacity-80 ${large ? "text-[10px] md:text-[12px]" : "text-[7px]"
                    }`}>
                    {tierLabel ? `${tierLabel} — ${deadlineLabel}-ig` : "Jelentkezési határidő"}
                </span>
                <div className="hidden md:flex flex-col items-start mr-1">
                    <span className={`uppercase tracking-[0.12em] font-bold leading-tight opacity-70 ${large ? "text-[14px]" : "text-[9px]"
                        }`}>
                        {tierLabel || "Jelentkezési határidő"}
                    </span>
                    <span className={`uppercase tracking-[0.12em] font-bold leading-tight ${large ? "text-[16px]" : "text-[10px]"
                        }`}>
                        {deadlineLabel ? `${deadlineLabel}-ig` : "határidő"}
                    </span>
                </div>
                <div className={`hidden md:block w-px ${dark ? "bg-black/20" : "bg-[#CEFF06]/30"} ${large ? "h-14" : "h-7"
                    }`} />

                <div className={`flex items-center ${large ? "gap-3 md:gap-5 lg:gap-6" : "gap-1.5 md:gap-2.5 lg:gap-3"
                    }`}>
                    <CountdownBlock value={days} label="nap" large={large} />
                    <span className={`opacity-40 font-poppins-bold ${large ? "-mt-6 text-xl md:text-2xl" : "-mt-4"}`}>:</span>
                    <CountdownBlock value={hours} label="óra" large={large} />
                    <span className={`opacity-40 font-poppins-bold ${large ? "-mt-6 text-xl md:text-2xl" : "-mt-4"}`}>:</span>
                    <CountdownBlock value={minutes} label="perc" large={large} />
                    <span className={`opacity-40 font-poppins-bold ${large ? "-mt-6 text-xl md:text-2xl" : "-mt-4"}`}>:</span>
                    <CountdownBlock value={seconds} label="mp" large={large} />
                </div>
            </div>
        </div>
    );
}

export { NavCountdown };

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [navVisible, setNavVisible] = useState(false);
    const [subjects, setSubjects] = useState<string[]>([]);
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        setSubjects(getActiveSubjects());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 850);
        };

        setNavVisible(true);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    const logoSrc = (scrolled && isHome) ? "/svg/erettsegizo-b.svg" : "/svg/erettsegizo-w.svg";

    // On subpages, we want a white logo on the grey background if not scrolled, or black if we decide to blur white.
    // Actually, the user says "grey background" for subpages.
    const effectiveLogoSrc = isHome
        ? (isMenuOpen ? "/svg/erettsegizo-w.svg" : logoSrc)
        : "/svg/erettsegizo-w.svg";

    const linkColor = (scrolled && isHome)
        ? "text-gray-700 hover:text-black"
        : "text-nav-button-text hover:text-white";

    const hamburgerColor = (scrolled && isHome)
        ? "text-gray-800 hover:text-black"
        : "text-nav-button-text hover:text-white";

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id.replace("#", ""));
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "instant"
            });
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 lg:px-24 font-poppins z-50 transition-all duration-300
                ${isMenuOpen
                    ? "bg-[#1a1a1a] py-5 shadow-none"
                    : (scrolled && isHome)
                        ? "bg-white/80 backdrop-blur-md py-3 shadow-lg"
                        : (isHome ? "bg-transparent py-5" : "bg-[#1a1a1a] py-5 shadow-lg")
                }
                ${navVisible || isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
            `}>
                <div className="flex-shrink-0 z-50">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Image
                            src={effectiveLogoSrc}
                            alt="Érettségiző.hu logo"
                            width={100}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                </div>

                <div className="flex flex-1 justify-center z-50">
                    <NavCountdown
                        dark={scrolled && isHome && !isMenuOpen}
                        monochrome={!isHome && !isMenuOpen}
                    />
                </div>
                <div className="hidden md:flex items-center gap-8 lg:gap-14 flex-shrink-0">
                    <Link
                        href="https://erettsegizo.hu"
                        onClick={() => setIsMenuOpen(false)}
                        className={`${linkColor} transition-colors duration-200 cursor-pointer`}
                    >
                        Kezdőlap
                    </Link>
                    <a
                        href="#tortenelem"
                        onClick={(e) => scrollToSection(e, "tortenelem")}
                        className={`${linkColor} transition-colors duration-200 cursor-pointer`}
                    >
                        Történelem
                    </a>
                    {subjects.includes("magyar") && (
                        <a
                            href="#magyar"
                            onClick={(e) => scrollToSection(e, "magyar")}
                            className={`${linkColor} transition-colors duration-200 cursor-pointer`}
                        >
                            Magyar
                        </a>
                    )}
                    <a
                        href="#gyik"
                        onClick={(e) => scrollToSection(e, "gyik")}
                        className={`${linkColor} transition-colors duration-200 cursor-pointer`}
                    >
                        GYIK
                    </a>
                </div>
                <div className="hidden md:block flex-shrink-0 z-50 ml-8">
                    <Link
                        href="/jelentkezes"
                        className="bg-nav-button text-white font-poppins-bold hover:brightness-110 px-6 py-3 rounded-full transition-all duration-200"
                    >
                        Jelentkezem
                    </Link>
                </div>

                <div className="block md:hidden z-50 flex-shrink-0">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`${isMenuOpen ? "text-white" : hamburgerColor} focus:outline-none transition-colors`}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            <div className={`fixed inset-0 ${isHome ? "bg-primary" : "bg-[#1a1a1a]"} z-40 flex flex-col items-center justify-center pb-20 gap-8 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
                <Link
                    href="https://erettsegizo.hu"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl text-nav-button-text hover:text-white transition-colors duration-200 cursor-pointer"
                >
                    Kezdőlap
                </Link>
                <a
                    href="#tortenelem"
                    onClick={(e) => scrollToSection(e, "tortenelem")}
                    className="text-2xl text-nav-button-text hover:text-white transition-colors duration-200 cursor-pointer"
                >
                    Történelem
                </a>
                {subjects.includes("magyar") && (
                    <a
                        href="#magyar"
                        onClick={(e) => scrollToSection(e, "magyar")}
                        className="text-2xl text-nav-button-text hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        Magyar
                    </a>
                )}
                <a
                    href="#gyik"
                    onClick={(e) => scrollToSection(e, "gyik")}
                    className="text-2xl text-nav-button-text hover:text-white transition-colors duration-200 cursor-pointer"
                >
                    GYIK
                </a>
                <Link
                    href="/jelentkezes"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-green text-black font-poppins-extrab text-xl px-10 py-4 rounded-full transition-all duration-200 hover:brightness-110 mt-4"
                >
                    Jelentkezem
                </Link>
            </div>
        </>
    );
}