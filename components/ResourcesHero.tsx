import React from 'react';

export default function ResourcesHero() {
  const categories = [
    "All", "Tools", "Family-Based", "Citizenship", "Work Authorization", "Green Card", "Travel", "DACA"
  ];

  return (
    <section className="relative w-full flex flex-col items-center pt-40 pb-32 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E3755D]/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#4375A3]/20 rounded-full blur-[100px] translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 md:px-8 lg:px-16 text-center">

        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-10 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">
            Free Resources
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[80px] font-bold mb-8 text-center leading-[1.05] tracking-tight drop-shadow-md">
          <span className="text-white block mb-2">Immigration</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3755D] to-[#C8634D] block">Resources Hub</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#A3B8CC] font-medium text-[20px] max-w-3xl mx-auto text-center mb-16 leading-relaxed">
          Comprehensive guides, checklists, and tutorials to help you navigate your immigration journey with clarity and confidence.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/20 p-3 flex items-center mb-16 relative z-20 focus-within:bg-white/15 transition-colors">
          <div className="pl-5 text-white/50">
            <span className="material-icons text-[28px]">search</span>
          </div>
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full bg-transparent border-none outline-none px-5 py-4 text-white text-[18px] font-medium placeholder:text-[#A3B8CC]"
          />
          <button className="bg-gradient-to-r from-[#E3755D] to-[#C8634D] hover:from-[#C8634D] hover:to-[#B65640] text-white px-10 py-4 rounded-[20px] font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(227,117,93,0.3)] text-[16px]">
            Search
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`px-7 py-3 rounded-full font-bold text-[14px] transition-all duration-300 shadow-lg border ${
                idx === 0 
                  ? 'bg-gradient-to-r from-[#E3755D] to-[#C8634D] text-white border-transparent' 
                  : 'bg-white/5 backdrop-blur-md text-[#A3B8CC] border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
