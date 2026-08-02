import React from 'react';

export default function AboutTimeline() {
  const timelineEvents = [
    {
      year: '2022',
      title: 'The Beginning',
      description:
        'Founder Augustine Koroma arrived in America, identifying the gap in support for new arrivals.',
    },
    {
      year: '2023',
      title: 'First Success',
      description:
        'Helping fellow immigrants at the kitchen table leads to the first 50 successful green card approvals.',
    },
    {
      year: '2024',
      title: 'Official Launch',
      description:
        'Horizon Pathways LLC officially established with a team of five dedicated case managers.',
    },
    {
      year: '2025',
      title: 'Rapid Growth',
      description:
        'Expansion to cover all 50 states with a digital-first application platform.',
    },
    {
      year: '2026',
      title: 'Leading Platform',
      description:
        'Serving 2,981+ clients and setting a new industry standard for transparency.',
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 bg-[#F7F8FA] text-center">
      <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mb-3 tracking-tight">
        Our Growth Journey
      </h2>
      <p className="text-orange-500 font-semibold text-[14px] mb-16">
        Pioneering a better way to navigate immigration since day one.
      </p>

      <div className="relative max-w-3xl mx-auto">
        {/* Center line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#D8DEE6]"></div>

        <div className="flex flex-col gap-14">
          {timelineEvents.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            const content = (
              <>
                <p className="text-[#0A192F] font-bold text-[15px] leading-snug">
                  {event.year}: {event.title}
                </p>
                <p className="text-[#5A6579] text-[13px] font-medium leading-relaxed mt-1">
                  {event.description}
                </p>
              </>
            );
            return (
              <div
                key={idx}
                className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-0"
              >
                <div className="pr-10 text-right">{isLeft ? content : null}</div>
                <div className="w-3 h-3 rounded-full bg-orange-600 border-2 border-white shadow-[0_0_0_2px_#E7EBF0] mt-1 justify-self-center"></div>
                <div className="pl-10 text-left">{!isLeft ? content : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}