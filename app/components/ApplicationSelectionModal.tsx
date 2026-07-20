'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ApplicationSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApplicationSelectionModal({ isOpen, onClose }: ApplicationSelectionModalProps) {
    const router = useRouter();
    const [selectedGoal, setSelectedGoal] = useState<any>(null);
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [view, setView] = useState<'grid' | 'details' | 'tiers' | 'agreement' | 'checkout'>('grid');
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);

    if (!isOpen) return null;

    const goals = [
        {
            id: 'family',
            title: 'Family-Based Immigration',
            emoji: '👨‍👩‍👧‍👦',
            desc: 'For U.S. citizens and permanent residents petitioning eligible family members from abroad',
            tags: ['Spouse', 'Parent', 'Child', 'Sibling'],
            pricing: {
                title: 'Family-Based Petition',
                subtitle: 'I-130 petition for alien relative',
                basePrice: 549.99,
                advancedPrice: 789.99,
                premiumPrice: 999.99,
                processingTime: '10-14 months',
                requirements: ['Proof of relationship', 'Sponsor meets income requirements', 'Intending immigrant is admissible']
            }
        },
        {
            id: 'fiance',
            title: 'Fiancé (K-1) Visa',
            emoji: '💍',
            desc: 'Bring your fiancé(e) to the United States to get married and apply for permanent residence.',
            tags: [],
            pricing: {
                title: 'K-1 Fiancé Visa – USCIS Petition only',
                subtitle: 'I-129F petition for K-1 fiancé visa',
                basePrice: 549.99,
                advancedPrice: 849.99,
                premiumPrice: 1049.99,
                processingTime: '8-12 months',
                requirements: ['Both parties free to marry', 'Met in person within 2 years', 'Intent to marry within 90 days']
            }
        },
        {
            id: 'adjustment',
            title: 'Adjustment of Status (Green Card)',
            emoji: '🏡',
            desc: 'Apply for a Green Card from within the United States through an eligible category.',
            tags: [],
            pricing: {
                title: 'Adjustment of Status',
                subtitle: 'I-485 application to register permanent residence',
                basePrice: 599.99,
                advancedPrice: 949.99,
                premiumPrice: 1249.99,
                processingTime: '12-24 months',
                requirements: ['Currently in the US', 'Entered lawfully', 'Visa number immediately available']
            }
        },
        {
            id: 'naturalization',
            title: 'Naturalization (Citizenship)',
            emoji: '🇺🇸',
            desc: 'Apply to become a U.S. citizen if you meet the eligibility requirements.',
            tags: [],
            pricing: {
                title: 'US Naturalization',
                subtitle: 'N-400 application for naturalization',
                basePrice: 349.99,
                advancedPrice: 449.99,
                premiumPrice: 649.99,
                processingTime: '6-10 months',
                requirements: ['At least 18 years old', 'Permanent resident for 3-5 years', 'Continuous residence and physical presence']
            }
        },
        {
            id: 'renewal',
            title: 'Green Card Renewal or Replacement',
            emoji: '💳',
            desc: 'Renew or replace your Permanent Resident Card if it has expired or has been lost.',
            tags: [],
            pricing: {
                title: 'Green Card Renewal',
                subtitle: 'I-90 application to replace permanent resident card',
                basePrice: 349.99,
                advancedPrice: 449.99,
                premiumPrice: 599.99,
                processingTime: '6-9 months',
                requirements: ['Current card expired or expiring within 6 months', 'Card was lost, stolen, or destroyed']
            }
        },
        {
            id: 'conditions',
            title: 'Removal of Conditions on Residence',
            emoji: '🔄',
            desc: 'Remove the conditions on your two-year conditional Green Card.',
            tags: [],
            pricing: {
                title: 'Removal of Conditions',
                subtitle: 'I-751 petition to remove conditions on residence',
                basePrice: 399.99,
                advancedPrice: 499.99,
                premiumPrice: 699.99,
                processingTime: '18-24 months',
                requirements: ['Conditional resident status', 'Filing within 90 days before card expires', 'Still married to same US citizen']
            }
        }
    ];

    const handleGoalClick = (goal: any) => {
        setSelectedGoal(goal);
        setView('details');
    };

    const handleClose = () => {
        setSelectedGoal(null);
        setSelectedTier('');
        setView('grid');
        setIsAgreementChecked(false);
        setIsTermsChecked(false);
        onClose();
    };

    const handleGetStarted = () => {
        setView('tiers');
    };

    const handleSelectTier = (tier: string) => {
        setSelectedTier(tier);
        setView('agreement');
    };

    const handleAgreeAndContinue = () => {
        if (!isAgreementChecked) return;
        setView('checkout');
    };

    const handleCompletePurchase = () => {
        if (!isTermsChecked) return;
        router.push('/signup');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B3A64]/60 backdrop-blur-sm p-4 overflow-y-auto">
            {view === 'grid' && !selectedGoal && (
                <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[900px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                    <div className="flex justify-between items-center p-8 pb-4">
                        <h2 className="text-3xl font-black text-[#1B3A64]">Select An Application</h2>
                        <button onClick={handleClose} className="bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.map((goal, idx) => (
                            <div key={goal.id} className="bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-[#FA6514]/20" onClick={() => handleGoalClick(goal)}>
                                <h3 className="text-lg font-bold text-[#1B3A64] mb-2">{idx + 1}. {goal.emoji} {goal.title}</h3>
                                <p className="text-sm text-[#5A6579] mb-4">{goal.desc}</p>
                                {goal.tags.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {goal.tags.map(tag => (
                                            <span key={tag} className="bg-[#f1f5f9] text-[#475569] text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {view === 'details' && selectedGoal && (
                <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative my-8">
                    {/* Top Close Button */}
                    <button onClick={handleClose} className="absolute top-4 right-4 bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {/* Pill at top */}
                    <div className="flex justify-center pt-8 pb-4">
                        <span className="bg-[#fff1f2] text-[#f43f5e] px-4 py-1.5 rounded-full text-sm font-bold border border-[#ffe4e6]">
                            {selectedGoal.title}
                        </span>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="bg-white rounded-[24px] border border-[#f43f5e] shadow-lg relative p-6">
                            {/* Ribbon */}
                            <div className="absolute top-0 right-6 bg-[#f43f5e] text-white text-[10px] font-bold tracking-wider py-1 px-3 rounded-b-md">
                                MOST POPULAR
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-4 mt-2 mb-2">
                                <div className="bg-[#fff1f2] text-[#f43f5e] w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                                    {selectedGoal.emoji}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1B3A64] text-[17px] leading-tight pr-12">{selectedGoal.pricing.title}</h3>
                                </div>
                            </div>
                            <p className="text-[#5A6579] text-[13px] mb-6">{selectedGoal.pricing.subtitle}</p>

                            {/* Price */}
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#1B3A64]">${selectedGoal.pricing.basePrice}</span>
                                <span className="text-sm text-[#8c98a9] font-medium">starting</span>
                            </div>

                            {/* Tiers list */}
                            <div className="bg-[#f8f9fa] rounded-xl border border-[#e2e8f0] overflow-hidden mb-6">
                                <div className="flex justify-between py-3 px-4 border-b border-[#e2e8f0]">
                                    <span className="text-[13px] text-[#5A6579] font-medium">Basic Package</span>
                                    <span className="text-[13px] text-[#1B3A64] font-bold">${selectedGoal.pricing.basePrice}</span>
                                </div>
                                <div className="flex justify-between py-3 px-4 border-b border-[#e2e8f0]">
                                    <span className="text-[13px] text-[#5A6579] font-medium">Advanced Package</span>
                                    <span className="text-[13px] text-[#1B3A64] font-bold">${selectedGoal.pricing.advancedPrice}</span>
                                </div>
                                <div className="flex justify-between py-3 px-4">
                                    <span className="text-[13px] text-[#5A6579] font-medium">Premium Package</span>
                                    <span className="text-[13px] text-[#1B3A64] font-bold">${selectedGoal.pricing.premiumPrice}</span>
                                </div>
                            </div>

                            {/* Processing Time */}
                            <div className="flex items-center gap-4 border border-[#e2e8f0] rounded-xl p-4 mb-6">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <div>
                                    <div className="text-[10px] text-[#8c98a9] font-bold tracking-wider uppercase">Processing Time</div>
                                    <div className="text-[14px] text-[#1B3A64] font-bold">{selectedGoal.pricing.processingTime}</div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    <span className="text-[10px] text-[#f43f5e] font-bold tracking-wider uppercase">REQUIREMENTS</span>
                                </div>
                                <ul className="space-y-2">
                                    {selectedGoal.pricing.requirements.map((req: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-[13px] text-[#5A6579]">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={handleGetStarted} className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3">
                                Get Started
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                            
                            <button className="w-full text-[13px] text-[#1B3A64] font-bold hover:underline py-2">
                                Learn More
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {view === 'tiers' && selectedGoal && (
                <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[900px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative my-8 p-8">
                    {/* Top Close Button */}
                    <button onClick={handleClose} className="absolute top-4 right-4 bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <h2 className="text-3xl font-black text-[#1B3A64] mb-2">{selectedGoal.pricing.title}</h2>
                    <p className="text-[#5A6579] mb-8 pb-6 border-b border-[#e2e8f0]">You can finish your application after this purchase</p>

                    <p className="text-sm text-[#5A6579] mb-6">Questions? Please chat with us below, or call: (844) 488-5245</p>
                    <h3 className="text-xl font-bold text-[#1B3A64] mb-6">Select which level of service you need</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Essentials */}
                        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-transparent hover:border-[#FA6514]/20">
                            <div className="bg-[#fff7ed] py-4 text-center">
                                <h4 className="font-bold text-[#1B3A64]">Essentials</h4>
                            </div>
                            <div className="p-8 flex-1 flex flex-col items-center text-center">
                                <div className="text-4xl font-black text-[#1B3A64] mb-4">${selectedGoal.pricing.basePrice}</div>
                                <p className="text-[#5A6579] text-sm mb-8 flex-1">Do-it-yourself application preparation</p>
                                <button onClick={() => handleSelectTier('Essentials')} className="w-full bg-[#FA6514] hover:bg-[#E3755D] text-white font-bold py-3 rounded-xl transition-colors">
                                    Select →
                                </button>
                            </div>
                        </div>

                        {/* Enhanced */}
                        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-transparent hover:border-[#FA6514]/20">
                            <div className="bg-[#f0f9ff] py-4 text-center">
                                <h4 className="font-bold text-[#1B3A64]">Enhanced</h4>
                            </div>
                            <div className="p-8 flex-1 flex flex-col items-center text-center">
                                <div className="text-4xl font-black text-[#1B3A64] mb-4">${selectedGoal.pricing.advancedPrice}</div>
                                <p className="text-[#5A6579] text-sm mb-8 flex-1">Do-it-yourself application preparation</p>
                                <button onClick={() => handleSelectTier('Enhanced')} className="w-full bg-[#FA6514] hover:bg-[#E3755D] text-white font-bold py-3 rounded-xl transition-colors">
                                    Select →
                                </button>
                            </div>
                        </div>

                        {/* Professional */}
                        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-transparent hover:border-[#FA6514]/20">
                            <div className="bg-[#ecfdf5] py-4 text-center">
                                <h4 className="font-bold text-[#1B3A64]">Professional</h4>
                            </div>
                            <div className="p-8 flex-1 flex flex-col items-center text-center">
                                <div className="text-4xl font-black text-[#1B3A64] mb-4">${selectedGoal.pricing.premiumPrice}</div>
                                <p className="text-[#5A6579] text-sm mb-8 flex-1">Do-it-yourself application preparation</p>
                                <button onClick={() => handleSelectTier('Professional')} className="w-full bg-[#FA6514] hover:bg-[#E3755D] text-white font-bold py-3 rounded-xl transition-colors">
                                    Select →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'agreement' && selectedGoal && (
                <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[900px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative my-8 flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="p-8 pb-4 relative shrink-0">
                        <button onClick={handleClose} className="absolute top-8 right-8 bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors z-10">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <h2 className="text-2xl font-black text-[#1B3A64] mb-2 uppercase">LIMITED SCOPE REPRESENTATION AGREEMENT</h2>
                        <p className="text-[#3b82f6] text-sm">You can finish your application after this purchase</p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="px-8 py-4 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="text-[#5A6579] text-sm space-y-4 pr-4 border-r-4 border-[#FA6514]">
                            <p>THIS LIMITED SCOPE REPRESENTATION AGREEMENT ("Agreement") is made between you, a Horizon Pathways customer and the Immigration Attorney ("Attorney") who has agreed to provide Services as defined below to you. You and Attorney agree that Attorney is not engaged to represent you generally in your immigration case. Rather, Attorney's representation of you is limited to the Services defined below, and nothing more, unless you and Attorney otherwise agree separately in writing.</p>
                            
                            <p>Horizon Pathways, Inc. ("Horizon Pathways") is not a party to this Agreement. Your relationship with Horizon Pathways is governed by the company's Terms and Conditions and Privacy Policy.</p>
                            
                            <p>As part of the services made available to you at HorizonPathways.us, Horizon Pathways has made arrangements with independent immigration attorneys to perform legal consultations for you and/or limited reviews of immigration documents you generate using Horizon Pathways' software. Attorney is not an employee of Horizon Pathways and is an independent practitioner. During the delivery of Services, Attorney will exercise their independent professional judgment, without influence or control by Horizon Pathways.</p>
                            
                            <p>Attorney must act in your best interest while providing the Services defined in this Agreement in a competent manner. However, because you and Attorney have agreed that Attorney will provide only limited legal help:</p>
                            
                            <p>Attorney DOES NOT have to give more help than described in this Agreement, and<br/>
                            Attorney DOES NOT HAVE TO HELP you with any other part of your immigration benefits application, case, or legal matter.<br/>
                            While performing the Services defined in this Agreement, you specifically agree that:</p>
                            
                            <p>Attorney DOES NOT promise any specific outcome of your immigration benefits application, case, or legal matter;<br/>
                            Attorney WILL RELY ENTIRELY on your description of the facts you provide to them via the Horizon Pathways website about your case and WILL NOT conduct any independent investigation;<br/>
                            Attorney's representation of you ends when Horizon Pathways delivers your immigration documents to you or when the Attorney advises against filing the immigration documents you selected; and<br/>
                            Attorney may advise you that a limited scope representation is not reasonable in your case and advise that you need additional services or more comprehensive services of another attorney.</p>
                        </div>

                        <h3 className="text-xl font-bold text-[#1B3A64] mt-8 mb-4 uppercase">INCLUDED SERVICES</h3>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-6 bg-white border-t border-[#e2e8f0] shrink-0">
                        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                            <div className="relative flex items-start pt-1">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={isAgreementChecked}
                                    onChange={(e) => setIsAgreementChecked(e.target.checked)}
                                />
                                <div className="w-5 h-5 border-2 border-[#cbd5e1] rounded peer-checked:bg-[#FA6514] peer-checked:border-[#FA6514] transition-colors flex items-center justify-center">
                                    <svg className={`w-3.5 h-3.5 text-white ${isAgreementChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                            </div>
                            <span className="text-[13px] text-[#5A6579] leading-relaxed">
                                I have read and agree to the <strong>Limited Scope Representation Agreement</strong> and consent to Horizon Pathways acting as a third-party payor for the legal services included in my selected package.
                            </span>
                        </label>

                        <div className="flex justify-end gap-4">
                            <button onClick={() => setView('tiers')} className="px-6 py-2.5 rounded-lg border border-[#e2e8f0] text-[#5A6579] font-medium hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAgreeAndContinue} 
                                disabled={!isAgreementChecked}
                                className={`px-6 py-2.5 rounded-lg font-bold text-white transition-colors ${isAgreementChecked ? 'bg-[#facc15] hover:bg-[#eab308]' : 'bg-[#fde047] cursor-not-allowed opacity-70'}`}
                            >
                                I Agree & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'checkout' && selectedGoal && (
                <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[650px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative my-8 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-8 pb-4 relative shrink-0 border-b border-[#e2e8f0]">
                        <button onClick={handleClose} className="absolute top-8 right-8 bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors z-10">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <h2 className="text-2xl font-black text-[#1B3A64]">Your Order Summary</h2>
                    </div>

                    {/* Scrollable Content */}
                    <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
                        <h3 className="text-lg font-bold text-[#1B3A64] mb-4">
                            {selectedGoal.pricing.title.split(' – ')[0]}: {selectedTier}
                        </h3>
                        
                        <ul className="space-y-2 mb-6 list-disc list-inside text-[13px] text-[#5A6579]">
                            {selectedTier === 'Essentials' && (
                                <li>Do-it-yourself application preparation</li>
                            )}
                            {selectedTier === 'Enhanced' && (
                                <>
                                    <li>Everything in Essentials</li>
                                    <li>Translation of 5 additional pages to include in your application (if needed)</li>
                                    <li>Ready-to-submit application mailed to your home</li>
                                    <li>Legal support if USCIS requests additional evidence</li>
                                </>
                            )}
                            {selectedTier === 'Professional' && (
                                <>
                                    <li>Everything in Enhanced</li>
                                    <li>Extended support from assigned Case Manager until approval</li>
                                    <li>One consultation with an immigration attorney to answer questions</li>
                                </>
                            )}
                        </ul>

                        <div className="bg-[#f0f9ff] text-[#0369a1] text-[13px] p-4 rounded-xl border border-[#bae6fd] mb-8 text-center">
                            Selected Case: <strong>{selectedGoal.pricing.title}</strong> (b149683c-cd71-4467-91e8-1b3430bebb13)
                        </div>

                        <h3 className="text-lg font-bold text-[#1B3A64] mb-4">Provide your payment information</h3>
                        
                        <div className="mb-6">
                            <label className="block text-[13px] text-[#5A6579] mb-2">Promo Code:</label>
                            <div className="flex gap-4">
                                <input type="text" className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-2 focus:outline-none focus:border-[#FA6514]" />
                                <button className="bg-[#FA6514] hover:bg-[#E3755D] text-white font-bold px-6 py-2 rounded-xl transition-colors whitespace-nowrap">
                                    &lt;&lt; Apply
                                </button>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 text-[#d97706] mb-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span className="font-bold text-[15px] text-[#1B3A64]">Secure Credit Card Payment Information</span>
                            </div>
                            <p className="text-[12px] text-[#8c98a9]">This is a secure 256-bit SSL encrypted payment.</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <input type="text" placeholder="Card" className="w-full border border-[#bae6fd] bg-[#f0f9ff]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FA6514]" />
                            <input type="text" placeholder="Bank" className="w-full border border-[#bae6fd] bg-[#f0f9ff]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FA6514]" />
                        </div>

                        <p className="text-[11px] text-[#8c98a9] mb-6 leading-relaxed">
                            By providing your card information, you allow Horizon Pathways, Inc. to charge your card for future payments in accordance with their terms.
                        </p>

                        <div className="border border-[#e2e8f0] rounded-xl p-4 flex justify-between items-center mb-6 bg-white">
                            <span className="text-[#5A6579] font-medium">Total</span>
                            <span className="text-2xl font-black text-[#1B3A64]">
                                ${selectedTier === 'Professional' ? selectedGoal.pricing.premiumPrice : selectedTier === 'Enhanced' ? selectedGoal.pricing.advancedPrice : selectedGoal.pricing.basePrice}
                            </span>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer mb-8 group">
                            <div className="relative flex items-start pt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={isTermsChecked}
                                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                                />
                                <div className="w-4 h-4 border border-[#cbd5e1] rounded peer-checked:bg-[#1B3A64] peer-checked:border-[#1B3A64] transition-colors flex items-center justify-center">
                                    <svg className={`w-3 h-3 text-white ${isTermsChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                            </div>
                            <span className="text-[13px] text-[#5A6579]">
                                I agree to the Horizon Pathways <a href="#" className="underline">Terms and Conditions</a>
                            </span>
                        </label>

                        <button 
                            onClick={handleCompletePurchase}
                            disabled={!isTermsChecked}
                            className={`px-8 py-3 rounded-xl font-bold text-white transition-colors flex items-center gap-2 ${isTermsChecked ? 'bg-[#1B3A64] hover:bg-[#132a4a]' : 'bg-[#475569] cursor-not-allowed opacity-70'}`}
                        >
                            Complete Purchase →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
