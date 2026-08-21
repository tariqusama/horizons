'use client';

import React, { useState, useEffect, useRef } from "react";
import { Clock, ArrowRight, Star, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CaseType {
  id: string;
  name: string;
  minMonths: number;
  maxMonths: number;
  description: string;
  isCore?: boolean;
}

export default function TimelineSection() {
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [timeline, setTimeline] = useState<CaseType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const caseTypes: CaseType[] = [
    // Family-Based Immigration
    {
      id: "i-130-immediate-relative",
      name: "I-130 Immediate Relative (IR)",
      minMonths: 12,
      maxMonths: 18,
      description: "Family petition for spouses, parents, unmarried children under 21",
      isCore: true
    },
    {
      id: "i-130-f1",
      name: "I-130 Family First Preference (F1)",
      minMonths: 84,
      maxMonths: 96,
      description: "Unmarried sons/daughters of U.S. citizens"
    },
    {
      id: "i-130-f2a",
      name: "I-130 Family Second Preference (F2A)",
      minMonths: 24,
      maxMonths: 36,
      description: "Spouses and children of permanent residents"
    },
    {
      id: "i-130-f4",
      name: "I-130 Family Fourth Preference (F4) - Siblings",
      minMonths: 120,
      maxMonths: 156,
      description: "Brothers and sisters of U.S. citizens",
      isCore: true
    },
    {
      id: "i-485-adjustment",
      name: "I-485 Adjustment of Status",
      minMonths: 10,
      maxMonths: 24,
      description: "Green card application while in the U.S.",
      isCore: true
    },
    {
      id: "k-1-fiance",
      name: "K-1 Fiancé(e) Visa",
      minMonths: 6,
      maxMonths: 9,
      description: "For foreign fiancé(e)s of U.S. citizens",
      isCore: true
    },
    {
      id: "k-3-spouse",
      name: "K-3 Spouse Visa",
      minMonths: 12,
      maxMonths: 18,
      description: "For spouses of U.S. citizens abroad",
      isCore: true
    },
    
    // Employment-Based Immigration
    {
      id: "i-140-eb1",
      name: "I-140 EB-1 (Priority Workers)",
      minMonths: 6,
      maxMonths: 12,
      description: "Extraordinary ability, outstanding researchers, executives"
    },
    {
      id: "i-140-eb2",
      name: "I-140 EB-2 (Advanced Degree)",
      minMonths: 12,
      maxMonths: 18,
      description: "Advanced degree professionals or exceptional ability"
    },
    {
      id: "i-140-eb3",
      name: "I-140 EB-3 (Skilled Workers)",
      minMonths: 12,
      maxMonths: 24,
      description: "Skilled workers, professionals, other workers"
    },
    {
      id: "perm-labor",
      name: "PERM Labor Certification",
      minMonths: 6,
      maxMonths: 12,
      description: "Required for most employment-based green cards"
    },
    
    // Work Authorization
    {
      id: "i-765-ead",
      name: "I-765 Employment Authorization (EAD)",
      minMonths: 3,
      maxMonths: 6,
      description: "Work permit for various immigration categories",
      isCore: true
    },
    {
      id: "h-1b",
      name: "H-1B Specialty Occupation",
      minMonths: 3,
      maxMonths: 6,
      description: "Temporary work visa for specialty occupations"
    },
    {
      id: "l-1-transfer",
      name: "L-1 Intracompany Transfer",
      minMonths: 3,
      maxMonths: 5,
      description: "For managers, executives, specialized knowledge workers"
    },
    {
      id: "o-1-extraordinary",
      name: "O-1 Extraordinary Ability",
      minMonths: 2,
      maxMonths: 4,
      description: "For individuals with extraordinary ability in sciences, arts, etc."
    },
    {
      id: "tn-nafta",
      name: "TN NAFTA Professional",
      minMonths: 1,
      maxMonths: 3,
      description: "For Canadian and Mexican professionals under USMCA"
    },
    
    // Citizenship & Naturalization
    {
      id: "n-400-naturalization",
      name: "N-400 Naturalization",
      minMonths: 8,
      maxMonths: 14,
      description: "U.S. citizenship application for permanent residents",
      isCore: true
    },
    {
      id: "n-600-certificate",
      name: "N-600 Certificate of Citizenship",
      minMonths: 12,
      maxMonths: 18,
      description: "For those who acquired citizenship through parents"
    },
    
    // Travel Documents
    {
      id: "i-131-travel",
      name: "I-131 Travel Document",
      minMonths: 4,
      maxMonths: 8,
      description: "Advance parole and reentry permits",
      isCore: true
    },
    {
      id: "i-90-renew-card",
      name: "I-90 Green Card Renewal",
      minMonths: 8,
      maxMonths: 12,
      description: "Renew or replace permanent resident card",
      isCore: true
    },
    
    // Humanitarian & Protection
    {
      id: "i-589-asylum",
      name: "I-589 Asylum Application",
      minMonths: 6,
      maxMonths: 24,
      description: "Apply for asylum in the United States"
    },
    {
      id: "i-730-refugee",
      name: "I-730 Refugee/Asylee Relative Petition",
      minMonths: 12,
      maxMonths: 24,
      description: "Bring family members as refugees or asylees"
    },
    {
      id: "i-821d-daca",
      name: "I-821D DACA Renewal",
      minMonths: 4,
      maxMonths: 8,
      description: "Deferred Action for Childhood Arrivals renewal",
      isCore: true
    },
    {
      id: "u-visa-crime",
      name: "U Visa (Crime Victims)",
      minMonths: 48,
      maxMonths: 72,
      description: "For victims of certain crimes who assist law enforcement"
    },
    {
      id: "vawa-petition",
      name: "VAWA Self-Petition",
      minMonths: 18,
      maxMonths: 36,
      description: "For abused spouses, children, or parents"
    },
    
    // Student & Exchange
    {
      id: "f-1-student",
      name: "F-1 Student Visa",
      minMonths: 1,
      maxMonths: 3,
      description: "For academic studies at U.S. institutions"
    },
    {
      id: "m-1-vocational",
      name: "M-1 Vocational Student",
      minMonths: 1,
      maxMonths: 3,
      description: "For vocational or technical studies"
    },
    {
      id: "j-1-exchange",
      name: "J-1 Exchange Visitor",
      minMonths: 2,
      maxMonths: 4,
      description: "For educational and cultural exchange programs"
    },
    
    // Business & Investment
    {
      id: "eb5-investor",
      name: "EB-5 Immigrant Investor",
      minMonths: 24,
      maxMonths: 48,
      description: "Green card through qualifying investment"
    },
    {
      id: "e2-treaty-investor",
      name: "E-2 Treaty Investor",
      minMonths: 3,
      maxMonths: 6,
      description: "For treaty country nationals investing in U.S. business"
    },
    
    // Removal of Conditions
    {
      id: "i-751-conditions",
      name: "I-751 Remove Conditions on Residence",
      minMonths: 12,
      maxMonths: 24,
      description: "Remove conditions on 2-year conditional green card",
      isCore: true
    },
    
    // Waivers
    {
      id: "i-601-waiver",
      name: "I-601 Waiver of Inadmissibility",
      minMonths: 12,
      maxMonths: 24,
      description: "Waiver for certain grounds of inadmissibility"
    },
    {
      id: "i-212-waiver",
      name: "I-212 Permission to Reapply",
      minMonths: 6,
      maxMonths: 12,
      description: "For those previously removed or deported"
    }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCalculate = () => {
    const selected = caseTypes.find(c => c.id === selectedCase);
    if (selected) {
      setTimeline(selected);
    }
  };

  const selectedItem = caseTypes.find(c => c.id === selectedCase);

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 mx-auto bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-blue-50/40 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8 md:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 px-3 md:px-4 py-2 rounded-full mb-4">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-xs md:text-sm font-semibold text-orange-600">Estimate Your Timeline</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-slate-900 tracking-tight">
            How Long Will Your Case Take?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
            Get accurate processing timelines for all Horizon Pathways immigration categories based on current USCIS data
          </p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-4 md:space-y-6">
            <div className="w-full relative" ref={dropdownRef}>
              <label className="block text-sm md:text-base font-semibold text-slate-800 mb-3">
                Select Your Immigration Case Type
              </label>
              
              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full min-h-[44px] flex items-center justify-between bg-white border border-slate-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all cursor-pointer"
                >
                  <span className={`block truncate ${!selectedItem ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>
                    {selectedItem ? selectedItem.name : "Choose from 40+ immigration case types..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500 ml-2 flex-shrink-0" />
                </button>
                
                {isOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[40vh] md:max-h-[400px] overflow-y-auto">
                    {caseTypes.map((caseType) => (
                      <div
                        key={caseType.id}
                        onClick={() => {
                          setSelectedCase(caseType.id);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors ${selectedCase === caseType.id ? 'bg-orange-50' : ''}`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2 flex-wrap w-full">
                            <span className="font-medium text-sm md:text-base text-slate-800">{caseType.name}</span>
                            {caseType.isCore && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] uppercase font-bold whitespace-nowrap">
                                <Star className="w-3 h-3 fill-current" />
                                We Specialize
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 line-clamp-2">{caseType.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleCalculate} 
              disabled={!selectedCase}
              className={`w-full h-11 md:h-12 text-sm md:text-base font-bold rounded-lg flex items-center justify-center transition-all duration-300 ${
                selectedCase 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Calculate Timeline
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            {timeline && (
              <motion.div 
                className="mt-6 md:mt-8 p-5 md:p-6 bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-xl border border-orange-200/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {timeline.isCore && (
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-orange-100/70 border border-orange-200 rounded-lg">
                    <Star className="w-4 h-4 text-orange-600 fill-current flex-shrink-0" />
                    <p className="text-xs md:text-sm font-bold text-orange-700">
                      We specialize in this case type at Horizon Pathways
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-full flex-shrink-0 border border-orange-100">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">{timeline.name}</h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-4">{timeline.description}</p>
                    
                    <div className="bg-white/60 rounded-lg border border-slate-200/50 p-4 mb-4">
                      <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Current USCIS Processing Time:</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-orange-600">
                        {timeline.minMonths}-{timeline.maxMonths} months
                      </p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-slate-600">
                      <p className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                        <span>Timeline varies by USCIS service center and case complexity</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                        <span>Premium processing available for eligible case types</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                        <span>Our attorneys can help expedite your case when possible</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                        <span>Data updated regularly from official USCIS sources</span>
                      </p>
                    </div>

                    {timeline.isCore ? (
                      <Link 
                        href="/signup" 
                        className="inline-flex w-full items-center justify-center mt-6 h-11 text-sm md:text-base font-bold bg-[#1A2B4B] text-white rounded-lg hover:bg-[#162037] transition-colors"
                      >
                        Start Your Application
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    ) : (
                      <>
                        <div className="mt-5 p-4 bg-white/60 rounded-lg border border-slate-200/50">
                          <p className="text-xs md:text-sm text-slate-700">
                            💡 This is a specialized case type. Schedule a consultation with our team to discuss your specific situation and explore your options.
                          </p>
                        </div>
                        <Link 
                          href="/contact" 
                          className="inline-flex w-full items-center justify-center mt-3 h-11 text-sm md:text-base font-bold bg-white text-slate-800 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Schedule Consultation
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.p 
          className="text-center text-xs text-slate-500 mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          * Processing times are based on current USCIS data and are updated regularly. Actual timelines may vary by service center and case complexity. 
          Data source: <a href="https://egov.uscis.gov/processing-times/" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 transition-colors">USCIS Processing Times</a>
        </motion.p>
      </div>
    </section>
  );
}