import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import ImpactSection from "@/components/ImpactSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FreeToolsSection from "@/components/FreeToolsSection";
import TimelineSection from "@/components/TimelineSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import ServicesSection from "@/components/ServicesSection";
import HelpCTASection from "@/components/HelpCTASection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full pb-20">
      <HeroSection />
      <TrustBadges />
      <FreeToolsSection />
      <TimelineSection />
      <ImpactSection />
      <FeaturesSection />
      <ServicesSection />
      <HowItWorksSection />
      <HelpCTASection />
      <SuccessStoriesSection />
      <FAQSection />
    </main>
  );
}
