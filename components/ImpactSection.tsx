import React from 'react';

export default function ImpactSection() {
  const stats = [
    {
      value: "98%",
      label: "Success Rate",
      icon: "task_alt",
    },
    {
      value: "3,012+",
      label: "Cases Handled",
      icon: "groups",
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: "support_agent",
    },
    {
      value: "4.9/5",
      label: "Client Rating",
      icon: "star",
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-white relative">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
        <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Our Impact</span>
      </div>

      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
        Proven Excellence
      </h2>
      <p className="text-[#5A6579] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
        Numbers that speak to our commitment, expertise, and the trust our clients place in us.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-12 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] flex flex-col items-center justify-center border border-gray-100 hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] rounded-[24px] flex items-center justify-center mb-8 shadow-inner border border-white relative z-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-[#1B3A64] text-[36px] drop-shadow-sm">{stat.icon}</span>
            </div>
            <h3 className="text-5xl font-black mb-3 text-[#1B3A64] relative z-10">{stat.value}</h3>
            <p className="text-[#5A6579] font-bold text-[14px] uppercase tracking-wider relative z-10">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
