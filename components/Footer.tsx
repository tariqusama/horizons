'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api, { initCsrf } from '@/lib/api';

const socialLinks = [
  {
    key: 'facebook',
    href: 'https://facebook.com/Horizonpway',
    label: 'Facebook',
    icon: (
      <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5H17V2.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V10.8H7v3.2h2.8v8h3.7z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/horizonpathways.us?igsh=Z3NxNTA5bWFncDFy&utm_source=qr',
    label: 'Instagram',
    icon: (
      <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
      </svg>
    ),
  },
  {
    key: 'tiktok',
    href: 'https://www.tiktok.com/@horizon_pathways?_t=ZP-90Hu7Xrttrq&_r=1',
    label: 'TikTok',
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.2 3.1c.9 1.5 2.2 2.6 3.9 3.1v2.1c-1.1 0-2.1-.2-3.1-.6v6.4c0 2.8-2.3 5.1-5.1 5.1S5 16.9 5 14.1S7.3 9 10.1 9c.4 0 .7 0 1 .1v2.1c-.3-.1-.6-.1-1-.1-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3.1h2.1z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@HorizonPathways',
    label: 'YouTube',
    icon: (
      <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.8 8s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.2-.9C15.9 4.5 12 4.5 12 4.5h0s-3.9 0-6.8.3c-.6 0-1.4.1-2.2.9C2.2 6.4 2 8 2 8s-.2 1.8-.2 3.6v1.6c0 1.8.2 3.6.2 3.6s.2 1.6.8 2.3c.8.8 1.8.8 2.2.9 2.9.3 6.8.3 6.8.3s3.9 0 6.8-.3c.6 0 1.4-.1 2.2-.9.6-.7.8-2.3.8-2.3s.2-1.8.2-3.6v-1.6c0-1.8-.2-3.6-.2-3.6zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
];

const contactIcons = {
  address: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3623D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3623D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3623D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
};

export default function Footer() {
  const pathname = usePathname?.() || '';
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewsletterMessage('');
    setNewsletterError('');

    try {
      await initCsrf();
      await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterMessage('Successfully subscribed!');
      setNewsletterEmail('');
    } catch (error: any) {
      setNewsletterError(
        error.response?.data?.message || 'Unable to subscribe right now, please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#09182F] text-white pt-16 pb-8 w-full font-sans border-t border-[#122642]">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-4 py-3 shadow-sm border border-white/70">
              <Image
                src="/horizonlogo.png"
                alt="Horizon Pathways"
                width={180}
                height={45}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-[#9AB0CF] text-[15px] leading-[1.7] max-w-[280px] font-medium">
              We are professional document preparers dedicated to helping you achieve your American dream through expert guidance and modern technology.
            </p>

            <div className="max-w-[280px]">
              <form className="flex gap-2 mb-2" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-[#1A2D4C] border border-[#253F69] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#E3623D] text-white placeholder-[#627C9E] transition-colors"
                  placeholder="Email address"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#E3623D] hover:bg-[#C85433] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  {isSubmitting ? '...' : 'Subscribe'}
                </button>
              </form>
              {newsletterMessage ? (
                <p className="text-[13px] text-green-400">{newsletterMessage}</p>
              ) : null}
              {newsletterError ? (
                <p className="text-[13px] text-red-400">{newsletterError}</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-[#1A2D4C] flex items-center justify-center hover:bg-[#E3623D] transition-colors text-white shadow-sm"
                >
                  <span className="inline-flex items-center justify-center">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-white">Quick Links</h4>
            <ul className="flex flex-col gap-5">
              <li><Link href="/" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">About Us</Link></li>
              <li><Link href="/resources" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Resources</Link></li>
              <li><Link href="/contact" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Contact</Link></li>
             </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-white">Services</h4>
            <ul className="flex flex-col gap-5">
              <li><Link href="/services" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">All Services</Link></li>
              <li><Link href="/free-tools" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Free Tools</Link></li>
              <li><Link href="/faq" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">FAQ</Link></li>
              <li><Link href="/signup" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-white">Legal</h4>
            <ul className="flex flex-col gap-5">
              <li><Link href="/terms" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-white">Contact Us</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">{contactIcons.address}</div>
                <div className="text-[#9AB0CF] text-[15px] font-medium leading-[1.6] hover:text-[#E3623D] transition-colors">
                  7170 Executive Pl, Ste 410<br />
                  #1362<br />
                  Lanham, MD 20706
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="shrink-0">{contactIcons.email}</div>
                <a href="mailto:support@horizonpathways.us" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">
                  support@horizonpathways.us
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="shrink-0">{contactIcons.phone}</div>
                <a href="tel:+18007957153" className="text-[#9AB0CF] text-[15px] font-medium hover:text-[#E3623D] transition-colors">
                  +1 (800) 795-7153
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#1A2D4C] mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[14px] text-[#627C9E] font-medium gap-4">
          <p className="text-[#9AB0CF]">© {new Date().getFullYear()} Horizon Pathways. Professional Immigration Experts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}