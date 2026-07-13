import React from 'react';

export default function AboutJourney() {
  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E3755D]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto text-center relative z-10">
        <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
          <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Our Journey</span>
        </div>

        <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-20 leading-tight tracking-tight">
          The Story Behind Horizon
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-16 text-left">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 flex items-start space-x-6 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-[24px] bg-[#F8F9FA] flex items-center justify-center border border-gray-100 shadow-inner shrink-0 group-hover:bg-[#EAF1F8] transition-colors duration-300">
                <span className="material-icons text-[#E3755D] text-[32px]">flight_takeoff</span>
              </div>
              <p className="text-[#5A6579] font-medium leading-relaxed text-[17px] mt-1">
                Horizon Pathways started with one person's story. Our founder came to America as an immigrant and quickly hit the same wall most people do — the system is confusing, the legal fees are out of reach, and one wrong form can cost you everything.
              </p>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 flex items-start space-x-6 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-[24px] bg-[#F8F9FA] flex items-center justify-center border border-gray-100 shadow-inner shrink-0 group-hover:bg-[#EAF1F8] transition-colors duration-300">
                <span className="material-icons text-[#E3755D] text-[32px]">diversity_1</span>
              </div>
              <p className="text-[#5A6579] font-medium leading-relaxed text-[17px] mt-1">
                He figured it out the hard way — and once he did, friends started asking for help. Then friends of friends. Word spread fast, transforming a personal mission into a professional service helping thousands.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1B3A64]/20 to-transparent rounded-[48px] mix-blend-overlay z-10"></div>
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#E3755D]/20 to-[#1B3A64]/20 rounded-[56px] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Founder"
              className="w-full rounded-[48px] object-cover h-[600px] shadow-[0_30px_60px_rgba(27,58,100,0.2)] border border-gray-100 relative z-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
