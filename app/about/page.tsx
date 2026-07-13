import React from 'react';
import AboutMission from '@/components/AboutMission';
import AboutImpact from '@/components/AboutImpact';
import AboutJourney from '@/components/AboutJourney';
import AboutTimeline from '@/components/AboutTimeline';
import AboutValues from '@/components/AboutValues';
import AboutTeam from '@/components/AboutTeam';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import HelpCTASection from '@/components/HelpCTASection';

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center pt-40 overflow-hidden bg-gradient-to-b from-[#FDFBF9] to-white">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#E3755D]/5 to-[#1B3A64]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 md:px-8 lg:px-16 text-center">

        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-full px-6 py-2 mb-10 shadow-sm">
          <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">
            Premium Immigration Services Since 2022
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[80px] font-bold mb-8 text-center leading-[1.05] tracking-tight text-[#1B3A64] drop-shadow-sm">
          About Horizon<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3755D] to-[#C8634D]">Pathways</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#5A6579] font-medium text-[20px] max-w-3xl mx-auto text-center mb-32 leading-relaxed">
          We're immigrants helping immigrants. We've been where you are, and we're here to make the road a little easier, clearer, and a lot more reliable.
        </p>
      </div>

      {/* Page Sections */}
      <AboutMission />
      <div className="w-full">
        <AboutImpact />
      </div>
      <AboutJourney />
      <AboutTimeline />
      <AboutValues />
      <AboutTeam />

      {/* Testimonials */}
      <SuccessStoriesSection />

      {/* CTA */}
      <HelpCTASection />
    </main>
  );
}
