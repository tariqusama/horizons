import React from 'react';

export default function ContactHero() {
  return (
    <section className="relative w-full flex flex-col justify-center items-center text-center px-4 pt-24 pb-20">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A192F]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto flex flex-col items-center">
        {/* Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span className="text-white text-sm font-bold tracking-wide uppercase">We're Here to Help</span>
        </div>

        <h1 className="text-5xl md:text-[64px] font-black leading-[1.1] mb-6 tracking-tight text-white">
          Get in Touch
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-blue-100 mb-10 max-w-2xl leading-relaxed">
          Have questions about your immigration journey? Our team of experts is ready to provide the guidance and support you need.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex-1 w-full text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1">Call Us</h3>
            <p className="text-blue-100">+1 (800) 795 7153</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex-1 w-full text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1">Email Us</h3>
            <p className="text-blue-100">support@horizonpathways.us</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex-1 w-full text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1">Visit Us</h3>
            <p className="text-blue-100">Lanham, MD 20706</p>
          </div>
        </div>
      </div>
    </section>
  );
}
