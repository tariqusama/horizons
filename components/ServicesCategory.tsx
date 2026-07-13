import React from 'react';
import Link from 'next/link';

type PricingPackage = {
  name: string;
  price: string;
};

type ServiceCardData = {
  title: string;
  subtitle: string;
  startingPrice: string;
  packages: PricingPackage[];
  processingTime: string;
  requirements: string[];
  isPopular?: boolean;
};

type ServicesCategoryProps = {
  title: string;
  subtitle: string;
  pillText: string;
  cards: ServiceCardData[];
};

export default function ServicesCategory({ title, subtitle, pillText, cards }: ServicesCategoryProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto py-20 px-4 md:px-8 lg:px-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
          <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">{pillText}</span>
        </div>
        <h2 className="text-4xl md:text-[48px] font-bold text-[#1B3A64] mb-6 leading-tight">{title}</h2>
        <p className="text-[#5A6579] font-medium text-[19px] max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="w-20 h-[4px] bg-gradient-to-r from-[#E3755D] to-[#C8634D] mx-auto mt-8 rounded-full shadow-sm"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-[48px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 relative flex flex-col hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] transition-all duration-500`}>
            
            {card.isPopular && (
              <div className="absolute -top-5 right-8 bg-gradient-to-r from-[#E3755D] to-[#C8634D] text-white text-[12px] font-bold px-5 py-2.5 rounded-full flex items-center shadow-[0_10px_20px_rgba(227,117,93,0.3)] uppercase tracking-wider z-10">
                <span className="material-icons text-[16px] mr-1.5">star</span>
                Most Popular
              </div>
            )}

            <div className="flex items-start mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] border border-white rounded-[20px] flex items-center justify-center shadow-inner mr-5 shrink-0">
                <span className="material-icons text-[#E3755D] text-[28px]">task</span>
              </div>
              <h3 className="font-bold text-[#1B3A64] text-[22px] leading-snug mt-1">{card.title}</h3>
            </div>
            
            <p className="text-[#5A6579] text-[16px] mb-8 min-h-[50px] leading-relaxed font-medium">{card.subtitle}</p>

            <div className="mb-8 bg-[#FDFBF9] border border-gray-100 p-6 rounded-[24px] shadow-inner">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-[#1B3A64]">{card.startingPrice}</span>
                <span className="text-[#5A6579] text-[14px] font-bold uppercase tracking-wider">starting</span>
              </div>
            </div>

            <div className="space-y-5 mb-8 flex-1">
              {card.packages.map((pkg, pIdx) => (
                <div key={pIdx} className="flex justify-between items-center text-[16px] font-medium pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="text-[#5A6579]">{pkg.name}</span>
                  <span className="text-[#1B3A64] font-bold text-[18px]">{pkg.price}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#FDFBF9] border border-gray-100 rounded-[24px] p-5 mb-8 flex items-center shadow-sm">
              <div className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center border border-gray-100 shadow-sm mr-4">
                <span className="material-icons text-[#1B3A64] text-[24px]">schedule</span>
              </div>
              <div>
                <div className="text-[12px] text-[#5A6579] font-bold uppercase tracking-wider mb-0.5">Processing Time</div>
                <div className="text-[#1B3A64] font-bold text-[16px]">{card.processingTime}</div>
              </div>
            </div>

            <div className="mb-10">
              <div className="text-[13px] text-[#1B3A64] font-bold uppercase tracking-wider mb-4 flex items-center">
                <span className="material-icons text-[18px] mr-2">checklist</span>
                <span>Requirements</span>
              </div>
              <ul className="space-y-3">
                {card.requirements.map((req, rIdx) => (
                  <li key={rIdx} className="flex items-start text-[15px] text-[#5A6579] font-medium leading-relaxed">
                    <span className="material-icons text-[#E3755D] text-[20px] mr-3 shrink-0 mt-0.5">check_circle</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <Link href="/services" className="w-full bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold py-5 rounded-[20px] transition-all duration-300 flex items-center justify-center shadow-[0_15px_30px_rgba(27,58,100,0.2)] hover:shadow-[0_20px_40px_rgba(27,58,100,0.3)] hover:-translate-y-1 text-[17px]">
                <span>Get Started</span>
                <span className="material-icons ml-2 text-[20px]">arrow_forward</span>
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
