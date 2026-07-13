import React from 'react';

export default function TrustBadges() {
  const badges = [
    {
      title: "Legally Registered",
      subtitle: "Fully Compliant",
      icon: "verified_user"
    },
    {
      title: "SSL Secured",
      subtitle: "Data Protected",
      icon: "lock"
    },
    {
      title: "DOJ Accredited",
      subtitle: "Certified Attorneys",
      icon: "gavel"
    },
    {
      title: "USCIS-Experienced",
      subtitle: "Filing Specialists",
      icon: "fact_check"
    }
  ];

  return (
    <section className="w-full px-4 max-w-[1400px] mx-auto bg-transparent relative z-20 -mt-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.15)] border border-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons text-[#1B3A64] text-[28px]">{badge.icon}</span>
              </div>
              <h3 className="text-[#1B3A64] font-bold text-[18px] mb-1.5">{badge.title}</h3>
              <p className="text-[#5A6579] text-[15px] font-medium">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
