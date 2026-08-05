'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { impactStats } from '@/data/homePage';

export default function ImpactSection() {
  return (
    <section className="w-full py-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">
          Our Impact
        </span>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mt-3 mb-3 tracking-tight">
          Proven <span className="text-orange-600">Excellence</span>
        </h2>
        <p className="text-[#5A6579] font-medium mb-12 text-[15px]">
          Numbers that speak to our commitment and success
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        {impactStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
              className="bg-white rounded-2xl p-7 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] flex flex-col items-start text-left"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon size={20} color={stat.iconColor} strokeWidth={2.25} />
              </div>
              <h3 className="text-[28px] font-bold text-[#0A192F] mb-1 leading-none">
                {stat.value}
              </h3>
              <p className="text-[#8A93A3] text-[13px] font-medium">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}