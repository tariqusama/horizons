import React from 'react';

export default function AboutValues() {
  const values = [
    {
      title: "Compassion",
      description: "We've sat where you're sitting. We know the late-night Googling, the stress, the not-knowing. That's why we treat every case like it's our own family's.",
      icon: "favorite"
    },
    {
      title: "Integrity",
      description: "We'll tell you the truth — even when it's not what you want to hear. Honest pricing, no surprise fees, and no promises we can't keep.",
      icon: "verified_user"
    },
    {
      title: "Excellence",
      description: "98% of our clients are happy with how things went. We get there by sweating the small stuff and working with experienced immigration attorneys.",
      icon: "military_tech"
    },
    {
      title: "Transparency",
      description: "No black boxes. You'll always know where your case stands, what's next, and why we're doing it that way.",
      icon: "visibility"
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-[#FDFBF9]">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
        <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">What Drives Us</span>
      </div>
      
      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
        Our Core Values
      </h2>
      <p className="text-[#5A6579] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
        Four things we won't compromise on — no matter how busy we get.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((val, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-10 text-left shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] border border-white rounded-[24px] flex items-center justify-center shadow-inner mb-8 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-[#E3755D] text-[28px] drop-shadow-sm">{val.icon}</span>
            </div>
            <h3 className="text-[24px] font-bold text-[#1B3A64] mb-4">{val.title}</h3>
            <p className="text-[#5A6579] font-medium leading-relaxed text-[16px]">
              {val.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
