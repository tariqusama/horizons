import React from 'react';
import { Heart, ShieldCheck, BadgeCheck, Eye } from 'lucide-react';

export default function AboutValues() {
  const values = [
    {
      title: 'Compassion',
      description:
        'We listen first. We know the anxiety of the "pending" status because we\'ve lived it.',
      icon: Heart,
      iconColor: '#E3623D',
      iconBg: '#FDF1EA',
      titleColor: '#E3623D',
    },
    {
      title: 'Integrity',
      description:
        'Honest assessments, always. We never give false hope just to secure a client.',
      icon: ShieldCheck,
      iconColor: '#5A6579',
      iconBg: '#F0F2F5',
      titleColor: '#0A192F',
    },
    {
      title: 'Excellence',
      description:
        'Triple-check verification. Precision is the difference between approval and rejection.',
      icon: BadgeCheck,
      iconColor: '#E3623D',
      iconBg: '#FDF1EA',
      titleColor: '#E3623D',
    },
    {
      title: 'Transparency',
      description:
        "Clear pricing and real-time tracking. You'll never wonder what happens next.",
      icon: Eye,
      iconColor: '#5A6579',
      iconBg: '#F0F2F5',
      titleColor: '#2F6FDB',
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mb-14 tracking-tight">
        The Values That Guide Us
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {values.map((val, idx) => {
          const Icon = val.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-left border border-[#EDEFF3] shadow-[0_2px_8px_rgba(27,58,100,0.04)]"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: val.iconBg }}
              >
                <Icon size={19} color={val.iconColor} strokeWidth={2.25} />
              </div>
              <h3
                className="text-[15px] font-bold mb-2"
                style={{ color: val.titleColor }}
              >
                {val.title}
              </h3>
              <p className="text-[#8A93A3] text-[13px] font-medium leading-relaxed">
                {val.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}