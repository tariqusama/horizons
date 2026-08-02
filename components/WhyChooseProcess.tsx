import React from 'react';

export default function WhyChooseProcess() {
  const stats = [
    {
      value: '10x',
      title: 'Save 20+ Hours',
      description: 'Faster than traditional methods.',
      color: '#E3623D',
    },
    {
      value: 'Expert',
      title: 'Dedicated Support',
      description: 'Managers & attorneys on hand.',
      color: '#D14343',
    },
    {
      value: '98%',
      title: 'Success Rate',
      description: 'Industry-leading approval rate.',
      color: '#E3623D',
    },
    {
      value: 'AES',
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption.',
      color: '#D14343',
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div className="text-left">
          <h2 className="text-2xl md:text-[28px] font-bold text-[#0A192F] mb-3 leading-snug tracking-tight">
            Proven Results: Why Choose Our Process
          </h2>
          <p className="text-[#5A6579] font-medium text-[14px] leading-relaxed mb-8 max-w-lg">
            Our systematic approach combines technology with human expertise
            to deliver exceptional results and an unparalleled user
            experience.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <p
                  className="font-bold text-[24px] mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-[#0A192F] font-bold text-[13px] mb-1">
                  {stat.title}
                </p>
                <p className="text-[#8A93A3] text-[12px] font-medium">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative w-full">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
            alt="Case manager reviewing an application with a client"
            className="w-full h-[300px] md:h-[340px] object-cover rounded-2xl shadow-[0_20px_40px_-10px_rgba(27,58,100,0.15)]"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-[#0A192F] font-bold text-[13px]">✈ Horizon Pathways</span>
          </div>
        </div>
      </div>
    </section>
  );
}