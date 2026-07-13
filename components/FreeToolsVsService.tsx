import React from 'react';

export default function FreeToolsVsService() {
  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 bg-[#FDFBF9] border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
            <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Not Sure Which Path to Choose?</span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">Free Tools vs. Full Service</h2>
          <p className="text-[#5A6579] font-medium text-[19px] leading-relaxed max-w-2xl mx-auto">
            Find the right solution for your immigration needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Free Tools Column */}
          <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] flex flex-col hover:-translate-y-2 transition-transform duration-500">
            <h3 className="text-[32px] font-bold text-[#1B3A64] mb-3">Free Tools</h3>
            <p className="text-[#5A6579] font-medium mb-10 text-[16px]">Best for simple, straightforward cases where you feel comfortable with DIY.</p>

            <div className="space-y-5 mb-10 flex-grow">
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>You're comfortable with DIY</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>Fill forms yourself with guidance</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>Simple form submission</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>AR-11, G-1145, I-94 retrieval</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>No legal complexities</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>Clean immigration history</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5A6579] font-medium text-[16px]">
                <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                <span>Budget-conscious</span>
              </div>
            </div>

            <div className="mb-10">
              <div className="text-[40px] font-black text-[#1B3A64]">$0 <span className="text-[14px] text-[#5A6579] font-bold uppercase tracking-wider ml-1">cost for tools</span></div>
            </div>

            <div className="bg-[#FDFBF9] rounded-[24px] p-8 border border-gray-100 shadow-inner mt-auto">
              <h4 className="font-bold text-[#1B3A64] mb-5 text-[13px] uppercase tracking-wider">What You Get:</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-[15px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                  <span>Pre-filled PDF forms</span>
                </li>
                <li className="flex items-start space-x-3 text-[15px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                  <span>Step-by-step instructions</span>
                </li>
                <li className="flex items-start space-x-3 text-[15px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                  <span>Filing guidance</span>
                </li>
                <li className="flex items-start space-x-3 text-[15px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                  <span>Save and edit anytime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Full Service Column */}
          <div className="bg-gradient-to-br from-[#0A192F] via-[#122846] to-[#1B3A64] rounded-[48px] p-12 shadow-[0_30px_60px_-15px_rgba(27,58,100,0.4)] border border-[#122b4f] flex flex-col hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E3755D]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-[32px] font-bold text-white mb-3">Full Service</h3>
              <p className="text-[#A3B8CC] font-medium mb-10 text-[16px]">Best for complex cases needing expert support and peace of mind.</p>

              <div className="space-y-5 mb-10 flex-grow">
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>You want expert guidance</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Attorney-led case management</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Complex immigration case</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Adjustment, naturalization, waivers</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Legal challenges exist</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Criminal history, denials, appeals</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Peace of mind matters</span>
                </div>
                <div className="flex items-center space-x-4 text-white font-medium text-[16px]">
                  <span className="material-icons text-[#E3755D] text-[20px]">check</span>
                  <span>Professional handling end-to-end</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-[24px] p-8 border border-white/20 shadow-sm mt-auto">
                <h4 className="font-bold text-white mb-5 text-[13px] uppercase tracking-wider">What You Get:</h4>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3 text-[15px] text-white font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span><strong>Everything in Free Tools, plus:</strong></span>
                  </li>
                  <li className="flex items-start space-x-3 text-[15px] text-[#A3B8CC] font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span>Attorney case review</span>
                  </li>
                  <li className="flex items-start space-x-3 text-[15px] text-[#A3B8CC] font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span>Complete document prep</span>
                  </li>
                  <li className="flex items-start space-x-3 text-[15px] text-[#A3B8CC] font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span>Case strategy & planning</span>
                  </li>
                  <li className="flex items-start space-x-3 text-[15px] text-[#A3B8CC] font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span>Ongoing support</span>
                  </li>
                  <li className="flex items-start space-x-3 text-[15px] text-[#A3B8CC] font-medium">
                    <span className="material-icons text-[#00B67A] text-[20px] shrink-0">check_circle</span>
                    <span>Optional add-on services</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
