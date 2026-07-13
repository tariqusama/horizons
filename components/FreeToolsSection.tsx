import React from 'react';
import Link from 'next/link';

export default function FreeToolsSection() {
  const tools = [
    {
      title: "AR-11 Change of Address",
      description: "Required notification for all immigrants when changing address. Get a pre-filled PDF instantly.",
      iconBg: "bg-white",
      iconColor: "text-[#E3755D]",
      tagText: "Most Popular",
      tagColor: "text-[#E3755D]",
      tagBg: "bg-white",
      tagBorder: "border-[#E3755D]",
      buttonText: "Start Free AR-11",
      buttonColor: "bg-[#E3755D] hover:bg-[#C8634D]",
      icon: "mark_email_read"
    },
    {
      title: "I-912 Fee Waiver",
      description: "Check eligibility and generate your USCIS fee waiver request form.",
      iconBg: "bg-white",
      iconColor: "text-[#1B3A64]",
      tagText: "Popular",
      tagColor: "text-[#1B3A64]",
      tagBg: "bg-white",
      tagBorder: "border-[#1B3A64]",
      buttonText: "Start Free I-912",
      buttonColor: "bg-[#1B3A64] hover:bg-[#122b4f]",
      icon: "request_quote"
    },
    {
      title: "G-1145 E-Notification",
      description: "Get email and text updates for your USCIS applications. Add to any filing packet.",
      iconBg: "bg-white",
      iconColor: "text-[#1B3A64]",
      tagText: "Essential",
      tagColor: "text-[#1B3A64]",
      tagBg: "bg-white",
      tagBorder: "border-[#1B3A64]",
      buttonText: "Start Free G-1145",
      buttonColor: "bg-[#1B3A64] hover:bg-[#122b4f]",
      icon: "notifications_active"
    }
  ];

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-white">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-5 py-2 mb-6 border border-gray-100 shadow-sm">
        <span className="text-[#1B3A64] text-[11px] font-bold tracking-[0.1em] uppercase">
          100% Free • No Credit Card
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-[#1B3A64] mb-4">
        Free Immigration Tools
      </h2>
      <p className="text-[#5A6579] font-medium mb-16 text-[17px] max-w-2xl mx-auto leading-relaxed">
        Professional USCIS forms and guides at absolutely no cost. Start your immigration journey with confidence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {tools.map((tool, idx) => (
          <div key={idx} className="bg-[#F8F9FA] rounded-[32px] p-8 shadow-sm text-left flex flex-col border border-gray-100 transition-transform hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 ${tool.iconBg}`}>
              <span className={`material-icons text-[24px] ${tool.iconColor}`}>{tool.icon}</span>
            </div>

            <div className={`inline-flex items-center self-start rounded-full px-3 py-1 mb-4 shadow-sm border ${tool.tagBorder} ${tool.tagBg}`}>
              <span className={`material-icons text-[14px] mr-1.5 ${tool.tagColor}`}>star</span>
              <span className={`text-[11px] font-bold ${tool.tagColor} uppercase tracking-wider`}>{tool.tagText}</span>
            </div>

            <h3 className="text-[#1B3A64] font-bold text-2xl mb-4">{tool.title}</h3>
            <p className="text-[#5A6579] font-medium text-[15px] leading-relaxed mb-10 flex-grow">
              {tool.description}
            </p>

            <Link href="/free-tools" className={`w-full py-4 rounded-xl font-bold text-white transition-colors text-[15px] flex justify-center items-center shadow-sm ${tool.buttonColor}`}>
              <span>{tool.buttonText}</span>
              <span className="material-icons text-[18px] ml-2">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/free-tools" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-colors shadow-sm flex items-center w-full sm:w-auto justify-center">
          <span>View All Free Tools</span>
          <span className="material-icons text-[18px] ml-2">widgets</span>
        </Link>
        <Link href="/how-it-works" className="bg-white hover:bg-gray-50 border border-gray-200 text-[#1B3A64] px-8 py-4 rounded-xl font-bold text-[15px] transition-colors shadow-sm flex items-center w-full sm:w-auto justify-center">
          <span>See How Our Process Works</span>
          <span className="material-icons text-[18px] ml-2">lightbulb</span>
        </Link>
      </div>
    </section>
  );
}
