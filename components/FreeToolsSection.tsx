'use client';

import React from 'react';
import Link from 'next/link';
import { MailCheck, FileText, BellRing, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FreeToolsSection() {
  const tools = [
    {
      title: 'AR-11 Change of Address',
      description:
        'Required notification for all immigrants when changing address. Get a pre-filled PDF instantly.',
      tag: 'Most Popular',
      tagColor: '#E3623D',
      tagBg: '#FDF1EA',
      buttonText: 'Start Free AR-11',
      buttonClass:
        'bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
      icon: MailCheck,
      iconColor: '#E3623D',
      iconBg: '#FDF1EA',
    },
    {
      title: 'I-912 Fee Waiver',
      description:
        'Check eligibility and generate your USCIS fee waiver request form quickly and easily.',
      tag: 'Popular',
      tagColor: '#5A6579',
      tagBg: '#F0F2F5',
      buttonText: 'Start Free I-912',
      buttonClass: 'bg-[#0A192F] hover:bg-[#122846] text-white',
      icon: FileText,
      iconColor: '#5A6579',
      iconBg: '#F0F2F5',
    },
    {
      title: 'G-1145 E-Notification',
      description:
        'Get email and text updates for your USCIS applications. Add to any filing packet.',
      tag: 'Essential',
      tagColor: '#5A6579',
      tagBg: '#F0F2F5',
      buttonText: 'Start Free G-1145',
      buttonClass:
        'bg-white hover:bg-gray-50 text-[#0A192F] border border-[#D8DEE6]',
      icon: BellRing,
      iconColor: '#5A6579',
      iconBg: '#F0F2F5',
    },
  ];

  return (
    <section className="w-full py-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-[#F7F8FA] text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center bg-white rounded-full px-4 py-1.5 mb-6 border border-[#E7EBF0] shadow-sm">
          <span className="text-[#5A6579] text-[10px] font-bold tracking-[0.15em] uppercase">
            100% Free • No Credit Card
          </span>
        </div>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mb-3 tracking-tight">
          Free Immigration Tools
        </h2>
        <p className="text-[#5A6579] font-medium mb-12 text-[15px] max-w-xl mx-auto leading-relaxed">
          Professional USCIS forms and guides at absolutely no cost.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
      >
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="bg-white rounded-2xl p-7 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] text-left flex flex-col"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: tool.iconBg }}
              >
                <Icon size={20} color={tool.iconColor} strokeWidth={2.25} />
              </div>

              <span
                className="inline-flex self-start rounded-full px-2.5 py-0.5 mb-3 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: tool.tagBg, color: tool.tagColor }}
              >
                {tool.tag}
              </span>

              <h3 className="text-[#0A192F] font-bold text-[17px] mb-2 leading-snug">
                {tool.title}
              </h3>
              <p className="text-[#8A93A3] text-[13px] font-medium leading-relaxed mb-6 flex-grow">
                {tool.description}
              </p>

              <Link
                href="/free-tools"
                className={`w-full py-3 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors ${tool.buttonClass}`}
              >
                {tool.buttonText}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
      >
        <Link
          href="/free-tools"
          className="inline-flex items-center gap-1.5 text-[#2F6FDB] font-bold text-[14px] hover:underline"
        >
          View All Free Tools
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}