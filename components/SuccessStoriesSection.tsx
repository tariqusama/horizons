import React from 'react';
import Link from 'next/link';

export default function SuccessStoriesSection() {
  const stories = [
    {
      date: "April 15, 2025",
      text: "\"My fiancée from Haiti was recently approved for her K-1 visa, and I honestly can't thank Horizon Pathways enough for the support we received during the process. At first, we were overwhelmed by all the paperwork and requirements...\"",
      name: "Huck Gransden",
      location: "US"
    },
    {
      date: "April 6, 2026",
      text: "\"I'm very grateful to Horizon Pathways for helping my mother through her IR-5 immigrant visa process from the Philippines. At first, my family and I were overwhelmed by all the paperwork and requirements, but their team made everything much easier...\"",
      name: "Beau Walker",
      location: "US"
    },
    {
      date: "May 5, 2026",
      text: "\"I'm originally from Romania, and when I started my Adjustment of Status process from an F-1 student visa to a Green Card, I felt very overwhelmed by all the paperwork and immigration requirements. Horizon Pathways made the process much easier for me...\"",
      name: "Madison Cooper",
      location: "US"
    },
    {
      date: "August 18, 2025",
      text: "\"Choosing Horizon Pathways for my wife's visa was a great decision. Visa rules and paperwork are very confusing and stressful. However, their team, especially Augustine, was very organized and got all our proof ready early...\"",
      name: "Abdoul Amadou",
      location: "US"
    },
    {
      date: "October 31, 2025",
      text: "\"I recommend Horizon Pathways. They helped us file for an SB-1 Returning Resident visa for my child who overstayed in Congo due to unexpected circumstances. Immigration law is complex, but the team's deep understanding put us at ease...\"",
      name: "Robert Mugisha",
      location: "US"
    },
    {
      date: "May 12, 2026",
      text: "\"I am a U.S. citizen and filed a K-1 visa for my fiancée in South Africa and a K-2 visa for her 4-year-old son. From preparing our initial USCIS petition all the way to the embassy interview in Johannesburg, Horizon Pathways guided and supported us...\"",
      name: "Caleb Thornton",
      location: "US"
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-[#FDFBF9] relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#4375A3]/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm relative z-10">
        <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Testimonials</span>
      </div>

      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight relative z-10">
        Success Stories from Our Clients
      </h2>
      <p className="text-[#5A6579] font-medium mb-10 text-[19px] max-w-2xl mx-auto leading-relaxed relative z-10">
        Real, verified reviews from clients on Trustpilot and Google
      </p>

      <div className="inline-flex items-center justify-center bg-white border border-gray-200/50 rounded-full pl-6 pr-7 py-3 mb-20 shadow-[0_10px_20px_-10px_rgba(27,58,100,0.1)] gap-6 relative z-10">
        <div className="flex items-center bg-[#00B67A] text-white rounded-full px-5 py-2 font-bold text-sm shadow-sm">
          <span className="material-icons text-[16px] mr-2">star</span>
          Trustpilot
        </div>
        <div className="flex items-center text-[#5A6579] font-bold text-sm">
          <span className="material-icons text-[20px] mr-2 text-[#1B3A64]">account_circle</span>
          Google
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left relative z-10">
        {stories.map((story, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 flex flex-col hover:-translate-y-2 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1.5 text-[#00B67A]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-[22px]">star</span>
                ))}
              </div>
              <span className="text-[#5A6579]/60 text-xs font-bold uppercase tracking-wider">{story.date}</span>
            </div>
            <p className="text-[#5A6579] font-medium text-[16px] leading-relaxed mb-8 flex-grow">
              {story.text}
            </p>
            <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
              <div>
                <h4 className="text-[#1B3A64] font-bold text-[16px] mb-1">{story.name}</h4>
                <p className="text-[#5A6579]/80 text-[13px] font-medium">{story.location}</p>
              </div>
              <div className="flex items-center text-[#00B67A] font-bold text-[13px] bg-[#00B67A]/10 px-3 py-1.5 rounded-full">
                <span className="material-icons text-[16px] mr-1.5">verified</span>
                Verified
              </div>
            </div>
          </div>
        ))}
        {/* Fog fade effect at bottom of grid */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#FDFBF9] to-transparent pointer-events-none z-20"></div>
      </div>

      <div className="mt-12 text-center relative z-30">
        <a href="#" className="text-[#E3755D] font-bold text-[17px] hover:text-[#C8634D] inline-flex items-center transition-colors">
          See all reviews on Trustpilot
          <span className="material-icons text-[20px] ml-2">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
