import Link from 'next/link';
import React from 'react';

export default function ServicesCTA() {
  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-[#FDFBF9] text-center border-t border-gray-100">
      <div className="max-w-[1000px] mx-auto bg-gradient-to-br from-[#0A192F] via-[#1B3A64] to-[#122846] rounded-[48px] p-12 md:p-20 shadow-[0_30px_60px_-15px_rgba(27,58,100,0.3)] border border-[#122b4f] relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E3755D]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20 shadow-sm">
            <span className="text-white text-[12px] font-bold tracking-[0.15em] uppercase">Ready to Begin</span>
          </div>

          <h2 className="text-4xl md:text-[56px] font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-md">
            Take the Next Step in Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3755D] to-[#C8634D]">Immigration Journey</span>
          </h2>

          <p className="text-[#A3B8CC] font-medium mb-16 text-[20px] max-w-2xl mx-auto leading-relaxed">
            Join thousands of families who have successfully navigated their immigration process with our expert guidance and personalized support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Link href="/signup" className="w-full sm:w-auto bg-gradient-to-r from-[#E3755D] to-[#C8634D] hover:from-[#C8634D] hover:to-[#B65640] text-white px-9 py-5 rounded-[20px] font-bold text-[17px] transition-all duration-300 shadow-[0_15px_30px_rgba(227,117,93,0.3)] hover:shadow-[0_20px_40px_rgba(227,117,93,0.4)] hover:-translate-y-1 inline-flex items-center justify-center">
              Start Your Application
            </Link>
            <Link href="/free-tools" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-9 py-5 rounded-[20px] font-bold text-[17px] transition-all duration-300 shadow-lg inline-flex items-center justify-center hover:-translate-y-1">
              Try Free Tools First
            </Link>
          </div>

          <div className="text-[#A3B8CC] text-[14px] font-bold tracking-wider flex items-center justify-center space-x-3 flex-wrap gap-y-3 uppercase">
            <span className="flex items-center"><span className="material-icons text-[#00B67A] text-[18px] mr-1.5">lock</span> Secure</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center"><span className="material-icons text-[#E3755D] text-[18px] mr-1.5">star</span> Rated 4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
