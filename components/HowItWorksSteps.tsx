import React from 'react';

export default function HowItWorksSteps() {
  const steps = [
    {
      number: 1,
      title: "Create Your Secure Profile",
      time: "2-5 minutes",
      description: "Sign up in minutes and access your personalized immigration dashboard. We use bank-level encryption to protect your data.",
      features: [
        "Quick 2-minute registration process",
        "256-bit encryption for all data",
        "Multi-factor authentication available",
        "Access from any device, anytime"
      ],
      iconBg: "bg-gradient-to-br from-[#E3755D] to-[#1B3A64]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      )
    },
    {
      number: 2,
      title: "Complete Guided Forms",
      time: "1-2 hours",
      description: "Answer simple questions in plain English. Our intelligent system fills complex USCIS forms automatically.",
      features: [
        "Step-by-step guided questions",
        "Auto-save progress feature",
        "Built-in form validation",
        "Helpful tips and explanations"
      ],
      iconBg: "bg-gradient-to-br from-[#E3755D] to-[#8C2300]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      number: 3,
      title: "Upload Supporting Documents",
      time: "30-60 minutes",
      description: "Securely upload photos, identification, and evidence. Our checklist ensures you don't miss anything.",
      features: [
        "Smart document checklist",
        "Drag-and-drop upload",
        "Automatic file organization",
        "Real-time upload verification"
      ],
      iconBg: "bg-gradient-to-br from-[#E3755D] to-[#1B3A64]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      )
    },
    {
      number: 4,
      title: "Professional Review",
      time: "24-48 hours",
      description: "Your dedicated case manager reviews everything for completeness. Attorney review available for peace of mind.",
      features: [
        "Assigned case manager",
        "Comprehensive document review",
        "Error detection and correction",
        "Optional attorney consultation"
      ],
      iconBg: "bg-gradient-to-br from-[#A84227] to-[#1B3A64]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      number: 5,
      title: "Quality Assurance Check",
      time: "12-24 hours",
      description: "Final quality control ensures your application meets USCIS standards before printing and assembly.",
      features: [
        "Multi-point inspection",
        "USCIS compliance verification",
        "Professional formatting",
        "Final approval notification"
      ],
      iconBg: "bg-gradient-to-br from-[#E3755D] to-[#1B3A64]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="m9 15 2 2 4-4"></path>
        </svg>
      )
    },
    {
      number: 6,
      title: "Print, Assemble & Ship",
      time: "3-5 business days",
      description: "We print, organize, and ship your complete USCIS-ready package directly to your door with tracking.",
      features: [
        "Professional printing service",
        "Organized packet assembly",
        "USPS tracking included",
        "Delivery confirmation"
      ],
      iconBg: "bg-gradient-to-br from-[#E3755D] to-[#1B3A64]",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-24 px-4 bg-[#FDFBF9] relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto text-center relative z-10">
        
        <div className="inline-flex items-center space-x-2 bg-blue-50/50 rounded-full px-5 py-2 mb-8 border border-blue-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-[#1B3A64] text-sm font-bold tracking-wide">Complete Process: 5-10 Business Days</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-6">
          Your Step-by-Step Journey
        </h2>
        <p className="text-gray-500 font-medium mb-24 text-lg max-w-2xl mx-auto leading-relaxed">
          Every application follows our proven 6-step process, ensuring accuracy, compliance, and peace of mind.
        </p>

        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-orange-200 via-orange-300 to-transparent z-0"></div>

          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-orange-100 border-l-4 border-l-[#E3755D] text-left w-full max-w-4xl mx-auto overflow-hidden group hover:shadow-[0_12px_40px_rgb(255,69,0,0.1)] transition-shadow">
                
                {/* Decorative blob in corner */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-orange-50 to-blue-50 rounded-full opacity-60 blur-2xl group-hover:scale-110 transition-transform"></div>

                {/* Big Number */}
                <div className="absolute top-6 right-8 text-5xl font-black text-[#E3755D] opacity-90 drop-shadow-sm">
                  {step.number}
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${step.iconBg}`}>
                    {step.icon}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                      <h3 className="text-2xl font-bold text-[#E3755D]">{step.title}</h3>
                      <div className="inline-flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-500 w-fit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{step.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-[#5A6579] font-medium leading-relaxed mb-8 max-w-2xl text-lg">
                      {step.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {step.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span className="text-gray-500 font-medium text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
