"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  Heart,
  Users,
  User,
  RefreshCw,
  FileText,
  Headphones,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';

type Package = { price: string | number };
type Service = {
  title: string;
  subtitle: string;
  popular?: boolean;
  packages?: Package[];
};
type Category = {
  title: string;
  services: Service[];
};

// Picks an icon for a service card based on keywords in its title.
// Pass an explicit `icon` on the service object in the future if you want full control.
function iconForService(title: string) {
  const t = title.toLowerCase();
  if (t.includes('marriage')) return Heart;
  if (t.includes('parent')) return Users;
  if (t.includes('child')) return User;
  if (t.includes('family')) return Users;
  if (t.includes('renewal') || t.includes('condition')) return RefreshCw;
  return Sparkles;
}

const iconWrapStyles = [
  'bg-[#FDE8E8] text-[#E23636]',
  'bg-[#F1F3F6] text-[#475569]',
  'bg-[#1a2b4b] text-white',
  'bg-[#FFF0E8] text-[#FF5A1F]',
];

export default function PricingSection({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories?.[0]?.title ?? '');

  const currentCategory =
    categories.find((c) => c.title === activeCategory) ?? categories[0];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 pb-32 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b4b] mb-4">
          Transparent, Professional Pricing
        </h2>
        <p className="text-[#64748b] max-w-2xl mx-auto">
          Clear pathways to your U.S. immigration goals with no hidden fees. Expert
          attorney-reviewed support for every step of the journey.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        {categories.map((category) => {
          const isActive = category.title === currentCategory?.title;
          return (
            <button
              key={category.title}
              onClick={() => setActiveCategory(category.title)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all duration-200 ${isActive
                ? 'bg-[#1a2b4b] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#1a2b4b]'
                }`}
            >
              {category.title}
            </button>
          );
        })}
      </div>
      <div className="border-b border-gray-200 mb-10" />

      {/* Service cards for active category */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCategory?.services.map((service, sIdx) => {
          const Icon = iconForService(service.title);
          const iconStyle = iconWrapStyles[sIdx % iconWrapStyles.length];
          const price = service.packages?.[0]?.price ?? '0.00';
          const [whole, cents] = String(price).split('.');

          return (
            <div
              key={service.title}
              className={`group relative rounded-2xl border p-6 flex flex-col h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${service.popular
                ? 'border-[#FF5A1F] shadow-md'
                : 'border-gray-200 hover:border-[#FF5A1F]/30'
                }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-6 bg-[#FF5A1F] text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${iconStyle}`}>
                <Icon className="w-5 h-5" />
              </div>

              <h4 className="font-bold text-[17px] text-[#1a2b4b] leading-snug mb-2">
                {service.title}
              </h4>

              <p className="text-[13px] text-[#64748b] leading-relaxed mb-6 flex-1">
                {service.subtitle}
              </p>

              <div className="border-t border-gray-100 pt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-[#8C9BAF] uppercase tracking-[0.1em] font-bold mb-1">
                    Starting at
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-[26px] font-extrabold text-[#1a2b4b] leading-none">
                      ${whole}
                    </span>
                    {cents && (
                      <span className="text-sm font-bold text-[#1a2b4b] leading-none">.{cents}</span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/signup?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#FF5A1F] hover:gap-1.5 transition-all"
                >
                  Start Application
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Horizon Promise */}
      <div className="mt-20 bg-[#F7F9FC] rounded-2xl p-10 md:p-12">
        <h3 className="text-2xl font-bold text-[#1a2b4b] text-center mb-10">
          The Horizon Promise
        </h3>

        <div className="grid sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <h4 className="font-bold text-[#1a2b4b] mb-2">Dedicated Case Manager</h4>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-[220px]">
              Your <span className="text-[#3B82F6] font-medium">personal expert guide</span> throughout
              the entire process.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <BadgeCheck className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <h4 className="font-bold text-[#1a2b4b] mb-2">100% Satisfaction</h4>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-[220px]">
              Confidence in every filing, backed by our{' '}
              <span className="text-[#FF5A1F] font-medium">quality guarantee</span>.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <h4 className="font-bold text-[#1a2b4b] mb-2">Complete Preparation</h4>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-[220px]">
              Meticulous <span className="text-[#3B82F6] font-medium">attention to detail</span> on
              every form and document.
            </p>
          </div>
        </div>
      </div>

      {/* Fine print */}
      <div className="mt-10 flex items-start gap-2 text-xs text-[#8C9BAF] max-w-2xl mx-auto text-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
        <p>
          Prices listed are for our professional services only and do not include USCIS filing
          fees. All payments are securely processed through Stripe. We offer flexible payment
          plans for qualified applicants.
        </p>
      </div>
    </div>
  );
}