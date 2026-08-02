'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FAQSection() {
  const faqs = [
    'How long does the DACA renewal process take?',
    "What's the difference between Basic, Advanced, and Premium plans?",
    'Can I track my application status after submission?',
    'What documents do I need for a Green Card renewal?',
    'Do you offer refunds if my application is denied?',
    'How secure is my personal information?',
    'Can you help with family-based immigration for relatives abroad?',
  ];

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-20 bg-[#F7F8FA] flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[720px] text-center mb-10"
      >
        <h2 className="text-3xl md:text-[36px] font-bold text-[#0A192F] mb-3 tracking-tight">
          Frequently <span className="text-orange-500">Asked</span> Questions
        </h2>
        <p className="text-[#5A6579] font-medium text-[14px] leading-relaxed">
          Get answers to common questions about our immigration services
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-[720px] space-y-3 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
      >
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
            className="bg-white border border-[#EDEFF3] rounded-xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-[#D8DEE6] transition-colors duration-200"
          >
            <h3 className="text-[#2F6FDB] font-semibold text-[14px]">{faq}</h3>
            <ChevronDown size={16} className="text-[#8A93A3] shrink-0 ml-4" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}