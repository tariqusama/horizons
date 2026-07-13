import React from 'react';
import FAQHero from '@/components/FAQHero';
import FAQAccordion from '@/components/FAQAccordion';

export default function FAQPage() {
  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <FAQHero />
      <FAQAccordion />
    </main>
  );
}
