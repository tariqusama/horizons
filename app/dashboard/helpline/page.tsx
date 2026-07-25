"use client";
import React, { useState } from "react";
import api from "@/lib/api";

export default function DashboardHelplinePage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/support/tickets", { subject, message });
      setSuccessMsg(res.data.message || "Message sent successfully!");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
      <div className="space-y-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 className="text-[20px] font-bold text-[#1B3A64] leading-none tracking-tight">Contact Us</h3>
                <p className="text-[14px] text-[#5A6579] mt-1">Multiple ways to reach our team</p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                
                <div className="flex items-center space-x-4 p-4 bg-[#FFF5F0] rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FA6514]">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1B3A64]">Phone</p>
                    <p className="text-[13px] text-[#5A6579]">(800) 795-7153</p>
                    <p className="text-[11px] text-[#8A8F98]">Toll-Free</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-[#F0F5FF] rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1B3A64]">Email</p>
                    <p className="text-[13px] text-[#5A6579]">support@horizonpathways.us</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-[#F0FDF4] rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#22C55E]">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1B3A64]">WhatsApp</p>
                    <p className="text-[13px] text-[#5A6579]">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-[#FFF7ED] rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F97316]">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1B3A64]">Business Hours</p>
                    <p className="text-[13px] text-[#5A6579]">Mon–Fri | 9:00 AM – 5:00 PM (EST)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[#FAF5FF] rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A855F7]">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1B3A64]">Office Address</p>
                    <p className="text-[13px] text-[#5A6579] leading-relaxed">
                      Horizon Pathways LLC<br />7375 Executive Pl, Ste 400 #1062<br />Lanham, MD 20706
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="text-2xl font-bold text-[#1B3A64] leading-none tracking-tight">Send us a Message</h3>
              <p className="text-base text-[#5A6579] mt-1">We'll get back to you within 24 hours</p>
            </div>
            <div className="p-6 pt-0">
              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-base">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-base">
                  {errorMsg}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[15px] font-bold text-[#1B3A64]" htmlFor="subject">Subject</label>
                  <input 
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-base text-[#1B3A64] placeholder:text-gray-400 focus:outline-none focus:border-[#FA6514] focus:ring-1 focus:ring-[#FA6514] transition-all" 
                    id="subject" 
                    placeholder="How can we help you?" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[15px] font-bold text-[#1B3A64]" htmlFor="message">Message</label>
                  <textarea 
                    className="flex min-h-[140px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-base text-[#1B3A64] placeholder:text-gray-400 focus:outline-none focus:border-[#FA6514] focus:ring-1 focus:ring-[#FA6514] transition-all resize-none" 
                    id="message" 
                    placeholder="Describe your issue or question..." 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center font-bold rounded-xl text-base h-12 px-6 bg-[#FA6514] hover:bg-[#E85B12] text-white gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm mt-6">
          <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-[#1B3A64] leading-none tracking-tight">Frequently Asked Questions</h3>
            <p className="text-base text-[#5A6579] mt-1">Quick answers to common questions</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-lg font-bold text-[#1B3A64] mb-1">How long does the application process take?</h4>
              <p className="text-base text-[#5A6579]">Processing times vary by application type, typically 3-6 months.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1B3A64] mb-1">Can I track my application status?</h4>
              <p className="text-base text-[#5A6579]">Yes, check the "My Applications" section for real-time updates.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1B3A64] mb-1">What documents do I need?</h4>
              <p className="text-base text-[#5A6579]">Each application has specific requirements listed in the application details.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
