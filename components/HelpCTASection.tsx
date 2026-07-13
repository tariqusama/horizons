import Link from 'next/link';
import React from 'react';

export default function HelpCTASection() {
  return (
    <section className="w-full px-4 py-24 max-w-[1400px] mx-auto bg-white">
      <div className="w-full rounded-[48px] p-12 md:p-20 bg-gradient-to-br from-[#0A192F] via-[#1B3A64] to-[#122846] shadow-[0_30px_60px_-15px_rgba(27,58,100,0.3)] flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E3755D]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4375A3]/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        {/* Content */}
        <div className="w-full md:w-[55%] flex flex-col items-start text-left mb-10 md:mb-0 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-sm rounded-full px-6 py-2 mb-8">
            <span className="text-white text-[12px] font-bold tracking-[0.15em] uppercase">Expert Support Available</span>
          </div>

          <h2 className="text-4xl md:text-[48px] font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
            Need help choosing the right service?
          </h2>
          <p className="text-[#A3B8CC] font-medium text-[19px] max-w-xl leading-relaxed">
            Our experts are here to guide you through the process and help you select the best
            immigration service for your needs.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full md:w-[45%] flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-end gap-5 relative z-10">
          <Link href="/services" className="w-full sm:w-auto bg-gradient-to-r from-[#E3755D] to-[#C8634D] hover:from-[#C8634D] hover:to-[#B65640] text-white font-bold text-[17px] rounded-[20px] px-8 py-5 flex items-center justify-center transition-all duration-300 shadow-[0_15px_30px_rgba(227,117,93,0.3)] hover:shadow-[0_20px_40px_rgba(227,117,93,0.4)] hover:-translate-y-1">
            <span>See All Services</span>
            <span className="material-icons text-[20px] ml-3">arrow_forward</span>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-5 rounded-[20px] font-bold text-[17px] transition-all duration-300 shadow-lg flex items-center justify-center hover:-translate-y-1">
            <span className="material-icons text-[20px] mr-3">call</span>
            <span>Get Consultation</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
