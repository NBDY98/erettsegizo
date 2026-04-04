import React from "react";
import OrderForm from "@/app/components/OrderForm";

export default function JelentkezesPage() {
    return (
        <main className="w-full bg-white pt-32 pb-12">
            <React.Suspense fallback={<div className="min-h-[500px] flex items-center justify-center font-poppins-med">Betöltés...</div>}>
                <OrderForm />
            </React.Suspense>
        </main>
    );
}
