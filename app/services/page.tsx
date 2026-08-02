"use client";

import React, { useState, useEffect } from 'react';
import ServicesHero from '@/components/ServicesHero';
import ServicesCategory from '@/components/ServicesCategory';
import ServicesCTA from '@/components/ServicesCTA';
import PricingSection from '@/components/PricingSection';
import api from '@/lib/api';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/services')
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch services:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <ServicesHero />

      {/* Navigation Tabs */}
      <div className="w-full max-w-md mx-auto px-4 mt-16 relative z-30">
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(27,58,100,0.08)] border border-[#EDEFF3] p-1.5 flex gap-2">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'services'
              ? 'bg-[#0A192F] text-white shadow-md'
              : 'text-[#8A93A3] hover:bg-[#F0F2F5] hover:text-[#0A192F]'
              }`}
          >
            Browse Services
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'pricing'
              ? 'bg-[#0A192F] text-white shadow-md'
              : 'text-[#8A93A3] hover:bg-[#F0F2F5] hover:text-[#0A192F]'
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
            <div className="pb-10">
              {categories.length > 0 ? (
                categories.map((category, idx) => (
                  <ServicesCategory
                    key={category.id ?? idx}
                    title={category.title}
                    subtitle={category.subtitle}
                    pillText={category.pill_text || category.pillText || category.title}
                    cards={category.services ?? []}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center py-24">
                  <p className="text-sm text-[#64748b]">No services available right now. Please check back later.</p>
                </div>
              )}
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
