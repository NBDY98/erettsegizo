"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, Mail } from "lucide-react";
import Image from "next/image";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
}

interface About1Props {
    displayProgressIndicators?: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: 1,
        name: "Teszt Béla",
        role: "CEO & Alapító",
        image: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687",
    },
    {
        id: 2,
        name: "Teszt Anna",
        role: "Történelem tanár",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=687",
    },
    {
        id: 3,
        name: "Teszt Gábor",
        role: "Magyar tanár",
        image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=687",
    },
];

const CAROUSEL_CONFIG = {
    autoPlayInterval: 5000,
    animationDuration: 0.4,
    layoutDuration: 2,
    paddingDuration: 0.75,
    easing: [0.32, 0.72, 0, 1] as const,
};

const CAROUSEL_HEIGHT = 450;

export default function About1({
    displayProgressIndicators = false,
}: About1Props = {}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
        }, CAROUSEL_CONFIG.autoPlayInterval);

        return () => clearInterval(interval);
    }, [resetKey]);

    const handleIndexChange = (index: number) => {
        setActiveIndex(index);
        setResetKey((prev) => prev + 1);
    };

    const getVisibleMembers = (): TeamMember[] => {
        return [
            TEAM_MEMBERS[activeIndex],
            TEAM_MEMBERS[(activeIndex + 1) % TEAM_MEMBERS.length],
            TEAM_MEMBERS[(activeIndex + 2) % TEAM_MEMBERS.length],
        ];
    };

    return (
        <section className="w-full flex items-start lg:items-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-9 order-1 lg:order-2">
                        <Carousel visibleMembers={getVisibleMembers()} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TeamMemberList({
    activeIndex,
    onIndexChange,
}: {
    activeIndex: number;
    onIndexChange: (index: number) => void;
}) {
    return (
        <div className="space-y-4">
            {TEAM_MEMBERS.map((member, index) => {
                const isActive = index === activeIndex;

                return (
                    <button
                        key={member.id}
                        onClick={() => onIndexChange(index)}
                        className="flex items-center gap-3 w-full text-left group"
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${isActive
                                ? "bg-neutral-900 dark:bg-white scale-100"
                                : "bg-neutral-300 dark:bg-neutral-700 scale-75"
                                }`}
                        />
                        <span
                            className={`text-sm sm:text-base ${isActive
                                ? "text-neutral-900 dark:text-white font-medium"
                                : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                                }`}
                        >
                            {member.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function Carousel({ visibleMembers }: { visibleMembers: TeamMember[] }) {
    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: CAROUSEL_HEIGHT }}
        >
            <div className="flex gap-6 h-full">
                <AnimatePresence mode="sync" initial={false}>
                    {visibleMembers.map((member, position) => (
                        <CarouselCard key={member.id} member={member} position={position} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Gradient Fade - Desktop Only */}
            <div className="hidden lg:block absolute top-0 right-0 w-[200px] h-full bg-linear-to-l from-white dark:from-neutral-950 to-transparent pointer-events-none" />
        </div>
    );
}

function CarouselCard({
    member,
    position,
}: {
    member: TeamMember;
    position: number;
}) {
    const isActive = position === 0;
    const isNext = position === 1;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
                opacity: 0,
                x: -100,
                transition: { duration: CAROUSEL_CONFIG.animationDuration },
            }}
            transition={{
                duration: CAROUSEL_CONFIG.animationDuration,
                ease: CAROUSEL_CONFIG.easing,
                layout: {
                    duration: CAROUSEL_CONFIG.layoutDuration,
                    ease: CAROUSEL_CONFIG.easing,
                },
            }}
            className="shrink-0 w-[280px] sm:w-[320px] md:w-[400px] h-full"
        >
            <motion.div
                className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                animate={{ padding: isActive ? "0px" : "4rem" }}
                transition={{ duration: CAROUSEL_CONFIG.paddingDuration }}
            >
                <motion.div
                    className="relative w-full h-full"
                    layout
                    transition={{
                        duration: 0.6,
                        ease: CAROUSEL_CONFIG.easing,
                    }}
                >
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="w-full h-full object-cover rounded-lg"
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 400px"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-white/80 via-white/30 to-transparent dark:from-black/80 dark:via-black/30 dark:to-transparent rounded-lg" />

                    {/* Content Overlay */}
                    <CardContent member={member} isActive={isActive} isNext={isNext} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function CardContent({
    member,
    isActive,
    isNext,
}: {
    member: TeamMember;
    isActive: boolean;
    isNext: boolean;
}) {
    const paddingClasses = isActive
        ? "p-5 sm:p-6 md:p-8"
        : isNext
            ? "p-4 sm:p-5"
            : "p-3 sm:p-4";

    const titleClasses = isActive
        ? "text-xl sm:text-2xl md:text-3xl"
        : isNext
            ? "text-base sm:text-lg md:text-xl"
            : "text-sm sm:text-base md:text-lg";

    const roleClasses = isActive
        ? "text-sm sm:text-base"
        : isNext
            ? "text-xs sm:text-sm"
            : "text-xs";

    const iconSize = isActive
        ? "w-9 h-9 sm:w-10 sm:h-10"
        : isNext
            ? "w-8 h-8"
            : "w-7 h-7";

    const iconClasses = isActive ? "w-4 h-4" : isNext ? "w-3.5 h-3.5" : "w-3 h-3";

    return (
        <div className={`absolute bottom-0 left-0 right-0 ${paddingClasses}`}>
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 inline-block shadow-lg">
                <h3
                    className={`font-poppins-bold text-white mb-1 leading-tight ${titleClasses}`}
                >
                    {member.name}
                </h3>
                <p className={`font-poppins-med text-white/90 leading-tight m-0 ${roleClasses}`}>
                    {member.role}
                </p>
            </div>
        </div>
    );
}

function ProgressIndicators({
    activeIndex,
    onIndexChange,
}: {
    activeIndex: number;
    onIndexChange: (index: number) => void;
}) {
    return (
        <div className="flex items-center gap-2 mt-6">
            {TEAM_MEMBERS.map((_, index) => {
                const isActive = index === activeIndex;

                return (
                    <button
                        key={index}
                        onClick={() => onIndexChange(index)}
                        className="group relative h-1 flex-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden"
                        aria-label={`Go to team member ${index + 1}`}
                    >
                        <motion.div
                            className="absolute inset-0 bg-neutral-900 dark:bg-white origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: isActive ? 1 : 0 }}
                            transition={{
                                duration: isActive ? 5 : 0.3,
                                ease: isActive ? "linear" : "easeOut",
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
}
