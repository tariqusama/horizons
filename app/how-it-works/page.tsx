import React from 'react';
import HowItWorksHero from '@/components/HowItWorksHero';
import HowItWorksSteps from '@/components/HowItWorksSteps';
import WhyChooseProcess from '@/components/WhyChooseProcess';
import NeverNavigateAlone from '@/components/NeverNavigateAlone';
import ProcessVideo from '@/components/ProcessVideo';
import ReadyCTA from '@/components/ReadyCTA';

export default function HowItWorksPage() {
  return (
    <main className="flex flex-col w-full">
      <HowItWorksHero />
      <HowItWorksSteps />
      
      {/* New Sections based on user request */}
      <WhyChooseProcess />
      <NeverNavigateAlone />
      <ProcessVideo />
      
      {/* Final CTA */}
      <ReadyCTA />
    </main>
  );
}
