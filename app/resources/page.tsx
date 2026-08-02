"use client";

import React, { useState } from 'react';
import ResourcesHero from '@/components/ResourcesHero';
import ResourcesToolsSection from '@/components/ResourcesToolsSection';
import ResourcesGrid from '@/components/ResourcesGrid';
import PathwaysComparison from '@/components/PathwaysComparison';
import ResourcesInfo from '@/components/ResourcesInfo';
import ResourcesCTA from '@/components/ResourcesCTA';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <ResourcesHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ResourcesToolsSection />
      <div className="w-full flex justify-center px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-[1400px] bg-white border border-gray-200 rounded-[32px] py-5 px-6 md:px-8 shadow-sm mb-10 flex items-center gap-3 text-sm text-[#5A6579]">
          <span className="material-icons text-orange-500">info</span>
          <span className="leading-relaxed">
            <strong>Note:</strong> Processing times and costs are approximate and may vary based on individual circumstances, USCIS service centers, and current processing backlogs. Always check the official USCIS website for the most up-to-date information.
          </span>
        </div>
      </div>
      <ResourcesGrid
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />
      <PathwaysComparison />
      <ResourcesInfo />
      <ResourcesCTA />
    </main>
  );
}
