import React from 'react';

export default function FreeToolsHero() {
  return (
    <section className="relative w-full flex flex-col items-center pt-40 pb-32 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-[#E3755D]/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[#4375A3]/20 rounded-full blur-[100px] translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 md:px-8 lg:px-16 text-center">

        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-10 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">
            100% Completely Free
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[80px] font-bold mb-8 text-center leading-[1.05] tracking-tight drop-shadow-md">
          <span className="text-white block mb-2">Free Immigration</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3755D] to-[#C8634D] block">Tools & Resources</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#A3B8CC] font-medium text-[20px] max-w-3xl mx-auto text-center mb-16 leading-relaxed">
          Essential USCIS forms and guides at no cost. Build trust in your immigration journey with Horizon Pathways' free resources.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-[16px] font-bold text-white">
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3.5 rounded-[16px] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
            <span className="material-icons text-[#E3755D] text-[24px]">money_off</span>
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3.5 rounded-[16px] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
            <span className="material-icons text-[#E3755D] text-[24px]">verified_user</span>
            <span>Trusted by thousands</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3.5 rounded-[16px] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
            <span className="material-icons text-[#E3755D] text-[24px]">bolt</span>
            <span>Instant access</span>
          </div>
        </div>

      </div>
    </section>
  );
}
