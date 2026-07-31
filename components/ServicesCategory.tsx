"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Sparkles, Clock, Info, CheckCircle2, ArrowRight, X } from 'lucide-react';

type PricingPackage = {
  name: string;
  price: string | number;
  features?: string[];
};

type ServiceCardData = {
  title: string;
  subtitle: string;
  starting_price: string;
  packages: PricingPackage[];
  processing_time: string;
  requirements: string[];
  is_popular?: boolean;
};

type ServicesCategoryProps = {
  title: string;
  subtitle: string;
  pillText: string;
  cards: ServiceCardData[];
};

export default function ServicesCategory({ title, subtitle, pillText, cards }: ServicesCategoryProps) {
  const [selectedCardForModal, setSelectedCardForModal] = useState<ServiceCardData | null>(null);

  const closeModal = () => setSelectedCardForModal(null);

  return (
    <div className="w-full max-w-[1200px] mx-auto py-12 px-4 md:px-8 relative">
      <div className="text-center mb-12">
        <div className="inline-flex items-center rounded-full border border-orange-200/50 bg-[#FFF0E8]/50 px-3 py-1 mb-6 shadow-sm">
          <span className="text-[#FF5A1F] text-[12px] font-semibold">{pillText}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b4b] mb-4">{title}</h2>
        <p className="text-[#64748b] text-[16px] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="w-16 h-1 bg-[#FF5A1F] mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="group relative rounded-2xl border border-gray-200 bg-white p-6 flex flex-col h-full transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Top row: Icon and Popular Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#FF5A1F]" />
              </div>
              
              {card.is_popular && (
                <div className="bg-[#FF5A1F] text-white rounded-full px-3 py-1 text-[11px] font-bold tracking-wide">
                  Most Popular
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <h3 className="font-bold text-[18px] text-[#1a2b4b] mb-2 leading-tight">
              {card.title}
            </h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed mb-6 flex-1 min-h-[60px]">
              {card.subtitle}
            </p>

            {/* Divider */}
            <hr className="border-gray-100 mb-6" />

            {/* Processing Time Pill */}
            <div className="bg-gray-50 rounded-lg py-2 px-3 flex items-center gap-2 mb-6 w-full">
              <Clock className="w-4 h-4 text-[#FF5A1F]" />
              <span className="text-[13px] text-gray-600 font-medium">{card.processing_time}</span>
            </div>

            {/* Requirements / Features */}
            <div className="mb-8">
              <div className="text-[13px] font-bold text-[#1a2b4b] mb-3">Requirements:</div>
              <ul className="space-y-2.5">
                {card.requirements.map((req, rIdx) => (
                  <li key={rIdx} className="flex items-start text-[13px] text-[#64748b]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <Link 
                href={
                  card.title === 'AR-11 Change of Address' ? '/free/ar-11/start' :
                  card.title === 'G-1145 E-Notification' ? '/free/g-1145/start' :
                  card.title === 'I-94 Travel History Guide' ? '/free/i-94/start' :
                  '/services'
                } 
                className="w-full bg-[#FF5A1F] hover:bg-[#E04512] text-white font-bold py-2.5 rounded-lg transition-colors duration-300 flex items-center justify-center text-[14px]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm overflow-y-auto">
          {/* Modal Background Click */}
          <div className="absolute inset-0" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-4xl bg-[#F8F9FA] rounded-2xl shadow-2xl my-auto animate-fade-in flex flex-col max-h-[90vh]">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center flex-wrap gap-3 mb-2 pr-8">
                  {selectedCardForModal.is_popular && (
                    <div className="inline-flex items-center justify-center bg-[#FF5A1F] text-white rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide">
                      <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                      Most Popular
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold text-[#1a2b4b]">{selectedCardForModal.title}</h2>
                </div>
                <p className="text-[#64748b] text-[15px]">{selectedCardForModal.subtitle}</p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-100 rounded-xl p-6 text-center flex flex-col justify-center">
                  <div className="text-3xl font-bold text-[#FF5A1F] mb-1">{selectedCardForModal.packages[0]?.price != null ? (typeof selectedCardForModal.packages[0].price === 'number' ? `$${selectedCardForModal.packages[0].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : selectedCardForModal.packages[0].price) : '-'}</div>
                  <div className="text-[14px] text-[#64748b]">{selectedCardForModal.packages[0]?.name || 'Basic Plan'}</div>
                </div>
                
                <div className="bg-gray-100 border border-[#1a2b4b] rounded-xl p-6 text-center flex flex-col justify-center relative">
                  <div className="text-3xl font-bold text-[#FF5A1F] mb-1">{selectedCardForModal.packages[1]?.price != null ? (typeof selectedCardForModal.packages[1].price === 'number' ? `$${selectedCardForModal.packages[1].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : selectedCardForModal.packages[1].price) : '-'}</div>
                  <div className="text-[14px] text-[#64748b] mb-3">{selectedCardForModal.packages[1]?.name || 'Advanced Plan'}</div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a2b4b] text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-xl p-6 text-center flex flex-col justify-center">
                  <div className="text-3xl font-bold text-[#FF5A1F] mb-1">{selectedCardForModal.packages[2]?.price != null ? (typeof selectedCardForModal.packages[2].price === 'number' ? `$${selectedCardForModal.packages[2].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : selectedCardForModal.packages[2].price) : '-'}</div>
                  <div className="text-[14px] text-[#64748b]">{selectedCardForModal.packages[2]?.name || 'Premium Plan'}</div>
                </div>
              </div>

              {/* Processing Time */}
              <div className="mb-10">
                <h3 className="text-[22px] font-bold text-[#1a2b4b] mb-2">Processing Time</h3>
                <p className="text-[15px] text-[#64748b]">
                  Typically {selectedCardForModal.processing_time} depending on your specific case and location.
                </p>
              </div>

              {/* What's Included */}
              <div className="mb-10">
                <h3 className="text-[22px] font-bold text-[#1a2b4b] mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-[#1a2b4b] mb-3 text-[15px]">All Plans Include:</h4>
                    <ul className="space-y-3">
                      {(selectedCardForModal.packages[0]?.features || [
                        "Complete form preparation and review",
                        "Dedicated case manager",
                        "100% satisfaction guarantee",
                        "Step-by-step guidance"
                      ]).map((feature, i) => (
                        <li key={i} className="flex items-start text-[14px] text-[#1a2b4b]">
                          <CheckCircle2 className="w-[18px] h-[18px] text-[#FF5A1F] mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a2b4b] mb-3 text-[15px]">Advanced Plan Adds:</h4>
                    <ul className="space-y-3">
                      {(selectedCardForModal.packages[1]?.features || [
                        "Certified translation services",
                        "Legal review by immigration attorney",
                        "Priority support (24hr response)",
                        "Phone support"
                      ]).map((feature, i) => (
                        <li key={i} className="flex items-start text-[14px] text-[#1a2b4b]">
                          <CheckCircle2 className="w-[18px] h-[18px] text-[#FF5A1F] mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Premium Plan Exclusive Benefits */}
              <div className="bg-[#EBF3FC] border border-[#D0E1F5] rounded-xl p-6 mb-4">
                <h4 className="text-[18px] font-bold text-[#1a2b4b] mb-4">Premium Plan Exclusive Benefits:</h4>
                <ul className="space-y-3">
                  {(selectedCardForModal.packages[2]?.features || [
                    "30-minute one-on-one consultation with immigration attorney",
                    "USCIS interview preparation kit",
                    "Priority email support (5hr response)",
                    "WhatsApp/Text support"
                  ]).map((feature, i) => (
                    <li key={i} className="flex items-start text-[14px] text-[#1a2b4b]">
                      <CheckCircle2 className="w-[18px] h-[18px] text-[#2c5282] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-[#F8F9FA] rounded-b-2xl mt-auto">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-[#1a2b4b] font-medium hover:bg-gray-50 transition-colors text-[14px]"
              >
                Close
              </button>
              <Link 
                href="/services" 
                className="px-6 py-2.5 rounded-lg bg-[#FF5A1F] hover:bg-[#E04512] text-white font-bold transition-colors flex items-center text-[14px]"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
