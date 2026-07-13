import React from 'react';

export default function AboutTimeline() {
  const timelineEvents = [
    {
      title: "The Beginning",
      year: "2022",
      description: "Our founder arrived in America as an immigrant, facing the overwhelming challenge of navigating the complex immigration system with limited resources.",
      icon: "flight"
    },
    {
      title: "First Success",
      year: "2023",
      description: "After successfully completing his own immigration journey through perseverance and determination, our founder began helping fellow immigrants prepare their applications.",
      icon: "verified"
    },
    {
      title: "Official Launch",
      year: "2024",
      description: "Growing demand led to the official establishment of Horizon Pathways LLC, transforming one person's mission into a professional service.",
      icon: "domain"
    },
    {
      title: "Rapid Growth",
      year: "2025",
      description: "Expanded our team of case managers and connected with experienced immigration attorneys nationwide to serve clients in all 50 states.",
      icon: "trending_up"
    },
    {
      title: "Leading Platform",
      year: "2026",
      description: "Now serving 2,981+ clients from 75+ countries with a 98% satisfaction rate, continuing to expand our services and impact.",
      icon: "stars"
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] text-center relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#E3755D]/10 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#4375A3]/20 rounded-full blur-[120px] translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
          <span className="text-[#A3B8CC] text-[12px] font-bold tracking-[0.15em] uppercase">Our Story</span>
        </div>

        <h2 className="text-4xl md:text-[56px] font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
          The Journey
        </h2>
        <p className="text-[#A3B8CC] font-medium mb-24 text-[19px] max-w-2xl mx-auto leading-relaxed">
          From one immigrant's struggle to serving thousands nationwide.
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-[#E3755D]/50 to-transparent rounded-full shadow-[0_0_15px_rgba(227,117,93,0.5)]"></div>

          {timelineEvents.map((event, idx) => (
            <div key={idx} className={`flex items-center justify-between w-full mb-16 ${idx % 2 === 0 ? 'flex-row-reverse' : ''} group`}>

              <div className="w-5/12"></div>

              <div className="z-20 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#E3755D] to-[#C8634D] rounded-full shadow-[0_0_0_8px_rgba(10,25,47,0.8)] border border-white/20 group-hover:scale-125 transition-transform duration-500">
                <span className="material-icons text-white text-[20px]">{event.icon}</span>
              </div>

              <div className={`w-5/12 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 inline-block w-full text-left hover:-translate-y-2 hover:bg-white/15 transition-all duration-300">
                  <div className={`flex items-center space-x-5 mb-5 ${idx % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse justify-end'}`}>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                      <span className="material-icons text-[#E3755D] text-[28px] drop-shadow-sm">{event.icon}</span>
                    </div>
                  </div>
                  <div className={`inline-flex items-center bg-[#E3755D]/20 border border-[#E3755D]/30 rounded-full px-5 py-1.5 mb-6 text-white font-bold text-[14px] shadow-sm ${idx % 2 === 0 ? '' : 'float-right'}`}>
                    {event.year}
                  </div>
                  <div className="clear-both"></div>
                  <p className="text-[#A3B8CC] font-medium leading-relaxed text-[16px]">
                    {event.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
