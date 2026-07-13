'use client';
import React, { useState } from 'react';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Services', 'Pricing', 'Process', 'Legal'];

  const allFaqs = [
    {
      category: 'Services',
      question: "What types of immigration cases do you handle?",
      answer: "We handle a wide variety of family-based and employment-based immigration cases, including Marriage Green Cards, K-1 Fiancé Visas, Naturalization (Citizenship), DACA Renewals, Employment Authorization (EAD), and Petitions to Remove Conditions."
    },
    {
      category: 'Services',
      question: "Are you a law firm?",
      answer: "Horizon Pathways is an immigration services platform, not a law firm. We provide expert case management and document preparation. For cases requiring legal representation, we partner with an independent network of experienced, licensed immigration attorneys who provide legal advice and review your application before filing."
    },
    {
      category: 'Pricing',
      question: "How much do your services cost?",
      answer: "Our fees vary depending on the complexity of your case and the level of service you select (Basic, Advanced, or Premium). Typically, our full-service packages range from $399 to $899. This fee does not include the mandatory USCIS government filing fees."
    },
    {
      category: 'Pricing',
      question: "Do you offer payment plans?",
      answer: "Yes! We understand that immigration costs can add up. We offer flexible, 0% interest payment plans that allow you to split your service fee into smaller monthly installments."
    },
    {
      category: 'Process',
      question: "How long will my application take to process?",
      answer: "Processing times depend entirely on the type of application and the current backlog at the United States Citizenship and Immigration Services (USCIS). For example, a Marriage Green Card can take 10-13 months, while Naturalization may take 8-12 months. We provide a customized timeline estimate during your initial consultation."
    },
    {
      category: 'Process',
      question: "Will I have a dedicated person handling my case?",
      answer: "Absolutely. Once you start an application, you will be assigned a dedicated Case Manager who will guide you through every step, answer your questions, and ensure your application is perfectly assembled."
    },
    {
      category: 'Legal',
      question: "What happens if my application is denied?",
      answer: "If you chose our Premium Package (which includes Attorney Representation), our partnered attorney will review the denial notice and advise on the best course of action, which may include filing an appeal or a motion to reopen. While we cannot guarantee approval, our 98% success rate shows our commitment to doing things right the first time."
    }
  ];

  const filteredFaqs = activeCategory === 'All' 
    ? allFaqs 
    : allFaqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="w-full py-12 px-4 bg-[#FDFBF9] pb-24">
      <div className="max-w-[800px] mx-auto">
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${
                activeCategory === cat 
                  ? 'bg-[#1B3A64] text-white border-[#1B3A64]' 
                  : 'bg-white text-[#5A6579] border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${isOpen ? 'border-[#1B3A64] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <button
                  className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'bg-[#1B3A64] text-white' : 'bg-white text-[#1B3A64]'}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-bold text-lg pr-4">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-white/20 rotate-180' : 'bg-blue-50'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 bg-white border-t border-gray-100 text-[#5A6579] leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions block */}
        <div className="mt-16 bg-[#1B3A64] rounded-3xl p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="text-left relative z-10">
            <h3 className="text-2xl font-black text-white mb-2">Still have questions?</h3>
            <p className="text-blue-100 font-medium mb-0">Our immigration experts are here to help you.</p>
          </div>
          
          <div className="relative z-10">
            <a href="/contact" className="inline-block bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-3.5 rounded-xl font-bold transition-colors">
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
