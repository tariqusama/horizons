'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelineSection() {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-orange-500 text-[14px] font-bold tracking-[0.2em] uppercase">
          Estimate Your Timeline
        </span>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mt-3 mb-3 tracking-tight">
          How Long Will Your Case Take?
        </h2>
        <p className="text-[#5A6579] font-medium mb-10 text-[15px] max-w-xl mx-auto leading-relaxed">
          Get accurate processing timelines for all Horizon Pathways
          immigration categories based on current USCIS data.
        </p>
      </motion.div>

      <motion.div 
        className="bg-[#F5F7FA] rounded-2xl p-8 md:p-10 border border-[#E7EBF0] text-left max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label className="block text-[#2F6FDB] font-bold text-[15px] mb-3">
          Select Your Immigration Case Type
        </label>

        <div className="relative mb-6">
          <select
            defaultValue=""
            className="w-full appearance-none bg-white border border-[#D8DEE6] text-[#5A6579] font-medium text-[14px] rounded-lg px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all cursor-pointer"
          >
            <option value="" disabled>
              Choose from 40+ immigration case types...
            </option>
            <option value="marriage">Marriage Green Card</option>
            <option value="fiance">K-1 Fiance Visa</option>
            <option value="citizenship">Citizenship &amp; Naturalization</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-[#8A93A3]">
            <ChevronDown size={18} />
          </div>
        </div>

        <Link
          href="/signup"
          className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-[14px] rounded-lg py-3.5 flex items-center justify-center transition-all duration-300"
        >
          Calculate Timeline
        </Link>
      </motion.div>

      <motion.p 
        className="text-[#8A93A3] text-[13px] leading-relaxed max-w-xl mx-auto mt-6 italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        * Processing times are based on current USCIS data and are updated
        regularly. Actual timelines may vary by service center and case
        complexity. Data source: USCIS Processing Times.
      </motion.p>
    </section>
  );
}