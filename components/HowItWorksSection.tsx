import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Create Your Profile",
      description: "Sign up and set up your secure personal dashboard.",
    },
    {
      num: "02",
      title: "Complete Application",
      description: "Answer clear, guided questions to fill every required form accurately.",
    },
    {
      num: "03",
      title: "Upload Documents",
      description: "Securely upload necessary evidence and review your complete packet.",
    },
    {
      num: "04",
      title: "Legal Review",
      description: "An experienced immigration attorney reviews everything before filing.",
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] text-center relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#E3755D]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">The Process</span>
        </div>

        <h2 className="text-4xl md:text-[56px] font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
          How It Works
        </h2>
        <p className="text-[#A3B8CC] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
          Four simple steps to transform your immigration journey from complex to complete, backed by legal expertise.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/10 hover:-translate-y-3 transition-all duration-500 relative group overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[120px] font-black text-white/5 leading-none select-none group-hover:text-white/10 transition-colors duration-500">
                {step.num}
              </div>
              
              <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#E3755D] to-[#C8634D] flex items-center justify-center mb-8 shadow-inner border border-white/20 relative z-10 group-hover:scale-110 transition-transform duration-500">
                <span className="text-white font-black text-3xl drop-shadow-md">{step.num}</span>
              </div>
              
              <h3 className="text-white font-bold text-[22px] mb-4 relative z-10">{step.title}</h3>
              <p className="text-[#A3B8CC] font-medium text-[16px] leading-relaxed relative z-10 flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
