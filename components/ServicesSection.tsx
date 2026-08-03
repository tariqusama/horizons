'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { services } from '@/data/homePage';

export default function ServicesSection() {
  const [category, setCategory] = useState('adjustment');
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[#8A93A3] text-[14px] font-bold tracking-[0.2em] uppercase">
          Professional Services
        </span>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mt-3 mb-3 tracking-tight">
          Our Immigration Services
        </h2>
        <p className="text-[#5A6579] font-medium mb-8 text-[15px] max-w-2xl mx-auto leading-relaxed">
          Professional assistance for individuals and families seeking to navigate the U.S. immigration system.
        </p>

        <div className="relative max-w-sm mx-auto mb-12">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none bg-white border border-[#D8DEE6] text-orange-600 font-bold text-[15px] text-center rounded-full px-6 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/30 shadow-sm cursor-pointer"
          >
            <option value="adjustment">Adjustment of Status (Inside the U.S.)</option>
            <option value="consular">Consular Processing (Outside the U.S.)</option>
            <option value="other">Other Immigration Services</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#8A93A3]">
            <ChevronDown size={16} />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        {services
          .filter((s) => {
            if (category.includes(':')) {
              const [main, sub] = category.split(':');
              return s.category === main && s.sub === sub;
            }
            return s.category === category;
          })
          .map((service, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="bg-[#F7F8FA] rounded-2xl p-7 border border-[#EDEFF3] flex flex-col relative"
            >
              {service.tag && (
                <span className="absolute top-6 right-6 bg-orange-500 text-white font-bold text-[12px] uppercase tracking-wide px-2.5 py-1 rounded-full">
                  {service.tag}
                </span>
              )}

              <h3 className="text-[#0A192F] font-bold text-[18px] leading-snug mb-2 pr-16">
                {service.title}
              </h3>
              <p className="text-[#8A93A3] text-[15px] font-medium leading-relaxed mb-5">
                {service.description}
              </p>

              <div className="flex items-center gap-2 mb-5 text-[15px]">
                <Clock size={15} className="text-orange-500 shrink-0" />
                <span className="text-[#5A6579] font-medium">
                  Processing Time: <span className="font-bold text-[#0A192F]">{service.time}</span>
                </span>
              </div>

              <ul className="space-y-2.5 mb-7 flex-grow">
                {service.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[15px] text-[#5A6579] font-medium leading-relaxed"
                  >
                    <CheckCircle2 size={15} className="text-orange-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="w-full bg-[#0A192F] hover:bg-[#122846] text-white font-bold text-[15px] rounded-lg py-3 flex items-center justify-center transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          ))}
      </motion.div>
    </section>
  );
}