"use client";

import React, { forwardRef, useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import {
    Hourglass,
    GitBranch,
    KeyRound,
    Waypoints,
    BookMarked,
    Brain,
    type LucideIcon,
} from "lucide-react";
import { AnimatedBeam } from "./bits/animated-beam";

interface Topic {
    id: number;
    title: string;
    description: string;
    Icon: LucideIcon;
    gradient: string;
    beamColors: [string, string];
    glowColor: string;
    particleColor: string;
    status: string;
    statusType: "loading" | "done";
}

const TOPICS: Topic[] = [
    {
        id: 1,
        title: "Korszakok",
        description: "Az ókor, középkor, újkor és jelenkor főbb jellemzői.",
        Icon: Hourglass,
        gradient: "bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-900",
        beamColors: ["#7c3aed", "#4f46e5"],
        glowColor: "rgba(124, 58, 237, 0.45)",
        particleColor: "#a78bfa",
        status: "Tanulás folyamatban...",
        statusType: "loading",
    },
    {
        id: 2,
        title: "Ok-okozati láncok",
        description: "Események és következményeik logikai összefűzése.",
        Icon: GitBranch,
        gradient: "bg-gradient-to-br from-sky-400 via-sky-500 to-blue-800",
        beamColors: ["#0ea5e9", "#2563eb"],
        glowColor: "rgba(14, 165, 233, 0.45)",
        particleColor: "#7dd3fc",
        status: "Feldolgozás alatt...",
        statusType: "loading",
    },
    {
        id: 3,
        title: "Kulcsfogalmak",
        description: "Minden korszak legfontosabb fogalmai egy helyen.",
        Icon: KeyRound,
        gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-800",
        beamColors: ["#10b981", "#0d9488"],
        glowColor: "rgba(16, 185, 129, 0.45)",
        particleColor: "#6ee7b7",
        status: "Rögzítve az agyban",
        statusType: "done",
    },
    {
        id: 4,
        title: "Összefüggések",
        description: "Gazdaság, politika és társadalom kapcsolódási pontjai.",
        Icon: Waypoints,
        gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-800",
        beamColors: ["#f59e0b", "#ea580c"],
        glowColor: "rgba(245, 158, 11, 0.45)",
        particleColor: "#fcd34d",
        status: "Teljes megértés",
        statusType: "done",
    },
    {
        id: 5,
        title: "Témakörök",
        description: "Tömör összefoglalók a hatékony tanuláshoz.",
        Icon: BookMarked,
        gradient: "bg-gradient-to-br from-rose-400 via-rose-500 to-pink-800",
        beamColors: ["#f43f5e", "#db2777"],
        glowColor: "rgba(244, 63, 94, 0.45)",
        particleColor: "#fda4af",
        status: "Aktiválás...",
        statusType: "loading",
    },
];

function BrainBurstScrollParticle({ p, burstProgress, color, scale, finalOpacity }: { p: { id: number, size: number, driftX: number, driftY: number }, burstProgress: import("motion/react").MotionValue<number>, color: string, scale: import("motion/react").MotionValue<number>, finalOpacity: import("motion/react").MotionValue<number> }) {
    const xTransform = useTransform(burstProgress, (bp: number) => p.driftX * bp);
    const yTransform = useTransform(burstProgress, (bp: number) => p.driftY * bp);

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: p.size,
                height: p.size,
                left: `calc(50% - ${p.size / 2}px)`,
                top: `calc(50% - ${p.size / 2}px)`,
                backgroundColor: color,
                boxShadow: `0 0 ${p.size * 3}px ${color}, 0 0 ${p.size * 6}px ${color}40`,
                opacity: finalOpacity,
                x: xTransform,
                y: yTransform,
                scale: scale,
            }}
        />
    );
}

function BrainBurstScroll({
    color,
    progress,
    threshold,
    count = 10,
}: {
    color: string;
    progress: import("motion/react").MotionValue<number>;
    threshold: number;
    count?: number;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 1;
            const dist = 30 + Math.random() * 60;
            return {
                id: i,
                size: 5 + Math.random() * 5,
                driftX: Math.cos(angle) * dist,
                driftY: Math.sin(angle) * dist,
            };
        });
    }, [count]);

    const burstProgress = useTransform(progress, (p) => Math.max(0, Math.min(1, (p - threshold) / 0.08)));
    const scale = useTransform(burstProgress, (bp) => 0.3 + bp * 0.7);
    const fadeOut = useTransform(burstProgress, (bp) => (bp > 0.5 ? 1 - (bp - 0.5) / 0.5 : 1));
    const finalOpacity = useTransform(
        [burstProgress, fadeOut],
        ([bp, fo]: number[]) => (bp <= 0 ? 0 : fo * 0.9)
    );

    if (!mounted) return null;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-[5]">
            {particles.map((p) => (
                <BrainBurstScrollParticle
                    key={p.id}
                    p={p}
                    burstProgress={burstProgress}
                    color={color}
                    scale={scale}
                    finalOpacity={finalOpacity}
                />
            ))}
        </div>
    );
}

function BrainBurstAuto({
    color,
    beamDelay,
    beamDuration,
    count = 12,
}: {
    color: string;
    beamDelay: number;
    beamDuration: number;
    count?: number;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 1;
            const dist = 30 + Math.random() * 60;
            return {
                id: i,
                size: 6 + Math.random() * 5,
                driftX: Math.cos(angle) * dist,
                driftY: Math.sin(angle) * dist,
                jitter: (Math.random() - 0.5) * 0.4,
            };
        });
    }, [count]);

    if (!mounted) return null;

    const arrivalDelay = beamDelay + beamDuration;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-[5]">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `calc(50% - ${p.size / 2}px)`,
                        top: `calc(50% - ${p.size / 2}px)`,
                        backgroundColor: color,
                        boxShadow: `0 0 ${p.size * 3}px ${color}, 0 0 ${p.size * 6}px ${color}40`,
                        animation: `brain-burst ${beamDuration}s ease-out infinite`,
                        animationDelay: `${arrivalDelay + p.jitter}s`,
                        "--dx": `${p.driftX}px`,
                        "--dy": `${p.driftY}px`,
                        opacity: 0,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}

const NodeCard = forwardRef<
    HTMLDivElement,
    { className?: string; topic: Topic }
>(({ className, topic }, ref) => {
    return (
        <div className={cn("relative group", className)}>
            <div
                className="hidden md:block absolute -inset-3 rounded-3xl blur-2xl opacity-60 transition-opacity duration-500"
                style={{ backgroundColor: topic.glowColor }}
            />
            <div
                className="hidden md:block absolute -inset-1 rounded-2xl blur-md opacity-40"
                style={{ backgroundColor: topic.glowColor }}
            />
            <div
                ref={ref}
                className={cn(
                    "relative z-10 flex w-full flex-col gap-3 rounded-2xl p-5 md:p-6 transition-all duration-300",
                    topic.gradient
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                        <topic.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[14px] md:text-[16px] font-poppins-bold leading-snug text-white">
                        {topic.title}
                    </h3>
                </div>
                <p className="text-xs md:text-sm font-poppins-med leading-relaxed text-white/80">
                    {topic.description}
                </p>
            </div>
        </div>
    );
});
NodeCard.displayName = "NodeCard";

const BrainNode = forwardRef<
    HTMLDivElement,
    { className?: string; isMobile: boolean; scrollP: import("motion/react").MotionValue<number>; beamDuration: number }
>(({ className, isMobile, scrollP, beamDuration }, ref) => {
    return (
        <div className={cn("relative group", className)}>
            {isMobile ? (
                <>
                    <BrainBurstScroll color={TOPICS[0].particleColor} progress={scrollP} threshold={0.28} count={10} />
                    <BrainBurstScroll color={TOPICS[1].particleColor} progress={scrollP} threshold={0.40} count={10} />
                    <BrainBurstScroll color={TOPICS[2].particleColor} progress={scrollP} threshold={0.52} count={10} />
                    <BrainBurstScroll color={TOPICS[3].particleColor} progress={scrollP} threshold={0.64} count={10} />
                </>
            ) : (
                <>
                    <BrainBurstAuto color={TOPICS[0].particleColor} beamDelay={0} beamDuration={beamDuration} count={12} />
                    <BrainBurstAuto color={TOPICS[1].particleColor} beamDelay={1} beamDuration={beamDuration} count={12} />
                    <BrainBurstAuto color={TOPICS[2].particleColor} beamDelay={2} beamDuration={beamDuration} count={12} />
                    <BrainBurstAuto color={TOPICS[3].particleColor} beamDelay={3} beamDuration={beamDuration} count={12} />
                    <BrainBurstAuto color={TOPICS[4].particleColor} beamDelay={4} beamDuration={beamDuration} count={12} />
                </>
            )}

            <div className="hidden md:block absolute -inset-6 rounded-full bg-gradient-to-br from-violet-500/20 via-amber-500/20 to-emerald-500/20 blur-2xl animate-pulse" />
            <div className="hidden md:block absolute -inset-3 rounded-full bg-gradient-to-br from-violet-500/10 via-rose-500/10 to-sky-500/10 blur-xl" />
            <div
                ref={ref}
                className="relative z-10 flex h-32 w-32 px-3 py-1.5 md:h-32 md:w-32 lg:h-36 lg:w-36 items-center justify-center rounded-full transition-transform"
            >
                <Brain
                    className="h-32 w-32 md:h-24 md:w-24 lg:h-32 lg:w-32 text-[#f3b5b8]"
                    strokeWidth={1.5}
                />
            </div>
        </div>
    );
});
BrainNode.displayName = "BrainNode";

export default function HistorySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const brainRef = useRef<HTMLDivElement>(null);
    const node1Ref = useRef<HTMLDivElement>(null);
    const node2Ref = useRef<HTMLDivElement>(null);
    const node3Ref = useRef<HTMLDivElement>(null);
    const node4Ref = useRef<HTMLDivElement>(null);
    const node5Ref = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const beam1P = useTransform(scrollYProgress, [0.05, 0.30], [0, 1], { clamp: true });
    const beam2P = useTransform(scrollYProgress, [0.15, 0.42], [0, 1], { clamp: true });
    const beam3P = useTransform(scrollYProgress, [0.27, 0.54], [0, 1], { clamp: true });
    const beam4P = useTransform(scrollYProgress, [0.38, 0.66], [0, 1], { clamp: true });

    const beamDuration = 7;

    return (
        <section ref={sectionRef} id="tortenelem" className="w-full px-4 py-16 md:py-24 lg:py-32 scroll-mt-20">
            <style jsx>{`
        @keyframes brain-burst {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          3% {
            opacity: 1;
            transform: translate(calc(var(--dx) * 0.1), calc(var(--dy) * 0.1)) scale(1.6);
          }
          8% {
            opacity: 0.8;
            transform: translate(calc(var(--dx) * 0.5), calc(var(--dy) * 0.5)) scale(1);
          }
          16% {
            opacity: 0.2;
            transform: translate(calc(var(--dx) * 0.85), calc(var(--dy) * 0.85)) scale(0.4);
          }
          22% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0);
          }
        }
      `}</style>

            <div className="mx-auto mb-12 md:mb-20 max-w-3xl text-center">
                <h2 className="font-poppins-extrab text-3xl md:text-4xl lg:text-5xl leading-tight text-black">
                    Történelem
                    <br />
                    <span className="font-poppins-med text-2xl md:text-3xl lg:text-4xl text-black/70">
                        az ókortól napjainkig,{" "}
                        <span className="italic font-poppins-bold text-black/50">egy ívben</span>
                    </span>
                </h2>
            </div>

            <div
                ref={containerRef}
                className="relative mx-auto flex w-full items-center justify-center overflow-hidden"
            >
                <div
                    className={cn(
                        "grid w-full max-w-[320px] grid-cols-1 place-items-center gap-10",
                        "md:max-w-4xl lg:max-w-5xl md:grid-cols-[1fr_auto_1fr] md:grid-rows-[auto_auto_auto] md:gap-x-16 md:gap-y-16 lg:gap-x-24 lg:gap-y-20"
                    )}
                >
                    <div className="w-full max-w-[280px] md:max-w-[300px] md:col-start-1 md:row-start-1 md:justify-self-end">
                        <NodeCard ref={node1Ref} topic={TOPICS[0]} />
                    </div>

                    <div className="w-full max-w-[280px] md:max-w-[300px] md:col-start-1 md:row-start-2 md:justify-self-end">
                        <NodeCard ref={node2Ref} topic={TOPICS[1]} />
                    </div>

                    <div className="flex items-center justify-center md:col-start-2 md:row-start-1 md:row-span-2">
                        <BrainNode ref={brainRef} isMobile={isMobile} scrollP={scrollYProgress} beamDuration={beamDuration} />
                    </div>

                    <div className="w-full max-w-[280px] md:max-w-[300px] md:col-start-3 md:row-start-1 md:justify-self-start">
                        <NodeCard ref={node3Ref} topic={TOPICS[2]} />
                    </div>

                    <div className="w-full max-w-[280px] md:max-w-[300px] md:col-start-3 md:row-start-2 md:justify-self-start">
                        <NodeCard ref={node4Ref} topic={TOPICS[3]} />
                    </div>

                    <div className="hidden md:flex w-full max-w-[280px] md:max-w-[300px] justify-center md:col-start-2 md:row-start-3 md:justify-self-center">
                        <NodeCard ref={node5Ref} topic={TOPICS[4]} />
                    </div>
                </div>

                <AnimatedBeam
                    className="z-0"
                    containerRef={containerRef}
                    fromRef={node1Ref}
                    toRef={brainRef}
                    {...(isMobile ? { scrollProgress: beam1P } : { duration: beamDuration, delay: 0 })}
                    gradientStartColor={TOPICS[0].beamColors[0]}
                    gradientStopColor={TOPICS[0].beamColors[1]}
                    pathWidth={3}
                    pathOpacity={0.15}
                    showParticles
                    particleCount={8}
                    particleSize={3}
                    particleSpread={10}
                />
                <AnimatedBeam
                    className="z-0"
                    containerRef={containerRef}
                    fromRef={node2Ref}
                    toRef={brainRef}
                    {...(isMobile ? { scrollProgress: beam2P } : { duration: beamDuration, delay: 1 })}
                    gradientStartColor={TOPICS[1].beamColors[0]}
                    gradientStopColor={TOPICS[1].beamColors[1]}
                    pathWidth={3}
                    pathOpacity={0.15}
                    showParticles
                    particleCount={8}
                    particleSize={3}
                    particleSpread={10}
                />
                <AnimatedBeam
                    className="z-0"
                    containerRef={containerRef}
                    fromRef={node3Ref}
                    toRef={brainRef}
                    reverse={!isMobile}
                    {...(isMobile ? { scrollProgress: beam3P } : { duration: beamDuration, delay: 2 })}
                    gradientStartColor={TOPICS[2].beamColors[0]}
                    gradientStopColor={TOPICS[2].beamColors[1]}
                    pathWidth={3}
                    pathOpacity={0.15}
                    showParticles
                    particleCount={8}
                    particleSize={3}
                    particleSpread={10}
                />
                <AnimatedBeam
                    className="z-0"
                    containerRef={containerRef}
                    fromRef={node4Ref}
                    toRef={brainRef}
                    reverse={!isMobile}
                    {...(isMobile ? { scrollProgress: beam4P } : { duration: beamDuration, delay: 3 })}
                    gradientStartColor={TOPICS[3].beamColors[0]}
                    gradientStopColor={TOPICS[3].beamColors[1]}
                    pathWidth={3}
                    pathOpacity={0.15}
                    showParticles
                    particleCount={8}
                    particleSize={3}
                    particleSpread={10}
                />
                <AnimatedBeam
                    className="z-0 hidden md:block"
                    containerRef={containerRef}
                    fromRef={node5Ref}
                    toRef={brainRef}
                    duration={beamDuration}
                    delay={4}
                    gradientStartColor={TOPICS[4].beamColors[0]}
                    gradientStopColor={TOPICS[4].beamColors[1]}
                    pathWidth={3}
                    pathOpacity={0.15}
                    showParticles
                    particleCount={8}
                    particleSize={3}
                    particleSpread={10}
                />
            </div>
        </section>
    );
}