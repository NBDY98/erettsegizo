import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import TargetSection from "./components/TargetSection";
import PricingSection from "./components/PricingSection";
import GuaranteeSection from "./components/GuaranteeSection";
import LiteratureSection from "./components/LiteratureSection";
import HistorySection from "./components/HistorySection";
import FAQ2 from "./components/bits/faq-2";
import WhyOnlineSection from "./components/WhyOnlineSection";
export default async function Home() {
    return (
        <main className="w-full">
            <Hero />
            <ProblemSection />
            <TargetSection />
            <HistorySection />
            <LiteratureSection />
            <PricingSection />
            <GuaranteeSection />
            <WhyOnlineSection />
            <FAQ2 />
        </main>
    );
}
