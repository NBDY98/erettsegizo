"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Plus, Search, Smile } from "lucide-react";

/* ── sample data ─────────────────────────────────────────── */

interface VideoItem {
    id: number;
    src: string;        // video URL
    poster?: string;    // poster/thumbnail
    username: string;
    displayName: string;
    caption: string;
    sound: string;
    likes: string;
    comments: string;
    shares: string;
    saves: string;
    avatarColor: string;
}

const VIDEOS: VideoItem[] = [
    {
        id: 1,
        src: "/videos/1.mp4",
        username: "@erettsegizo.hu",
        displayName: "Érettsegizo.hu",
        caption: "Szegediek figyelem! Jövünk hozzátok a magyar érettségi felkészítőnkkel! #szeged #érettségi #magyar #irodalom #nyelvtan",
        sound: "eredeti hang – erettsegizo.hu",
        likes: "845K",
        comments: "12.4K",
        shares: "3.2K",
        saves: "45.1K",
        avatarColor: "from-rose-500 to-orange-500",
    },
    {
        id: 2,
        src: "/videos/2.mp4",
        username: "@erettsegizo.hu",
        displayName: "Érettsegizo.hu",
        caption: "2 nap alatt fel tudunk arra készíteni, hogy tök jó érettségit írj.Hihetetlennek hangozhat, de már több mint 8000 diáknak segítettünk, és garanciát is vállalunk rá!",
        sound: "eredeti hang – erettsegizo.hu",
        likes: "845K",
        comments: "12.4K",
        shares: "3.2K",
        saves: "45.1K",
        avatarColor: "from-rose-500 to-orange-500",
    }
];

export default function TikTokFeed() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<"up" | "down">("down");
    const [showNoMore, setShowNoMore] = useState(false);
    const [liked, setLiked] = useState<Record<number, boolean>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
    const [doubleTapPos, setDoubleTapPos] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const lastTapTime = useRef(0);
    const dragY = useMotionValue(0);
    const dragOpacity = useTransform(dragY, [-80, 0, 80], [0.6, 1, 0.6]);

    /* navigation */
    const goTo = useCallback(
        (dir: "up" | "down") => {
            if (isTransitioning) return;

            if (dir === "up" && currentIndex === 0) {
                setShowNoMore(true);
                setTimeout(() => setShowNoMore(false), 1800);
                return;
            }

            const next = dir === "down" ? currentIndex + 1 : currentIndex - 1;
            if (next < 0 || next >= VIDEOS.length) return;

            setIsTransitioning(true);
            setDirection(dir);
            setCurrentIndex(next);
            setTimeout(() => setIsTransitioning(false), 500);
        },
        [currentIndex, isTransitioning],
    );

    /* keyboard */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                goTo("down");
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                goTo("up");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goTo]);

    /* touch — native listeners with { passive: false } to prevent page scroll */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
            touchStartTime.current = Date.now();
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();                       // ← blocks page scroll
            const delta = e.touches[0].clientY - touchStartY.current;
            dragY.set(delta * 0.35);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const delta = e.changedTouches[0].clientY - touchStartY.current;
            const elapsed = Date.now() - touchStartTime.current;
            const velocity = Math.abs(delta) / elapsed;

            animate(dragY, 0, { type: "spring", stiffness: 400, damping: 30 });

            const threshold = velocity > 0.4 ? 20 : 60;

            if (Math.abs(delta) > threshold) {
                if (delta < 0) goTo("down");
                else goTo("up");
            }

            /* double-tap to like */
            const now = Date.now();
            if (now - lastTapTime.current < 300 && Math.abs(delta) < 10) {
                const touch = e.changedTouches[0];
                const rect = el.getBoundingClientRect();
                setDoubleTapPos({
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                });
                setShowDoubleTapHeart(true);
                setLiked((prev) => ({ ...prev, [VIDEOS[currentIndex].id]: true }));
                setTimeout(() => setShowDoubleTapHeart(false), 900);
            }
            lastTapTime.current = now;
        };

        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [goTo, currentIndex, dragY]);

    /* double-click for desktop */
    const onDoubleClick = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setDoubleTapPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setShowDoubleTapHeart(true);
            setLiked((prev) => ({ ...prev, [VIDEOS[currentIndex].id]: true }));
            setTimeout(() => setShowDoubleTapHeart(false), 900);
        }
    };

    /* wheel — native listener with { passive: false } to block page scroll */
    const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const goToRef = useRef(goTo);
    goToRef.current = goTo;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (wheelTimeout.current) return;
            if (Math.abs(e.deltaY) < 15) return;

            if (e.deltaY > 0) goToRef.current("down");
            else goToRef.current("up");

            wheelTimeout.current = setTimeout(() => {
                wheelTimeout.current = null;
            }, 600);
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);

    const video = VIDEOS[currentIndex];

    const variants = {
        enter: (d: "up" | "down") => ({
            y: d === "down" ? "100%" : "-100%",
            opacity: 0.5,
        }),
        center: { y: "0%", opacity: 1 },
        exit: (d: "up" | "down") => ({
            y: d === "down" ? "-100%" : "100%",
            opacity: 0.5,
        }),
    };

    return (
        <motion.div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-black select-none"
            style={{ opacity: dragOpacity, touchAction: "none" }}
            onDoubleClick={onDoubleClick}
            tabIndex={0}
        >
            {/* ── video layer ────────────────────────────── */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={video.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.8 }}
                    className="absolute inset-0"
                >
                    <video
                        src={video.src}
                        poster={video.poster}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {/* dim overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* ── "no more" overlay ──────────────────────── */}
            <AnimatePresence>
                {showNoMore && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute top-[15%] left-0 right-0 z-50 flex justify-center px-6"
                    >
                        <div className="relative">
                            <div className="px-7 py-3.5 rounded-full bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                <p className="text-black text-[1.15rem] font-semibold tracking-wide text-center"
                                    style={{ fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
                                >
                                    Pont eljött az idő tanulni <Smile className="w-6 h-6 inline-block" />
                                </p>
                            </div>
                            {/* subtle glow */}
                            <div className="absolute -inset-2 rounded-full bg-white/5 blur-xl -z-10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── double-tap heart ───────────────────────── */}
            <AnimatePresence>
                {showDoubleTapHeart && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.3, opacity: 1 }}
                        exit={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute z-50 pointer-events-none"
                        style={{ left: doubleTapPos.x - 36, top: doubleTapPos.y - 36 }}
                    >
                        <Heart className="w-[72px] h-[72px] text-[#FE2C55] fill-[#FE2C55] drop-shadow-[0_0_20px_rgba(254,44,85,0.6)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── right sidebar actions ──────────────────── */}
            <div className="absolute right-3 bottom-[22%] z-30 flex flex-col items-center gap-5">
                {/* avatar */}
                <div className="relative mb-2">
                    <div className={`w-[3.6rem] h-[3.6rem] rounded-full bg-gradient-to-br ${video.avatarColor} border-[2.5px] border-white shadow-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-[1.1rem]" style={{ fontFamily: "system-ui" }}>
                            {video.displayName.charAt(0)}
                        </span>
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center border-2 border-black">
                        <Plus className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                </div>

                {/* like */}
                <SideButton
                    icon={<Heart className={`w-7 h-7 ${liked[video.id] ? "text-[#FE2C55] fill-[#FE2C55]" : "text-white"}`} strokeWidth={2} />}
                    label={video.likes}
                    onClick={() => setLiked((prev) => ({ ...prev, [video.id]: !prev[video.id] }))}
                />

                {/* comment */}
                <SideButton
                    icon={<MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />}
                    label={video.comments}
                />

                {/* save */}
                <SideButton
                    icon={<Bookmark className="w-7 h-7 text-white" strokeWidth={2} />}
                    label={video.saves}
                />

                {/* share */}
                <SideButton
                    icon={<Share2 className="w-7 h-7 text-white" strokeWidth={2} />}
                    label={video.shares}
                />

                {/* spinning disc */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-[3px] border-gray-600 mt-1 flex items-center justify-center"
                >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-500" />
                </motion.div>
            </div>

            {/* ── bottom info ────────────────────────────── */}
            <div className="absolute bottom-6 left-0 right-[5.5rem] z-30 px-4">
                <p className="text-white text-[1.15rem] font-bold mb-1.5 drop-shadow-md"
                    style={{ fontFamily: "system-ui", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
                >
                    {video.username}
                </p>
                <p className="text-white/90 text-[0.95rem] leading-snug mb-3 line-clamp-2 drop-shadow-sm"
                    style={{ fontFamily: "system-ui", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                >
                    {video.caption}
                </p>
                <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-4 h-4 text-white flex-shrink-0" strokeWidth={2} />
                    <motion.div
                        className="flex-1 overflow-hidden"
                    >
                        <motion.p
                            animate={{ x: [0, -200, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="text-white/80 text-[0.85rem] whitespace-nowrap"
                            style={{ fontFamily: "system-ui" }}
                        >
                            {video.sound}
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* ── top bar ────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-8 bg-gradient-to-b from-black/40 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="w-8" />
                    <div className="flex items-center gap-6">
                        <span className="text-white/50 text-[1.05rem] font-semibold" style={{ fontFamily: "system-ui" }}>
                            Követés
                        </span>
                        <div className="relative">
                            <span className="text-white text-[1.05rem] font-bold" style={{ fontFamily: "system-ui" }}>
                                Neked
                            </span>
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white rounded-full"
                            />
                        </div>
                    </div>
                    <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
            </div>

            {/* ── progress dots ──────────────────────────── */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
                {VIDEOS.map((_, i) => (
                    <div
                        key={i}
                        className={`w-[3px] rounded-full transition-all duration-300 ${i === currentIndex
                            ? "h-4 bg-white"
                            : "h-[3px] bg-white/30"
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── sidebar button ──────────────────────────────────────── */

function SideButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
            <div className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">{icon}</div>
            <span
                className="text-white text-[0.75rem] font-semibold drop-shadow-sm"
                style={{ fontFamily: "system-ui", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
                {label}
            </span>
        </button>
    );
}