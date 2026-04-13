"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DelayedMountProps {
    children: React.ReactNode;
    delayMs?: number;
    fallback?: React.ReactNode;
    animateIn?: boolean;
}

export default function DelayedMount({ 
    children, 
    delayMs = 1500, 
    fallback = null,
    animateIn = true 
}: DelayedMountProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, delayMs);

        return () => clearTimeout(timer);
    }, [delayMs]);

    if (!isMounted) return <>{fallback}</>;

    if (animateIn) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full h-full relative"
            >
                {children}
            </motion.div>
        );
    }

    return <>{children}</>;
}
