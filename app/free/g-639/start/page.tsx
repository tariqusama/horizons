"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function G639Page() {
  const [requestType, setRequestType] = useState<'my' | 'other' | null>('my');

  return (
    <main className="min-h-screen bg-[#FDFBF9] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Information */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <Link href="/free-tools" className="inline-flex items-center text-[#5A6579] hover:text-[#1B3A64] font-medium mb-6 transition-colors">
              <span className="material-icons text-[18px] mr-2">arrow_back</span>
              Back to Free Tools
            </Link>
            <h1 className="text-4xl font-bold text-[#1B3A64] mb-4 leading-tight">Generate Your FOIA G-639 Request</h1>
            <p className="text-[#5A6579] text-lg leading-relaxed">
              Complete the form below to generate your personalized G-639 FOIA request. We'll create a ready-to-submit PDF with filing instructions.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-[#EAF1F8] p-3 rounded-full shrink-0">
                <span className="material-icons text-[#1B3A64]">timer</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1B3A64]">10-15 Minutes</h4>
                <p className="text-[#5A6579] text-sm">Simple form completion</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-[#EAF1F8] p-3 rounded-full shrink-0">
                <span className="material-icons text-[#1B3A64]">picture_as_pdf</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1B3A64]">Instant PDF</h4>
                <p className="text-[#5A6579] text-sm">Ready-to-submit form</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-[#E2F7F1] p-3 rounded-full shrink-0">
                <span className="material-icons text-[#00B67A]">money_off</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1B3A64]">100% Free</h4>
                <p className="text-[#5A6579] text-sm">No hidden charges</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hidden lg:block">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Progress: 1 of 4</div>
            <ul className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              <li className="relative flex items-center">
                <div className="h-5 w-5 rounded-full bg-orange-500 border-4 border-orange-100 flex items-center justify-center relative z-10 shrink-0"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-[#1B3A64] text-sm">Who's Requesting?</h4>
                </div>
              </li>
              <li className="relative flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center relative z-10 shrink-0"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-400 text-sm">Subject of Record</h4>
                </div>
              </li>
              <li className="relative flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center relative z-10 shrink-0"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-400 text-sm">Scope & Delivery</h4>
                </div>
              </li>
              <li className="relative flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center relative z-10 shrink-0"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-400 text-sm">Consent & Attachments</h4>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 p-8 md:p-10">
            
            <div className="mb-8 border-b border-gray-100 pb-6">
              <div className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">Step 1</div>
              <h2 className="text-2xl font-bold text-[#1B3A64] mb-2">Who's Requesting?</h2>
              <p className="text-[#5A6579]">Tell us about the person making this request</p>
            </div>

            <form className="space-y-8">
              
              <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button 
                  type="button" 
                  onClick={() => setRequestType('my')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${requestType === 'my' ? 'bg-white text-[#1B3A64] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  My Records
                </button>
                <button 
                  type="button"
                  onClick={() => setRequestType('other')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${requestType === 'other' ? 'bg-white text-[#1B3A64] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Someone Else's Records
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">First Name *</label>
                  <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Last Name *</label>
                  <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Email Address *</label>
                  <input type="email" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Phone Number</label>
                  <input type="tel" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1B3A64] border-b border-gray-100 pb-2 mb-4">Mailing Address</h3>
                
                <div className="mb-5">
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Street Address *</label>
                  <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">City *</label>
                    <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">State/Province *</label>
                    <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">ZIP/Postal Code *</label>
                    <input type="text" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                <button type="button" className="text-gray-500 hover:text-[#1B3A64] font-bold px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center">
                  <span className="material-icons mr-1 text-[18px]">arrow_back</span>
                  Previous
                </button>
                <button type="button" className="bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md flex items-center">
                  Next
                  <span className="material-icons ml-1 text-[18px]">arrow_forward</span>
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                By using this service, you agree to our Terms of Service and Privacy Policy. Your information is secure and only used to generate your FOIA request form.
              </p>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
