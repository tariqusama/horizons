"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, ChevronDown, Check, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const CountryDropdown = ({ name, required, defaultValue }: { name: string, required?: boolean, defaultValue?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || "");
  const [search, setSearch] = useState("");
  
  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected} required={required} />
      
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all text-[#1B3A64]"
      >
        <span className={selected ? "text-[#1B3A64]" : "text-gray-400"}>{selected || "Select country"}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A64]/20 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li
                    key={country}
                    onClick={() => {
                      setSelected(country);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-[#1B3A64]/5 transition-colors ${selected === country ? 'bg-[#1B3A64]/10 text-[#1B3A64] font-medium' : 'text-gray-600'}`}
                  >
                    {country}
                    {selected === country && <Check className="w-4 h-4 text-[#1B3A64]" />}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">No countries found</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function I94Page() {
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    setFormData(formValues);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(27, 58, 100);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("I-94 Form Summary", 20, 25);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("Generated by Horizon Immigration", 20, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);

    // Content
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    let y = 60;
    
    for (const [key, value] of Object.entries(formData)) {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      doc.setFont("helvetica", "bold");
      doc.text(`${formattedKey}:`, 20, y);
      
      doc.setFont("helvetica", "normal");
      const splitValue = doc.splitTextToSize(String(value || 'Not provided'), 110);
      doc.text(splitValue, 80, y);
      
      y += Math.max(10, splitValue.length * 6 + 4);
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
    }

    doc.save('I-94-Guide.pdf');
  };

  return (
    <main className="min-h-screen bg-[#FDFBF9] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Information */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <Link href="/free-tools" className="inline-flex items-center text-[#5A6579] hover:text-[#1B3A64] font-medium mb-6 transition-colors">
              <span className="material-icons text-[18px] mr-2">arrow_back</span>
              Back to Free Tools
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A64] mb-4 leading-tight">I-94 Retrieval Guide</h1>
            <p className="text-[#5A6579] text-lg leading-relaxed">
              Get your entry records and travel history from CBP. Save evidence for future immigration filings.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <span className="material-icons text-blue-600 mr-2">info</span>
              Why Do I Need My I-94?
            </h3>
            <p className="text-blue-900 text-sm mb-4 leading-relaxed">
              Your I-94 is your official arrival/departure record. It is critical evidence for:
            </p>
            <ul className="list-disc pl-5 text-blue-900 text-sm space-y-1">
              <li>Proving lawful entry into the United States</li>
              <li>Applying for a Green Card (Adjustment of Status)</li>
              <li>Renewing or extending your visa</li>
              <li>Applying for a driver's license or Social Security Number</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(27,58,100,0.08)] border border-gray-100 p-8 md:p-12">
            
            {step === 'form' && (
              <>
                {/* Progress Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Step 1 of 4</div>
                      <h3 className="text-xl font-bold text-[#1B3A64]">Traveler Information</h3>
                    </div>
                    <div className="text-sm font-bold text-[#1B3A64]">25% Complete</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    Enter your details as they appear on your passport
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleFormSubmit}>
                  
                  {/* Form Fields */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">First Name *</label>
                        <input name="firstName" required type="text" placeholder="Asha" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Last Name *</label>
                        <input name="lastName" required type="text" placeholder="Mensah" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Date of Birth *</label>
                        <input name="dob" required type="text" placeholder="mm/dd/yyyy" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Passport Country *</label>
                        <CountryDropdown name="passportCountry" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#1B3A64] mb-1.5">Passport Number (Optional but Recommended)</label>
                      <input name="passportNumber" type="text" placeholder="G1234567" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#1B3A64] focus:bg-white transition-all" />
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                        <span className="material-icons text-[14px] mr-1 text-gray-400">lightbulb</span>
                        Including your passport number improves search accuracy
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                    <button type="submit" className="bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md flex items-center">
                      Review Information
                      <span className="material-icons ml-1 text-[18px]">arrow_forward</span>
                    </button>
                  </div>

                </form>
              </>
            )}

            {step === 'review' && (
              <div className="animate-fade-in">
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#1B3A64] transition-colors mb-6"
                >
                  <span className="material-icons text-[18px] mr-1">arrow_back</span>
                  Back to Edit Form
                </button>

                <div className="mb-8 border-b border-gray-100 pb-6 text-center">
                  <h2 className="text-2xl font-bold text-[#1B3A64] mb-2">Review Your Information</h2>
                  <p className="text-[#5A6579]">Please double-check your details before downloading your guide.</p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
                    <h3 className="text-base font-bold text-[#1B3A64] mb-4 border-b border-gray-200 pb-2">Traveler Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500 block">First Name</span><span className="font-medium text-[#1B3A64]">{formData.firstName || '-'}</span></div>
                      <div><span className="text-gray-500 block">Last Name</span><span className="font-medium text-[#1B3A64]">{formData.lastName || '-'}</span></div>
                      <div><span className="text-gray-500 block">Date of Birth</span><span className="font-medium text-[#1B3A64]">{formData.dob || '-'}</span></div>
                      <div><span className="text-gray-500 block">Passport Country</span><span className="font-medium text-[#1B3A64]">{formData.passportCountry || '-'}</span></div>
                      <div><span className="text-gray-500 block">Passport Number</span><span className="font-medium text-[#1B3A64]">{formData.passportNumber || '-'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1B3A64] text-white h-14 px-10 text-lg font-bold hover:bg-[#0A192F] transition-colors shadow-md w-full md:w-auto"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
