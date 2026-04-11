"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { getCurrentPriceTier, formatPrice } from "@/app/lib/pricing";
import { usePathname } from "next/navigation";

export default function FAQ2() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tier, setTier] = useState<any>(null);

    const pathname = usePathname();
    const isJelentkezes = pathname === "/jelentkezes";

    useEffect(() => {
        setTier(getCurrentPriceTier());
    }, []);

    const faqs = [
        {
            question: "Meddig tart az ismétlés?",
            answer:
                "Az ismétlés 16:30-kor kezdődik és 21:00-ig tart. Ebben benne van az alapos áttekintés és a rövid szünetek is, hogy friss maradj.",
        },
        {
            question: "Miben más ez, mint ha egyedül ismétlek?",
            answer:
                "Itt nem csak átnézed az anyagot, hanem vezetetten, rendszerezve haladsz végig rajta, kiemelve azokat a pontokat, amik nagy eséllyel előjönnek az érettségin.",
        },
        {
            question: "Milyen platformon lesz az oktatás?",
            answer:
                "Egy zárt, könnyen kezelhető online felületen tartjuk, amihez csak egy böngészőre van szükséged. A linket e-mailben küldjük ki.",
        },
        {
            question: "Megéri még az utolsó este csatlakozni?",
            answer:
                "Igen — sokszor pont az utolsó átnézés adja meg azt a plusz magabiztosságot, ami az érettségin számít.",
        },
        {
            question: "Mennyire kell előre készülnöm az estre?",
            answer:
                "Nem szükséges külön készülnöd. Ez az este pont arról szól, hogy ha már tanultál, akkor segítünk mindent a helyére tenni a fejedben az érettségi előtt.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="gyik" className="w-full flex items-start py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 scroll-mt-20">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
                {tier && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-16 md:mb-24"
                    >
                        <Link
                            href="/jelentkezes"
                            className="bg-[#cc2b20] text-white font-poppins-bold text-sm md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-full hover:scale-105 transition-transform flex flex-col items-center justify-center shadow-lg cursor-pointer"
                        >
                            <span>Jelentkezem</span>
                        </Link>
                    </motion.div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 xl:gap-20 justify-start">
                    <div className="flex flex-col space-y-6 lg:sticky lg:top-24 lg:self-start">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="font-poppins-extrab text-neutral-900 dark:text-white leading-tight tracking-tight text-4xl md:text-5xl"
                        >
                            <span className="block">Gyakran ismételt</span>
                            <span className="relative inline-block mt-1">
                                kérdések
                                <span className="absolute bottom-[0.1em] left-1 w-[calc(100%-0.5rem)] h-[0.25em] bg-[rgba(206,255,6,0.6)] -z-10 rounded-sm" />
                            </span>
                        </motion.h2>

                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4"
                        >
                            <Link
                                href="/jelentkezes"
                                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#cc2b20] text-white font-poppins-bold text-sm sm:text-base hover:bg-[#b0251c] hover:scale-105 transition-all duration-200 whitespace-nowrap text-center flex flex-col items-center justify-center"
                            >
                                <span>Jelentkezem {tier ? formatPrice(tier.price) : "..."}-tól</span>
                                {tier?.isCombo && <span className="text-[10px] opacity-80">(Töri, Magyar vagy Kombo)</span>}
                            </Link>
                        </motion.div> */}
                    </div>

                    <div className="flex flex-col space-y-7">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                                className="flex flex-col"
                            >
                                <div className="flex items-start gap-3">
                                    <motion.button
                                        onClick={() => toggleFAQ(index)}
                                        className="flex-1 max-w-[85%] sm:max-w-[75%] text-left group cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div
                                            className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-full transition-all duration-200 ${openIndex === index
                                                ? "bg-blue-500/10 border border-blue-500/30"
                                                : "bg-neutral-200 dark:bg-neutral-800 border border-transparent hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                                }`}
                                        >
                                            <p
                                                className={`text-sm sm:text-base leading-relaxed transition-colors duration-200 ${openIndex === index
                                                    ? "text-blue-400"
                                                    : "text-neutral-900 dark:text-white"
                                                    }`}
                                            >
                                                {faq.question}
                                            </p>
                                        </div>
                                    </motion.button>

                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        aria-label={openIndex === index ? "Kérdés bezárása" : "Kérdés megnyitása"}
                                        className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors duration-200 mt-3 ${openIndex === index
                                            ? "border-blue-500/50 hover:border-blue-400"
                                            : "border-neutral-400 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-400"
                                            }`}
                                    >
                                        {openIndex === index ? (
                                            <Minus
                                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${openIndex === index
                                                    ? "text-blue-400"
                                                    : "text-neutral-900 dark:text-white"
                                                    }`}
                                            />
                                        ) : (
                                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600 dark:text-neutral-400" />
                                        )}
                                    </button>
                                </div>

                                <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                                opacity: { duration: 0.3, ease: "easeInOut" },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.2, y: -10 }}
                                                animate={{ scale: 1, y: 0 }}
                                                exit={{ scale: 0.5, y: -10 }}
                                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                className="self-end max-w-[85%] sm:max-w-[75%] mt-4 ml-auto"
                                            >
                                                <div className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-[20px] bg-blue-500">
                                                    <p className="text-sm sm:text-base text-white leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
