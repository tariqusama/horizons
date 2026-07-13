import React from 'react';
import Link from 'next/link';

export default function TimelineSection() {
  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] text-center relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#E3755D]/10 rounded-full blur-[150px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">Estimate Your Timeline</span>
        </div>

        <h2 className="text-4xl md:text-[56px] font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
          How Long Will Your Case Take?
        </h2>
        <p className="text-[#A3B8CC] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
          Get accurate processing timelines for all Horizon Pathways immigration categories based on current USCIS data.
        </p>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 text-left mb-10 max-w-3xl mx-auto relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>

          <label className="relative z-10 block text-white font-bold text-[18px] mb-6">
            Select Your Immigration Case Type
          </label>

          <div className="relative mb-10 z-10">
            <select className="w-full appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[18px] rounded-[24px] px-8 py-6 pr-14 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 focus:border-[#E3755D] transition-all cursor-pointer shadow-inner">
              <option value="" disabled selected className="text-black">Choose from 40+ immigration case types...</option>
              <option value="marriage" className="text-black">Marriage Green Card</option>
              <option value="fiance" className="text-black">K-1 Fiance Visa</option>
              <option value="citizenship" className="text-black">Citizenship & Naturalization</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-8 pointer-events-none text-white/50">
              <span className="material-icons text-[28px]">expand_more</span>
            </div>
          </div>

          <Link href="/signup" className="relative z-10 w-full bg-gradient-to-r from-[#E3755D] to-[#C8634D] hover:from-[#C8634D] hover:to-[#B65640] text-white font-bold text-[18px] rounded-[20px] py-6 flex items-center justify-center transition-all duration-300 shadow-[0_15px_30px_rgba(227,117,93,0.3)] hover:shadow-[0_20px_40px_rgba(227,117,93,0.4)] hover:-translate-y-1">
            <span>Calculate Timeline</span>
            <span className="material-icons ml-3">calculate</span>
          </Link>
        </div>

        <p className="text-[#A3B8CC] text-[14px] leading-relaxed max-w-3xl mx-auto">
          * Processing times are based on current USCIS data and are updated regularly. Actual timelines may vary by service center and case complexity. Data source: <a href="#" className="text-white hover:text-[#E3755D] underline transition-colors">USCIS Processing Times</a>
        </p>
      </div>
    </section>
  );
}
