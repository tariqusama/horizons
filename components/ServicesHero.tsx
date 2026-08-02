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
    <>
      <section className="relative w-full h-[600px] flex flex-col justify-center items-center text-center px-4 pt-20">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 bg-[#0A192F]"></div>

        {/* Custom Gradient Mesh */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(3, 42, 119, 0.9) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 68, 0, 0.8) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(3, 42, 119, 0.8) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 68, 0, 0.7) 0px, transparent 50%)'
          }}
        ></div>

        <div className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center mt-[-30px]">
          {/* Pill */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4"></path>
              <path d="M12 18v4"></path>
              <path d="M4.93 4.93l2.83 2.83"></path>
              <path d="M16.24 16.24l2.83 2.83"></path>
              <path d="M2 12h4"></path>
              <path d="M18 12h4"></path>
              <path d="M4.93 19.07l2.83-2.83"></path>
              <path d="M16.24 7.76l2.83-2.83"></path>
            </svg>
            <span className="text-white text-xs font-bold tracking-wide uppercase">
              Authorized Immigration Guidance
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-[68px] font-black leading-[1.1] mb-6 tracking-tight text-white">
            Professional Immigration Services
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl font-medium text-gray-200 mb-10 max-w-3xl leading-relaxed">
            Navigate your immigration journey with confidence. Our expert team
            provides personalized, professional guidance tailored to your unique
            situation.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center space-x-2 justify-center">
              <span>Start Your Journey</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <Link href="/" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-lg backdrop-blur-sm transition-colors shadow-lg flex items-center justify-center">
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section Outside Hero */}
      <section className="w-full bg-white border-b border-[#E7EBF0] py-6 relative z-20 shadow-sm">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-[1400px] mx-auto px-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#E4EAF5] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#2F6FDB]" />
                </div>
                <span className="text-[#0A192F] font-bold text-[15px]">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}