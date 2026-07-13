import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#102A54] text-white pt-20 pb-8 px-6 w-full font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Section: Logo & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Brand & Socials */}
          <div className="w-full lg:w-[450px]">
            {/* Logo Container */}
            <div className="bg-white rounded-2xl p-4 inline-flex mb-6 shadow-lg">
               <Image
                 src="/horizonlogo footer.png"
                 alt="Horizon Pathways"
                 width={240}
                 height={60}
                 className="h-10 w-auto"
               />
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed pr-8">
              Your trusted partner in navigating the complex world of U.S. immigration. We provide comprehensive legal services to help you achieve your American dream.
            </p>
            <div className="flex gap-3">
              {/* Social icons */}
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E3755D] hover:border-[#E3755D] transition-all text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E3755D] hover:border-[#E3755D] transition-all text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E3755D] hover:border-[#E3755D] transition-all text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E3755D] hover:border-[#E3755D] transition-all text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="w-full lg:w-[500px] bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3l1.9 5.8 1.9-5.8a2 2 0 0 1 1.3-1.3l5.8-1.9-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg>
               Stay Updated
            </h3>
            <p className="text-gray-300 text-sm mb-6">
               Get the latest immigration news and updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
               <input 
                 className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3755D] text-white placeholder-gray-400 transition-colors"
                 placeholder="Enter your email"
               />
               <button className="bg-[#E3755D] hover:bg-[#C8634D] text-white font-bold py-3 px-6 rounded-xl flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5">
                 Subscribe 
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
               </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-12"></div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center text-white">
               Quick Links <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
            </h4>
            <ul className="space-y-4">
              <li><Link href="/" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Home</Link></li>
              <li><Link href="/how-it-works" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> How It Works</Link></li>
              <li><Link href="/about" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> About Us</Link></li>
              <li><Link href="/success-stories" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Success Stories</Link></li>
              <li><Link href="/contact" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center text-white">
               Services <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
            </h4>
            <ul className="space-y-4">
              <li><Link href="/services" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> All Services</Link></li>
              <li><Link href="/free-tools" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Free Tools</Link></li>
              <li><Link href="/faq" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> FAQ</Link></li>
              <li><Link href="/signup" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Get Started</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center text-white">
               Legal <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
            </h4>
            <ul className="space-y-4">
              <li><Link href="/terms" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><polyline points="9 18 15 12 9 6"></polyline></svg> Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center text-white">
               Contact <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 mt-0.5 text-gray-400">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 </div>
                 <div className="leading-tight mt-1.5">7375 Executive Pl, Ste 400 #1062<br />Lanham, MD 20706</div>
              </li>
              <li className="flex items-center text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 text-gray-400">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                 </div>
                 <a href="mailto:support@horizonpathways.us" className="hover:text-white transition-colors">support@horizonpathways.us</a>
              </li>
              <li className="flex items-center text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 text-gray-400">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                 </div>
                 <a href="tel:+18007957153" className="hover:text-white transition-colors">+1 (800) 795 7153</a>
              </li>
              <li className="flex items-center text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 text-gray-400">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 </div>
                 <span>Mon–Fri | 9:00 AM – 5:00 PM (EST)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
           <p>© 2026 Horizon Pathways LLC. All rights reserved.</p>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              Powered by Innovation
           </div>
        </div>
      </div>
    </footer>
  );
}
