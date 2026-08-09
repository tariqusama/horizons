'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import api from '../../lib/api';
import { Users, Clock, CheckCircle2, ArrowRight, Heart, Home, Flag, CreditCard, RefreshCw } from 'lucide-react';

interface ApplicationSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QQ24fAJEL5Up1VaSpBRWbAfKrBCobEsVPtv2yo8eFSRJYKHs3GtB78nuyteFvcU0Q1RW5MtKQ5TMNk6R9vxbd8u00cwahnxJ9';
const stripePromise = loadStripe(stripeKey);

const CheckoutForm = ({ selectedSubPlan, selectedTier, handleClose, getSelectedAmount, questionnaireAnswers }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [cardholderName, setCardholderName] = useState('');
    const [billingEmail, setBillingEmail] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [isCardReady, setIsCardReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const completePurchase = async () => {
        if (!isTermsChecked) return;
        if (!cardholderName.trim() || !billingEmail.trim()) {
            setPaymentError('Please enter your cardholder name and email.');
            return;
        }

        if (!stripe || !elements) {
            setPaymentError('Stripe is still loading. Please wait a moment.');
            return;
        }

        if (!isCardReady) {
            setPaymentError('Card input is not ready yet. Please wait a moment.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setPaymentError('Card input is not available. Please refresh the page or try again.');
            return;
        }

        setIsSubmitting(true);
        setPaymentError('');

        const amount = getSelectedAmount();
        const planDescription = `${selectedSubPlan.title} - ${selectedTier}`;

        try {
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: cardholderName,
                    email: billingEmail,
                },
            });

            if (paymentMethodError) {
                setPaymentError(paymentMethodError.message || 'Payment method creation failed.');
                setIsSubmitting(false);
                return;
            }

            const response = await api.post('/payment/process', {
                amount,
                email: billingEmail,
                plan: planDescription,
                goal: selectedSubPlan.subtitle || selectedSubPlan.title,
                payment_method_id: paymentMethod.id,
            });

            if (response.data.status === 'requires_action' && response.data.client_secret) {
                const confirmation = await stripe.confirmCardPayment(response.data.client_secret);
                if (confirmation.error) {
                    throw confirmation.error;
                }
                if (confirmation.paymentIntent?.status !== 'succeeded') {
                    throw new Error('Payment was not completed.');
                }
            } else if (response.data.status !== 'success') {
                throw new Error(response.data.message || 'Payment processing failed.');
            }

            // Create the application in the database
            await api.post('/applications', {
                amount,
                plan: planDescription,
                goal: selectedSubPlan.subtitle || selectedSubPlan.title,
                package_name: selectedSubPlan.title,
                service_id: selectedSubPlan.id,
                questionnaire: questionnaireAnswers
            });

            alert('Payment successful! Your application has been submitted.');
            handleClose();

            // Reload the page to fetch the new application
            window.location.href = '/dashboard?payment=success';
        } catch (err: any) {
            setPaymentError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[650px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 pb-4 relative shrink-0 border-b border-[#e2e8f0]">
                <button onClick={handleClose} className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h2 className="text-2xl font-black text-[#1B3A64]">Your Order Summary</h2>
            </div>

            <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
                <h3 className="text-lg font-bold text-[#1B3A64] mb-1">
                    {selectedSubPlan.id === 'fiance_petition' ? 'K-1 Fiancé: ' : `${selectedSubPlan.title.split(' – ')[0]}: `}{selectedTier}
                </h3>

                <ul className="list-disc pl-6 space-y-2 text-sm text-[#475569] mb-6">
                    {selectedTier === 'Advanced' ? (
                        <>
                            <li>Everything in Basic</li>
                            <li>Translation of 5 additional pages to include in your application (if needed)</li>
                            <li>Ready-to-submit application mailed to your home</li>
                            <li>Legal support if USCIS requests additional evidence</li>
                            <li>Extended support from assigned Case Manager until approval</li>
                            <li>One consultation with an immigration attorney to answer questions</li>
                        </>
                    ) : selectedTier === 'Premium' ? (
                        <>
                            <li>Everything in Advanced</li>
                            <li>Priority consultation scheduling</li>
                            <li>Extended application review and attorney follow-up</li>
                            <li>Legal support if USCIS requests additional evidence</li>
                            <li>Dedicated Case Manager support until approval</li>
                            <li>Up to three consultations with an immigration attorney</li>
                        </>
                    ) : (
                        <>
                            <li>Basic document review and application preparation support</li>
                            <li>Review of your immigration application documents before submission</li>
                            <li>Verification for typographical errors and internal consistency</li>
                            <li>One review consultation with an attorney</li>
                        </>
                    )}
                </ul>

                <div className="bg-[#f0f9ff] text-[#0369a1] text-[13px] p-4 rounded-xl border border-[#bae6fd] mb-6 text-center">
                    Selected Case: <strong>{selectedSubPlan.title}</strong> ({selectedSubPlan.id})
                </div>

                <div className="border border-[#e2e8f0] rounded-xl p-4 mb-6 bg-white">
                    <p className="text-sm text-[#5A6579] mb-2">Provide your payment information</p>
                    <div className="rounded-xl border border-[#d1d5db] bg-[#ffffff] p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="cardholder-name">Cardholder Name</label>
                            <input
                                id="cardholder-name"
                                type="text"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#1B3A64] focus:ring-[#1B3A64]/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="billing-email">Billing Email</label>
                            <input
                                id="billing-email"
                                type="email"
                                value={billingEmail}
                                onChange={(e) => setBillingEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#1B3A64] focus:ring-[#1B3A64]/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Card Details</label>
                            <div className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                color: '#0f172a',
                                                fontSize: '16px',
                                                fontFamily: 'Inter, system-ui, sans-serif',
                                                '::placeholder': {
                                                    color: '#94a3b8',
                                                },
                                            },
                                            invalid: {
                                                color: '#dc2626',
                                            },
                                        },
                                        hidePostalCode: true,
                                    }}
                                    onReady={() => setIsCardReady(true)}
                                    onChange={(event) => {
                                        if (event.error) {
                                            setPaymentError(event.error.message || 'Please check your card details.');
                                        } else {
                                            setPaymentError('');
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">By providing your card information, you allow Horizon Pathways, Inc. to charge your card for future payments in accordance with their terms.</p>
                        {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
                    </div>
                </div>

                <div className="border border-[#e2e8f0] rounded-xl p-4 flex justify-between items-center mb-6 bg-white">
                    <span className="text-[#5A6579] font-medium">Total</span>
                    <span className="text-2xl font-black text-[#1B3A64]">
                        ${selectedTier === 'Premium' ? selectedSubPlan.premiumPrice : selectedTier === 'Advanced' ? selectedSubPlan.advancedPrice : selectedSubPlan.basePrice}
                    </span>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mb-4">
                    <div className="relative flex items-start pt-0.5">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={isTermsChecked}
                            onChange={(e) => setIsTermsChecked(e.target.checked)}
                        />
                        <div className="w-4 h-4 border border-[#cbd5e1] rounded peer-checked:bg-[#1B3A64] peer-checked:border-[#1B3A64] transition-colors flex items-center justify-center">
                            <svg className={`w-3 h-3 text-white ${isTermsChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>
                    <span className="text-[13px] text-[#5A6579]">
                        I agree to the Horizon Pathways <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms and Conditions</a>
                    </span>
                </label>

                <button
                    onClick={completePurchase}
                    disabled={!isTermsChecked || isSubmitting || !isCardReady}
                    className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors ${isTermsChecked && isCardReady ? 'bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50' : 'bg-slate-400 cursor-not-allowed opacity-50 shadow-none'}`}
                >
                    {isSubmitting ? 'Processing payment...' : isCardReady ? 'Complete Purchase →' : 'Loading card field...'}
                </button>
            </div>
        </div>
    );
};

export default function ApplicationSelectionModal({ isOpen, onClose }: ApplicationSelectionModalProps) {
    const router = useRouter();
    const [selectedGoal, setSelectedGoal] = useState<any>(null);
    const [selectedSubPlan, setSelectedSubPlan] = useState<any>(null);
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [view, setView] = useState<'grid' | 'details' | 'tiers' | 'questionnaire' | 'agreement' | 'checkout'>('grid');
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState({
        wants_g1145: true,
        wants_ead: false,
        wants_ap: false,
        wants_joint_sponsor: false,
        wants_household_member: false
    });

    const [goals, setGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/public/services');
                const data = res.data;
                const dynamicGoals = data.map((cat: any) => {
                    let emoji = '📄';
                    if (cat.title.includes('Family')) emoji = '👨‍👩‍👧‍👦';
                    else if (cat.title.includes('Fianc')) emoji = '💍';
                    else if (cat.title.includes('Adjustment')) emoji = '🏡';
                    else if (cat.title.includes('Renew')) emoji = '💳';
                    else if (cat.title.includes('Other')) emoji = '🇺🇸';

                    return {
                        id: cat.id,
                        title: cat.title,
                        emoji,
                        desc: cat.subtitle,
                        tags: [],
                        headerPill: cat.pill_text || cat.title,
                        headerTitle: cat.title,
                        headerSubtitle: cat.subtitle,
                        subPlans: cat.services.map((srv: any) => {
                            const basicPkg = srv.packages.find((p: any) => p.name.includes('Basic'));
                            const advancedPkg = srv.packages.find((p: any) => p.name.includes('Advanced'));
                            const premiumPkg = srv.packages.find((p: any) => p.name.includes('Premium'));
                            
                            let requirements = [];
                            try {
                                if (typeof srv.requirements === 'string') {
                                    requirements = JSON.parse(srv.requirements);
                                } else if (Array.isArray(srv.requirements)) {
                                    requirements = srv.requirements;
                                }
                            } catch (e) {
                                requirements = [];
                            }

                            return {
                                id: srv.id,
                                title: srv.title,
                                subtitle: srv.subtitle,
                                iconType: 'users',
                                basePrice: basicPkg ? basicPkg.price : parseFloat((srv.starting_price || '$0').replace(/[^0-9.]/g, '')),
                                advancedPrice: advancedPkg ? advancedPkg.price : 0,
                                premiumPrice: premiumPkg ? premiumPkg.price : 0,
                                processingTime: srv.processing_time,
                                requirements: requirements
                            };
                        })
                    };
                });
                setGoals(dynamicGoals);
            } catch (err) {
                console.error('Failed to fetch services:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = (type: string, className: string) => {
        switch (type) {
            case 'users': return <Users className={className} />;
            case 'heart': return <Heart className={className} />;
            case 'home': return <Home className={className} />;
            case 'flag': return <Flag className={className} />;
            case 'creditcard': return <CreditCard className={className} />;
            case 'refresh': return <RefreshCw className={className} />;
            default: return <Users className={className} />;
        }
    };

    const handleGoalClick = (goal: any) => {
        setSelectedGoal(goal);
        setView('details');
    };

    const handleClose = () => {
        setSelectedGoal(null);
        setSelectedSubPlan(null);
        setSelectedTier('');
        setView('grid');
        setIsAgreementChecked(false);
        setQuestionnaireAnswers({
            wants_g1145: true,
            wants_ead: false,
            wants_ap: false,
            wants_joint_sponsor: false,
            wants_household_member: false
        });
        onClose();
    };

    const handleSelectSubPlan = (subPlan: any) => {
        setSelectedSubPlan(subPlan);
        setView('tiers');
    };

    const handleSelectTier = (tier: string) => {
        setSelectedTier(tier);
        setView('questionnaire');
    };

    const handleContinueToAgreement = () => {
        setView('agreement');
    };

    const handleAgreeAndContinue = () => {
        if (!isAgreementChecked) return;
        setView('checkout');
    };

    const getSelectedAmount = () => {
        if (!selectedSubPlan) return 0;
        return selectedTier === 'Premium'
            ? selectedSubPlan.premiumPrice
            : selectedTier === 'Advanced'
                ? selectedSubPlan.advancedPrice
                : selectedSubPlan.basePrice;
    };



    return (
        <Elements stripe={stripePromise}>
            <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-[#1B3A64]/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
                {view === 'grid' && !selectedGoal && (
                    <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-[94vw] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-4 sm:my-8 relative">
                        <div className="flex justify-between items-center p-6 sm:p-8 pb-4">
                            <h2 className="text-3xl font-black text-[#1B3A64]">Select An Application</h2>
                            <button onClick={handleClose} className="bg-[#1B3A64] hover:bg-[#132a4a] text-white rounded-full p-2 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="w-full max-w-[95vw] sm:max-w-[86vw] lg:max-w-[78rem] max-h-[92vh] flex flex-col bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative my-4 sm:my-8">
                        <div className="flex flex-col sm:flex-row items-start justify-between px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-4 shrink-0 gap-4">
                            <div className="flex-1 text-center">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#fff1f2] border border-[#f9c8d3] text-xs font-semibold text-[#e11d48]">
                                    {selectedGoal.headerPill}
                                </span>
                                <h2 className="tracking-tight mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
                                    {selectedGoal.headerTitle}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    {selectedGoal.headerSubtitle}
                                </p>
                                <div className="mt-3 mx-auto w-16 h-0.5 bg-[#e11d48] rounded-full"></div>
                            </div>
                            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition shrink-0" aria-label="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6 flex-1 custom-scrollbar">
                            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                {selectedGoal.subPlans.map((plan: any) => (
                                    <div key={plan.id} className="relative rounded-2xl bg-white border p-5 flex flex-col border-slate-200/70 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="w-9 h-9 rounded-lg bg-[#fff1f2] flex items-center justify-center shrink-0">
                                                {getIcon(plan.iconType, "w-4.5 h-4.5 text-[#e11d48]")}
                                            </span>
                                            <h3 className="text-sm font-bold text-slate-900 leading-snug">{plan.title}</h3>
                                        </div>
                                        <p className="mt-3 text-xs text-slate-500">{plan.subtitle}</p>

                                        <div className="mt-3 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-slate-900">${plan.basePrice}</span>
                                            <span className="text-xs text-slate-500">starting</span>
                                        </div>

                                        <div className="mt-4 rounded-xl border border-slate-100 overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-2.5 text-xs border-b border-slate-100">
                                                <span className="text-slate-700">Basic Package</span>
                                                <span className="font-semibold text-slate-900">${plan.basePrice}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5 text-xs border-b border-slate-100 bg-slate-50/50">
                                                <span className="text-slate-700">Advanced Package</span>
                                                <span className="font-semibold text-slate-900">${plan.advancedPrice}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                                                <span className="text-slate-700">Premium Package</span>
                                                <span className="font-semibold text-slate-900">${plan.premiumPrice}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#e11d48]" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Processing Time</p>
                                                <p className="text-xs font-semibold text-slate-900">{plan.processingTime}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wide flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Requirements
                                            </p>
                                            <ul className="mt-2 space-y-1.5">
                                                {plan.requirements.map((req: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                                        <CheckCircle2 className="w-3 h-3 text-[#f43f5e] mt-0.5 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-auto pt-5">
                                            <button onClick={() => handleSelectSubPlan(plan)} className="w-full py-2.5 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                                                Get Started <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button className="mt-2 w-full text-xs text-orange-600 hover:text-orange-700 font-medium">Learn More</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'tiers' && selectedSubPlan && (
                    <div className="w-full max-w-[95vw] sm:max-w-[86vw] lg:max-w-[56rem] max-h-[92vh] flex flex-col bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-lg animate-in fade-in duration-200 relative my-4 sm:my-8">
                        <div className="flex flex-col sm:flex-row items-start justify-between px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-4 gap-4">
                            <div>
                                <h2 className="tracking-tight text-2xl sm:text-3xl font-bold text-slate-900">{selectedSubPlan.title}</h2>
                                <p className="mt-2 text-sm text-slate-500">You can finish your application after this purchase</p>
                            </div>
                            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition shrink-0" aria-label="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>

                        <div className="border-t border-slate-200 mx-4 sm:mx-6 md:mx-10"></div>

                        <div className="overflow-y-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6 flex-1">
                            <p className="text-sm text-slate-700">
                                Questions? Please chat with us below, or call: <span className="font-medium">(844) 488-5245</span>
                            </p>
                            <h3 className="mt-5 text-lg font-bold text-slate-900">Select which level of service you need</h3>

                            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-2xl bg-white border border-slate-200/70 overflow-hidden flex flex-col shadow-sm">
                                    <div className="bg-[#fff1f2] py-4 text-center">
                                        <p className="text-lg font-bold text-slate-900">Basic</p>
                                    </div>
                                    <div className="px-6 py-8 text-center flex-1 flex flex-col">
                                        <p className="text-4xl font-bold text-slate-900">${selectedSubPlan.basePrice}</p>
                                        <p className="mt-6 text-sm text-slate-500">Do-it-yourself application preparation</p>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <button onClick={() => handleSelectTier('Basic')} className="w-full py-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                                            Select <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white border border-slate-200/70 overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(225,29,72,0.18)]">
                                    <div className="bg-[#fff1f2] py-4 text-center">
                                        <p className="text-lg font-bold text-slate-900">Advanced</p>
                                    </div>
                                    <div className="px-6 py-8 text-center flex-1 flex flex-col">
                                        <p className="text-4xl font-bold text-slate-900">${selectedSubPlan.advancedPrice}</p>
                                        <p className="mt-6 text-sm text-slate-500">Do-it-yourself application preparation</p>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <button onClick={() => handleSelectTier('Advanced')} className="w-full py-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                                            Select <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white border border-slate-200/70 overflow-hidden flex flex-col shadow-sm">
                                    <div className="bg-[#fff1f2] py-4 text-center">
                                        <p className="text-lg font-bold text-slate-900">Premium</p>
                                    </div>
                                    <div className="px-6 py-8 text-center flex-1 flex flex-col">
                                        <p className="text-4xl font-bold text-slate-900">${selectedSubPlan.premiumPrice}</p>
                                        <p className="mt-6 text-sm text-slate-500">Do-it-yourself application preparation</p>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <button onClick={() => handleSelectTier('Premium')} className="w-full py-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                                            Select <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'agreement' && selectedSubPlan && (
                    <div className="relative z-50 w-full max-w-[95vw] sm:max-w-[86vw] lg:max-w-[56rem] mx-auto p-3 sm:p-6 shadow-lg duration-200 bg-[#F5F5F5] rounded-3xl overflow-hidden border-0 [&>button]:hidden">
                        <h2 className="text-lg font-semibold leading-none tracking-tight sr-only">Limited Scope Representation Agreement</h2>

                        <div className="relative px-4 sm:px-8 pt-7 pb-5 border-b border-slate-200/70">
                            <button onClick={handleClose} aria-label="Close" className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#0B2545] hover:bg-[#0a1f3d] text-white flex items-center justify-center transition shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-4 h-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                            <h2 className="text-xl md:text-2xl font-bold tracking-wide text-[#0B2545] uppercase pr-12">Limited Scope Representation Agreement</h2>
                            <p className="mt-1 text-sm text-sky-700/80">You can finish your application after this purchase</p>
                        </div>

                        <div className="px-4 sm:px-8 py-6 max-h-[60vh] overflow-y-auto text-[13.5px] leading-relaxed text-slate-700 space-y-4">
                            <p>THIS LIMITED SCOPE REPRESENTATION AGREEMENT ("Agreement") is made between you, a Horizon Pathways customer and the Immigration Attorney ("Attorney") who has agreed to provide Services as defined below to you. You and Attorney agree that Attorney is not engaged to represent you generally in your immigration case. Rather, Attorney's representation of you is limited to the Services defined below, and nothing more, unless you and Attorney otherwise agree separately in writing.</p>

                            <p>Horizon Pathways, Inc. ("Horizon Pathways") is not a party to this Agreement. Your relationship with Horizon Pathways is governed by the company's Terms and Conditions and Privacy Policy.</p>

                            <p>As part of the services made available to you at HorizonPathways.us, Horizon Pathways has made arrangements with independent immigration attorneys to perform legal consultations for you and/or limited reviews of immigration documents you generate using Horizon Pathways' software. Attorney is not an employee of Horizon Pathways and is an independent practitioner. During the delivery of Services, Attorney will exercise their independent professional judgment, without influence or control by Horizon Pathways.</p>

                            <p>Attorney must act in your best interest while providing the Services defined in this Agreement in a competent manner. However, because you and Attorney have agreed that Attorney will provide only limited legal help:</p>

                            <p>Attorney DOES NOT have to give more help than described in this Agreement, and<br />Attorney DOES NOT HAVE TO HELP you with any other part of your immigration benefits application, case, or legal matter.<br />While performing the Services defined in this Agreement, you specifically agree that:</p>

                            <p>Attorney DOES NOT promise any specific outcome of your immigration benefits application, case, or legal matter;<br />Attorney will RELY ENTIRELY on your description of the facts you provide to them via the Horizon Pathways website about your case and WILL NOT conduct any independent investigation;<br />Attorney's representation of you ends when Horizon Pathways delivers your immigration documents to you or when the Attorney advises against filing the immigration documents you selected; and<br />Attorney may advise you that a limited scope representation is not reasonable in your case and advise that you need additional services or more comprehensive services of another attorney.</p>

                            <h3 className="font-bold text-[#0B2545] pt-2">INCLUDED SERVICES</h3>
                            <p>Depending on the product you purchased, the Services to be provided will consist of the following:</p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>If you purchased the <strong>Premium</strong> package, you have the option of scheduling up to three consultations with the Attorney and the Attorney will review your immigration application documents before you receive them from Horizon Pathways.</li>
                                <li>If you purchased the <strong>Advanced</strong> package, you have the option of scheduling one consultation with the Attorney and the Attorney will review your immigration documents before you receive them from Horizon Pathways.</li>
                                <li>If you purchased the <strong>Basic</strong> package, the Attorney will only review your immigration application documents before you receive them from Horizon Pathways.</li>
                            </ul>
                            <p>Consultation Services include the following and no more:</p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>Attorney review of the facts you provided to the Attorney via the Horizon Pathways website.</li>
                                <li>Attorney will provide verbal or written feedback discussing your personal legal immigration options, based on the facts you provided via the Horizon Pathways website.</li>
                            </ul>
                            <p>Immigration application document review services include the following and no more:</p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>Attorney will review the application you completed using the Horizon Pathways website and review your application to check for typographical errors, inconsistent or incorrect data, illogical entries, or internal conflicts in the application.</li>
                                <li>Attorney will confirm you are eligible for the immigration benefit you are seeking.</li>
                                <li>Attorney will correct omissions of critical information that Attorney identifies that may cause rejection by the government.</li>
                                <li>Attorney will review your filing timeline in an effort to avoid application rejection.</li>
                                <li>Attorney will advise you about the immigration benefit you are seeking and provide written feedback typically within 7-10 business days. However, due to circumstances Attorney cannot foresee Attorney may need additional time to deliver your feedback to you. When these circumstances occur Attorney will rely on Horizon Pathways to inform you.</li>
                            </ul>
                            <h3 className="font-bold text-[#0B2545] pt-2">SERVICES THAT ARE NOT INCLUDED</h3>
                            <p>The following services are not included and will not be provided by the Attorney, unless otherwise agreed to in writing:</p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>Representation before the United States Citizenship and Immigration Service ("USCIS"), the Board of Immigration Appeals ("BIA"), the Executive Office for Immigration Review ("EOIR"), the Department of Labor ("DOL"), the State Department, any United States Federal Court, state court, local city or municipal court, or any other governmental agency or administrative body in any legal proceeding.</li>
                                <li>Independent investigation of the facts related to your application or petition for immigration benefits.</li>
                                <li>Counsel through communications with third parties on your behalf.</li>
                                <li>Advice, counsel, or representation for any other type of case or legal matter not included within the definition of Services.</li>
                            </ul>
                            <h3 className="font-bold text-[#0B2545] pt-2">HORIZON PATHWAYS PROVIDING THIRD-PARTY PAYMENT</h3>
                            <p>By clicking the "I agree" button at the time of your purchase you consent to Horizon Pathways serving as a third-party payor for the legal services included in the package you selected and that are itemized in your purchase receipt. As part of this third-party payment arrangement, Attorney agrees to exercise their independent professional judgement, in accordance with the ethical and professional obligations that govern lawyers in the state(s) which they are licensed.</p>
                            <h3 className="font-bold text-[#0B2545] pt-2">YOUR OBLIGATIONS</h3>
                            <p>You retain control over all aspects of your immigration matter and remain responsible for all decisions made during your immigration matter. You agree to (a) provide truthful and complete information when completing your application using the Horizon Pathways software and website; (b) provide truthful and complete information in any communications between you and Attorney; (c) carefully consider Attorney's advice before making any major decisions regarding your immigration application or case; (d) advise Attorney of any new developments or new or changed information related to your application or immigration matter of which you learn during the course of this Agreement and prior to any consultations with Attorney; (e) as part of your experience with Horizon Pathways, that it is your responsibility to send your immigration benefit application to the appropriate USCIS office for processing and adjudication.</p>
                            <h3 className="font-bold text-[#0B2545] pt-2">TERMINATION OF AGREEMENT</h3>
                            <p>Unless you and Attorney otherwise agree in writing, this Agreement, and Attorney's representation of you, shall automatically terminate when you receive your immigration application documents from Horizon Pathways or when Attorney completes the Services you purchased, whichever comes first. You may terminate this Agreement for any or no reason at any time. Attorney may terminate this Agreement if, in Attorney's sole judgment, you have failed to fulfill one or more of your material obligations under this Agreement, for other good cause, or any reason authorized or required by law, rule or regulation, including professional rules and/or ethics rules that govern the conduct of Attorneys.</p>
                            <h3 className="font-bold text-[#0B2545] pt-2">ENTIRE AGREEMENT</h3>
                            <p>This document represents the entire and exclusive agreement between you and Attorney. It supersedes and replaces any and all prior oral or written understandings or agreements made to you by Attorney regarding the Services discussed herein.</p>
                            <h3 className="font-bold text-[#0B2545] pt-2">YOUR INFORMED CONSENT</h3>
                            <p>You are agreeing to the terms of this Agreement and that:</p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>You confirm that you have read this entire Limited Scope Representation Agreement and understand all of its terms, and that you understand and accept the limitations on the scope of Attorney's services provided herein, and your obligations identified above;</li>
                                <li>You give Attorney permission to share and disclose information, data, and/or facts pertinent to your immigration benefit application or case with Horizon Pathways solely for the purpose of facilitating generation of the immigration benefit application form you have selected and understand that such communications are to be kept confidential by Horizon Pathways and Attorney, in accordance with the same level of privacy required by the Attorney under the rules that govern Attorney's communications with you; and</li>
                                <li>Unless you and the Attorney otherwise agree in writing, Attorney is not your attorney for any other purpose, and Attorney has no obligation to provide you any more assistance than the Services defined above.</li>
                            </ul>
                        </div>

                        <div className="px-4 sm:px-8 py-5 border-t border-slate-200/70 bg-white space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 w-5 h-5 rounded border-slate-300 text-[#e11d48] focus:ring-[#f43f5e] cursor-pointer accent-[#e11d48]"
                                    checked={isAgreementChecked}
                                    onChange={(e) => setIsAgreementChecked(e.target.checked)}
                                />
                                <span className="text-sm text-slate-700 leading-snug">I have read and agree to the <strong>Limited Scope Representation Agreement</strong> and consent to Horizon Pathways acting as a third-party payor for the legal services included in my selected package.</span>
                            </label>

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button onClick={() => setView('tiers')} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAgreeAndContinue}
                                    disabled={!isAgreementChecked}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition ${isAgreementChecked ? 'bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : 'bg-slate-400 cursor-not-allowed opacity-50 shadow-none'}`}
                                >
                                    I Agree & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'questionnaire' && selectedSubPlan && (
                    <div className="w-full max-w-[95vw] sm:max-w-[86vw] lg:max-w-[40rem] flex flex-col bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-lg animate-in fade-in duration-200 relative my-4 sm:my-8">
                        <div className="flex flex-col items-start justify-between px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-4">
                            <h2 className="tracking-tight text-2xl font-bold text-slate-900 mb-1">Tell us about your needs</h2>
                            <p className="text-sm text-slate-500">We will dynamically add optional forms to your package based on your answers below.</p>
                            <button onClick={handleClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition" aria-label="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="border-t border-slate-200 mx-4 sm:mx-6 md:mx-10"></div>
                        
                        <div className="px-4 sm:px-6 md:px-10 py-6 space-y-6">
                            
                            {/* G-1145 is standard for most forms */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                                <h3 className="font-semibold text-slate-900 mb-2">Electronic Notifications</h3>
                                <p className="text-sm text-slate-600 mb-4">Would you like to receive electronic notifications (text/email) when your application is accepted?</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="g1145" checked={questionnaireAnswers.wants_g1145} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_g1145: true})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                        <span className="text-sm font-medium">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="g1145" checked={!questionnaireAnswers.wants_g1145} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_g1145: false})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                        <span className="text-sm font-medium">No</span>
                                    </label>
                                </div>
                            </div>

                            {/* EAD and AP for AOS specifically */}
                            {(selectedSubPlan.id === 'aos' || selectedSubPlan.title.includes('Adjustment of Status') || selectedSubPlan.title.includes('DACA')) && (
                                <>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                                        <h3 className="font-semibold text-slate-900 mb-2">Work Permit</h3>
                                        <p className="text-sm text-slate-600 mb-4">Would you like to apply for an Employment Authorization Document while your application is pending?</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="ead" checked={questionnaireAnswers.wants_ead} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_ead: true})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                                <span className="text-sm font-medium">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="ead" checked={!questionnaireAnswers.wants_ead} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_ead: false})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                                <span className="text-sm font-medium">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {(selectedSubPlan.id === 'aos' || selectedSubPlan.title.includes('Adjustment of Status')) && (
                                <>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                                        <h3 className="font-semibold text-slate-900 mb-2">Advance Parole</h3>
                                        <p className="text-sm text-slate-600 mb-4">Would you like to apply for a travel document so you may travel internationally while your application is pending?</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="ap" checked={questionnaireAnswers.wants_ap} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_ap: true})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                                <span className="text-sm font-medium">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="ap" checked={!questionnaireAnswers.wants_ap} onChange={() => setQuestionnaireAnswers({...questionnaireAnswers, wants_ap: false})} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                                <span className="text-sm font-medium">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                                        <h3 className="font-semibold text-slate-900 mb-2">Financial Sponsorship</h3>
                                        <p className="text-sm text-slate-600 mb-4">Will you require a Joint Sponsor or use income/assets from a Household Member to meet the financial sponsorship requirements?</p>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={questionnaireAnswers.wants_joint_sponsor} onChange={(e) => setQuestionnaireAnswers({...questionnaireAnswers, wants_joint_sponsor: e.target.checked})} className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300" />
                                                <span className="text-sm text-slate-700">Yes, I will need a Joint Sponsor</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={questionnaireAnswers.wants_household_member} onChange={(e) => setQuestionnaireAnswers({...questionnaireAnswers, wants_household_member: e.target.checked})} className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300" />
                                                <span className="text-sm text-slate-700">Yes, I will use a Household Member's income</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="px-4 sm:px-6 md:px-10 py-6 bg-slate-50 border-t border-slate-200">
                            <button onClick={handleContinueToAgreement} className="w-full py-3.5 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg">
                                Continue <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'checkout' && selectedSubPlan && (
                    <div className="w-full max-w-[95vw] sm:max-w-[650px]">
                        <CheckoutForm
                            selectedSubPlan={selectedSubPlan}
                            selectedTier={selectedTier}
                            handleClose={handleClose}
                            getSelectedAmount={getSelectedAmount}
                            questionnaireAnswers={questionnaireAnswers}
                        />
                    </div>
                )}
            </div>
        </Elements>
    );
}
