import React from 'react';

export default function AboutJourney() {
  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="text-left">
          <h2 className="text-3xl md:text-[40px] font-bold text-[#0A192F] mb-6 tracking-tight leading-tight">
            The Story Behind Horizon
          </h2>
          <p className="text-[#5A6579] font-medium text-[15px] leading-relaxed mb-8">
            What started as a small kitchen-table operation born from the
            frustration of complex visa forms has grown into a nationwide
            beacon for immigrants. Our founder, Augustine Koroma, realized
            that legal expertise wasn't enough; immigrants needed empathy,
            accessibility, and a digital-first approach to the American
            Dream.
          </p>

          <blockquote className="border-l-2 border-orange-500 pl-6">
            <p className="text-[#0A192F] italic font-medium text-[16px] leading-relaxed mb-4">
              "From one immigrant's struggle to serving thousands
              nationwide."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="/ceo-picture.jpeg"
                alt="Augustine Koroma"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <p className="text-[#0A192F] font-bold text-[14px] leading-tight">
                  Augustine Koroma
                </p>
                <p className="text-[#2F6FDB] text-[13px] font-medium">
                  CEO &amp; Founder
                </p>
              </div>
            </div>
          </blockquote>
        </div>

        {/* Right image */}
        <div className="w-full">
          <img
            src="/team-picture.jpg"
            alt="Horizon Pathways team"
            className="w-full h-[380px] md:h-[420px] object-cover rounded-3xl shadow-[0_20px_40px_-10px_rgba(27,58,100,0.15)] rotate-1"
          />
        </div>
      </div>
    </section>
  );
}