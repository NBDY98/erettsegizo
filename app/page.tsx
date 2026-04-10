import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import TargetSection from "./components/TargetSection";
import dynamic from "next/dynamic";
import SchemaOrg from "./components/SchemaOrg";

const PricingSection = dynamic(() => import("./components/PricingSection"));
const GuaranteeSection = dynamic(() => import("./components/GuaranteeSection"));
const LiteratureSection = dynamic(() => import("./components/LiteratureSection"));
const HistorySection = dynamic(() => import("./components/HistorySection"));
const FAQ2 = dynamic(() => import("./components/bits/faq-2"));

export default async function Home() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Érettségiző.hu",
        "url": "https://erettsegizo.hu",
        "logo": "https://erettsegizo.hu/apple-touch-icon.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+36-30-405-9600",
            "contactType": "customer service",
            "email": "info@erettsegizo.hu",
            "availableLanguage": "Hungarian"
        }
    };

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Érettségiző - Az utolsó este az érettségi előtt",
        "description": "Intenzív, egyestés online érettségi felkészítő a legfontosabb magyar irodalom és történelem tételekből.",
        "provider": {
            "@type": "Organization",
            "name": "Érettségiző.hu",
            "sameAs": "https://erettsegizo.hu"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Meddig tart az ismétlés?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Az ismétlés 16:30-kor kezdődik és 21:00-ig tart. Ebben benne van az alapos áttekintés és a rövid szünetek is, hogy friss maradj."
                }
            },
            {
                "@type": "Question",
                "name": "Miben más ez, mint ha egyedül ismétlek?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Itt nem csak átnézed az anyagot, hanem vezetetten, rendszerezve haladsz végig rajta, kiemelve azokat a pontokat, amik nagy eséllyel előjönnek az érettségin."
                }
            },
            {
                "@type": "Question",
                "name": "Milyen platformon lesz az oktatás?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Egy zárt, könnyen kezelhető online felületen tartjuk, amihez csak egy böngészőre van szükséged. A linket e-mailben küldjük ki."
                }
            },
            {
                "@type": "Question",
                "name": "Megéri még az utolsó este csatlakozni?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Igen — sokszor pont az utolsó átnézés adja meg azt a plusz magabiztosságot, ami az érettségin számít."
                }
            },
            {
                "@type": "Question",
                "name": "Mennyire kell előre készülnöm az estre?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nem szükséges külön készülnöd. Ez az este pont arról szól, hogy ha már tanultál, akkor segítünk mindent a helyére tenni a fejedben az érettségi előtt."
                }
            }
        ]
    };

    return (
        <main className="w-full">
            <SchemaOrg schema={organizationSchema} />
            <SchemaOrg schema={courseSchema} />
            <SchemaOrg schema={faqSchema} />

            <Hero />
            <ProblemSection />
            <TargetSection />
            <HistorySection />
            <LiteratureSection />
            <PricingSection />
            <GuaranteeSection />
            {/* <WhyOnlineSection /> */}
            <FAQ2 />
        </main>
    );
}
