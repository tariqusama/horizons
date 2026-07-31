"use client";

import React, { useState, useEffect } from 'react';
import ServicesHero from '@/components/ServicesHero';
import ServicesCategory from '@/components/ServicesCategory';
import ServicesCTA from '@/components/ServicesCTA';
import PricingSection from '@/components/PricingSection';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/public/services')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch services:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <ServicesHero />

      {/* Navigation Tabs */}
      <div className="w-full max-w-md mx-auto px-4 mt-8 relative z-30">
        <div className="bg-white rounded-xl shadow-sm border p-1.5 flex gap-2">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'services'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            Browse Services
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'pricing'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            Pricing Plans
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {activeTab === 'services' && (
            <div className="space-y-16 pb-32">
              {categories.map((category) => (
                <ServicesCategory
                  key={category.id}
                  title={category.title}
                  subtitle={category.subtitle}
                  pillText={category.pill_text}
                  cards={category.services}
                />
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <PricingSection categories={categories} />
          )}
        </>
      )}

      <ServicesCTA />
    </main>
  );
}
