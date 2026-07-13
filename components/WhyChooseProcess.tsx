import React from 'react';

export default function WhyChooseProcess() {
  const reasons = [
    {
      title: "Save 20+ Hours",
      description: "Our guided process is 10x faster than filling forms manually or hiring expensive attorneys.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      title: "Expert Support",
      description: "Dedicated case managers and optional attorney review ensure accuracy and peace of mind.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "98% Success Rate",
      description: "Our comprehensive review process results in fewer USCIS rejections and faster approvals.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      )
    },
    {
      title: "Bank-Level Security",
      description: "Your sensitive information is protected with enterprise-grade encryption and secure servers.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-24 px-4 bg-white text-center">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-5 py-2 mb-8 border border-blue-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <span className="text-[#1B3A64] text-sm font-bold tracking-wide">Proven Results</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-6">
          Why Choose Our Process
        </h2>
        <p className="text-[#5A6579] font-medium mb-16 text-lg max-w-2xl mx-auto leading-relaxed">
          Our systematic approach combines technology with human expertise to deliver exceptional results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <div key={idx} className={`bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border ${idx === 1 ? 'border-orange-400 border-2' : 'border-gray-100'} flex flex-col items-center hover:-translate-y-1 transition-transform`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E3755D] to-[#1B3A64] flex items-center justify-center mb-6 shadow-lg">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1B3A64] mb-4">{reason.title}</h3>
              <p className="text-[#5A6579] text-sm leading-relaxed font-medium">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
