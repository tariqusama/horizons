'use client';

import React from 'react';
import { FileText, Scale, MapPin, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
  const features = [
    {
      title: "Forms That Don't Fight You",
      description:
        'Guided questions in plain English — no legal jargon, no guesswork.',
      icon: FileText,
    },
    {
      title: 'A Real Attorney Reviews It',
      description:
        'Before anything goes to USCIS, a certified immigration attorney looks it over.',
      icon: Scale,
    },
    {
      title: 'Always Know Where You Stand',
      description:
        "Track your case in real time so you're never left wondering what's next.",
      icon: MapPin,
    },
    {
      title: 'Pay Without the Headache',
      description:
        'Secure checkout, simple membership — cancel or change it whenever.',
      icon: CreditCard,
    },
  ];

  return (
    <section className="w-full py-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-[#F7F8FA] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">
          Our Features
        </span>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mt-3 mb-3 tracking-tight">
          Why Choose Horizon Pathways
        </h2>
        <p className="text-[#5A6579] font-medium mb-12 text-[15px]">
          Immigration is hard enough. We make the parts we can control feel a
          lot easier.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="bg-white rounded-2xl p-7 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] flex flex-col items-start text-left"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FDF1EA] flex items-center justify-center mb-6">
                <Icon size={20} color="#E3755D" strokeWidth={2.25} />
              </div>
              <h3 className="text-[#0A192F] font-bold text-[16px] mb-2 leading-snug">
                {feature.title}
              </h3>
              <p className="text-[#8A93A3] text-[13px] font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}