'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FAQSection() {
  const faqs = [
    {
      question: 'How long does the DACA renewal process take?',
      answer:
        'USCIS typically takes 4-6 months to process DACA renewal applications. We recommend submitting your renewal 150-120 days before your current DACA expires to ensure continuous coverage. Our expedited service can have your application ready to mail within 48 hours.',
    },
    {
      question: "What's the difference between Basic, Advanced, and Premium plans?",
      answer:
        'Basic provides document preparation and filing support, Advanced adds a review package and application readiness checks, and Premium includes attorney review, priority support, and interview preparation. We can help you choose the plan that best fits your case complexity and timeline.',
    },
    {
      question: 'Can I track my application status after submission?',
      answer:
        'Yes. After you file, USCIS provides a receipt number you can use on the official case status website. We also monitor your application and notify you of updates so you can stay informed without the extra work.',
    },
    {
      question: 'What documents do I need for a Green Card renewal?',
      answer:
        'For green card renewal, you generally need your current green card, government-issued photo ID, evidence of continued U.S. residence, and any supporting documents specific to your category. We guide you through the exact list based on your filing type and personal situation.',
    },
    {
      question: 'Do you offer refunds if my application is denied?',
      answer:
        'USCIS filing fees are nonrefundable, but our service guarantees are based on the work we perform. We review our refund policy case-by-case and may offer credits or partial refunds when the issue is due to an error on our part, not a government decision.',
    },
    {
      question: 'How secure is my personal information?',
      answer:
        'We protect your information with encrypted file uploads, secure storage, and strict access controls. Your data is only used for your immigration process and is never shared without your permission.',
    },
    {
      question: 'Can you help with family-based immigration for relatives abroad?',
      answer:
        'Yes. We assist with family-based petitions, including I-130 filings, supporting evidence, and coordination with U.S. consulates abroad. We help ensure your application is complete and prepared for each step of the process.',
    },
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-10 bg-[#F7F8FA] flex flex-col items-center">
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
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
              }}
              className={`bg-white border rounded-xl px-6 transition-all duration-200 ${isOpen ? 'border-orange-200 shadow-[0_20px_40px_-20px_rgba(251,146,60,0.5)]' : 'border-[#EDEFF3] hover:border-[#D8DEE6]'
                }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between py-5 md:py-6 text-left"
              >
                <span className="text-[#0A192F] font-semibold text-[14px] md:text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-[#8A93A3] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {isOpen && (
                <div className="pb-6 text-sm md:text-base text-[#5A6579] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}