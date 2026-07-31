"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle,
  ChevronLeft
} from 'lucide-react';

export default function I912Page() {
  const [pathA, setPathA] = useState(true);
  const [pathB, setPathB] = useState(true);
  const [pathC, setPathC] = useState(true);
  
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);

  const benefits = [
    "Medicaid",
    "SNAP (Food Stamps)",
    "SSI (Supplemental Security Income)",
    "TANF (Temporary Assistance for Needy Families)",
    "State General Assistance",
    "WIC (Women, Infants, and Children)",
    "LIHEAP (Low Income Home Energy Assistance)",
    "Section 8 Housing Assistance",
    "Other"
  ];

  return (
    <main className="min-h-screen bg-[#FDFBF9] py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2A3441] mb-4">I-912 Fee Waiver Request</h1>
        <p className="text-[#6B7280] text-lg">
          Complete your eligibility assessment and generate your I-912 form instantly.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12">
        
        {/* Top Progress Nav */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6 overflow-x-auto pb-4 md:pb-0">
            {/* Step 1 */}
            <div className="flex items-center space-x-3 shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">Step 1</p>
                <p className="text-[#2A3441] text-sm font-semibold">Eligibility</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-3 shrink-0 mr-4 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Step 2</p>
                <p className="text-gray-500 text-sm font-semibold">Applicant & Household</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center space-x-3 shrink-0 mr-4 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Step 3</p>
                <p className="text-gray-500 text-sm font-semibold">Income & Attachments</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center space-x-3 shrink-0 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Step 4</p>
                <p className="text-gray-500 text-sm font-semibold">Review & Generate</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E5E7EB] rounded-full h-2.5">
            <div className="bg-[#FF5A1F] h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Content Box */}
        <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2A3441] flex items-center mb-2">
              <CheckCircle className="w-6 h-6 text-[#6B7280] mr-2" />
              Eligibility Pathways
            </h2>
            <p className="text-[#6B7280] text-sm pl-8">
              Choose any pathway that applies to you. You only need to qualify through one.
            </p>
          </div>

          <div className="space-y-8 pl-2">
            
            {/* Path A */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer mb-5">
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${pathA ? 'bg-[#FF5A1F] border-[#FF5A1F]' : 'border-gray-300'}`}
                  onClick={() => setPathA(!pathA)}
                >
                  {pathA && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-semibold text-[#2A3441]">Path A: I receive means-tested benefits</span>
              </label>

              {pathA && (
                <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {benefits.map((benefit, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                      <div 
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedBenefit === benefit ? 'border-[#FF5A1F]' : 'border-orange-500 group-hover:border-[#FF5A1F]'}`}
                        onClick={() => setSelectedBenefit(benefit)}
                      >
                        {selectedBenefit === benefit && <div className="w-2 h-2 rounded-full bg-[#FF5A1F]"></div>}
                        {selectedBenefit !== benefit && <div className="w-4 h-4 rounded-full bg-white border-2 border-orange-500"></div>}
                      </div>
                      <span className="text-sm text-[#4B5563] group-hover:text-[#2A3441]">{benefit}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Path B */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer mb-5">
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${pathB ? 'bg-[#FF5A1F] border-[#FF5A1F]' : 'border-gray-300'}`}
                  onClick={() => setPathB(!pathB)}
                >
                  {pathB && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-semibold text-[#2A3441]">Path B: My household income is ≤ 150% of Federal Poverty Guidelines</span>
              </label>

              {pathB && (
                <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Household Size</label>
                    <input type="number" placeholder="1" className="w-full h-10 bg-[#F9FAFB] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">State</label>
                    <select className="w-full h-10 bg-[#F9FAFB] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-gray-500">
                      <option value="" disabled selected>Select state</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Annual AGI (from tax return)</label>
                    <input type="text" className="w-full h-10 bg-[#F9FAFB] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">OR Monthly Gross Income</label>
                    <input type="text" className="w-full h-10 bg-[#F9FAFB] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all" />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Path C */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer mb-5">
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${pathC ? 'bg-[#FF5A1F] border-[#FF5A1F]' : 'border-gray-300'}`}
                  onClick={() => setPathC(!pathC)}
                >
                  {pathC && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-semibold text-[#2A3441]">Path C: I have an extraordinary expense or financial hardship</span>
              </label>

              {pathC && (
                <div className="pl-8 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Describe your financial hardship</label>
                    <textarea rows={3} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Monthly Expenses</label>
                    <input type="text" className="w-full h-10 bg-[#F9FAFB] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all" />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/free-tools" className="inline-flex items-center px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#6B7280] hover:bg-gray-50 transition-colors">
            Back
          </Link>
          <button className="px-8 py-2.5 bg-[#FF9A76] text-white rounded-lg text-sm font-bold shadow-sm opacity-90 hover:opacity-100 transition-opacity">
            Next
          </button>
        </div>

      </div>
    </main>
  );
}
