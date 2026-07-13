import React from 'react';

export default function ProcessVideo() {
  const cards = [
    {
      title: "Quick Overview",
      description: "See the entire process in under 7 minutes",
      iconBg: "bg-orange-50",
      iconColor: "#E3755D",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      title: "Real Examples",
      description: "See actual forms and documents we help you prepare",
      iconBg: "bg-blue-50",
      iconColor: "#1B3A64",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="m9 15 2 2 4-4"></path>
        </svg>
      )
    },
    {
      title: "Expert Insights",
      description: "Hear from our immigration specialists",
      iconBg: "bg-orange-50",
      iconColor: "#E3755D",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-24 px-4 bg-white text-center">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-5 py-2 mb-8 border border-blue-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span className="text-[#1B3A64] text-sm font-bold tracking-wide">Video Walkthrough</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-6">
          See the Process in Action
        </h2>
        <p className="text-[#5A6579] font-medium mb-16 text-lg max-w-2xl mx-auto leading-relaxed">
          Watch our complete video tour to see exactly how easy and straightforward your immigration journey will be with Horizon Pathways.
        </p>

        {/* Video Player Placeholder */}
        <div className="relative w-full max-w-[1000px] mx-auto aspect-[16/9] bg-[#0A192F] rounded-[32px] overflow-hidden mb-12 shadow-2xl border-4 border-[#1B3A64]">
          <img 
            src="https://placehold.co/1600x900/0A192F/FFFFFF?text=Video+Thumbnail" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-80"
          />
          
          <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2 border border-white/30">
            <span className="w-2 h-2 rounded-full bg-[#E3755D] animate-pulse"></span>
            <span className="text-white text-xs font-bold tracking-widest uppercase">Watch Video Tour</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-24 h-24 bg-[#E3755D] rounded-full flex items-center justify-center shadow-[0_0_0_12px_rgba(255,69,0,0.2)] hover:scale-110 transition-transform">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center">
              <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center mb-6`} style={{ color: card.iconColor }}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1B3A64] mb-3">{card.title}</h3>
              <p className="text-[#5A6579] text-sm font-medium leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
