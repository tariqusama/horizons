"use client";

import React from 'react';
import Link from 'next/link';

export default function I94Page() {
  return (
    <main className="min-h-screen bg-[#FDFBF9] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Information */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <Link href="/free-tools" className="inline-flex items-center text-[#5A6579] hover:text-[#1B3A64] font-medium mb-6 transition-colors">
              <span className="material-icons text-[18px] mr-2">arrow_back</span>
              Back to Free Tools
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A64] mb-4 leading-tight">I-94 Retrieval Guide</h1>
            <p className="text-[#5A6579] text-lg leading-relaxed">
              Get your entry records and travel history from CBP. Save evidence for future immigration filings.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <span className="material-icons text-blue-600 mr-2">info</span>
              Why Do I Need My I-94?
            </h3>
            <p className="text-blue-900 text-sm mb-4 leading-relaxed">
              Your I-94 is your official arrival/departure record. It is critical evidence for:
            </p>
            <ul className="list-disc pl-5 text-blue-900 text-sm space-y-1">
              <li>Proving lawful entry into the United States</li>
              <li>Applying for a Green Card (Adjustment of Status)</li>
              <li>Renewing or extending your visa</li>
              <li>Applying for a driver's license or Social Security Number</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 p-8 md:p-12">
            
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Step 1 of 4</div>
                  <h3 className="text-xl font-bold text-[#1B3A64]">Traveler Information</h3>
                </div>
                <div className="text-sm font-bold text-[#1B3A64]">25% Complete</div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Enter your details as they appear on your passport
              </p>
            </div>

            <form className="space-y-8">
              
              {/* Form Fields */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">First Name *</label>
                    <input type="text" placeholder="Asha" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Last Name *</label>
                    <input type="text" placeholder="Mensah" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Date of Birth *</label>
                    <input type="text" placeholder="mm/dd/yyyy" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Passport Country *</label>
                    <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all text-[#1B3A64]">
                      <option value="" disabled selected>Select country</option>
                      <option>Ghana</option>
                      <option>Nigeria</option>
                      <option>Kenya</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Passport Number (Optional but Recommended)</label>
                  <input type="text" placeholder="G1234567" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                    <span className="material-icons text-[14px] mr-1 text-gray-400">lightbulb</span>
                    Including your passport number improves search accuracy
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button type="button" className="text-gray-500 hover:text-[#1B3A64] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center">
                  <span className="material-icons mr-1 text-[18px]">arrow_back</span>
                  Previous
                </button>
                <button type="button" className="bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md flex items-center">
                  Continue
                  <span className="material-icons ml-1 text-[18px]">arrow_forward</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
