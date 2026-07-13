import React from 'react';

export default function AboutTeam() {
  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto bg-white relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative z-10">

        {/* Left Column: Who We Are & What We Do */}
        <div className="space-y-16">
          <div>
            <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
              <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Who We Are</span>
            </div>
            <h2 className="text-4xl md:text-[48px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">The Horizon Pathways team</h2>
            <p className="text-[#5A6579] font-medium leading-relaxed text-[19px]">
              We're not just a service — most of us have been through this ourselves. We know what it feels like to stare at a 12-page form at midnight, worried one wrong checkbox could derail everything. That's why our team brings real empathy to your case, not a script.
            </p>
          </div>

          <div>
            <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
              <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">What We Do</span>
            </div>
            <p className="text-[#5A6579] font-medium leading-relaxed text-[19px] mb-10">
              Think of us as the bridge between "I'll just do it myself" and "I can't afford a lawyer." We've got the heart of the first and the experience of the second.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)] hover:-translate-y-1 transition-transform">
                <h3 className="text-[20px] font-bold text-[#1B3A64] mb-3">Experienced Immigration Attorneys</h3>
                <p className="text-[#5A6579] text-[16px] leading-relaxed">
                  We're connected to a nationwide network of experienced immigration attorneys, so you get matched with someone who actually knows your kind of case.
                </p>
              </div>
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)] hover:-translate-y-1 transition-transform">
                <h3 className="text-[20px] font-bold text-[#1B3A64] mb-3">Certified Document Translation</h3>
                <p className="text-[#5A6579] text-[16px] leading-relaxed">
                  Got documents in another language? Our certified translations meet USCIS filing requirements, with a strong track record of acceptance — so your paperwork doesn't get bounced back over a translation issue.
                </p>
              </div>
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)] hover:-translate-y-1 transition-transform">
                <h3 className="text-[20px] font-bold text-[#1B3A64] mb-3">Affordable & Compassionate Support</h3>
                <p className="text-[#5A6579] text-[16px] leading-relaxed">
                  Lawyers are expensive. Doing it alone is risky. We sit right in the middle — professional help at a price that doesn't make you wince.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Trusted & Certified */}
        <div className="bg-gradient-to-br from-[#0A192F] to-[#1B3A64] rounded-[48px] p-12 md:p-16 text-white shadow-[0_30px_60px_-15px_rgba(27,58,100,0.3)] border border-[#122b4f] h-fit sticky top-32 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E3755D]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20 shadow-sm">
              <span className="text-white text-[12px] font-bold tracking-[0.15em] uppercase">Trusted & Certified</span>
            </div>
            
            <p className="text-[#A3B8CC] font-medium leading-relaxed text-[19px] mb-14">
              The credentials and partners that back up everything we do.
            </p>

            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                  <span className="material-icons text-[#E3755D] text-[32px]">gavel</span>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold mb-2">Experienced Immigration Attorneys</h4>
                  <p className="text-[#A3B8CC] text-[16px] leading-relaxed">We connect clients with experienced immigration attorneys who understand their case type</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                  <span className="material-icons text-[#E3755D] text-[32px]">fact_check</span>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold mb-2">USCIS-Compliant Translations</h4>
                  <p className="text-[#A3B8CC] text-[16px] leading-relaxed">Certified document translations prepared to meet USCIS filing standards</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                  <span className="material-icons text-[#E3755D] text-[32px]">verified_user</span>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold mb-2">Client-Trusted Service</h4>
                  <p className="text-[#A3B8CC] text-[16px] leading-relaxed">Strong client satisfaction ratings built on transparent pricing and honest communication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
