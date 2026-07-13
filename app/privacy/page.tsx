import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="w-full bg-[#FDFBF9] min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-[800px] mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <h1 className="text-4xl md:text-5xl font-black text-[#1B3A64] mb-4">Privacy Policy</h1>
        <p className="text-gray-500 font-medium mb-12 border-b border-gray-100 pb-8">Last Updated: July 2026</p>

        <div className="prose prose-lg text-[#5A6579] font-medium leading-relaxed max-w-none">
          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">1. Information We Collect</h2>
          <p>
            At Horizon Pathways, we prioritize the confidentiality and security of your personal and legal information. We collect information you provide directly to us when you create an account, use our free tools, request full service, or communicate with us. This includes your name, email, phone number, and sensitive immigration-related data required for forms.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 mb-6">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your immigration applications and forms</li>
            <li>Communicate with you regarding your case status</li>
            <li>Respond to your legal inquiries via our partnered attorneys</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement bank-level encryption and robust security measures to protect your personal information from unauthorized access, alteration, or disclosure. All documents uploaded to our platform are stored on secure, encrypted servers.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">4. Sharing of Information</h2>
          <p>
            We do not sell, rent, or share your personal information with third-party advertisers. We only share information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 mb-6">
            <li>Licensed partner attorneys working directly on your case</li>
            <li>United States Citizenship and Immigration Services (USCIS) when submitting your authorized applications</li>
            <li>Essential service providers (like payment processors) bound by strict confidentiality agreements</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3A64] mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at <strong>privacy@horizonpathways.us</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}
