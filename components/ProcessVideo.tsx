import React from 'react';
import { Play, Clock, FileText, Users } from 'lucide-react';

export default function ProcessVideo() {
  const items = [
    {
      title: 'Quick Overview',
      subtitle: 'Under 7 minutes',
      icon: Clock,
    },
    {
      title: 'Real Examples',
      subtitle: 'Actual case samples',
      icon: FileText,
    },
    {
      title: 'Expert Insights',
      subtitle: 'Legal walkthroughs',
      icon: Users,
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <h2 className="text-2xl md:text-[28px] font-bold text-[#0A192F] mb-3 tracking-tight">
        Video Walkthrough: See the Process in Action
      </h2>
      <p className="text-orange-500 font-semibold text-[13px] mb-10 max-w-lg mx-auto leading-relaxed">
        Watch our complete video tour to see exactly how easy and
        straightforward your immigration journey will be with Horizon
        Pathways.
      </p>

      {/* Video Player */}
      <div className="relative w-full max-w-[900px] mx-auto aspect-[16/9] bg-[#0A192F] rounded-2xl overflow-hidden mb-8 shadow-[0_20px_40px_-10px_rgba(27,58,100,0.2)] border border-[#EDEFF3]">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Video tour thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[#0A192F] font-bold text-[13px]">
          Horizon Pathways
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_0_10px_rgba(227,98,61,0.25)] hover:scale-105 transition-transform">
            <Play size={24} color="white" fill="white" className="ml-0.5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 text-left">
          <p className="text-white/80 text-[11px] font-bold uppercase tracking-wider">
            How It Works
          </p>
          <p className="text-white font-bold text-[18px]">
            Step-by-Step Guide
          </p>
        </div>
      </div>

      {/* Items row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <Icon size={16} className="text-orange-500" />
              <div className="text-left">
                <p className="text-[#0A192F] font-bold text-[13px] leading-tight">
                  {item.title}
                </p>
                <p className="text-[#8A93A3] text-[11px]">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}