"use client";

import React, { useEffect, useRef } from "react";
import { Check, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import { useTracking } from "@/hooks/useTracking";
import { getStoredLeadData } from "@/lib/tracking";
import { motion } from "framer-motion";

export default function SikeresJelentkezesPage() {
    const { trackPurchase } = useTracking();
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;
        hasTracked.current = true;

        const leadData = getStoredLeadData();
        if (leadData) {
            trackPurchase(
                {
                    email: leadData.email,
                    firstName: leadData.firstName,
                    lastName: leadData.lastName,
                    phone: leadData.phone,
                },
                leadData.product,
                leadData.value,
                leadData.currency
            );
        } else {
            console.warn("[Tracking] Nem található lead adat a Purchase rögzítéséhez (üres session).");
        }
    }, [trackPurchase]);

    return (
        <section className="w-full min-h-[85vh] bg-[#fafaf9] pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-green/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[0%] -left-[10%] w-[40%] h-[40%] bg-black/5 blur-[100px] rounded-full" />
            </div>

            <div className="container-main px-4 relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
                
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green rounded-[2rem] flex items-center justify-center shadow-xl shadow-green/20 mb-10"
                >
                    <Check size={48} className="text-black" strokeWidth={3.5} />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-poppins-extrab text-4xl sm:text-5xl md:text-6xl text-black mb-6 leading-tight"
                >
                    Sikeres <span className="bg-green px-3 md:px-4 py-1 ml-1 rounded-xl">jelentkezés!</span>
                </motion.h1>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-black/[0.03] w-full mt-4 flex flex-col gap-6"
                >
                    <p className="font-poppins-med text-lg md:text-xl text-black/80 leading-relaxed">
                        Köszönjük a rendelésed, minden szuperül működött! A helyedet sikeresen befoglaltuk az utolsó esti ismétlésre.
                    </p>

                    <div className="flex flex-col gap-4 mt-2">
                        <div className="bg-[#fafaf9] rounded-2xl p-5 flex items-start gap-4 text-left border border-black/5">
                            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Mail size={20} className="text-black/60" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-poppins-bold text-black mb-1">Nézd meg az e-mail fiókodat!</h3>
                                <p className="font-poppins-med text-sm text-black/60 leading-relaxed">
                                    Küldtünk egy visszaigazoló levelet a részletekkel. Kérlek, olvasd el figyelmesen, ott minden további lépést megtalálsz. (Nézz be a Promóciók/Spam mappába is biztos ami biztos!)
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#fafaf9] rounded-2xl p-5 flex items-start gap-4 text-left border border-black/5">
                            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                                <ShieldCheck size={20} className="text-black/60" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-poppins-bold text-black mb-1">Fizetés / Számla</h3>
                                <p className="font-poppins-med text-sm text-black/60 leading-relaxed">
                                    A fizetés módjától (átutalás vagy kártya) függően már úton van feléd az adómentes számla, illetve átutalás esetén a díjbekérő is.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-black/40 font-poppins-bold uppercase tracking-widest text-sm hover:text-black transition-colors"
                    >
                        <ArrowRight size={16} strokeWidth={3} className="rotate-180" />
                        Vissza a főoldalra
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
