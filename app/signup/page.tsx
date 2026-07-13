'use client';
import React, { useState } from 'react';
import Link from 'next/link';

type Question = {
  question: string;
  options: string[];
};

type Pathways = {
  [key: string]: Question[];
};

const pathways: Pathways = {
  "Replace or fix a Green Card": [
    { question: "What happened to your Green Card?", options: ["It was lost, stolen, or destroyed", "It expired or will expire in 6 months", "It has incorrect information", "Other"] },
    { question: "Are you currently inside the United States?", options: ["Yes", "No"] },
    { question: "When was your Green Card originally issued?", options: ["Within the last 10 years", "More than 10 years ago", "I don't remember"] },
    { question: "Have you ever been arrested or convicted of a crime?", options: ["No", "Yes"] },
    { question: "Do you have a copy of your old Green Card or your receipt number?", options: ["Yes, both", "Yes, just a copy", "Yes, just the number", "No"] }
  ],
  "Bring a fiancé(e) or spouse/relative to the U.S.": [
    { question: "What is your relationship to the person you are sponsoring?", options: ["Spouse", "Fiancé(e)", "Parent", "Child", "Sibling"] },
    { question: "What is your current U.S. immigration status?", options: ["U.S. Citizen", "Lawful Permanent Resident"] },
    { question: "Where is the person you are sponsoring currently located?", options: ["Inside the U.S.", "Outside the U.S."] },
    { question: "Have you ever filed an immigration petition for this person before?", options: ["No", "Yes"] },
    { question: "What is the sponsored relative's current marital status?", options: ["Single", "Married", "Divorced", "Widowed"] },
    { question: "Can you financially support the person you are sponsoring (meet income requirements)?", options: ["Yes", "No", "I'm not sure"] },
    { question: "Does the relative have any children who will immigrate with them?", options: ["Yes", "No"] }
  ],
  "Apply for a Green Card while in the U.S. (Adjustment of Status)": [
    { question: "How did you enter the United States?", options: ["With a valid visa", "Without inspection", "Paroled into the U.S."] },
    { question: "Who is sponsoring your application?", options: ["A U.S. Citizen spouse/immediate relative", "An employer", "Other / Not sure"] },
    { question: "Are you currently in lawful immigration status?", options: ["Yes", "No", "I don't know"] },
    { question: "Have you ever worked in the U.S. without authorization?", options: ["No", "Yes"] },
    { question: "Have you ever been in immigration court or deportation proceedings?", options: ["No", "Yes"] }
  ],
  "Remove conditions on residence (marriage-based)": [
    { question: "Are you still married to the U.S. citizen or permanent resident spouse?", options: ["Yes, we are still married", "No, we are divorced or separated", "My spouse is deceased"] },
    { question: "When does your conditional Green Card expire?", options: ["Within the next 90 days", "In more than 90 days", "It has already expired"] },
    { question: "Do you and your spouse currently live together?", options: ["Yes", "No"] },
    { question: "Do you have joint financial documents (e.g. bank accounts, leases)?", options: ["Yes, many", "Yes, a few", "No"] }
  ],
  "DACA (Deferred Action) — Renewal": [
    { question: "When does your current DACA expire?", options: ["It is already expired", "Within 150 days", "In more than 150 days"] },
    { question: "Have you departed the U.S. without Advance Parole since your last DACA approval?", options: ["No", "Yes"] },
    { question: "Have you been arrested or convicted of any crime since your last DACA approval?", options: ["No", "Yes"] },
    { question: "Are you currently in school, graduated, or honorably discharged from the military?", options: ["Yes", "No"] },
    { question: "Do you have a copy of your previous DACA approval notice (I-797)?", options: ["Yes", "No"] }
  ],
  "Apply for U.S. Citizenship (Naturalization)": [
    { question: "How long have you had your Green Card?", options: ["Less than 3 years", "3-5 years (and married to U.S. citizen)", "More than 5 years"] },
    { question: "Have you taken any trips outside the U.S. lasting longer than 6 months?", options: ["No", "Yes"] },
    { question: "Are you at least 18 years old?", options: ["Yes", "No"] },
    { question: "Have you lived in your current state for at least 3 months?", options: ["Yes", "No"] },
    { question: "Have you ever claimed to be a U.S. citizen in writing or any other way?", options: ["No", "Yes"] },
    { question: "Have you ever failed to file your federal, state, or local taxes?", options: ["No", "Yes"] },
    { question: "Are you willing to take the full Oath of Allegiance to the United States?", options: ["Yes", "No"] },
    { question: "Can you read, write, and speak basic English?", options: ["Yes", "No", "I qualify for an exemption"] }
  ]
};

const goals = Object.keys(pathways);

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Goal selection, 1+ = questions, Final = account creation
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // New States for Flow
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    // Auto-advance after a brief delay to show selection state
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 350);
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    // Auto-advance after a brief delay
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 350);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      window.location.href = '/';
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedGoal(null);
    setAnswers({});
  };

  const questions = selectedGoal ? pathways[selectedGoal] : [];
  // Goal selection is step 1. Follow-up questions are step 2 to N.
  const totalSteps = selectedGoal ? questions.length + 1 : 8; // default to 8 for initial view as per screenshot
  const isQuestionsDone = currentStep > questions.length;
  
  // Progress calculation
  let progress = 0;
  if (isQuestionsDone) {
    progress = 100;
  } else {
    // Current step 0 is actually Step 1 in UI
    progress = ((currentStep + 1) / totalSteps) * 100;
  }
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h1 className="text-[44px] leading-tight font-black text-[#1B3A64] mb-2 tracking-tight">Immigration Assessment</h1>
            <p className="text-[#5A6579] font-medium text-[17px]">
              Answer a few questions to find the right immigration path for you
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[22px] font-bold text-[#1B3A64] mb-6 tracking-tight">What is your primary immigration goal today?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.map((goal, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoalSelect(goal)}
                  className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${
                    selectedGoal === goal 
                      ? 'border-[#E3755D] bg-[#FDFBF9] shadow-[0_10px_20px_rgba(227,117,93,0.1)]' 
                      : 'border-gray-200 bg-white hover:border-[#E3755D]/50 hover:shadow-sm'
                  }`}
                >
                  <div className="shrink-0 w-6 h-6 rounded-full border-[1.5px] border-[#E3755D] flex items-center justify-center transition-colors">
                    {selectedGoal === goal && (
                      <div className="w-3 h-3 rounded-full bg-[#E3755D]"></div>
                    )}
                  </div>
                  <div className="flex-grow flex justify-center items-center px-4">
                    <span className={`text-[15px] leading-snug font-bold text-center transition-colors ${selectedGoal === goal ? 'text-[#E3755D]' : 'text-[#1B3A64]'}`}>
                      {goal}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // After questions are done, show plan selection
    if (currentStep === questions.length + 1) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-[#EAF1F8] border border-blue-100/50 rounded-full px-5 py-2 mb-6 shadow-sm">
              <span className="text-[#1B3A64] text-[11px] font-bold tracking-[0.1em] uppercase">
                {selectedGoal}
              </span>
            </div>
            <h1 className="text-4xl md:text-[40px] font-black text-[#1B3A64] mb-4 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-[#5A6579] font-medium text-[17px] max-w-2xl mx-auto">
              Select the service level that best fits your needs and budget. We ensure your application is complete and accurate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-[20px] font-bold text-[#1B3A64] text-center mb-2">Basic Plan</h3>
              <p className="text-[#5A6579] text-center text-[13px] font-medium mb-6">Essential services for your application</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">$349.99</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Complete form preparation and review
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Dedicated case manager
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Step-by-step guidance
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  100% satisfaction guarantee
                </li>
              </ul>
              <button 
                onClick={() => {
                  setSelectedPlanName('Basic Plan');
                  setSelectedPlanPrice('$349.99');
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C8634D] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-[#E3755D] shadow-[0_15px_30px_rgba(227,117,93,0.15)] flex flex-col hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E3755D] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-[20px] font-bold text-[#1B3A64] text-center mb-2">Advanced Plan</h3>
              <p className="text-[#5A6579] text-center text-[13px] font-medium mb-6">Comprehensive services with review</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">$449.99</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Everything in Basic Plan
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Certified translation services
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Legal review by an attorney
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Priority 24-hour support
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Phone support for real-time assistance
                </li>
              </ul>
              <button 
                onClick={() => {
                  setSelectedPlanName('Advanced Plan');
                  setSelectedPlanPrice('$449.99');
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C8634D] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#FDFBF9] rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-[20px] font-bold text-[#1B3A64] text-center mb-2">Premium Plan</h3>
              <p className="text-[#5A6579] text-center text-[13px] font-medium mb-6">Full-service support with consultation</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">$599.99</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  All Advanced Benefits
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  30-minute 1-on-1 attorney consultation
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  USCIS Interview preparation kit
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Priority email support (6 hour response)
                </li>
                <li className="flex items-start text-[13px] text-[#5A6579] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Direct WhatsApp/Text support
                </li>
              </ul>
              <button 
                onClick={() => {
                  setSelectedPlanName('Premium Plan');
                  setSelectedPlanPrice('$599.99');
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C8634D] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === questions.length + 2) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[500px] mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#EAF1F8] rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100/50">
              <span className="material-icons text-[#1B3A64] text-[40px]">person_add</span>
            </div>
            <h1 className="text-4xl md:text-[40px] font-black text-[#1B3A64] mb-4 tracking-tight">Create Account</h1>
            <p className="text-[#5A6579] font-medium text-[17px]">
              Create an account to save your plan and start your application.
            </p>
          </div>

          <div className="bg-[#FDFBF9] border border-gray-100 rounded-[24px] p-8 shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)]">
            <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                setCurrentStep(prev => prev + 1); // Go to Verification Step
              }}>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">First Name</label>
                  <input type="text" placeholder="John" required className="w-full px-5 py-4 rounded-[16px] border border-gray-200 bg-white text-[#1B3A64] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] font-medium transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">Last Name</label>
                  <input type="text" placeholder="Doe" required className="w-full px-5 py-4 rounded-[16px] border border-gray-200 bg-white text-[#1B3A64] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] font-medium transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full px-5 py-4 rounded-[16px] border border-gray-200 bg-white text-[#1B3A64] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] font-medium transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full px-5 py-4 rounded-[16px] border border-gray-200 bg-white text-[#1B3A64] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] font-medium transition-all" />
              </div>
              <button type="submit" className="w-full bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold py-4 rounded-[16px] transition-all duration-300 shadow-[0_15px_30px_rgba(27,58,100,0.2)] hover:shadow-[0_20px_40px_rgba(27,58,100,0.3)] hover:-translate-y-1 mt-6 text-[16px]">
                Continue
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (currentStep === questions.length + 3) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[480px] mx-auto">
          <div className="bg-white border border-gray-200 rounded-[12px] p-8 md:p-10 shadow-sm text-center">
            
            <div className="w-16 h-16 bg-[#FFF2ED] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons text-[#E3755D] text-[28px]">mail_outline</span>
            </div>
            
            <h1 className="text-[24px] font-bold text-[#1B3A64] mb-3">Enter Verification Code</h1>
            <p className="text-[#5A6579] font-medium text-[15px] mb-8">
              We sent a 6-digit code to <span className="font-bold text-[#1B3A64]">{email || 'your email'}</span>
            </p>

            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 border border-gray-300 rounded-[8px] text-center text-[20px] font-bold text-[#1B3A64] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all bg-white"
                />
              ))}
            </div>

            <p className="text-[#5A6579] text-[14px] mb-6">
              Didn't get the code? Check your spam folder, or resend it below.
            </p>

            <button 
              onClick={() => setCurrentStep(prev => prev + 1)} // Mock verification success -> payment
              className="w-full bg-[#F8F9FA] hover:bg-gray-100 text-[#1B3A64] font-medium py-3.5 rounded-[8px] border border-gray-200 transition-all mb-4"
            >
              Resend verification code
            </button>
            
            <button 
              onClick={() => setCurrentStep(questions.length + 2)} // Go back to account details
              className="text-[#E3755D] hover:text-[#C8634D] text-[14px] font-medium transition-colors"
            >
              Use a different email address
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === questions.length + 4) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[500px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[#1B3A64] mb-3 tracking-tight">Complete Payment</h1>
            <p className="text-[#5A6579] font-medium text-[16px]">
              You're almost there! Enter your payment details below.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)]">
            <div className="bg-[#F8F9FA] p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#1B3A64] text-[16px]">{selectedPlanName}</h3>
                <p className="text-[13px] text-[#5A6579] font-medium">{selectedGoal}</p>
              </div>
              <div className="text-[24px] font-black text-[#E3755D]">{selectedPlanPrice}</div>
            </div>

            <form className="p-8 space-y-5" onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">Card Information</label>
                <div className="border border-gray-200 rounded-[12px] overflow-hidden bg-white">
                  <div className="flex items-center px-4 py-3 border-b border-gray-200">
                    <span className="material-icons text-gray-400 text-[20px] mr-3">credit_card</span>
                    <input type="text" placeholder="Card number" required className="w-full outline-none text-[#1B3A64] font-medium placeholder-gray-400" />
                  </div>
                  <div className="flex bg-white">
                    <input type="text" placeholder="MM / YY" required className="w-1/2 px-4 py-3 outline-none text-[#1B3A64] font-medium placeholder-gray-400 border-r border-gray-200" />
                    <input type="text" placeholder="CVC" required className="w-1/2 px-4 py-3 outline-none text-[#1B3A64] font-medium placeholder-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1B3A64] uppercase tracking-wider">Name on Card</label>
                <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-white text-[#1B3A64] outline-none focus:border-[#E3755D] font-medium" />
              </div>

              <button type="submit" className="w-full bg-[#1B3A64] hover:bg-[#0A192F] text-white font-bold py-4 rounded-[12px] transition-all duration-300 shadow-[0_10px_20px_rgba(27,58,100,0.2)] hover:-translate-y-0.5 mt-4 text-[16px] flex justify-center items-center space-x-2">
                <span className="material-icons text-[18px]">lock</span>
                <span>Pay & Create Account</span>
              </button>
            </form>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-[12px] text-gray-400 flex items-center justify-center font-medium">
              <span className="material-icons text-[14px] mr-1">security</span>
              Payments are secure and encrypted
            </p>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentStep - 1];
    const selectedAnswer = answers[currentStep];

    return (
      <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-10">
          <h1 className="text-[44px] leading-tight font-black text-[#1B3A64] mb-2 tracking-tight">Question {currentStep}</h1>
        </div>

        <div className="mb-12">
          <h2 className="text-[22px] font-bold text-[#1B3A64] mb-6 tracking-tight">{currentQuestion.question}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${
                  selectedAnswer === option 
                    ? 'border-[#E3755D] bg-[#FDFBF9] shadow-[0_10px_20px_rgba(227,117,93,0.1)]' 
                    : 'border-gray-200 bg-white hover:border-[#E3755D]/50 hover:shadow-sm'
                }`}
              >
                <div className="shrink-0 w-6 h-6 rounded-full border-[1.5px] border-[#E3755D] flex items-center justify-center transition-colors">
                  {selectedAnswer === option && (
                    <div className="w-3 h-3 rounded-full bg-[#E3755D]"></div>
                  )}
                </div>
                <div className="flex-grow flex justify-center items-center px-4">
                  <span className={`text-[15px] leading-snug font-bold text-center transition-colors ${selectedAnswer === option ? 'text-[#E3755D]' : 'text-[#1B3A64]'}`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="w-full min-h-screen bg-[#FDFBF9] pt-32 pb-24 px-4 md:px-8 lg:px-16 flex items-center justify-center">
      
      {isQuestionsDone ? (
        // Post-Questionnaire Views (Plan Selection, Account, Verification, Payment)
        <div className="w-full">
          {renderContent()}
        </div>
      ) : (
        // Questionnaire View - Card Layout
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[40px] shadow-[0_20px_50px_-15px_rgba(27,58,100,0.1)] border border-gray-100 overflow-hidden flex min-h-[650px] relative">
          
          {/* Left Side - Image/Illustration */}
          <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-6 border border-white/20 shadow-sm">
                <span className="text-white text-[11px] font-bold tracking-[0.1em] uppercase">Horizon Pathways</span>
              </div>
              <p className="text-[18px] font-medium leading-relaxed max-w-md text-[#A3B8CC]">
                Start your U.S. immigration journey with confidence. Answer a few quick questions and we'll guide you to the right path — with experienced attorneys by your side.
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-[60%] flex flex-col p-8 sm:p-12 lg:p-16 relative">
            <div className="w-full max-w-[600px] mx-auto flex-grow flex flex-col justify-center">
              
              <div className="flex items-center mb-10 w-full">
                <button onClick={handleBack} className="inline-flex items-center space-x-2 text-[#5A6579] font-bold hover:text-[#1B3A64] transition-colors">
                  <span className="material-icons text-[20px]">arrow_back</span>
                  <span>Back</span>
                </button>
              </div>

              {!isQuestionsDone && (
                <div className="mb-10 w-full">
                  <div className="text-[#1B3A64] font-bold text-[15px] mb-3">
                    Step {currentStep + 1} of {totalSteps}
                  </div>
                  <div className="w-full h-2 bg-[#F8F9FA] rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E3755D] to-[#C8634D] rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex-grow w-full flex flex-col justify-center">
                {renderContent()}
              </div>

              {!isQuestionsDone && (
                <div className="flex justify-end pb-2 mt-12 w-full">
                  <button 
                    onClick={handleRestart}
                    className="bg-[#F8F9FA] hover:bg-gray-100 text-[#5A6579] hover:text-[#1B3A64] font-bold py-3 px-6 rounded-xl transition-colors flex items-center space-x-2 border border-gray-200"
                  >
                    <span className="material-icons text-[18px]">refresh</span>
                    <span>Restart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
