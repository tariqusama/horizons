import Link from 'next/link';
import React from 'react';

export default function ServicesHero() {
  return (
    <section className="relative w-full flex flex-col items-center pt-40 pb-32 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E3755D]/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#4375A3]/20 rounded-full blur-[100px] translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 md:px-8 lg:px-16 text-center">

        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-10 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">
            Trusted Immigration Partners
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[80px] font-bold mb-8 text-center leading-[1.05] tracking-tight drop-shadow-md">
          <span className="text-white block mb-2">Professional</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3755D] to-[#C8634D] block">Immigration Services</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#A3B8CC] font-medium text-[20px] max-w-3xl mx-auto text-center mb-24 leading-relaxed">
          Navigate your immigration journey with confidence. Our expert team provides personalized, professional guidance tailored to your unique situation.
        </p>

        {/* Floating Info Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-start border border-white/10 hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3755D] to-[#C8634D] rounded-[24px] flex items-center justify-center mb-8 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-white text-[32px]">school</span>
            </div>
            <h3 className="text-white font-bold text-[22px] mb-3">Expert Guidance</h3>
            <p className="text-[#A3B8CC] font-medium text-[16px] leading-relaxed text-left">Professional immigration attorneys and experienced specialists at your side.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-start border border-white/10 hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3755D] to-[#C8634D] rounded-[24px] flex items-center justify-center mb-8 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-white text-[32px]">timer</span>
            </div>
            <h3 className="text-white font-bold text-[22px] mb-3">Timely Processing</h3>
            <p className="text-[#A3B8CC] font-medium text-[16px] leading-relaxed text-left">Efficient, accurate handling of your case to prevent unnecessary delays.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-start border border-white/10 hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3755D] to-[#C8634D] rounded-[24px] flex items-center justify-center mb-8 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-white text-[32px]">support_agent</span>
            </div>
            <h3 className="text-white font-bold text-[22px] mb-3">Personalized Support</h3>
            <p className="text-[#A3B8CC] font-medium text-[16px] leading-relaxed text-left">Dedicated support throughout your entire immigration journey.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
