"use client";

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  FileStack, 
  Mail, 
  Bell, 
  CheckCircle 
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function G1145ReviewPage() {
  const params = useParams();
  
  return (
    <main className="min-h-screen bg-[#FDFBF9] py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Header Success Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A64] mb-4">Your G-1145 is Ready!</h1>
          <p className="text-[#5A6579] text-lg">
            Your e-notification request form has been completed and is ready for download.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Left Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* Form Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#1B3A64] mb-2">Form Summary</h2>
              <p className="text-[#5A6579] text-sm mb-6 pb-6 border-b border-gray-100">
                Review your G-1145 details before downloading
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                  <p className="font-semibold text-[#1B3A64]">Shehryar dfdvcv Shafique</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-semibold text-[#1B3A64]">zufjuquh@mailinator.com</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-semibold text-[#1B3A64]">34345534655</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submission Date</p>
                  <p className="font-semibold text-[#1B3A64]">7/30/2026</p>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-8 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:pr-6">
                <h2 className="text-2xl font-bold text-[#1B3A64] mb-2">Download Your Form</h2>
                <p className="text-orange-900 text-sm">
                  Download your filled G-1145 form to include with your USCIS application
                </p>
              </div>
              <button className="w-full md:w-auto shrink-0 bg-[#FF5A1F] hover:bg-[#E04512] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download G-1145 Form
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#1B3A64] mb-2">How to Use Your G-1145 Form</h2>
              <p className="text-[#5A6579] text-sm mb-8">
                Follow these steps to ensure you receive notifications about your USCIS application
              </p>

              <div className="space-y-8">
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#EAF1F8] text-[#1B3A64] flex items-center justify-center shrink-0 mr-5">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A64] text-lg mb-1">1. Print the Form</h3>
                    <p className="text-[#5A6579] text-sm">Print your completed G-1145 form on white paper</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#EAF1F8] text-[#1B3A64] flex items-center justify-center shrink-0 mr-5">
                    <FileStack className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A64] text-lg mb-1">2. Place on Top</h3>
                    <p className="text-[#5A6579] text-sm">Put the G-1145 form on top of your USCIS application packet</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#EAF1F8] text-[#1B3A64] flex items-center justify-center shrink-0 mr-5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A64] text-lg mb-1">3. Mail Together</h3>
                    <p className="text-[#5A6579] text-sm">Send everything to USCIS in the same envelope</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#EAF1F8] text-[#1B3A64] flex items-center justify-center shrink-0 mr-5">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A64] text-lg mb-1">4. Receive Notifications</h3>
                    <p className="text-[#5A6579] text-sm">Get text and email alerts when USCIS receives your application</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Upsell Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-[#1B3A64] rounded-2xl p-8 text-white sticky top-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                You've generated your G-1145 notification form. Planning to file a full immigration application?
              </p>
              
              <div className="bg-[#132A4A] rounded-xl p-5 mb-8">
                <p className="font-bold text-sm mb-4 text-orange-400">Consider Our Full-Service Packages:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-xs text-blue-50 leading-relaxed">Attorney review of all forms before submission</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-xs text-blue-50 leading-relaxed">Complete document preparation and organization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-xs text-blue-50 leading-relaxed">Ongoing case management and support</span>
                  </li>
                </ul>
              </div>

              <Link href="/services" className="block w-full bg-white text-[#1B3A64] hover:bg-gray-100 text-center font-bold py-3 rounded-xl transition-colors mb-4">
                View Full Services
              </Link>
              
              <Link href="/free-tools" className="block w-full text-center text-blue-200 hover:text-white text-sm font-medium transition-colors">
                More Free Tools →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
