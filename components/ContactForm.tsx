'use client';
import React from 'react';

export default function ContactForm() {
  return (
    <section className="w-full py-24 px-4 bg-[#FDFBF9]">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B3A64] mb-4">Send Us a Message</h2>
            <p className="text-[#5A6579] font-medium">
              Fill out the form below and one of our immigration experts will get back to you within 24 hours.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="(555) 000-0000"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1B3A64]">Inquiry Type</label>
              <select className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all font-medium">
                <option value="general">General Inquiry</option>
                <option value="family">Family-Based Immigration</option>
                <option value="work">Employment-Based Immigration</option>
                <option value="citizenship">Citizenship & Naturalization</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1B3A64]">Your Message</label>
              <textarea 
                rows={5}
                placeholder="How can we help you?"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-[#1B3A64] outline-none focus:bg-white focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all placeholder:text-gray-400 font-medium resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-[#E3755D] hover:bg-[#C8634D] text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2">
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
