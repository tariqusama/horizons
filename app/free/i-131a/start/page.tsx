"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function I131APage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
            <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A64] mb-4 leading-tight">I-131A Boarding Foil Eligibility Check</h1>
            <p className="text-[#5A6579] text-lg leading-relaxed">
              Answer a few questions to determine if you're eligible for a boarding foil and get personalized guidance on the next steps.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <span className="material-icons text-blue-600 mr-2">info</span>
              What is a Boarding Foil?
            </h3>
            <p className="text-blue-900 text-sm mb-4 leading-relaxed">
              A boarding foil is a document issued by a U.S. Embassy or Consulate that allows an airline to board you on a flight to the United States if your Green Card has been lost, stolen, or destroyed while traveling abroad.
            </p>
          </div>
        </div>

        {/* Right Column: Quiz */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 p-8 md:p-12">
            
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Progress</div>
                  <h3 className="text-xl font-bold text-[#1B3A64]">Question 1</h3>
                </div>
                <div className="text-sm font-bold text-[#1B3A64]">1 of 3</div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#1B3A64] mb-3">Are you a Lawful Permanent Resident (green card holder)?</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                You must have been granted permanent residence in the U.S. to be eligible for a boarding foil.
              </p>
              
              {/* Quiz Options */}
              <div className="space-y-4">
                <label 
                  className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedOption === 'yes' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOption('yes')}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                    selectedOption === 'yes' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === 'yes' && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
                  </div>
                  <span className={`font-bold ${selectedOption === 'yes' ? 'text-orange-700' : 'text-[#1B3A64]'}`}>Yes</span>
                </label>
                
                <label 
                  className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedOption === 'no' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOption('no')}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                    selectedOption === 'no' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === 'no' && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
                  </div>
                  <span className={`font-bold ${selectedOption === 'no' ? 'text-orange-700' : 'text-[#1B3A64]'}`}>No</span>
                </label>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button type="button" className="text-gray-500 hover:text-[#1B3A64] font-bold px-4 md:px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center">
                <span className="material-icons mr-1 text-[18px]">arrow_back</span>
                Previous
              </button>
              
              <div className="flex space-x-3">
                <button type="button" className="text-orange-500 hover:text-orange-600 font-bold px-4 md:px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center">
                  <span className="material-icons mr-1 text-[18px]">refresh</span>
                  Restart Quiz
                </button>
                <button 
                  type="button" 
                  disabled={!selectedOption}
                  className={`font-bold px-6 py-3 rounded-xl transition-colors shadow-md flex items-center ${
                    selectedOption ? 'bg-[#1B3A64] hover:bg-[#0A192F] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <span className="material-icons ml-1 text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
