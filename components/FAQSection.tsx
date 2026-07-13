import React from 'react';

export default function FAQSection() {
  const faqs = [
    "How long does the DACA renewal process take?",
    "What's the difference between Basic, Advanced, and Premium plans?",
    "Can I track my application status after submission?",
    "What documents do I need for a Green Card renewal?",
    "Do you offer refunds if my application is denied?",
    "How secure is my personal information?",
    "Can you help with family-based immigration for relatives abroad?"
  ];

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-32 bg-white flex flex-col items-center">
      <div className="w-full max-w-[900px] text-center mb-16">
        <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
          <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">
            Questions & Answers
          </span>
        </div>
        <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-[#5A6579] font-medium text-[19px] leading-relaxed">
          Get transparent answers to common questions about our immigration services.
        </p>
      </div>

      <div className="w-full max-w-[900px] space-y-5 text-left">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-[28px] p-8 flex items-center justify-between cursor-pointer hover:border-[#EAF1F8] hover:bg-[#FDFBF9] hover:shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)] transition-all duration-300 group">
            <h3 className="text-[#1B3A64] font-bold text-[18px] group-hover:text-[#E3755D] transition-colors">{faq}</h3>
            <div className="w-10 h-10 rounded-full bg-[#EAF1F8] group-hover:bg-[#E3755D]/10 flex items-center justify-center shrink-0 ml-4 transition-colors">
              <span className="material-icons text-[#1B3A64] group-hover:text-[#E3755D] transition-colors">
                add
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
