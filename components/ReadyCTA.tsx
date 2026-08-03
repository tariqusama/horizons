import Link from 'next/link';
import React from 'react';
import { CreditCard, ClipboardCheck, ShieldCheck } from 'lucide-react';

export default function ReadyCTA() {
  const trustItems = [
    { icon: CreditCard, text: 'No credit card required' },
    { icon: ClipboardCheck, text: 'Free eligibility check' },
    { icon: ShieldCheck, text: '100% satisfaction guarantee' },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <h2 className="text-2xl md:text-[30px] font-bold text-[#0A192F] mb-3 leading-snug tracking-tight max-w-2xl mx-auto">
        Start Your Journey Today: Ready to Begin Your Application?
      </h2>
      <p className="text-[#5A6579] font-medium text-[14px] max-w-xl mx-auto leading-relaxed mb-8">
        Join thousands of families who have successfully completed their
        immigration applications with Horizon Pathways. Let's get started on
        yours today.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <Link
          href="/signup"
          className="w-full sm:w-auto bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-bold text-[14px] transition-colors"
        >
          Start Free Assessment
        </Link>
        <Link
          href="/services"
          className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-[#0A192F] text-[#0A192F] px-6 py-3 rounded-lg font-bold text-[14px] transition-colors"
        >
          View All Services
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-1.5 text-[#8A93A3] text-[12px] font-medium">
              <Icon size={13} />
              {item.text}
            </div>
          );
        })}
      </div>
    </section>
  );
}