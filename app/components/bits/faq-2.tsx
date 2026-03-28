"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getCurrentPriceTier, formatPrice } from "@/app/lib/pricing";

export default function FAQ2() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tier, setTier] = useState<any>(null);

    useEffect(() => {
        setTier(getCurrentPriceTier());
    }, []);

    const faqs = [
        {
            question: "Lorem Ipsum?",
            answer:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            question: "Lorem Ipsum?",
            answer:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            question: "Lorem Ipsum?",
            answer:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            question: "Lorem Ipsum?",
            answer:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            question: "Lorem Ipsum?",
            answer:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="gyik" className="w-full flex items-start py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 scroll-mt-20">
            <div className="max-w-[1400px] mx-auto w-full">
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

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4"
                        >
                            <button className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#ff3b30] text-white font-poppins-bold text-sm sm:text-base hover:bg-[#e7625b] hover:scale-105 transition-colors duration-200 whitespace-nowrap">
                                Jelentkezem {tier ? formatPrice(tier.isCombo ? tier.comboPrice : tier.price) : "..."}-ért
                            </button>
                        </motion.div>
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
