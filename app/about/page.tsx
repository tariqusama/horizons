'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <main className="min-h-screen w-full relative flex flex-col items-center overflow-hidden bg-white">
      
      {/* Dark Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-[#0A192F]"></div>
        <div 
          className="absolute inset-0 z-0" 
          style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(3, 42, 119, 0.9) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 68, 0, 0.8) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(3, 42, 119, 0.8) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 68, 0, 0.7) 0px, transparent 50%)' }}
        ></div>
        <motion.div 
          className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          
          {/* Pill */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 shadow-sm"
          >
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
            <span className="text-white text-xs font-bold tracking-wide uppercase">Premium Immigration Services Since 2022</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
            className="text-5xl md:text-[68px] font-black leading-[1.1] mb-6 tracking-tight text-white"
          >
            About Horizon Pathways
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
            className="text-lg md:text-2xl font-medium text-gray-200 mb-10 max-w-3xl leading-relaxed"
          >
            We're immigrants helping immigrants. We've been where you are, and we're here to make the road a little easier, clearer, and a lot more reliable.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a href="/signup" className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center space-x-2 justify-center">
              <span>Get Started Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
            <a href="/resources" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-lg backdrop-blur-sm transition-colors shadow-lg flex items-center space-x-2 justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Watch Video Tour</span>
            </a>
          </motion.div>
        </motion.div>
      </section>

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
