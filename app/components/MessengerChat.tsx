"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Phone,
    Video,
    ChevronLeft,
    Send,
    Image as ImageIcon,
    Mic,
    Plus,
    ThumbsUp,
    Smile,
} from "lucide-react";

interface Person {
    name: string;
    avatar: string;
    initial: string;
    color: string;
}

interface ChatEvent {
    type: "message" | "typing" | "seen" | "pause" | "reaction";
    personIdx?: number;
    text?: string;
    link?: boolean;
    duration?: number;
    reaction?: string;
    reactionPersonIdx?: number;
}

const PEOPLE: Person[] = [
    {
        name: "Bence",
        avatar: "from-blue-500 to-cyan-400",
        initial: "B",
        color: "#0084FF",
    },
    {
        name: "Réka",
        avatar: "from-pink-500 to-rose-400",
        initial: "R",
        color: "#E4458E",
    },
    {
        name: "Dani",
        avatar: "from-emerald-500 to-green-400",
        initial: "D",
        color: "#44BF6A",
    },
    {
        name: "Lili",
        avatar: "from-violet-500 to-purple-400",
        initial: "L",
        color: "#8B5CF6",
    },
];

const ME_IDX = -1;

const SCRIPT: ChatEvent[] = [
    { type: "message", personIdx: 0, text: "Srácok ti hogy álltok a töri érettségivel? 😅" },
    { type: "pause", duration: 800 },
    { type: "typing", personIdx: 1, duration: 1200 },
    { type: "message", personIdx: 1, text: "Ne is mondd, még az évszámokat se tudom 💀" },
    { type: "pause", duration: 400 },
    { type: "typing", personIdx: 2, duration: 900 },
    { type: "message", personIdx: 2, text: "Én a világháborúkat keverem össze folyton" },
    { type: "pause", duration: 600 },
    { type: "typing", personIdx: 3, duration: 1400 },
    { type: "message", personIdx: 3, text: "Amúgy van 1 hét, elég lesz az? 🤔" },
    { type: "pause", duration: 500 },
    { type: "reaction", reactionPersonIdx: 0, reaction: "😂" },
    { type: "typing", personIdx: ME_IDX, duration: 1000 },
    { type: "message", personIdx: ME_IDX, text: "Én találtam egy elég jó oldalt ami rendszerezi az egész anyagot" },
    { type: "pause", duration: 300 },
    { type: "typing", personIdx: 1, duration: 600 },
    { type: "message", personIdx: 1, text: "Komolyan?? Melyik az?" },
    { type: "pause", duration: 400 },
    { type: "typing", personIdx: ME_IDX, duration: 800 },
    { type: "message", personIdx: ME_IDX, text: "erettsegizo.hu", link: true },
    { type: "pause", duration: 300 },
    { type: "typing", personIdx: ME_IDX, duration: 1400 },
    { type: "message", personIdx: ME_IDX, text: "Elvileg az érettségi előtti este átmegy veled a teljes anyagon kronologikusan 🔥" },
    { type: "pause", duration: 700 },
    { type: "reaction", reactionPersonIdx: 1, reaction: "🔥" },
    { type: "reaction", reactionPersonIdx: 2, reaction: "👀" },
    { type: "typing", personIdx: 2, duration: 1100 },
    { type: "message", personIdx: 2, text: "Jaa ez tök jó, pont ilyen kell" },
    { type: "pause", duration: 500 },
    { type: "typing", personIdx: 3, duration: 900 },
    { type: "message", personIdx: 3, text: "Beregisztráltam most 🙌" },
    { type: "pause", duration: 400 },
    { type: "typing", personIdx: 0, duration: 800 },
    { type: "message", personIdx: 0, text: "Király, én is megyek, köszi a tippet! 💪" },
    { type: "pause", duration: 600 },
    { type: "seen", duration: 0 },
    { type: "pause", duration: 1000 },
    { type: "typing", personIdx: 1, duration: 1200 },
    { type: "message", personIdx: 1, text: "Na akkor holnap mindenki ott! 📚" },
    { type: "pause", duration: 500 },
    { type: "reaction", reactionPersonIdx: 0, reaction: "💪" },
    { type: "reaction", reactionPersonIdx: 3, reaction: "❤️" },
];

interface RenderedMsg {
    id: number;
    personIdx: number;
    text: string;
    link?: boolean;
    reactions: { emoji: string; personIdx: number }[];
}

function Avatar({ person, size = "sm" }: { person: Person; size?: "sm" | "xs" }) {
    const s = size === "sm" ? "w-[2rem] h-[2rem]" : "w-[1.4rem] h-[1.4rem]";
    const t = size === "sm" ? "text-[0.75rem]" : "text-[0.55rem]";
    return (
        <div
            className={`${s} rounded-full bg-gradient-to-br ${person.avatar} flex items-center justify-center flex-shrink-0 shadow-sm`}
        >
            <span className={`text-white font-bold ${t}`} style={{ fontFamily: "system-ui" }}>
                {person.initial}
            </span>
        </div>
    );
}

function TypingIndicator({ person }: { person: Person }) {
    return (
        <div className="flex items-end gap-2 px-4">
            <Avatar person={person} size="sm" />
            <div className="flex flex-col">
                <span
                    className="text-[0.65rem] text-gray-500 mb-0.5 ml-1 font-medium"
                    style={{ fontFamily: "system-ui" }}
                >
                    {person.name}
                </span>
                <div className="bg-[#E9E9EB] rounded-[1.2rem] rounded-bl-[0.3rem] px-4 py-3 flex items-center gap-[3px]">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-[7px] h-[7px] rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.18,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function MessengerChat() {
    const [messages, setMessages] = useState<RenderedMsg[]>([]);
    const [typingPerson, setTypingPerson] = useState<Person | null>(null);
    const [seenBy, setSeenBy] = useState<number[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scriptIdx = useRef(0);
    const msgCounter = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingPerson, scrollToBottom]);

    const processNext = useCallback(() => {
        if (scriptIdx.current >= SCRIPT.length) {
            timeoutRef.current = setTimeout(() => {
                scriptIdx.current = 0;
                msgCounter.current = 0;
                setMessages([]);
                setTypingPerson(null);
                setSeenBy([]);
                timeoutRef.current = setTimeout(processNext, 800);
            }, 3000);
            return;
        }

        const event = SCRIPT[scriptIdx.current];
        scriptIdx.current += 1;

        switch (event.type) {
            case "pause":
                timeoutRef.current = setTimeout(processNext, event.duration || 500);
                break;

            case "typing": {
                const person =
                    event.personIdx === ME_IDX ? null : PEOPLE[event.personIdx!];
                setTypingPerson(person);
                timeoutRef.current = setTimeout(() => {
                    setTypingPerson(null);
                    processNext();
                }, event.duration || 1000);
                break;
            }

            case "message": {
                const id = msgCounter.current++;
                setMessages((prev) => [
                    ...prev,
                    {
                        id,
                        personIdx: event.personIdx!,
                        text: event.text!,
                        link: event.link,
                        reactions: [],
                    },
                ]);
                timeoutRef.current = setTimeout(processNext, 200);
                break;
            }

            case "seen":
                setSeenBy([0, 1, 2, 3]);
                timeoutRef.current = setTimeout(processNext, 100);
                break;

            case "reaction": {
                setMessages((prev) => {
                    const copy = [...prev];
                    const lastOther = [...copy]
                        .reverse()
                        .find((m) => m.personIdx !== event.reactionPersonIdx);
                    if (lastOther) {
                        lastOther.reactions = [
                            ...lastOther.reactions,
                            {
                                emoji: event.reaction!,
                                personIdx: event.reactionPersonIdx!,
                            },
                        ];
                    }
                    return copy;
                });
                timeoutRef.current = setTimeout(processNext, 300);
                break;
            }
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            setHasStarted(true);
            processNext();
        }, 1200);

        return () => {
            clearTimeout(t);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [processNext]);

    const grouped = messages.reduce<
        { personIdx: number; msgs: RenderedMsg[] }[]
    >((acc, msg) => {
        const last = acc[acc.length - 1];
        if (last && last.personIdx === msg.personIdx) {
            last.msgs.push(msg);
        } else {
            acc.push({ personIdx: msg.personIdx, msgs: [msg] });
        }
        return acc;
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col bg-white select-none overflow-hidden">
            { }
            <div className="flex items-center px-3 pt-[4.8rem] pb-3 bg-white border-b border-black/[0.08] flex-shrink-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <ChevronLeft className="w-6 h-6 text-[#0A84FF] mr-1 flex-shrink-0" />
                <div className="flex -space-x-2 mr-3">
                    {PEOPLE.slice(0, 3).map((p, i) => (
                        <div
                            key={i}
                            className={`w-[2rem] h-[2rem] rounded-full bg-gradient-to-br ${p.avatar} flex items-center justify-center border-2 border-white`}
                        >
                            <span className="text-white text-[0.6rem] font-bold" style={{ fontFamily: "system-ui" }}>
                                {p.initial}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 min-w-0 pt-3">
                    <p
                        className="text-gray-900 text-[0.95rem] font-semibold truncate"
                        style={{ fontFamily: "system-ui" }}
                    >
                        Érettek leszünk?! 😂
                    </p>
                    <p
                        className="text-gray-400 text-[0.7rem]"
                        style={{ fontFamily: "system-ui" }}
                    >
                        Aktív most
                    </p>
                </div>
                <div className="flex items-center gap-4 ml-2 flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0A84FF]" strokeWidth={2} />
                    <Video className="w-5 h-5 text-[#0A84FF]" strokeWidth={2} />
                </div>
            </div>

            { }
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4 space-y-1 bg-white scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                { }
                <div className="flex justify-center mb-4">
                    <span
                        className="text-[0.65rem] text-gray-400 font-medium px-3 py-1"
                        style={{ fontFamily: "system-ui" }}
                    >
                        Ma 16:32
                    </span>
                </div>

                { }
                {grouped.map((group, gi) => {
                    const isMe = group.personIdx === ME_IDX;
                    const person = isMe ? null : PEOPLE[group.personIdx];
                    const hasReactions = group.msgs.some((m) => m.reactions.length > 0);

                    return (
                        <div
                            key={gi}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${hasReactions ? "mb-5" : "mb-2"}`}
                        >
                            { }
                            {!isMe && person && (
                                <span
                                    className="text-[0.65rem] text-gray-400 mb-0.5 ml-12 font-medium"
                                    style={{ fontFamily: "system-ui" }}
                                >
                                    {person.name}
                                </span>
                            )}

                            <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-1.5`}>
                                { }
                                {!isMe && person && (
                                    <div className="mb-1">
                                        <Avatar person={person} size="sm" />
                                    </div>
                                )}

                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-[2px] max-w-[75%]`}>
                                    {group.msgs.map((msg, mi) => {
                                        const isFirst = mi === 0;
                                        const isLast = mi === group.msgs.length - 1;
                                        const hasReaction = msg.reactions.length > 0;

                                        let borderRadius: string;
                                        if (isMe) {
                                            if (group.msgs.length === 1) {
                                                borderRadius = "1.2rem 1.2rem 0.3rem 1.2rem";
                                            } else if (isFirst) {
                                                borderRadius = "1.2rem 1.2rem 0.3rem 1.2rem";
                                            } else if (isLast) {
                                                borderRadius = "1.2rem 0.3rem 0.3rem 1.2rem";
                                            } else {
                                                borderRadius = "1.2rem 0.3rem 0.3rem 1.2rem";
                                            }
                                        } else {
                                            if (group.msgs.length === 1) {
                                                borderRadius = "1.2rem 1.2rem 1.2rem 0.3rem";
                                            } else if (isFirst) {
                                                borderRadius = "1.2rem 1.2rem 1.2rem 0.3rem";
                                            } else if (isLast) {
                                                borderRadius = "0.3rem 1.2rem 1.2rem 0.3rem";
                                            } else {
                                                borderRadius = "0.3rem 1.2rem 1.2rem 0.3rem";
                                            }
                                        }

                                        return (
                                            <AnimatePresence key={msg.id}>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, y: 12 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25,
                                                        mass: 0.6,
                                                    }}
                                                    className={`relative ${hasReaction ? "mb-3.5" : ""}`}
                                                >
                                                    <div
                                                        className="px-3.5 py-[0.45rem] relative"
                                                        style={{
                                                            backgroundColor: isMe ? "#0A84FF" : "#E9E9EB",
                                                            borderRadius,
                                                        }}
                                                    >
                                                        {msg.link ? (
                                                            <p
                                                                className={`${isMe ? "text-white" : "text-gray-900"} text-[0.9rem] leading-relaxed`}
                                                                style={{ fontFamily: "system-ui" }}
                                                            >
                                                                {msg.text}
                                                            </p>
                                                        ) : (
                                                            <p
                                                                className={`${isMe ? "text-white" : "text-gray-900"} text-[0.9rem] leading-relaxed`}
                                                                style={{ fontFamily: "system-ui" }}
                                                            >
                                                                {msg.text}
                                                            </p>
                                                        )}
                                                    </div>

                                                    { }
                                                    {msg.reactions.length > 0 && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 500,
                                                                damping: 20,
                                                            }}
                                                            className={`absolute -bottom-3 ${isMe ? "left-1" : "right-1"} flex items-center gap-0`}
                                                        >
                                                            <div className="flex items-center bg-white border border-black/[0.08] rounded-full px-1.5 py-0.5 shadow-sm">
                                                                {msg.reactions.map((r, ri) => (
                                                                    <span key={ri} className="text-[0.7rem]">
                                                                        {r.emoji}
                                                                    </span>
                                                                ))}
                                                                {msg.reactions.length > 1 && (
                                                                    <span
                                                                        className="text-[0.6rem] text-gray-500 ml-0.5"
                                                                        style={{ fontFamily: "system-ui" }}
                                                                    >
                                                                        {msg.reactions.length}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                { }
                <AnimatePresence>
                    {typingPerson && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TypingIndicator person={typingPerson} />
                        </motion.div>
                    )}
                </AnimatePresence>

                { }
                <AnimatePresence>
                    {seenBy.length > 0 && messages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-end pr-3 pt-1 gap-[2px]"
                        >
                            {seenBy.map((pIdx) => (
                                <motion.div
                                    key={pIdx}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: pIdx * 0.1 }}
                                >
                                    <Avatar person={PEOPLE[pIdx]} size="xs" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-2" />
            </div>

            { }
            <div className="flex items-center gap-2 px-3 pt-3 pb-10 bg-white border-t border-black/[0.08] flex-shrink-0">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                    <Plus className="w-6 h-6 text-[#0A84FF]" strokeWidth={2.5} />
                    <ImageIcon className="w-5 h-5 text-[#0A84FF]" strokeWidth={2} />
                    <Mic className="w-5 h-5 text-[#0A84FF]" strokeWidth={2} />
                </div>
                <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 border border-black/[0.06]">
                    <span
                        className="text-gray-400 text-[0.85rem]"
                        style={{ fontFamily: "system-ui" }}
                    >
                        Aa
                    </span>
                    <div className="flex-1" />
                    <Smile className="w-5 h-5 text-[#0A84FF]" strokeWidth={2} />
                </div>
                <ThumbsUp className="w-6 h-6 text-[#0A84FF] flex-shrink-0" strokeWidth={2} />
            </div>
        </div>
    );
}