"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Check,
    CreditCard,
    Send,
    ShieldCheck,
    Ticket,
    Info,
    Loader2,
    Zap,
    Banknote,
    Dot,
    User,
    MapPin,
    ArrowRight,
    Sparkles,
    Lock,
    X,
    BookOpen,
    History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getCurrentPriceTier, formatPrice } from "@/app/lib/pricing";
import { useTracking } from "@/hooks/useTracking";

function AnimatedCheckbox({
    checked,
    onChange,
    name,
    required,
    children,
}: {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="flex items-center gap-3.5 cursor-pointer group select-none">
            <div className="relative shrink-0">
                <input
                    required={required}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                <motion.div
                    className={`w-[22px] h-[22px] rounded-lg border-2 flex items-center justify-center transition-colors duration-200 ${checked
                        ? "bg-green border-green"
                        : "border-white/20 group-hover:border-white/40"
                        }`}
                    whileTap={{ scale: 0.85 }}
                >
                    <AnimatePresence>
                        {checked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                                <Check size={13} className="text-black" strokeWidth={4} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <span className="text-[12px] text-white/40 leading-relaxed font-poppins-med transition-colors duration-200 group-hover:text-white/70">
                {children}
            </span>
        </label>
    );
}

/* ─── floating label input ─── */
function FormInput({
    label,
    required,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    className,
}: {
    label: string;
    required?: boolean;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    className?: string;
}) {
    const [focused, setFocused] = useState(false);
    const active = focused || value.length > 0;

    return (
        <div className={`relative group ${className || ""}`}>
            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? placeholder : ""}
                className={`
                    peer w-full h-[60px] px-5 pt-5 pb-2 rounded-2xl
                    bg-black/[0.02] border-[1.5px]
                    outline-none transition-all duration-300
                    font-poppins-med text-[15px] text-black
                    placeholder:text-black/35
                    ${focused
                        ? "bg-white shadow-sm"
                        : "border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.03]"
                    }
                `}
            />
            <label
                className={`
                    absolute left-5 transition-all duration-200 pointer-events-none
                    font-poppins-bold tracking-wider uppercase
                    ${active
                        ? "top-2.5 text-[9px] " + (focused ? "text-black" : "text-black/30")
                        : "top-[18px] text-[11px] text-black/30"
                    }
                `}
            >
                {label}
                {required && " *"}
            </label>
        </div>
    );
}

/* ─── section header ─── */
function SectionHeader({
    icon: Icon,
    title,
    step,
}: {
    icon: React.ElementType;
    title: string;
    step: number;
}) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className="relative">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10">
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-poppins-extrab text-black">{step}</span>
                </div>
            </div>
            <div>
                <h3 className="text-[22px] font-poppins-bold text-black leading-none">{title}</h3>
            </div>
        </div>
    );
}

/* ─── coupon input (collapse / expand / pill) ─── */
function CouponSection({
    couponCode,
    setCouponCode,
    couponStatus,
    setCouponStatus,
    couponError,
    setCouponError,
    discount,
    setDiscount,
    checkCoupon,
}: {
    couponCode: string;
    setCouponCode: (v: string) => void;
    couponStatus: "idle" | "checking" | "valid" | "invalid";
    setCouponStatus: (v: "idle" | "checking" | "valid" | "invalid") => void;
    couponError: string;
    setCouponError: (v: string) => void;
    discount: number;
    setDiscount: (v: number) => void;
    checkCoupon: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleRemove = () => {
        setCouponCode("");
        setCouponStatus("idle");
        setCouponError("");
        setDiscount(0);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            checkCoupon();
        }
        if (e.key === "Escape" && !couponCode) {
            setIsOpen(false);
        }
    };

    // ── Valid: show removable pill ──
    if (couponStatus === "valid") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-full flex items-center"
            >
                <div className="inline-flex items-center gap-2.5 h-10 pl-3.5 pr-2 rounded-full bg-green/[0.08] border border-green/20">
                    <Check size={13} className="text-green" strokeWidth={3} />
                    <span className="text-[12px] font-poppins-bold text-green tracking-wide uppercase">
                        {couponCode.toUpperCase()} · –{formatPrice(discount)}
                    </span>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="
                            w-5 h-5 rounded-full flex items-center justify-center
                            bg-green/10 text-green/50
                            hover:bg-green/20 hover:text-green
                            transition-colors duration-150
                        "
                    >
                        <X size={10} strokeWidth={2.5} />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="h-full flex items-center">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    // ── Collapsed: subtle text trigger ──
                    <motion.button
                        key="coupon-trigger"
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setIsOpen(true)}
                        className="
                            group flex items-center gap-2
                            text-[13px] font-poppins-med text-black/30
                            hover:text-black/55 transition-colors duration-200
                        "
                    >
                        <Ticket size={14} strokeWidth={2.5} className="shrink-0" />
                        <span className="border-b border-dashed border-current pb-px">
                            Van kuponkódod?
                        </span>
                        <ArrowRight
                            size={13}
                            strokeWidth={2.5}
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                        />
                    </motion.button>
                ) : (
                    // ── Expanded: input field ──
                    <motion.div
                        key="coupon-input"
                        initial={{ opacity: 0, width: "200px" }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ opacity: 0, width: "200px" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        <div className="relative flex items-center">
                            <input
                                ref={inputRef}
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    if (couponStatus === "invalid") {
                                        setCouponStatus("idle");
                                        setCouponError("");
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="pl. ERETTSEGI2026"
                                maxLength={20}
                                className={`
                                    w-full h-[52px] pl-4 pr-[100px] rounded-xl
                                    bg-white outline-none
                                    border-[1.5px] transition-all duration-200
                                    font-poppins-bold text-[13px] text-black tracking-[0.08em]
                                    placeholder:text-black/35 placeholder:tracking-normal placeholder:font-poppins-med placeholder:text-[13px]
                                    ${couponStatus === "invalid"
                                        ? "border-[#ff3b30]/30"
                                        : "border-black/[0.08] focus:border-black/20"
                                    }
                                `}
                            />
                            <button
                                type="button"
                                onClick={checkCoupon}
                                disabled={couponStatus === "checking" || !couponCode}
                                className="
                                    absolute right-1.5 h-[40px] px-4 rounded-lg
                                    bg-black text-white
                                    text-[10px] font-poppins-bold uppercase tracking-[0.12em]
                                    disabled:opacity-[0.06] disabled:pointer-events-none
                                    hover:bg-black/80 active:scale-[0.97]
                                    transition-all duration-150
                                    flex items-center justify-center min-w-[72px]
                                "
                            >
                                {couponStatus === "checking" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    "Beváltás"
                                )}
                            </button>
                        </div>

                        <AnimatePresence>
                            {couponStatus === "invalid" && couponError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[#ff3b30] text-[11px] font-poppins-bold mt-1.5 ml-1"
                                >
                                    {couponError}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── main form ─── */
export default function OrderForm() {
    const { trackLead } = useTracking();
    const [tier, setTier] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<"barion" | "transfer">("barion");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponStatus, setCouponStatus] = useState<
        "idle" | "checking" | "valid" | "invalid"
    >("idle");
    const [couponError, setCouponError] = useState("");
    const [discount, setDiscount] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);

    const [formData, setFormData] = useState({
        mssys_lastname: "",
        mssys_firstname: "",
        email: "",
        mssys_mobile: "",
        mssys_bill_country: "hu",
        mssys_bill_zip: "",
        mssys_bill_city: "",
        mssys_bill_address: "",
        mssys_comment: "",
        aszf_gdpr: false,
        adatvedelmi_gdpr: false,
        even_aluli_18: false,
    });

    const [selectedProduct, setSelectedProduct] = useState<"töri" | "magyar" | "kombo">("töri");

    useEffect(() => {
        const currentTier = getCurrentPriceTier();
        setTier(currentTier);
        if (currentTier.isCombo) {
            setSelectedProduct("kombo");
        } else if (currentTier.subjects.includes("magyar")) {
            setSelectedProduct("magyar");
        } else {
            setSelectedProduct("töri");
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        if (
            !formData.mssys_lastname ||
            !formData.mssys_firstname ||
            !formData.email ||
            !formData.mssys_mobile
        )
            return false;
        if (
            !formData.mssys_bill_zip ||
            !formData.mssys_bill_city ||
            !formData.mssys_bill_address
        )
            return false;
        if (!formData.aszf_gdpr || !formData.adatvedelmi_gdpr) return false;
        return true;
    };

    const checkCoupon = async () => {
        if (!couponCode) return;
        setCouponStatus("checking");
        setCouponError("");

        try {
            setTimeout(() => {
                if (couponCode.toUpperCase() === "SIKER") {
                    setCouponStatus("valid");
                    setDiscount(1000);
                } else {
                    setCouponStatus("invalid");
                    setCouponError("Érvénytelen kuponkód.");
                    setDiscount(0);
                }
            }, 1000);
        } catch {
            setCouponStatus("invalid");
            setCouponError("Hiba történt az ellenőrzés során.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Kérlek tölts ki minden kötelező mezőt és fogadd el a feltételeket!");
            return;
        }
        setIsSubmitting(true);

        // ── Tracking: Fire Lead event BEFORE SAPI form submission ──
        const productNames: Record<string, string> = {
            'töri': 'Történelem kurzus',
            'magyar': 'Magyar kurzus',
            'kombo': 'Kombo kurzus (Történelem + Magyar)',
        };
        trackLead(
            {
                email: formData.email,
                firstName: formData.mssys_firstname,
                lastName: formData.mssys_lastname,
                phone: formData.mssys_mobile,
                city: formData.mssys_bill_city,
                zip: formData.mssys_bill_zip,
                country: formData.mssys_bill_country,
            },
            productNames[selectedProduct] || selectedProduct,
            finalPrice,
            'HUF'
        );

        // Small delay to allow tracking fetch calls to fire
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.submit();
            }
        }, 300);
    };

    if (!tier) return null;

    const getPrice = () => {
        if (selectedProduct === "kombo") return tier.comboPrice || tier.price;
        return tier.price;
    };

    const basePrice = getPrice();
    const finalPrice = Math.max(0, basePrice - discount);

    return (
        <section
            id="jelentkezes"
            className="w-full py-24 md:py-32 bg-[#fafaf9] relative overflow-hidden"
        >
            <div className="container-main px-4 relative z-10">
                <div className="max-w-[880px] mx-auto">
                    <motion.div
                        className="text-center mb-16 md:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-poppins-extrab text-black mb-5 leading-[1.1]">
                            Biztosítsd a helyed
                            <br />
                            <span className="relative inline-block mt-1">
                                a kurzuson
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 300 12"
                                    fill="none"
                                >
                                    <path
                                        d="M2 8.5C50 2 100 2 150 6C200 10 250 4 298 7"
                                        stroke="#CEFF06"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-black/40 font-poppins-med text-base md:text-lg max-w-lg mx-auto mt-6">
                            Töltsd ki az alábbi űrlapot, és a számlát e-mailben küldjük el
                            neked.
                        </p>
                    </motion.div>

                    {/* ── form card ── */}
                    <motion.div
                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* ═══ Section 0: Product Selection ═══ */}
                            {tier.subjects.length > 1 || tier.isCombo ? (
                                <div>
                                    <SectionHeader icon={BookOpen} title="Válassz tantárgyat" step={1} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: "töri", label: "Történelem", icon: History },
                                            { id: "magyar", label: "Magyar", icon: BookOpen },
                                            { id: "kombo", label: "Kombo (Mindkettő)", icon: Sparkles, isCombo: true },
                                        ].map((prod) => (
                                            <motion.button
                                                key={prod.id}
                                                type="button"
                                                onClick={() => setSelectedProduct(prod.id as any)}
                                                whileTap={{ scale: 0.97 }}
                                                className={`
                                                    relative flex flex-col items-center justify-center p-6 rounded-2xl border-[1.5px] transition-all duration-300 text-center
                                                    ${selectedProduct === prod.id
                                                        ? "border-green bg-green/[0.04]"
                                                        : "border-black/[0.06] bg-black/[0.01] hover:border-black/[0.12] hover:bg-black/[0.02]"
                                                    }
                                                `}
                                            >
                                                <div className={`
                                                    w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300
                                                    ${selectedProduct === prod.id ? "bg-green text-black" : "bg-black/[0.04] text-black/30"}
                                                `}>
                                                    <prod.icon size={22} strokeWidth={2.5} />
                                                </div>
                                                <span className="font-poppins-bold text-black text-[15px]">{prod.label}</span>
                                                {prod.isCombo && (
                                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-poppins-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                                                        Legjobb érték
                                                    </span>
                                                )}
                                                {selectedProduct === prod.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute top-3 right-3"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center">
                                                            <Check size={11} className="text-black" strokeWidth={4} />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* ═══ Section 1: Personal ═══ */}
                            <div>
                                <SectionHeader icon={User} title="Résztvevő adatai" step={tier.subjects.length > 1 ? 2 : 1} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        required
                                        label="Vezetéknév"
                                        name="mssys_lastname"
                                        value={formData.mssys_lastname}
                                        onChange={handleChange}
                                        placeholder="Kovács"
                                    />
                                    <FormInput
                                        required
                                        label="Keresztnév"
                                        name="mssys_firstname"
                                        value={formData.mssys_firstname}
                                        onChange={handleChange}
                                        placeholder="László"
                                    />
                                    <FormInput
                                        required
                                        label="E-mail cím"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@pelda.hu"
                                    />
                                    <FormInput
                                        required
                                        label="Telefonszám"
                                        name="mssys_mobile"
                                        value={formData.mssys_mobile}
                                        onChange={handleChange}
                                        placeholder="+36 30 123 4567"
                                    />
                                </div>
                            </div>

                            {/* divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                            </div>

                            {/* ═══ Section 2: Billing ═══ */}
                            <div>
                                <SectionHeader icon={MapPin} title="Számlázási cím" step={tier.subjects.length > 1 ? 3 : 2} />
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Country select */}
                                        <div className="relative group">
                                            <select
                                                name="mssys_bill_country"
                                                value={formData.mssys_bill_country}
                                                onChange={handleChange}
                                                className="
                                                    peer w-full h-[60px] px-5 pt-5 pb-2 rounded-2xl
                                                    bg-black/[0.02] border-[1.5px] border-black/[0.06]
                                                    outline-none transition-all duration-300
                                                    font-poppins-med text-[15px] text-black
                                                    appearance-none cursor-pointer
                                                    hover:border-black/[0.12] hover:bg-black/[0.03]
                                                    focus:border-green focus:ring-[3px] focus:ring-green/10 focus:bg-white focus:shadow-sm
                                                "
                                            >
                                                <option value="hu">Magyarország</option>
                                                <option value="ro">Románia</option>
                                                <option value="sk">Szlovákia</option>
                                                <option value="at">Ausztria</option>
                                            </select>
                                            <label className="absolute left-5 top-2.5 text-[9px] font-poppins-bold tracking-wider uppercase text-black/30 pointer-events-none">
                                                Ország *
                                            </label>
                                            {/* dropdown arrow */}
                                            <svg
                                                className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 pointer-events-none"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                        <FormInput
                                            required
                                            label="Irányítószám"
                                            name="mssys_bill_zip"
                                            value={formData.mssys_bill_zip}
                                            onChange={handleChange}
                                            placeholder="1011"
                                        />
                                        <FormInput
                                            required
                                            label="Város"
                                            name="mssys_bill_city"
                                            value={formData.mssys_bill_city}
                                            onChange={handleChange}
                                            placeholder="Budapest"
                                        />
                                    </div>
                                    <FormInput
                                        required
                                        label="Utca, házszám"
                                        name="mssys_bill_address"
                                        value={formData.mssys_bill_address}
                                        onChange={handleChange}
                                        placeholder="Fő utca 12. 3/4."
                                    />

                                    {/* Comment */}
                                    <div className="relative group">
                                        <textarea
                                            name="mssys_comment"
                                            value={formData.mssys_comment}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Bármilyen egyéb megjegyzés..."
                                            className="
                                                w-full px-5 pt-8 pb-4 rounded-2xl
                                                bg-black/[0.02] border-[1.5px] border-black/[0.06]
                                                outline-none transition-all duration-300
                                                font-poppins-med text-[15px] text-black resize-none
                                                placeholder:text-black/35
                                                hover:border-black/[0.12] hover:bg-black/[0.03]
                                                focus:border-green focus:ring-[3px] focus:ring-green/10 focus:bg-white focus:shadow-sm
                                            "
                                        />
                                        <label className="absolute left-5 top-3 text-[9px] font-poppins-bold tracking-wider uppercase text-black/30 pointer-events-none">
                                            Megjegyzés
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* VAT Statement */}
                            <div className="bg-black/[0.02] border border-black/[0.05] rounded-2xl p-5 mt-4">
                                <p className="text-[13px] text-black/50 font-poppins-med leading-relaxed flex items-start gap-3">
                                    <Info size={16} className="shrink-0 mt-0.5 text-black/30" />
                                    <span>
                                        A vásárlásról a résztvevő nevére alanyi adómentes számlát állítunk ki. ÁFA tartalma 0%.
                                    </span>
                                </p>
                            </div>

                            {/* divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                            </div>

                            {/* ═══ Section 3: Payment & Coupon ═══ */}
                            <div>
                                <SectionHeader icon={CreditCard} title="Fizetés" step={tier.subjects.length > 1 ? 4 : 3} />
                                <div className="space-y-5">
                                    {/* Payment method cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button
                                            type="button"
                                            onClick={() => setPaymentMethod("barion")}
                                            whileTap={{ scale: 0.97 }}
                                            className={`
                                                relative flex flex-col justify-between p-5 md:p-6 rounded-2xl border-[1.5px] transition-all duration-300 text-left h-full min-h-[180px]
                                                ${paymentMethod === "barion"
                                                    ? "border-green bg-green/[0.04]"
                                                    : "border-black/[0.06] bg-black/[0.01] hover:border-black/[0.12] hover:bg-black/[0.02]"
                                                }
                                            `}
                                        >
                                            <div>
                                                <div
                                                    className={`
                                                    w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                                                    ${paymentMethod === "barion"
                                                            ? "bg-green text-black"
                                                            : "bg-black/[0.04] text-black/30"
                                                        }
                                                `}
                                                >
                                                    <Zap
                                                        size={20}
                                                        strokeWidth={2.5}
                                                        fill={
                                                            paymentMethod === "barion"
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </div>
                                                <p className="font-poppins-bold text-black text-base mb-1">
                                                    Online kártya
                                                </p>
                                                <p
                                                    className={`text-xs font-poppins-med leading-relaxed transition-colors duration-200 ${paymentMethod === "barion"
                                                        ? "text-black/50"
                                                        : "text-black/25"
                                                        }`}
                                                >
                                                    Azonnali
                                                </p>
                                            </div>
                                            <img
                                                src="https://d1ursyhqs5x9h1.cloudfront.net/sw/images/Barion-smart-payment-horizontal-whitebg.png"
                                                className={`h-4 object-contain mt-4 transition-opacity duration-300 ${paymentMethod === "barion"
                                                    ? "opacity-60"
                                                    : "opacity-20"
                                                    }`}
                                                alt="Barion"
                                            />
                                            {/* checkmark */}
                                            <AnimatePresence>
                                                {paymentMethod === "barion" && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 25,
                                                        }}
                                                        className="absolute top-4 right-4"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center">
                                                            <Check
                                                                size={13}
                                                                className="text-black"
                                                                strokeWidth={4}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        {/* Transfer */}
                                        <motion.button
                                            type="button"
                                            onClick={() => setPaymentMethod("transfer")}
                                            whileTap={{ scale: 0.97 }}
                                            className={`
                                                relative flex flex-col justify-between p-5 md:p-6 rounded-2xl border-[1.5px] transition-all duration-300 text-left h-full min-h-[180px]
                                                ${paymentMethod === "transfer"
                                                    ? "border-green bg-green/[0.04]"
                                                    : "border-black/[0.06] bg-black/[0.01] hover:border-black/[0.12] hover:bg-black/[0.02]"
                                                }
                                            `}
                                        >
                                            <div>
                                                <div
                                                    className={`
                                                    w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                                                    ${paymentMethod === "transfer"
                                                            ? "bg-green text-black"
                                                            : "bg-black/[0.04] text-black/30"
                                                        }
                                                `}
                                                >
                                                    <Banknote size={20} strokeWidth={2.5} />
                                                </div>
                                                <p className="font-poppins-bold text-black text-base mb-1">
                                                    Átutalás
                                                </p>
                                                <p
                                                    className={`text-xs font-poppins-med leading-relaxed transition-colors duration-200 ${paymentMethod === "transfer"
                                                        ? "text-black/50"
                                                        : "text-black/25"
                                                        }`}
                                                >
                                                    Díjbekérő e-mailben
                                                </p>
                                            </div>
                                            <p
                                                className={`text-[9px] font-poppins-bold uppercase tracking-[0.12em] mt-4 transition-colors duration-200 ${paymentMethod === "transfer"
                                                    ? "text-black/30"
                                                    : "text-black/15"
                                                    }`}
                                            >
                                                Fizetési határidő: 2 nap
                                            </p>
                                            <AnimatePresence>
                                                {paymentMethod === "transfer" && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 25,
                                                        }}
                                                        className="absolute top-4 right-4"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center">
                                                            <Check
                                                                size={13}
                                                                className="text-black"
                                                                strokeWidth={4}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </div>

                                    {/* Coupon — collapse/expand/pill */}
                                    <CouponSection
                                        couponCode={couponCode}
                                        setCouponCode={setCouponCode}
                                        couponStatus={couponStatus}
                                        setCouponStatus={setCouponStatus}
                                        couponError={couponError}
                                        setCouponError={setCouponError}
                                        discount={discount}
                                        setDiscount={setDiscount}
                                        checkCoupon={checkCoupon}
                                    />
                                </div>
                            </div>

                            <motion.div
                                className="relative bg-[#111111] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 overflow-hidden border border-white/10 shadow-2xl"
                                layout
                            >
                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

                                    {/* --- Bal oldal: Összeg --- */}
                                    <div className="w-full lg:w-auto flex flex-col items-center lg:items-start space-y-2">
                                        <span className="text-white/40 font-poppins-bold text-[11px] uppercase tracking-[0.15em]">
                                            Fizetendő összeg
                                        </span>
                                        <div className="flex flex-col items-center lg:items-start">
                                            <AnimatePresence mode="wait">
                                                {discount > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-xl font-poppins-bold text-white/30 line-through mb-1"
                                                    >
                                                        {formatPrice(basePrice)}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <motion.div
                                                key={finalPrice}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-5xl md:text-6xl lg:text-7xl font-poppins-extrab tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
                                            >
                                                {formatPrice(finalPrice)}
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* --- Jobb oldal: Checkboxok és Gomb --- */}
                                    <div className="w-full lg:w-[440px] flex flex-col gap-6">

                                        {/* Üvegszerű (Glassmorphism) konténer a jogi dolgoknak */}
                                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
                                            <AnimatedCheckbox
                                                required
                                                name="aszf_gdpr"
                                                checked={formData.aszf_gdpr}
                                                onChange={handleChange}
                                            >
                                                Elfogadom az <Link href="/aszf" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white hover:text-green transition-colors cursor-pointer border-b border-white/20 hover:border-green/50 pb-0.5">Általános Szerződési Feltételeket</Link>
                                            </AnimatedCheckbox>

                                            <AnimatedCheckbox
                                                required
                                                name="adatvedelmi_gdpr"
                                                checked={formData.adatvedelmi_gdpr}
                                                onChange={handleChange}
                                            >
                                                Az <Link href="/adatvedelem" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white hover:text-green transition-colors cursor-pointer border-b border-white/20 hover:border-green/50 pb-0.5">Adatkezelési Tájékoztatóban</Link> foglaltakat elolvastam, megértettem és tudomásul vettem.
                                            </AnimatedCheckbox>

                                            <AnimatedCheckbox
                                                name="even_aluli_18"
                                                checked={formData.even_aluli_18}
                                                onChange={handleChange}
                                            >
                                                A 18 éven aluli gyermek esetén törvényes képviselőjeként nyilatkozom, hogy az <Link href="/adatvedelem" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white hover:text-green transition-colors cursor-pointer border-b border-white/20 hover:border-green/50 pb-0.5">Adatkezelési Tájékoztatóban</Link> foglaltakat elolvastam, megértettem és tudomásul vettem. Hozzájárulok gyermekem személyes adatainak kezeléséhez, a szolgáltatás igénybevétele érdekében.
                                            </AnimatedCheckbox>
                                        </div>

                                        <p className="text-[11px] text-white/30 font-poppins-med text-center italic">
                                            A "Megrendelem" gombra kattintva fizetési kötelezettséggel járó megrendelést adsz le.
                                        </p>

                                        {/* Modernizált Submit Gomb */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.015 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="
                                                relative w-full bg-green text-black
                                                font-poppins-extrab text-[16px] md:text-lg
                                                py-4 md:py-5 rounded-2xl
                                                transition-all duration-300
                                                disabled:opacity-40 disabled:pointer-events-none
                                                group overflow-hidden
                                            "
                                        >
                                            {/* Shimmer / Csillogás effekt a gombon belül */}
                                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none skew-x-12" />

                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {isSubmitting ? (
                                                    <Loader2 size={24} className="animate-spin text-black" />
                                                ) : (
                                                    <>
                                                        Megrendelem
                                                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:translate-x-1 transition-all duration-300">
                                                            <ArrowRight
                                                                size={15}
                                                                className="text-black group-hover:text-green transition-colors duration-300"
                                                                strokeWidth={3.5}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </form>

                        {/* Hidden SAPI Form */}
                        <form
                            ref={formRef}
                            action="https://info.erettsegizo.hu/t/sub"
                            method="post"
                            className="hidden"
                        >
                            <input type="hidden" name="nl_id" value="168092" />
                            <input type="hidden" name="ns_id" value="329707" />
                            <input
                                type="hidden"
                                name="character-encoding"
                                value="utf-8"
                            />
                            <input type="hidden" name="prod_id" value="3338243" />
                            <input
                                type="hidden"
                                name="mssys_lastname"
                                value={formData.mssys_lastname}
                            />
                            <input
                                type="hidden"
                                name="mssys_firstname"
                                value={formData.mssys_firstname}
                            />
                            <input type="hidden" name="email" value={formData.email} />
                            <input
                                type="hidden"
                                name="mssys_mobile"
                                value={formData.mssys_mobile}
                            />
                            <input
                                type="hidden"
                                name="mssys_bill_country"
                                value={formData.mssys_bill_country}
                            />
                            <input
                                type="hidden"
                                name="mssys_bill_zip"
                                value={formData.mssys_bill_zip}
                            />
                            <input
                                type="hidden"
                                name="mssys_bill_city"
                                value={formData.mssys_bill_city}
                            />
                            <input
                                type="hidden"
                                name="mssys_bill_address"
                                value={formData.mssys_bill_address}
                            />
                            <input
                                type="hidden"
                                name="mssys_comment"
                                value={formData.mssys_comment}
                            />
                            <input
                                type="hidden"
                                name="mssys_coupon"
                                value={couponCode}
                            />
                            <input
                                type="hidden"
                                name="shipping_method"
                                value={
                                    paymentMethod === "barion" ? "44346" : "44349"
                                }
                            />
                            <input
                                type="hidden"
                                name="online_payment_method"
                                value={paymentMethod === "barion" ? "barion" : ""}
                            />
                            <input
                                type="hidden"
                                name="aszf_gdpr"
                                value={formData.aszf_gdpr ? "on" : ""}
                            />
                            <input
                                type="hidden"
                                name="adatvedelmi_gdpr"
                                value={formData.adatvedelmi_gdpr ? "on" : ""}
                            />
                            <input
                                type="hidden"
                                name="even_aluli_18"
                                value={formData.even_aluli_18 ? "on" : ""}
                            />
                        </form>
                    </motion.div>

                    {/* ── trust bar ── */}
                    <motion.div
                        className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <img
                            src="https://d1ursyhqs5x9h1.cloudfront.net/sw/images/Barion-smart-payment-horizontal-whitebg.png"
                            className="h-5 opacity-50"
                            alt="Barion"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}