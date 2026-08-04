import React from 'react';
import { Clock, Check } from 'lucide-react';

export default function HowItWorksSteps() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Secure Profile',
      time: '2-5 minutes',
      description:
        'Sign up in minutes and access your personalized immigration dashboard. We use bank-level encryption to protect your data.',
      features: ['Quick registration', '256-bit encryption', 'MFA & device access'],
    },
    {
      number: 2,
      title: 'Complete Guided Forms',
      time: '1-2 hours',
      description:
        'Answer simple questions in plain English. Our intelligent system fills complex USCIS forms automatically.',
      features: ['Step-by-step guidance', 'Auto-save & validation', 'Expert tips'],
    },
    {
      number: 3,
      title: 'Upload Documents',
      time: '30-60 minutes',
      description:
        "Securely upload photos, identification, and evidence. Our checklist ensures you don't miss anything.",
      features: ['Smart checklist', 'Drag-and-drop', 'Evidence verification'],
    },
    {
      number: 4,
      title: 'Professional Review',
      time: '24-48 hours',
      description:
        'Your dedicated case manager reviews everything for completeness. Attorney review available for peace of mind.',
      features: ['Assigned manager', 'Comprehensive review', 'Error detection'],
    },
    {
      number: 5,
      title: 'Quality Assurance Check',
      time: '12-24 hours',
      description:
        'Final quality control ensures your application meets USCIS standards before printing and assembly.',
      features: ['Multi-point inspection', 'Compliance verification', 'Final approval'],
    },
    {
      number: 6,
      title: 'Print, Assemble & Ship',
      time: '3-5 business days',
      description:
        'We print, organize, and ship your complete USCIS-ready package directly to your door with tracking.',
      features: ['Printing service', 'Organized assembly', 'USPS tracking'],
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <h2 className="text-3xl md:text-[36px] font-bold text-[#0A192F] mb-3 tracking-tight">
        Your Step-by-Step Journey
      </h2>
      <p className="text-orange-500 font-semibold text-[14px] mb-12 max-w-xl mx-auto leading-relaxed">
        Every application follows our proven 6-step process, ensuring
        accuracy, compliance, and peace of mind.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 text-left">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 border border-[#EDEFF3] border-l-4 border-l-orange-500 shadow-[0_2px_8px_rgba(27,58,100,0.04)] relative min-h-[260px]"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-[13px] flex items-center justify-center mb-4">
              {step.number}
            </div>

            <h3 className="text-[#0A192F] font-bold text-[16px] mb-1">
              {step.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[#8A93A3] text-[12px] font-medium mb-3">
              <Clock size={12} />
              {step.time}
            </div>
            <p className="text-[#5A6579] text-[13px] leading-relaxed mb-4">
              {step.description}
            </p>

            <div className="space-y-2">
              {step.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <Check size={14} className="text-green-600 shrink-0" />
                  <span className="text-[#5A6579] text-[12px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}