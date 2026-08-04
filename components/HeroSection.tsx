'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { heroContent } from '@/data/homePage';

export default function HeroSection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] as any } },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row md:items-center overflow-hidden bg-[#0A192F]">

      {/* Mobile: image block at top, fills width naturally */}
      <div className="relative w-full h-[55vw] min-h-[220px] max-h-[360px] md:hidden shrink-0">
        <img
          src={heroContent.backgroundImage}
          alt="A family reviewing immigration documents together at home"
          className="w-full h-full object-cover object-[center_25%]"
        />
        {/* bottom fade into dark section below */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A192F]" />
      </div>

      {/* Desktop: full-bleed background image */}
      <img
        src={heroContent.backgroundImage}
        alt="A family reviewing immigration documents together at home"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Desktop overlays */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0A192F]/95 via-[#0A192F]/60 to-transparent" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-16 pt-4 md:py-28">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-5 border border-white/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mr-2" />
            <span className="text-white text-[11px] font-bold tracking-[0.1em] uppercase">
              {heroContent.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.15] mb-5 tracking-tight text-white"
          >
            {heroContent.title[0]}<br />
            <span className="text-[#FF6B35]">{heroContent.highlight}</span> {heroContent.title[2]}<br />
            {heroContent.title[3]}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg font-medium mb-8 text-[#D7E1EC] leading-relaxed max-w-xl"
          >
            {heroContent.subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href={heroContent.primaryCta.href}
              className="bg-[#FF6B35] hover:bg-[#E05B2C] text-white px-7 py-3 rounded-lg font-bold text-[15px] transition-colors"
            >
              {heroContent.primaryCta.label}
            </Link>
            <Link
              href={heroContent.secondaryCta.href}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-7 py-3 rounded-lg font-bold text-[15px] transition-colors"
            >
              {heroContent.secondaryCta.label}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}