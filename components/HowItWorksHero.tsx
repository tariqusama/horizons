import Link from 'next/link';
import React from 'react';

export default function HowItWorksHero() {
  return (
    <section className="relative w-full h-[600px] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#0A192F]"></div>

      {/* Custom Gradient Mesh */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(at 0% 0%, hsl(220 95% 24% / .9) 0px, transparent 50%), radial-gradient(at 100% 0%, hsl(16 100% 50% / .8) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(220 95% 24% / .8) 0px, transparent 50%), radial-gradient(at 0% 100%, hsl(16 100% 50% / .7) 0px, transparent 50%)'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center">
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
            Simplified Immigration Process
          </span>
        </div>

        <h1 className="text-5xl md:text-[68px] font-black leading-[1.1] mb-6 tracking-tight text-white">
          How Horizon Pathways Works
        </h1>

        <p className="text-lg md:text-2xl font-medium text-gray-200 mb-10 max-w-3xl leading-relaxed">
          From profile creation to USCIS submission, we guide you through every step of your immigration journey with professional support and cutting-edge technology.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center space-x-2 justify-center">
            <span>Get Started Now</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </Link>
          <Link href="/resources" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-lg backdrop-blur-sm transition-colors shadow-lg flex items-center space-x-2 justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Watch Video Tour</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
