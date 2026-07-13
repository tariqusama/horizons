import Link from 'next/link';
import React from 'react';

export default function ReadyCTA() {
  return (
    <section className="w-full py-24 px-4 bg-[#FDFBF9] flex justify-center">
      <div className="max-w-[1000px] w-full bg-[#E3755D] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4"></path>
              <path d="M12 18v4"></path>
              <path d="M4.93 4.93l2.83 2.83"></path>
              <path d="M16.24 16.24l2.83 2.83"></path>
              <path d="M2 12h4"></path>
              <path d="M18 12h4"></path>
              <path d="M4.93 19.07l2.83-2.83"></path>
              <path d="M16.24 7.76l2.83-2.83"></path>
            </svg>
            <span className="text-white text-sm font-bold tracking-wide uppercase">Start Your Journey Today</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to Begin Your Application?
          </h2>
          <p className="text-orange-50 font-medium mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of families who have successfully completed their immigration applications with Horizon Pathways. Let's get started on yours today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/signup" className="w-full sm:w-auto bg-white text-[#E3755D] px-8 py-4 rounded-xl font-bold text-[15px] transition-transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
              <span>Start Free Assessment</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <Link href="/services" className="w-full sm:w-auto bg-transparent border border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center space-x-2">
              <span>View All Services</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Link>
          </div>

          <div className="mt-8 text-orange-100 text-xs font-medium tracking-wide flex items-center justify-center space-x-4 flex-wrap gap-y-2">
            <span>No credit card required</span>
            <span>•</span>
            <span>Free eligibility check</span>
            <span>•</span>
            <span>100% satisfaction guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
