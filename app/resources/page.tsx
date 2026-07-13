import React from 'react';
import ResourcesHero from '@/components/ResourcesHero';
import ResourcesGrid from '@/components/ResourcesGrid';
import PathwaysComparison from '@/components/PathwaysComparison';
import ResourcesInfo from '@/components/ResourcesInfo';
import ResourcesCTA from '@/components/ResourcesCTA';

export default function ResourcesPage() {
  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <ResourcesHero />
      <ResourcesGrid />
      <PathwaysComparison />
      <ResourcesInfo />
      <ResourcesCTA />
    </main>
  );
}
