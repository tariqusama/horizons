'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { howItWorksSteps } from '@/data/homePage';

export default function HowItWorksSection() {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-8 bg-[#D8CBBF]" />
          <span className="text-[#8A7D6E] text-[11px] font-bold tracking-[0.25em] uppercase">
            The Process
          </span>
          <span className="h-px w-8 bg-[#D8CBBF]" />
        </div>
        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mb-3 tracking-tight">
          How <span className="text-orange-600">It</span> Works
        </h2>
        <p className="text-[#5A6579] font-medium text-[15px]">
          Five simple steps to transform your immigration journey from complex to complete.
        </p>
      </motion.div>

      <motion.div
        className="max-w-2xl mx-auto flex flex-col gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {howItWorksSteps.map((step, idx) => (
          <motion.div
            key={idx}
            className="flex items-start gap-5"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
          >
            <div
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-[15px]"
              style={{ backgroundColor: step.color }}
            >
              {step.num}
            </div>
            <div>
              <h3 className="text-[#0A192F] font-bold text-[16px] mb-1.5 leading-snug">
                {step.title}
              </h3>
              <p className="text-[#8A93A3] text-[13px] font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}