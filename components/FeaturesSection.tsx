import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      title: "Forms That Don't Fight You",
      description: "Guided questions in plain English — no legal jargon, no guesswork.",
      icon: "description"
    },
    {
      title: "A Real Attorney Reviews It",
      description: "Before anything goes to USCIS, a certified immigration attorney looks it over.",
      icon: "gavel"
    },
    {
      title: "Always Know Where You Stand",
      description: "Track your case in real time so you're never left wondering what's next.",
      icon: "track_changes"
    },
    {
      title: "Pay Without the Headache",
      description: "Secure checkout, simple membership — cancel or change it whenever.",
      icon: "credit_card"
    }
  ];

  return (
    <section className="w-full pt-32 pb-24 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-white">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-5 py-2 mb-8 border border-blue-100/50 shadow-sm">
        <span className="text-[#1B3A64] text-[11px] font-bold tracking-[0.1em] uppercase">Our Features</span>
      </div>

      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
        Why Choose Horizon Pathways
      </h2>
      <p className="text-[#5A6579] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
        Immigration is hard enough. We make the parts we can control feel a lot easier and significantly more reliable.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] flex flex-col items-center text-center border border-gray-100 hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] transition-all duration-500 group">
            <div className="w-20 h-20 rounded-[24px] bg-[#F8F9FA] flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:bg-[#EAF1F8] transition-colors duration-300">
              <span className="material-icons text-[#E3755D] text-[36px]">{feature.icon}</span>
            </div>
            <h3 className="text-[#1B3A64] font-bold text-[20px] mb-4 leading-snug">{feature.title}</h3>
            <p className="text-[#5A6579] font-medium text-[16px] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
