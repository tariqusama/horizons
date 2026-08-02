import Link from 'next/link';
import React from 'react';
import { ShieldCheck, Clock, MessageSquare } from 'lucide-react';

export default function ServicesHero() {
  const features = [
    { icon: ShieldCheck, text: 'Expert Guidance' },
    { icon: Clock, text: 'Timely Processing' },
    { icon: MessageSquare, text: 'Personalized Support' },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-[#F7F8FA] text-center">
      <span className="inline-block bg-[#E4EAF5] text-[#2F6FDB] text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-6">
        Authorized Immigration Guidance
      </span>

      <h1 className="text-3xl md:text-[40px] font-bold text-[#0A192F] mb-4 tracking-tight">
        Professional Immigration Services
      </h1>
      <p className="text-[#5A6579] font-medium text-[15px] max-w-xl mx-auto leading-relaxed mb-8">
        Navigate your immigration journey with confidence. Our expert team
        provides personalized, professional guidance tailored to your unique
        situation.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <Link
          href="/signup"
          className="w-full sm:w-auto bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-bold text-[14px] transition-colors"
        >
          Start Your Journey
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-[#D8DEE6] text-[#0A192F] px-6 py-3 rounded-lg font-bold text-[14px] transition-colors"
        >
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#EDEFF3] px-4 py-3 flex items-center justify-center gap-2.5 shadow-[0_2px_8px_rgba(27,58,100,0.04)]"
            >
              <div className="w-7 h-7 rounded-full bg-[#E4EAF5] flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[#2F6FDB]" />
              </div>
              <span className="text-[#0A192F] font-semibold text-[13px]">
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}