import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestPricingControls from "./components/TestPricingControls";
import TrackingScripts from "./components/TrackingScripts";


import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Érettségiző",
	description: "Az utolsó este az érettségi előtt",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="hu" className={cn("scroll-pt-24 bg-background text-black", "font-sans")}>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<meta name="theme-color" content="#0B937C" />
			</head>
			<body className="font-rem antialiased overflow-x-hidden">
				<Toaster position="top-center" richColors />
				<TrackingScripts />
				<Navbar />
				<main id="main-content" role="main">
					{children}
				</main>
				<Footer />
				<TestPricingControls />
			</body>
		</html>
	);
}