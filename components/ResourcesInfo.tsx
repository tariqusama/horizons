'use client';
import React, { useState } from 'react';

export default function ResourcesInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Critical Deadlines & Timelines",
      answer: "USCIS enforces strict deadlines for responding to Requests for Evidence (RFEs), Notices of Intent to Deny (NOIDs), and filing appeals. Missing a deadline usually results in automatic denial. Always check the specific date on your notice and ensure your response is physically received by USCIS before that date, not just postmarked."
    },
    {
      question: "Filing Fees & Payment Methods",
      answer: "USCIS frequently updates filing fees. Always verify the current fee on the official USCIS form page before submitting. Accepted payment methods typically include money orders, personal checks, cashier's checks, and credit cards (using Form G-1450). Checks must be made exactly to 'U.S. Department of Homeland Security'."
    },
    {
      question: "Biometrics Appointments",
      answer: "After filing most applications, you will receive a Form I-797C Notice of Action scheduling your biometrics (fingerprinting and photo) appointment at a local Application Support Center (ASC). You must bring your notice and a valid government-issued photo ID. If you cannot attend, you must request a reschedule before the appointment date."
    },
    {
      question: "How to Check Your Case Status",
      answer: "You can track your application's progress using the 13-character receipt number found on your Form I-797 Notice of Action. Enter this number in the official USCIS Case Status Online tool. We recommend creating a USCIS online account to receive automatic status updates and electronic copies of notices."
    },
    {
      question: "Common Mistakes to Avoid",
      answer: "The most common reasons for rejection include: forgetting to sign the form, submitting outdated form versions, paying the incorrect fee, failing to translate foreign language documents, and leaving required fields blank. Always double-check your entire packet and consider having a professional review it before mailing."
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-white border-t border-gray-100 flex flex-col items-center">
      <div className="w-full max-w-[900px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
            <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Essential Guide</span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">Important Immigration Information</h2>
          <p className="text-[#5A6579] font-medium text-[19px] leading-relaxed max-w-2xl mx-auto">
            Essential information and deadlines you need to know before submitting any application to USCIS.
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
