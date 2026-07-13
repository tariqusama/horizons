import React from 'react';
import FreeToolsHero from '@/components/FreeToolsHero';
import ToolsGrid from '@/components/ToolsGrid';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import FreeToolsFAQ from '@/components/FreeToolsFAQ';
import FreeToolsVsService from '@/components/FreeToolsVsService';
import FreeToolsCTA from '@/components/FreeToolsCTA';

export default function FreeToolsPage() {
  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <FreeToolsHero />
      <ToolsGrid />
      <SuccessStoriesSection />
      <FreeToolsFAQ />
      <FreeToolsVsService />
      <FreeToolsCTA />
    </main>
  );
}
