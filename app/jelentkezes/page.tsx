import React from "react";
import OrderFormClient from "./OrderFormClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jelentkezés a felkészítőre",
    description: "Biztosítsd a helyed az intenzív érettségi felkészítőre! Készüljünk fel együtt célzottan, a legfontosabb történelem tételekből az utolsó pillanatban is.",
    alternates: {
        canonical: "/jelentkezes",
    },
};

export default function JelentkezesPage() {
    return (
        <main className="w-full bg-white pt-32 pb-12">
            <OrderFormClient />
        </main>
    );
}