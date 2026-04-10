import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestPricingControls from "./components/TestPricingControls";
import TrackingScripts from "./components/TrackingScripts";


import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: {
		default: "Érettségiző - Az utolsó este az érettségi előtt",
		template: "%s | Érettségiző.hu",
	},
	description: "Célzott érettségi felkészítő az utolsó pillanatban. Ismételjük át együtt a legfontosabb tételeket.",
	metadataBase: new URL("https://erettsegizo.hu"),
	alternates: {
		canonical: "/",
	},
	authors: [{ name: "Hegedüs Tamás e.v." }],
	keywords: [
		"magyar érettségi", "érettségi felkészítő", "magyar tételek", "utolsó este", "érettségi 2024", "kidolgozott tételek"
	],
	openGraph: {
		type: "website",
		locale: "hu_HU",
		url: "https://erettsegizo.hu",
		siteName: "Érettségiző.hu",
		title: "Érettségiző - Az utolsó este az érettségi előtt",
		description: "Célzott érettségi felkészítő az utolsó pillanatban. Ismételjük át együtt a legfontosabb tételeket közvetlenül a magyar érettségi előtt egy szervezett online eseményen!",
		images: [
			{
				url: "/og-image.jpg", // Később cserélendő a tényleges Open Graph képre
				width: 1200,
				height: 630,
				alt: "Érettségiző.hu - Az utolsó este az érettségi előtt",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Érettségiző - Az utolsó este az érettségi előtt",
		description: "Célzott érettségi felkészítő az utolsó pillanatban. Ismételjük át együtt a legfontosabb tételeket közvetlenül a magyar érettségi előtt!",
		images: ["/og-image.jpg"],
	},
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
				{/* <TrackingScripts /> */}
				<Navbar />
				<main id="main-content" role="main">
					{children}
				</main>
				<Footer />
				{/* <TestPricingControls /> */}
			</body>
		</html>
	);
}