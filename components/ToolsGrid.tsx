import React from 'react';
import Link from 'next/link';

export default function ToolsGrid() {
  const tools = [
    {
      title: "AR-11 Change of Address",
      description: "Required for all immigrants when changing address. Get a pre-filled PDF ready for USCIS submission.",
      time: "5-10 minutes",
      isPopular: true,
      features: [
        "Auto-filled PDF",
        "Filing instructions",
        "Mobile-friendly"
      ]
    },
    {
      title: "G-1145 E-Notification",
      description: "Get email/text updates for your USCIS applications. Add to any USCIS filing packet.",
      time: "2-3 minutes",
      features: [
        "Quick setup",
        "Text & email alerts",
        "Works with any form"
      ]
    },
    {
      title: "I-94 Travel History Guide",
      description: "Step-by-step guide to retrieve your I-94 arrival/departure records from CBP.",
      time: "3-5 minutes",
      features: [
        "Interactive guide",
        "CBP portal walkthrough",
        "PDF saving tips"
      ]
    },
    {
      title: "I-131A Boarding Foil Guide",
      description: "Lost your green card abroad? Learn how to apply for a boarding foil to return to the US.",
      time: "5-7 minutes",
      features: [
        "Eligibility check",
        "Document checklist",
        "Fee payment guide"
      ]
    },
    {
      title: "FOIA Request (G-639)",
      description: "Request your immigration file from USCIS. Get your complete A-file records.",
      time: "10-15 minutes",
      features: [
        "Pre-filled G-639",
        "Record type guidance",
        "Processing timeline"
      ]
    },
    {
      title: "I-912 Fee Waiver Request",
      description: "Apply for a fee waiver if you cannot afford USCIS filing fees due to financial hardship.",
      time: "15-20 minutes",
      features: [
        "Income calculator",
        "Evidence checklist",
        "Eligibility assessment"
      ]
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-[#FDFBF9]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
            <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Available Now</span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">Ready to use immigration tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] relative flex flex-col hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] transition-all duration-500 group">
              {tool.isPopular && (
                <div className="absolute -top-5 right-8 bg-gradient-to-r from-[#E3755D] to-[#C8634D] text-white text-[12px] font-bold px-5 py-2.5 rounded-full flex items-center shadow-[0_10px_20px_rgba(227,117,93,0.3)] uppercase tracking-wider z-10">
                  <span className="material-icons text-[16px] mr-1.5">star</span>
                  Most Popular
                </div>
              )}

              <div className="mb-8 flex-grow">
                <h3 className="text-[24px] font-bold text-[#1B3A64] mb-4 group-hover:text-[#E3755D] transition-colors leading-snug">{tool.title}</h3>
                <p className="text-[#5A6579] font-medium leading-relaxed mb-8 text-[16px] min-h-[50px]">{tool.description}</p>
                
                <div className="flex items-center space-x-2 text-[14px] font-bold text-[#1B3A64] mb-8 bg-[#FDFBF9] inline-flex px-4 py-2 rounded-xl border border-gray-100 shadow-inner">
                  <span className="material-icons text-[#E3755D] text-[20px]">schedule</span>
                  <span>{tool.time}</span>
                </div>

                <div className="space-y-4">
                  <div className="text-[12px] font-bold text-[#5A6579] uppercase tracking-wider mb-2">What's included:</div>
                  <ul className="space-y-3">
                    {tool.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center space-x-3 text-[15px] text-[#1B3A64] font-medium">
                        <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link href="/signup" className="w-full bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold py-5 rounded-[20px] transition-all duration-300 flex items-center justify-center space-x-2 mt-auto shadow-[0_15px_30px_rgba(27,58,100,0.2)] hover:shadow-[0_20px_40px_rgba(27,58,100,0.3)] hover:-translate-y-1 text-[17px]">
                <span>Get Started</span>
                <span className="material-icons text-[20px] ml-2">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
