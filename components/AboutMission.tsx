import React from 'react';
import { Eye, Flag } from 'lucide-react';

export default function AboutMission() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16 bg-[#F7F8FA]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] flex flex-col">
          <div className="w-11 h-11 bg-[#F0F2F5] rounded-lg flex items-center justify-center mb-6">
            <Eye size={20} color="#0A192F" strokeWidth={2.25} />
          </div>
          <h2 className="text-[22px] font-bold text-[#0A192F] mb-3">Our Vision</h2>
          <p className="text-[#5A6579] font-medium text-[14px] leading-relaxed">
            We want immigration to feel less scary. Our goal is simple —
            give you the clarity and support you need so the process
            actually makes sense.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)] flex flex-col">
          <div className="w-11 h-11 bg-[#FDF1EA] rounded-lg flex items-center justify-center mb-6">
            <Flag size={20} color="#E3623D" strokeWidth={2.25} />
          </div>
          <h2 className="text-[22px] font-bold text-[#0A192F] mb-3">Our Mission</h2>
          <p className="text-[#5A6579] font-medium text-[14px] leading-relaxed">
            We hand you the checklists, walk you through each form, and
            give you a real case manager to text when something doesn't
            make sense — so filing with USCIS feels doable, not
            terrifying.
          </p>
        </div>
      </div>
    </section>
  );
}