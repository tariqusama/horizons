'use client';

import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { successStories } from '@/data/homePage';

export default function SuccessStoriesSection() {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mb-3 tracking-tight">
          Success Stories From Our Clients
        </h2>
        <p className="text-orange-500 font-semibold text-[16px] mb-10">
          Real, verified reviews from clients on Trustpilot and Google
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {successStories.map((story, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            className="bg-white rounded-2xl p-7 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] flex flex-col"
          >
            <div className="flex gap-1 text-emerald-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#10B981" strokeWidth={0} />
              ))}
            </div>
            <p className="text-[#5A6579] font-medium text-[15px] leading-relaxed mb-6 flex-grow">
              {story.text}
            </p>
            <div className="border-t border-[#EDEFF3] pt-5 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                style={{ backgroundColor: story.color }}
              >
                {story.initials}
              </div>
              <div>
                <h4 className="text-[#0A192F] font-bold text-[16px] leading-tight">
                  {story.name}
                </h4>
                <div className="flex items-center gap-1 text-[#8A93A3] text-[13px] font-medium">
                  <BadgeCheck size={12} />
                  Verified Client
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}