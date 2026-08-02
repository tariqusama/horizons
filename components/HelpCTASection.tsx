'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

export default function HelpCTASection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-16 max-w-[1400px] mx-auto bg-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-3xl px-8 py-14 md:py-16 bg-[#FDEBEC] flex flex-col items-center text-center"
      >
        <span className="bg-white text-[#E3623D] text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-6">
          Expert Support Available
        </span>

        <h2 className="text-2xl md:text-[30px] font-bold text-[#0A192F] mb-3 tracking-tight">
          Need <span className="text-[#2F6FDB]">help</span> choosing the right service?
        </h2>
        <p className="text-[#5A6579] font-medium text-[14px] max-w-md leading-relaxed mb-8">
          Our experts are here to guide you through the process and help you
          select the best immigration service for your needs.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <Link
            href="/services"
            className="w-full sm:w-auto bg-[#0A192F] hover:bg-[#122846] text-white font-bold text-[13px] rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            See All Services
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-[#0A192F] text-[#0A192F] font-bold text-[13px] rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            Get Expert Consultation
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}