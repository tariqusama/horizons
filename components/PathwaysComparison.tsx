import React from 'react';

export default function PathwaysComparison() {
  const pathways = [
    {
      category: "Family-Based",
      title: "Marriage-Based Green Card",
      description: "For spouses of U.S. citizens or permanent residents",
      processing: "10-13 months",
      cost: "$1,760 - $2,830",
      workAuth: true,
      travel: true,
      family: true
    },
    {
      category: "Family-Based",
      title: "K-1 Fiancé(e) Visa",
      description: "For foreign fiancé(e)s of U.S. citizens planning to marry",
      processing: "6-9 months",
      cost: "$2,025",
      workAuth: false,
      travel: false,
      family: true
    },
    {
      category: "Citizenship",
      title: "Naturalization (N-400)",
      description: "Path to U.S. citizenship for eligible green card holders",
      processing: "8-12 months",
      cost: "$725 - $760",
      workAuth: true,
      travel: true,
      family: false
    },
    {
      category: "Work-Based",
      title: "Employment-Based Green Card",
      description: "For employees sponsored by U.S. employers",
      processing: "12-24+ months",
      cost: "$3,000 - $7,000+",
      workAuth: true,
      travel: true,
      family: true
    },
    {
      category: "DACA",
      title: "DACA Renewal",
      description: "Deferred Action for Childhood Arrivals program renewal",
      processing: "4-6 months",
      cost: "$495",
      workAuth: true,
      travel: false,
      family: false
    },
    {
      category: "Green Card",
      title: "Remove Conditions (I-751)",
      description: "Remove conditions on 2-year conditional green card",
      processing: "12-24 months",
      cost: "$595 - $680",
      workAuth: true,
      travel: true,
      family: false
    }
  ];

  const CheckIcon = () => (
    <div className="w-10 h-10 rounded-2xl bg-[#EAF1F8] border border-blue-100/50 flex items-center justify-center mx-auto shadow-sm">
      <span className="material-icons text-[#E3755D] text-[22px]">check_circle</span>
    </div>
  );

  const XIcon = () => (
    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto shadow-sm">
      <span className="material-icons text-gray-300 text-[22px]">cancel</span>
    </div>
  );

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-[#FDFBF9]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-2 mb-8 border border-gray-200/60 shadow-sm">
            <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Quick Reference</span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">Compare Immigration Pathways</h2>
          <p className="text-[#5A6579] font-medium text-[19px] max-w-2xl mx-auto leading-relaxed">
            Compare processing times, costs, and benefits of different immigration pathways to find the best option for your situation.
          </p>
        </div>

        <div className="overflow-x-auto pb-10">
          <table className="w-full min-w-[1000px] border-collapse bg-white rounded-[40px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100">
            <thead>
              <tr className="bg-gradient-to-r from-[#0A192F] to-[#1B3A64] text-white">
                <th className="py-8 px-10 text-left font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Pathway</th>
                <th className="py-8 px-8 text-center font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Processing</th>
                <th className="py-8 px-8 text-center font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Estimated Cost</th>
                <th className="py-8 px-8 text-center font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Work Auth</th>
                <th className="py-8 px-8 text-center font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Travel</th>
                <th className="py-8 px-8 text-center font-bold text-[14px] tracking-wider uppercase border-b border-[#122b4f]">Family</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pathways.map((pathway, idx) => (
                <tr key={idx} className="hover:bg-[#FDFBF9] transition-colors duration-300 group">
                  <td className="py-8 px-10">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[#E3755D] uppercase tracking-wider mb-2">{pathway.category}</span>
                      <span className="font-bold text-[#1B3A64] text-[18px] mb-2">{pathway.title}</span>
                      <span className="text-[15px] text-[#5A6579] font-medium leading-relaxed">{pathway.description}</span>
                    </div>
                  </td>
                  <td className="py-8 px-8 text-center">
                    <span className="inline-flex items-center bg-white border border-gray-200/60 shadow-sm text-[#1B3A64] font-bold px-5 py-2 rounded-full text-[14px]">
                      {pathway.processing}
                    </span>
                  </td>
                  <td className="py-8 px-8 text-center font-black text-[#1B3A64] text-[18px]">
                    {pathway.cost}
                  </td>
                  <td className="py-8 px-8">
                    {pathway.workAuth ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="py-8 px-8">
                    {pathway.travel ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="py-8 px-8">
                    {pathway.family ? <CheckIcon /> : <XIcon />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center text-[15px] text-[#5A6579] max-w-3xl mx-auto font-medium bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm inline-block">
          <p className="flex items-start justify-center space-x-3">
            <span className="material-icons text-[#E3755D] text-[24px] shrink-0">info</span>
            <span className="leading-relaxed text-left">
              <strong>Note:</strong> Processing times and costs are approximate and may vary based on individual circumstances, USCIS service centers, and current processing backlogs. Always check the official USCIS website for the most up-to-date information.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
