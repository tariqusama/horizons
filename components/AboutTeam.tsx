import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function AboutTeam() {
  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-[#0A192F]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Left: Who We Are */}
        <div className="bg-[#12213F] rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-[38px] font-bold text-white mb-5 tracking-tight">
            Who We Are
          </h2>
          <p className="text-[#A3B8CC] font-medium leading-relaxed text-[15px] mb-8 max-w-xl">
            We are the "bridge" between risky DIY filing and expensive law
            firms. Our team consists of experienced attorneys and certified
            translators who believe premium legal help should be accessible
            to everyone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-[14px] mb-1">
                  Experienced Attorneys
                </p>
                <p className="text-[#8A9BB5] text-[13px] leading-relaxed">
                  Legal review on every critical document.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-[14px] mb-1">
                  Certified Translation
                </p>
                <p className="text-[#8A9BB5] text-[13px] leading-relaxed">
                  Official translations for over 50 languages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: What We Do */}
        <div className="bg-gradient-to-b from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-[20px] mb-4">What We Do</h3>
            <p className="text-white/90 font-medium text-[14px] leading-relaxed mb-8">
              We simplify. We organize. We submit. We celebrate your victory
              with you.
            </p>
          </div>
          <Link
            href="/services"
            className="bg-white text-orange-600 font-bold text-[14px] rounded-lg py-3.5 px-6 text-center hover:bg-gray-50 transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}