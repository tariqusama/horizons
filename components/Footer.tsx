import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api, { initCsrf } from '@/lib/api';
import {
  footerBrand,
  footerNewsletter,
  footerSections,
  footerContactItems,
  footerBottom,
  FooterContactItem,
  FooterSocialLink,
} from './footerData';

const socialIcons: Record<string, ReactNode> = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  ),
};

const contactIcons: Record<FooterContactItem['type'], ReactNode> = {
  address: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  hours: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
};

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setNewsletterMessage('');
    setNewsletterError('');
    setIsSubmitting(true);

    try {
      await initCsrf();
      const response = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterMessage(response.data.message || 'Thanks for subscribing!');
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
    <footer className="bg-[#102A54] text-white pt-12 sm:pt-16 lg:pt-20 pb-8 px-4 sm:px-6 w-full font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          <div className="w-full lg:w-[450px]">
            <div className="bg-white rounded-2xl p-4 inline-flex mb-6 shadow-lg">
              <Image
                src={footerBrand.logoSrc}
                alt={footerBrand.logoAlt}
                width={240}
                height={60}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed sm:pr-8">
              {footerBrand.description}
            </p>
            <div className="flex gap-3">
              {footerBrand.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E3755D] hover:border-[#E3755D] transition-all text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  {socialIcons[social.icon]}
                </a>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[500px] bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3l1.9 5.8 1.9-5.8a2 2 0 0 1 1.3-1.3l5.8-1.9-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path>
              </svg>
              {footerNewsletter.title}
            </h3>
            <p className="text-gray-300 text-sm mb-6">{footerNewsletter.description}</p>
            {newsletterMessage ? (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {newsletterMessage}
              </div>
            ) : null}
            {newsletterError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {newsletterError}
              </div>
            ) : null}
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3755D] text-white placeholder-gray-400 transition-colors"
                placeholder={footerNewsletter.placeholder}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#E3755D] hover:bg-[#C8634D] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Submitting...' : footerNewsletter.buttonText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-10 sm:mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold mb-6 flex items-center text-white">
                {section.title}
                <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
              </h4>
              <ul className="space-y-4">
                {section.items.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group flex items-center text-gray-300 text-sm hover:text-white transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center text-white">
              Contact
              <div className="ml-3 h-px w-8 bg-[#E3755D]"></div>
            </h4>
            <ul className="space-y-4">
              {footerContactItems.map((item) => (
                <li key={item.type} className="flex items-start text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 mt-0.5 text-gray-400">
                    {contactIcons[item.type]}
                  </div>
                  <div className="leading-tight mt-1.5">
                    {item.href ? <a href={item.href} className="hover:text-white transition-colors">{item.value}</a> : <span>{item.value}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-6 sm:mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4 text-center md:text-left">
          <p>{footerBottom.copyright}</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {footerBottom.poweredBy}
          </div>
        </div>
      </div>
    </footer>
  );
}
