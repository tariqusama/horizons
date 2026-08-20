"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AboutImpact() {
  const [successStories, setSuccessStories] = useState(3012);

  useEffect(() => {
    // Fetch the number of new signups from the backend API
    // Replace '/stats/signups' with your actual API endpoint if different.
    api.get('/stats/signups')
      .then((response) => {
        // Assuming the API returns something like { count: 10 } or { total: 3022 }
        const count = response.data?.count || 0;
        const total = response.data?.total;
        if (total) {
          setSuccessStories(total);
        } else {
          setSuccessStories(3012 + count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch signup count", error);
      });
  }, []);

  const stats = [
    {
      value: "4+", label: "Years of Excellence", icon: "emoji_events",
    },
    {
      value: `${successStories.toLocaleString()}+`, label: "Success Stories", icon: "auto_awesome",
    },
    {
      value: "75+", label: "Countries Served", icon: "public",
    },
    {
      value: "98%", label: "Client Satisfaction", icon: "thumb_up",
    }
  ];

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto text-center bg-[#FDFBF9] relative overflow-hidden">
      <div className="inline-flex items-center bg-[#EAF1F8] rounded-full px-6 py-2 mb-8 border border-blue-100/50 shadow-sm">
        <span className="text-[#1B3A64] text-[12px] font-bold tracking-[0.15em] uppercase">Our Impact</span>
      </div>

      <h2 className="text-4xl md:text-[56px] font-bold text-[#1B3A64] mb-6 leading-tight tracking-tight">
        The Numbers Behind the Stories
      </h2>
      <p className="text-[#5A6579] font-medium mb-20 text-[19px] max-w-2xl mx-auto leading-relaxed">
        Behind every number is a family, a reunion, and a fresh start. We measure our success by the lives we change.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-10 shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_60px_-15px_rgba(27,58,100,0.12)] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-gradient-to-br from-[#EAF1F8] to-[#D5E4F2] rounded-[24px] flex items-center justify-center mb-8 border border-white shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons text-orange-500 text-[36px]">{stat.icon}</span>
            </div>

            <h3 className="text-5xl font-black text-[#1B3A64] mb-3 relative z-10">
              {stat.value}
            </h3>
            <p className="text-[#5A6579] font-bold text-[14px] tracking-wider uppercase relative z-10">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
