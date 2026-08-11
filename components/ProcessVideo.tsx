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

  // Replace this URL with the actual online video link you want to use
  const VIDEO_URL = 'https://youtu.be/5iU9YL3bz30?si=QlRLnqyLaHhpnf42';

  return (
    <section id="video-tour" className="w-full bg-white">
      <div className="py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto text-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-[#0A192F] mb-3 tracking-tight">
          Video Walkthrough: See the Process in Action
        </h2>
        <p className="text-orange-500 font-semibold text-[13px] mb-10 max-w-lg mx-auto leading-relaxed">
          Watch our complete video tour to see exactly how easy and
          straightforward your immigration journey will be with Horizon
          Pathways.
        </p>

        <div className="mb-8">
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold hover:underline"
          >
            ▶ Watch the video online
          </a>
        </div>

        {/* Video Player */}
        <div className="relative w-full max-w-[900px] mx-auto aspect-[16/9] bg-black rounded-2xl overflow-hidden mb-8 shadow-[0_20px_40px_-10px_rgba(27,58,100,0.2)] border border-[#EDEFF3]">
          <iframe 
            src="https://www.youtube.com/embed/5iU9YL3bz30" 
            title="Video Walkthrough" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
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
      </div>
    </section>
  );
}