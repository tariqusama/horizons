"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Info, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingSection({ categories }: { categories: any[] }) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 pb-32 animate-fade-in">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#1a2b4b] mb-4">Transparent, Affordable Pricing</h2>
        <p className="text-[#64748b] mb-12 max-w-2xl mx-auto">
          Choose your service below to see detailed pricing for our three service levels: <span className="font-bold text-[#1a2b4b]">Basic</span>, <span className="font-bold text-[#1a2b4b]">Advanced</span> (most popular), and <span className="font-bold text-[#1a2b4b]">Premium</span>.
        </p>
        <div className="inline-block border border-[#FFE4D6] bg-white text-[#FF5A1F] px-4 py-1.5 rounded-full font-medium text-[13px] mb-6 shadow-sm">
          Step 1: Choose Your Service
        </div>
        <h3 className="text-[28px] font-bold text-[#1a2b4b]">What immigration service do you need?</h3>
      </div>

      <div className="space-y-16">
        {categories.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-bold text-[#1a2b4b] mb-6">{category.title}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service: any, sIdx: number) => (
                <div
                  key={sIdx}
                  onClick={() => setSelectedService(service.title)}
                  className={`group relative rounded-2xl border p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-white ${selectedService === service.title
                      ? 'border-[#FF5A1F] ring-1 ring-[#FF5A1F] shadow-md'
                      : 'border-gray-200 hover:border-[#FF5A1F]/30'
                    }`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF0E8] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#FFE4D6]">
                      <Sparkles className="w-[22px] h-[22px] text-[#FF5A1F]" />
                    </div>
                    <h4 className="font-bold text-[15px] text-[#1a2b4b] group-hover:text-[#FF5A1F] transition-colors leading-tight pt-1">
                      {service.title}
                    </h4>
                  </div>

                  <div className="flex-1 mb-6">
                    <p className="text-[13px] text-[#64748b] leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="bg-[#FFF0E8] rounded-[14px] p-4 flex items-center justify-between border border-[#FFE4D6] group-hover:bg-[#FFE4D6]/70 transition-colors">
                      <div>
                        <p className="text-[10px] text-[#8C9BAF] uppercase tracking-[0.1em] font-bold mb-0.5">Starting at</p>
                        <div className="flex items-baseline">
                          <span className="text-[28px] font-extrabold text-[#FF5A1F] leading-none">${service.packages?.[0]?.price || '0.00'}</span>
                        </div>
                      </div>

                      <Link
                        href={`/signup?service=${encodeURIComponent(service.title)}`}
                        className="w-10 h-10 rounded-full bg-[#FFE4D6] flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h4 className="flex items-center text-lg font-bold text-[#1a2b4b] mb-4">
              <Info className="w-5 h-5 text-[#FF5A1F] mr-2" />
              Important
            </h4>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Prices listed are for our professional services only and do not include USCIS filing fees. All payments are securely processed through Stripe. We offer flexible payment plans for qualified applicants.
            </p>
          </div>

          <div className="flex-1 bg-white rounded-xl p-6 border border-gray-200 shadow-sm w-full">
            <h4 className="font-bold text-[#1a2b4b] mb-4">What's Included in All Plans</h4>
            <ul className="space-y-3">
              {['Dedicated Case Manager', '100% Satisfaction Guarantee', 'Complete Form Preparation'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-[#64748b] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
