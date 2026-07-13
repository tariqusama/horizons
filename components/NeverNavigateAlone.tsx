import Link from 'next/link';
import React from 'react';

export default function NeverNavigateAlone() {
  return (
    <section className="w-full py-24 px-4 bg-[#FDFBF9]">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-5 py-2 mb-8 border border-blue-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="text-[#1B3A64] text-sm font-bold tracking-wide">Professional Support</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-6">
                Never Navigate Alone
              </h2>
              <p className="text-[#5A6579] font-medium text-lg leading-relaxed">
                From start to finish, you'll have access to experienced case managers who understand immigration law and are dedicated to your success. Get answers to your questions within hours, not days.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-[#FFE8E0] flex items-center justify-center text-[#E3755D] shrink-0 border border-orange-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1B3A64] mb-1">Dedicated Case Manager</h4>
                  <p className="text-[#5A6579] text-sm font-medium">Your personal guide throughout the entire process</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1B3A64] shrink-0 border border-blue-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1B3A64] mb-1">Attorney Review Available</h4>
                  <p className="text-[#5A6579] text-sm font-medium">Optional legal review for maximum confidence</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-[#FFE8E0] flex items-center justify-center text-[#E3755D] shrink-0 border border-orange-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1B3A64] mb-1">24/7 Support Access</h4>
                  <p className="text-[#5A6579] text-sm font-medium">Get help whenever you need it via chat, email, or phone</p>
                </div>
              </div>
            </div>

            <Link href="/contact" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors shadow-lg inline-flex items-center justify-center space-x-2">
              <span>Talk to Our Team</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-[40px] -z-10 blur-xl opacity-70"></div>
            <img
              src="https://placehold.co/1200x800/1B3A64/FFFFFF?text=Support+Team"
              alt="Support team"
              className="w-full rounded-[32px] object-cover h-[500px] shadow-2xl border border-gray-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
