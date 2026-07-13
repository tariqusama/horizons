import React from 'react';

export default function TermsPage() {
  return (
    <main className="w-full bg-[#FDFBF9] min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-[800px] mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <h1 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-4">Terms & Conditions</h1>
        <p className="text-gray-500 font-medium mb-12 border-b border-gray-100 pb-8">Last Updated: July 2026</p>

        <div className="prose prose-lg text-[#5A6579] font-medium leading-relaxed max-w-none">
          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Horizon Pathways ("Platform", "we", "our"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">2. Nature of Services</h2>
          <p>
            Horizon Pathways is a technology platform that provides automated software tools and case management services to assist individuals in preparing their immigration applications. 
            <strong> Horizon Pathways is not a law firm.</strong> Our customer service representatives and case managers cannot provide legal advice. Any legal advice provided is done so exclusively through our network of independent, licensed partner attorneys.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">3. User Responsibilities</h2>
          <p>
            You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 mb-6">
            <li>Provide accurate, current, and complete information for all forms and applications.</li>
            <li>Maintain the security of your account credentials.</li>
            <li>Review all applications and documents for accuracy before signing and submitting them to USCIS.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">4. Fees and Refunds</h2>
          <p>
            Our service fees do not include government filing fees, biometrics fees, or medical exam costs. Due to the nature of our services and the immediate allocation of resources to your case upon purchase, our service fees are generally non-refundable once document preparation has begun.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            Horizon Pathways is not responsible for any delays, denials, or rejections by USCIS or any other government agency. We do not guarantee the approval of any application.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">6. Contact Information</h2>
          <p>
            For any questions regarding these Terms, please contact us at <strong>legal@horizonpathways.us</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}
