"use client";

import React, { useState } from 'react';
import {
  Gift, Clock, Shield, CircleAlert, FileText,
  CircleCheckBig, ArrowRight, Lock, BadgeCheck, Scale, ArrowLeft, Download, PenLine
} from 'lucide-react';
import jsPDF from 'jspdf';

const inputClass =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export default function G1145Page() {
  const [agreed, setAgreed] = useState(false);
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
      setTextField(form, 'A2', formData.familyName || "");
      setTextField(form, 'A3', formData.givenName || "");
      setTextField(form, 'A4', formData.middleName || "");
      setTextField(form, 'A5', formData.email || "");
      setTextField(form, 'A6', formData.phone || "");

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
    <main className="flex-grow bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">

        {step === 'form' && (
          <>
            {/* ── Hero ── */}
            <div className="text-center space-y-6 mb-12 animate-fade-in">
              <div className="flex justify-center">
                <div className="inline-flex items-center rounded-full border font-semibold bg-secondary text-secondary-foreground mb-4 px-6 py-2 text-base bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5 mr-2 text-blue-500" />
                  Free Immigration Tool
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                G-1145 e-Notification
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Request an electronic notification (text/email) when USCIS accepts your immigration application.
              </p>
            </div>

            {/* ── Feature cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  Icon: Clock, title: "1-2 Minutes",
                  desc: "Quick and easy form completion",
                  gradient: "from-blue-500/10 via-background to-cyan-500/10",
                  iconGradient: "from-blue-500/20 to-cyan-500/20",
                  hoverOverlay: "from-blue-500/20 to-cyan-500/20",
                  textColor: "text-blue-500", delay: 0,
                },
                {
                  Icon: Download, title: "Instant PDF",
                  desc: "Get your filled G-1145 immediately",
                  gradient: "from-indigo-500/10 via-background to-purple-500/10",
                  iconGradient: "from-indigo-500/20 to-purple-500/20",
                  hoverOverlay: "from-indigo-500/20 to-purple-500/20",
                  textColor: "text-indigo-500", delay: 100,
                },
                {
                  Icon: Shield, title: "100% Free",
                  desc: "No hidden fees or charges",
                  gradient: "from-green-500/10 via-background to-emerald-500/10",
                  iconGradient: "from-green-500/20 to-emerald-500/20",
                  hoverOverlay: "from-green-500/20 to-emerald-500/20",
                  textColor: "text-green-500", delay: 200,
                },
              ].map(({ Icon, title, desc, gradient, iconGradient, hoverOverlay, textColor, delay }) => (
                <div
                  key={title}
                  className={`rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br ${gradient} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${hoverOverlay} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
                  <div className="flex flex-col space-y-1.5 p-6 relative text-center pb-4">
                    <div className={`mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${iconGradient} backdrop-blur-sm flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${textColor}`} />
                    </div>
                    <h3 className="font-semibold tracking-tight text-2xl">{title}</h3>
                  </div>
                  <div className="p-6 pt-0 relative text-center">
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── What You'll Receive ── */}
            <div className="rounded-lg bg-card text-card-foreground mb-12 border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  What You&apos;ll Receive
                </h3>
                <p className="text-muted-foreground text-base mt-2">Everything you need to complete your e-Notification request</p>
              </div>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    ["Pre-filled G-1145 PDF", "Official USCIS form with your information already filled in"],
                    ["Instant Notifications", "Ensure you get SMS and email alerts from USCIS"],
                    ["Filing Instructions", "Clip it to the front of your application package"],
                    ["Peace of Mind", "Know exactly when your case is accepted"],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-background to-muted/30 hover:shadow-md transition-all duration-200">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <CircleCheckBig className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── What to Expect ── */}
            <div className="rounded-lg bg-card text-card-foreground mb-12 relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex flex-col space-y-1.5 p-6 relative">
                <h3 className="font-semibold tracking-tight flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  What to Expect
                </h3>
              </div>
              <div className="p-6 pt-0 relative">
                <div className="space-y-6">
                  {[
                    ["Fill in your contact info", "Provide your name, email, and mobile number"],
                    ["Review your information", "Double-check to ensure no typos in your contact info"],
                    ["Download your PDF", "Attach the downloaded form to the front of your USCIS application package"],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-r from-background to-muted/40 hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg">
                        {i + 1}
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">{title}</p>
                        <p className="text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── The Form ── */}
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Free Immigration Tool
                </div>
                <h2 className="text-3xl font-bold">G-1145 Form Generator</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Complete this form to generate your official G-1145 PDF for USCIS e-Notifications.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {/* ── Applicant Information ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <div>
                      <h3 className="text-base font-bold text-[#1B3A64]">Applicant Information</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Provide the contact details for the person filing the application.</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    {/* Family Name | Given Name | Middle Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Family Name (Last Name) *</label>
                        <input name="familyName" className={inputClass} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Given Name (First Name) *</label>
                        <input name="givenName" className={inputClass} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Middle Name</label>
                        <input name="middleName" className={inputClass} />
                      </div>
                    </div>
                    
                    {/* Email | Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input type="email" name="email" className={inputClass} placeholder="example@email.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Mobile Telephone Number</label>
                        <input type="tel" name="phone" className={inputClass} placeholder="(555) 555-5555" />
                        <p className="text-xs text-gray-400 mt-1">Include area code. At least one contact method (email or phone) is recommended.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Signature & Attestation ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <h3 className="text-base font-bold text-[#1B3A64]">Attestation</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                         type="checkbox"
                         checked={agreed}
                         onChange={(e) => setAgreed(e.target.checked)}
                         className="mt-1 w-4 h-4 accent-[#1B3A64] rounded border-gray-300"
                         required
                      />
                      <div>
                        <span className="block font-semibold text-sm text-[#1B3A64] mb-1">I have verified my contact information *</span>
                        <span className="block text-xs text-gray-500 leading-relaxed">
                          By checking this box, you confirm the email and mobile number are accurate so USCIS can successfully notify you.
                        </span>
                      </div>
                    </label>

                    <button
                      type="submit"
                      disabled={!agreed}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 px-6 text-base font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                    >
                      Continue to Review
                    </button>

                    <p className="text-xs text-center text-gray-400 leading-relaxed">
                      By submitting this form, you agree to our{' '}
                      <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                      <span className="underline cursor-pointer">Privacy Policy</span>. We protect your personal information and only use it to process your G-1145 form.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-6 pt-5 border-t border-gray-100">
                      {[
                        [Lock, "text-green-600", "SSL Encrypted"],
                        [BadgeCheck, "text-blue-600", "USCIS Compliant"],
                        [Scale, "text-purple-600", "Attorney Reviewed"],
                      ].map(([Icon, color, label]) => (
                        <div key={label as string} className="flex items-center text-gray-500 text-sm font-medium gap-1.5">
                          {React.createElement(Icon as React.ElementType, { className: `w-4 h-4 ${color}` })}
                          {label as string}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </>
        )}

        {/* ── Review Step ── */}
        {step === 'review' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit Form
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Review Your Information</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Please double-check your details before generating your G-1145 PDF.
              </p>
            </div>

            {/* Review: Applicant Information */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1B3A64]">Applicant Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div><span className="text-sm text-gray-500 block">Family Name (Last)</span><span className="font-medium">{formData.familyName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Given Name (First)</span><span className="font-medium">{formData.givenName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Middle Name</span><span className="font-medium">{formData.middleName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Email Address</span><span className="font-medium">{formData.email || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Mobile Number</span><span className="font-medium">{formData.phone || '-'}</span></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white text-gray-700 h-12 px-8 text-base font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                <PenLine className="w-4 h-4 mr-2" />
                Edit Form
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 px-10 text-base font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
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
