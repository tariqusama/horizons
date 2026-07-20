import React from 'react';
import Link from 'next/link';

export default function ServicesSection() {
  const services = [
    {
      title: "Marriage Green Card inside the U.S. – Concurrent Filing",
      description: "I-130 and I-485 concurrent filing for marriage-based green card",
      time: "12-18 months",
      tag: "Popular",
      requirements: [
        "Married to U.S. citizen or permanent resident",
        "Lawful entry to the United States"
      ]
    },
    {
      title: "Parent Adjustment of Status inside the U.S. – Concurrent Filing",
      description: "I-130 and I-485 concurrent filing for parent adjustment",
      time: "10-16 months",
      tag: null,
      requirements: [
        "Valid parent-child relationship",
        "Currently in the United States"
      ]
    },
    {
      title: "Child Adjustment of Status inside the U.S. – Concurrent Filing",
      description: "I-130 and I-485 concurrent filing for child adjustment",
      time: "10-16 months",
      tag: null,
      requirements: [
        "Valid parent-child relationship",
        "Currently in the United States"
      ]
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center relative bg-[#FDFBF9]">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
        <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Professional Services</span>
      </div>

      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
        Our Immigration Services
      </h2>
      <p className="text-[#5A6579] font-medium mb-16 text-[19px] max-w-3xl mx-auto leading-relaxed">
        Premium, attorney-reviewed immigration packages designed to give you peace of mind from start to finish.
      </p>

      <div className="relative max-w-2xl mx-auto mb-20 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#E3755D]/20 to-[#1B3A64]/20 rounded-[24px] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
        <select defaultValue="adjustment" className="relative w-full appearance-none bg-white border border-gray-200/50 text-[#1B3A64] font-bold text-[18px] rounded-[20px] px-8 py-6 pr-12 focus:outline-none shadow-[0_15px_30px_-10px_rgba(27,58,100,0.1)] cursor-pointer transition-shadow">
          <option value="adjustment">Adjustment of Status (Inside U.S.)</option>
          <option value="consular">Consular Processing (Outside U.S.)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-8 pointer-events-none text-[#1B3A64]">
          <span className="material-icons">expand_more</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 flex flex-col relative transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)]">
            {service.tag && (
              <div className="absolute -top-4 right-8 bg-gradient-to-r from-[#E3755D] to-[#C8634D] text-white font-bold text-[12px] tracking-wide px-5 py-2 rounded-full shadow-[0_10px_20px_rgba(227,117,93,0.3)] flex items-center z-10">
                <span className="material-icons text-[16px] mr-1.5">star</span>
                {service.tag}
              </div>
            )}

            <h3 className="text-[#1B3A64] font-bold text-[24px] leading-[1.3] mb-4 pr-4">{service.title}</h3>
            <p className="text-[#5A6579] font-medium text-[16px] leading-relaxed mb-8">
              {service.description}
            </p>

            <div className="bg-[#FDFBF9] border border-gray-100 shadow-inner rounded-[24px] p-5 flex items-center mb-8">
              <div className="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center mr-4 shadow-sm border border-gray-50">
                <span className="material-icons text-[#E3755D] text-[24px]">schedule</span>
              </div>
              <div>
                <p className="text-[#5A6579] text-[12px] font-bold uppercase tracking-widest mb-0.5">Processing Time</p>
                <p className="text-[#1B3A64] font-bold text-[16px]">{service.time}</p>
              </div>
            </div>

            <div className="mb-10 flex-grow">
              <p className="text-[#1B3A64] font-bold text-[16px] mb-4">Key Requirements:</p>
              <ul className="space-y-4">
                {service.requirements.map((req, i) => (
                  <li key={i} className="flex items-start text-[15px] text-[#5A6579] font-medium leading-relaxed">
                    <span className="material-icons text-[#E3755D] text-[20px] mr-3 shrink-0">check_circle</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/services" className="w-full bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold text-[16px] rounded-[16px] py-5 flex items-center justify-center transition-all duration-300 shadow-[0_15px_30px_rgba(27,58,100,0.2)] hover:shadow-[0_20px_40px_rgba(27,58,100,0.3)] hover:-translate-y-1">
              <span>View Package</span>
              <span className="material-icons text-[20px] ml-2">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
