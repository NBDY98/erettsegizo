import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestPricingControls from "./components/TestPricingControls";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });



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