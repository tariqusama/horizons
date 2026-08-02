'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { trustBadges } from '@/data/homePage';

export default function TrustBadges() {
  return (
    <section className="w-full bg-white border-b border-[#E7EBF0]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                className="flex items-center gap-3"
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <Icon size={20} strokeWidth={2} color={badge.color} className="shrink-0" />
                <div className="leading-tight">
                  <p className="font-bold text-[16px]" style={{ color: badge.color }}>
                    {badge.title}
                  </p>
                  <p className="text-[#8A93A3] text-[13px] font-medium tracking-wide uppercase">
                    {badge.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}