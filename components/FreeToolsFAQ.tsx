'use client';
import React, { useState } from 'react';

export default function FreeToolsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Are these tools really completely free?",
      answer: "Yes, all our tools are 100% free to use. There are no hidden charges, subscriptions, or paywalls for using these resources. We provide them as a public service to help immigrants navigate basic processes."
    },
    {
      question: "Do I need to create an account to use the free tools?",
      answer: "No account is required to access or use any of our free tools. You can use them anonymously and instantly. We only ask for an email if you wish to save your progress or receive a copy of your completed forms."
    },
    {
      question: "Are these forms official and accepted by USCIS?",
      answer: "Yes, our tools generate the exact, official USCIS PDF forms. We ensure they are always up-to-date with the latest editions required by USCIS for filing."
    },
    {
      question: "Can I use these tools if I have a complex case?",
      answer: "While you can use them, we strongly recommend our full service if you have a complex case involving criminal history, past denials, or complicated legal issues. Free tools are best suited for straightforward, simple applications."
    },
    {
      question: "What's the difference between free tools and full service?",
      answer: "Free tools provide guided self-help for filling out forms. Full service provides comprehensive case management, including attorney review, personalized legal strategy, document assembly, and ongoing support until a decision is made on your case."
    },
    {
      question: "How long does it take to complete a free tool?",
      answer: "Most tools take between 5 to 20 minutes to complete depending on the form and whether you have all your information and documents ready beforehand."
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-white border-t border-gray-100 flex flex-col items-center">
      <div className="w-full max-w-[900px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
            <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">Common Questions About Our Free Tools</h2>
          <p className="text-[#5A6579] font-medium text-[19px] leading-relaxed">
            Everything you need to know about using our free immigration tools.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white border border-gray-200/60 rounded-[28px] overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#EAF1F8] bg-[#FDFBF9] shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)]' : 'hover:border-[#EAF1F8] hover:bg-[#FDFBF9] hover:shadow-sm'} group`}
              >
                <button
                  className={`w-full flex items-center justify-between p-8 text-left transition-colors`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-bold text-[18px] transition-colors ${isOpen ? 'text-[#E3755D]' : 'text-[#1B3A64] group-hover:text-[#E3755D]'}`}>{faq.question}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${isOpen ? 'bg-[#E3755D]/10 text-[#E3755D]' : 'bg-[#EAF1F8] text-[#1B3A64] group-hover:bg-[#E3755D]/10 group-hover:text-[#E3755D]'}`}>
                    <span className={`material-icons transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-8 pb-8 text-[#5A6579] leading-relaxed font-medium text-[16px]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
