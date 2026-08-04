'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorksHero() {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20 pb-14 md:pb-20">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#0A192F]"></div>

      {/* Custom Gradient Mesh */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(at 0% 0%, hsl(220 95% 24% / .9) 0px, transparent 50%), radial-gradient(at 100% 0%, hsl(16 100% 50% / .8) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(220 95% 24% / .8) 0px, transparent 50%), radial-gradient(at 0% 100%, hsl(16 100% 50% / .7) 0px, transparent 50%)'
        }}
      ></div>

      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center"
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
          <span className="text-white text-xs font-bold tracking-wide uppercase">
            Simplified Immigration Process
          </span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
          className="text-4xl sm:text-5xl md:text-[56px] lg:text-[64px] font-black leading-[1.08] mb-6 tracking-tight text-white"
        >
          How Horizon Pathways Works
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
          className="text-base sm:text-lg md:text-[22px] font-medium text-gray-200 mb-10 max-w-3xl leading-relaxed"
        >
          From profile creation to USCIS submission, we guide you through every step of your immigration journey with professional support and cutting-edge technology.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/signup" className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center space-x-2 justify-center">
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
        </motion.div>
      </motion.div>
    </section>
  );
}
