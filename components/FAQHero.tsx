import React from 'react';

export default function FAQHero() {
  return (
    <section className="relative w-full flex flex-col justify-center items-center text-center px-4 pt-24 pb-20">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#FDFBF9]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto flex flex-col items-center">
        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-5 py-2 mb-8 border border-blue-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="text-[#1B3A64] text-sm font-bold tracking-wide uppercase">Knowledge Base</span>
        </div>

        <h1 className="text-5xl md:text-[64px] font-black leading-[1.1] mb-6 tracking-tight text-[#1B3A64]">
          How can we help?
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-[#5A6579] mb-12 max-w-2xl leading-relaxed">
          Find answers to the most common questions about our immigration services, pricing, and the application process.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex items-center relative z-20">
          <div className="pl-4 text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full bg-transparent border-none outline-none px-4 py-3 text-[#1B3A64] font-medium placeholder:text-gray-400"
          />
          <button className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
