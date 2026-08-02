import Link from 'next/link';
import React from 'react';
import { Users, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

export default function NeverNavigateAlone() {
  const items = [
    { icon: Users, title: 'Dedicated Case Manager' },
    { icon: ShieldCheck, title: 'Attorney Review Available' },
    { icon: MessageCircle, title: '24/7 Support Access' },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-[#0A192F]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-2xl md:text-[30px] font-bold text-white mb-4 leading-snug tracking-tight">
            Professional Support: Never Navigate Alone
          </h2>
          <p className="text-[#A3B8CC] font-medium text-[14px] leading-relaxed mb-8 max-w-md">
            From start to finish, you'll have access to experienced case
            managers who understand immigration law and are dedicated to
            your success. Get answers to your questions within hours, not
            days.
          </p>

          <div className="space-y-3 mb-8">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-orange-500" />
                  </div>
                  <p className="text-white font-bold text-[14px]">{item.title}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/contact"
            className="bg-white hover:bg-gray-100 text-[#0A192F] px-6 py-3 rounded-lg font-bold text-[14px] inline-flex items-center gap-2 transition-colors"
          >
            Talk to Our Team
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right image */}
        <div className="relative w-full">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
            alt="Case management team meeting"
            className="w-full h-[340px] md:h-[380px] object-cover rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]"
          />
          <div className="absolute bottom-5 left-5 right-5 md:right-auto md:w-[280px] bg-[#0F2444]/95 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[12px] shrink-0">
                SM
              </div>
              <div>
                <p className="text-white font-bold text-[13px] leading-tight">Sarah Mitchell</p>
                <p className="text-[#A3B8CC] text-[11px]">Senior Case Manager</p>
              </div>
            </div>
            <p className="text-[#C8D4E3] text-[12px] italic leading-relaxed">
              "Our goal is to turn a stressful legal hurdle into a clear,
              manageable journey for every family we serve."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}