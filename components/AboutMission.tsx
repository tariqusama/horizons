import React from 'react';

export default function AboutMission() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 pb-32 relative z-10 -mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-12 shadow-[0_30px_60px_-15px_rgba(27,58,100,0.15)] border border-white flex flex-col hover:-translate-y-2 transition-all duration-500 group">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] border border-white rounded-[24px] flex items-center justify-center shadow-inner text-[#1B3A64] shrink-0 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-[#E3755D] text-[36px]">visibility</span>
            </div>
            <h2 className="text-[32px] font-bold text-[#1B3A64] leading-tight">Our Vision</h2>
          </div>
          <p className="text-[#5A6579] font-medium text-[18px] leading-relaxed">
            We want immigration to feel less scary. Our goal is simple — give you the clarity and support you need so the process actually makes sense.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-12 shadow-[0_30px_60px_-15px_rgba(27,58,100,0.15)] border border-white flex flex-col hover:-translate-y-2 transition-all duration-500 group">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] border border-white rounded-[24px] flex items-center justify-center shadow-inner text-[#1B3A64] shrink-0 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-[#1B3A64] text-[36px]">rocket_launch</span>
            </div>
            <h2 className="text-[32px] font-bold text-[#1B3A64] leading-tight">Our Mission</h2>
          </div>
          <p className="text-[#5A6579] font-medium text-[18px] leading-relaxed">
            We hand you the checklists, walk you through each form, and give you a real case manager to text when something doesn't make sense — so filing with USCIS feels doable, not terrifying.
          </p>
        </div>
      </div>
    </section>
  );
}
