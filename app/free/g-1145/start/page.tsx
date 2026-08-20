"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Gift, 
  Clock, 
  Bell, 
  Shield, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  Download, 
  User,
  Lock,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function G1145Page() {
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    setFormData(formValues);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    try {
      const { PDFDocument } = await import('pdf-lib');

      // 1. Fetch and Load G-1145 PDF
      const pdfBytes = await fetch('/g-1145.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Helper to safely set text fields
      const setTextField = (form: any, name: string, value: string) => {
        try {
          if (value) {
            const field = form.getTextField(name);
            field.setText(value);
          }
        } catch (e) {
          console.error(`Could not set text field ${name}`, e);
        }
      };

      // 2. Fill G-1145 Form Fields
      setTextField(form, 'A2', formData.lastName || "");
      setTextField(form, 'A3', formData.firstName || "");
      setTextField(form, 'A4', formData.middleName || "");
      setTextField(form, 'A5', formData.email || "");
      setTextField(form, 'A6', formData.mobilePhone || "");

      // Flatten to ensure formatted fields like phone number render properly
      form.flatten();

      // 3. Save and Download
      const outPdfBytes = await pdfDoc.save();
      const blob = new Blob([outPdfBytes as any], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'G-1145-Form.pdf';
      link.click();
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("There was an error generating the official PDF. Please try again.");
    }
  };

  return (
    <main className="flex-grow bg-gradient-to-b from-[#FDFBF9] via-[#FDFBF9] to-gray-50/50 font-sans text-[#1B3A64]">
      <div className="max-w-[1000px] mx-auto px-4 py-12">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/free-tools" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#5A6579] hover:text-[#1B3A64] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Free Tools
          </Link>
        </div>

        {step === 'form' && (
          <>
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12 animate-fade-in">
              <div className="flex justify-center">
                <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-semibold px-6 py-2 text-base transition-transform hover:scale-105">
                  <Gift className="w-5 h-5 mr-2 text-orange-500" />
                  Free Immigration Tool
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A64] leading-tight">G-1145 E-Notification Request</h1>
              <p className="text-xl text-[#5A6579] max-w-3xl mx-auto leading-relaxed">
                Get instant text and email alerts when USCIS receives your application. Works with any USCIS form.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6 text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-[#1B3A64] text-xl mb-2">2-3 Minutes</h3>
                <p className="text-[#5A6579]">Ultra-fast form completion</p>
              </div>
              
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6 text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-bold text-[#1B3A64] text-xl mb-2">Instant Alerts</h3>
                <p className="text-[#5A6579]">Get notified immediately when USCIS receives your case</p>
              </div>
              
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6 text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-green-50 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-[#1B3A64] text-xl mb-2">100% Free</h3>
                <p className="text-[#5A6579]">No cost, no hidden fees</p>
              </div>

            </div>

            {/* Why Use G-1145 */}
            <div className="rounded-2xl bg-white border border-green-100 shadow-sm mb-12 overflow-hidden">
              <div className="bg-green-50/50 p-6 border-b border-green-50">
                <h3 className="font-bold flex items-center gap-3 text-2xl text-[#1B3A64]">
                  <div className="p-2 rounded-xl bg-green-100 text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  Why Use G-1145?
                </h3>
              </div>
              <div className="p-6 lg:p-8">
                <p className="mb-6 text-base text-[#5A6579] leading-relaxed">The G-1145 is completely optional, but using it provides significant benefits:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-[#1B3A64] font-medium mt-1">Get your receipt number via text message</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-[#1B3A64] font-medium mt-1">Receive email confirmation immediately</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[#1B3A64] font-medium mt-1">Know your case was received successfully</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[#1B3A64] font-medium mt-1">Avoid waiting weeks for receipt notice</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* What You'll Receive (from screenshot) */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-gray-200 shadow-sm mb-16 overflow-hidden">
              <div className="p-6 lg:p-8 pb-4">
                <h3 className="font-bold flex items-center gap-3 text-2xl text-[#1B3A64]">
                  <div className="p-2 rounded-xl bg-orange-100 text-[#FF5A1F]">
                    <Download className="w-6 h-6" />
                  </div>
                  What You'll Receive
                </h3>
                <p className="text-[#5A6579] text-base mt-2 ml-14">Everything you need to add e-notifications to your USCIS filing</p>
              </div>
              <div className="p-6 lg:p-8 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="p-1.5 rounded-full bg-orange-50 text-[#FF5A1F] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B3A64] text-base mb-1">Pre-filled G-1145 PDF</h4>
                        <p className="text-sm text-[#5A6579] leading-relaxed">Official USCIS form with your contact information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="p-1.5 rounded-full bg-orange-50 text-[#FF5A1F] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B3A64] text-base mb-1">Usage Instructions</h4>
                        <p className="text-sm text-[#5A6579] leading-relaxed">How to attach G-1145 to any USCIS application</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="p-1.5 rounded-full bg-orange-50 text-[#FF5A1F] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B3A64] text-base mb-1">Compatible Forms List</h4>
                        <p className="text-sm text-[#5A6579] leading-relaxed">Which USCIS applications work with G-1145</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="p-1.5 rounded-full bg-orange-50 text-[#FF5A1F] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B3A64] text-base mb-1">Troubleshooting Guide</h4>
                        <p className="text-sm text-[#5A6579] leading-relaxed">What to do if you don't receive notifications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Area */}
            <div className="max-w-[800px] mx-auto space-y-10">
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center rounded-full bg-[#EAF1F8] text-[#1B3A64] px-4 py-1.5 text-xs font-bold tracking-wider mb-2">
                  <Bell className="w-4 h-4 mr-2 text-[#1B3A64]" />
                  Free Immigration Tool
                </div>
                <h1 className="text-3xl font-bold text-[#1B3A64]">G-1145 E-Notification Request</h1>
                <p className="text-lg text-[#5A6579] max-w-2xl mx-auto">
                  Get email and text message updates when USCIS receives your application. Add this to any filing packet.
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                
                {/* Personal Info Box */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1B3A64] flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      Personal Information
                    </h3>
                    <p className="text-sm text-[#5A6579] mt-2 ml-8">Enter your full legal name as it appears on your immigration documents.</p>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-2" htmlFor="lastName">Applicant/Petitioner Full Last Name *</label>
                        <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] transition-all" placeholder="Lopez" name="lastName" id="lastName" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-2" htmlFor="firstName">Applicant/Petitioner Full First Name *</label>
                        <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] transition-all" placeholder="Maria" name="firstName" id="firstName" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-2" htmlFor="middleName">Applicant/Petitioner Full Middle Name</label>
                        <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] transition-all" placeholder="Carmen" name="middleName" id="middleName" />
                        <p className="text-xs text-[#5A6579] mt-2">Leave blank if you don't have a middle name</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notification Preferences Box */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1B3A64] flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-[#5A6579] mt-2 ml-8">USCIS will send updates to both your email and phone number when they receive your application.</p>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-2" htmlFor="email">Email Address *</label>
                        <input type="email" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] transition-all" placeholder="maria@example.com" name="email" id="email" required />
                        <p className="text-xs text-[#5A6579] mt-2">You'll receive email notifications here</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-2" htmlFor="mobilePhone">Mobile Phone Number (Text Message)</label>
                        <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] transition-all" placeholder="(555) 123-4567" name="mobilePhone" id="mobilePhone" />
                        <p className="text-xs text-[#5A6579] mt-2">Domestic customers only. Overseas customers receive email only.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* How G-1145 Works Box */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm overflow-hidden">
                  <div className="p-6 lg:p-8 pb-4">
                    <h3 className="text-xl font-bold text-blue-800 flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      How G-1145 Works
                    </h3>
                  </div>
                  <div className="p-6 lg:p-8 pt-0">
                    <p className="text-blue-700 text-sm mb-4">The G-1145 form is completely optional but highly recommended. When you include it with any USCIS application:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-sm mt-0.5">1.</span>
                        <span className="text-blue-700 text-sm">Place the completed G-1145 on top of your application packet</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-sm mt-0.5">2.</span>
                        <span className="text-blue-700 text-sm">USCIS will send you a text and email when they receive your packet</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-sm mt-0.5">3.</span>
                        <span className="text-blue-700 text-sm">You'll get your receipt number immediately via notification</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button className="w-full bg-[#FF5A1F] hover:bg-[#E04512] text-white font-bold h-14 rounded-xl text-lg shadow-md transition-colors" type="submit">
                    Continue to Review
                  </button>
                </div>
              </form>

              {/* Footer Icons */}
              <div className="mt-16 text-center space-y-8 border-t border-gray-200 pt-10">
                <div className="flex flex-wrap justify-center gap-10">
                  <div className="flex items-center gap-2 text-sm text-[#5A6579] font-medium">
                    <Lock className="w-5 h-5 text-gray-400" />
                    SSL Encrypted
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5A6579] font-medium">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    USCIS Compliant
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5A6579] font-medium">
                    <Bell className="w-5 h-5 text-gray-400" />
                    Universal Compatibility
                  </div>
                </div>
                <p className="text-sm text-[#5A6579] max-w-2xl mx-auto leading-relaxed">
                  This free tool is provided by Horizon Pathways. G-1145 works with any USCIS application including green card, citizenship, work permits, and family petitions.
                </p>
              </div>

            </div>
          </>
        )}

        {step === 'review' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#1B3A64] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit Form
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-[#1B3A64]">Review Your Information</h2>
              <p className="text-lg text-[#5A6579] max-w-2xl mx-auto">
                Please double-check your details before generating your G-1145 PDF.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1B3A64]">Personal Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><span className="text-sm text-gray-500 block">Full Last Name</span><span className="font-medium text-[#1B3A64]">{formData.lastName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Full First Name</span><span className="font-medium text-[#1B3A64]">{formData.firstName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Full Middle Name</span><span className="font-medium text-[#1B3A64]">{formData.middleName || '-'}</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1B3A64]">Notification Preferences</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="text-sm text-gray-500 block">Email Address</span><span className="font-medium text-[#1B3A64]">{formData.email || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Mobile Phone Number (Text Message)</span><span className="font-medium text-[#1B3A64]">{formData.mobilePhone || '-'}</span></div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center rounded-xl bg-[#FF5A1F] text-white h-14 px-10 text-lg font-bold hover:bg-[#E04512] transition-colors shadow-md"
              >
                <Download className="w-5 h-5 mr-3" />
                Download PDF
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
