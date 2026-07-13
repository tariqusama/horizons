import Link from 'next/link';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[800px] flex items-center px-4 md:px-8 lg:px-16 pt-32 pb-32 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] overflow-hidden">
      
      {/* Premium Glow Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E3755D]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4375A3]/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-2xl">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <span className="text-[#A3B8CC] text-[11px] font-bold tracking-[0.1em] uppercase">
              Immigration Application Assistance
            </span>
          </div>

          <h1 className="text-5xl sm:text-[68px] font-bold leading-[1.1] mb-6 tracking-tight text-white drop-shadow-lg">
            Your Path to U.S.<br />
            Immigration Success Starts<br />
            Here<span className="text-[#E3755D]">.</span>
          </h1>

          <p className="text-lg sm:text-[19px] font-medium mb-10 text-[#A3B8CC] leading-relaxed max-w-xl">
            Professional document preparation services to help you navigate your
            immigration journey with confidence.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/signup" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-9 py-4 rounded-[16px] font-bold text-lg transition-all duration-300 shadow-[0_10px_20px_rgba(227,117,93,0.3)] hover:shadow-[0_15px_30px_rgba(227,117,93,0.4)] hover:-translate-y-1 flex items-center justify-center">
              Get Started Today
            </Link>
            <Link href="/how-it-works" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-9 py-4 rounded-[16px] font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 flex items-center justify-center">
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Content - Abstract/Image Representation */}
        <div className="relative z-10 w-full h-[550px] hidden lg:block">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[48px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-10"></div>
            <img 
              src="/hero-bg.png" 
              alt="Immigration Success" 
              className="w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            {/* Glassmorphism Badge */}
            <div className="absolute bottom-12 left-12 z-20 bg-white/10 backdrop-blur-2xl p-6 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/20 flex items-center space-x-5">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E3755D] to-[#C8634D] rounded-[20px] flex items-center justify-center text-white shadow-inner">
                <span className="material-icons text-[28px]">verified_user</span>
              </div>
              <div>
                <p className="text-white font-bold text-[19px] mb-0.5 tracking-wide">Trusted Service</p>
                <p className="text-[#A3B8CC] font-medium text-[14px]">Thousands of success stories</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
