"use client";

import React, { useState } from 'react';
import ResourcesHero from '@/components/ResourcesHero';
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
