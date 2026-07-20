'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

type Question = {
  question: string;
  options: string[];
  disqualifyingOptions?: string[];
  skipToEndOptions?: string[];
};

type Pathways = {
  [key: string]: Question[];
};

const pathways: Pathways = {
  "Replace or fix a Green Card": [
    { question: "Do you currently live in the United States?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "What is your current immigration status?", options: ["I have permanent resident status", "I have non-permanent resident status"], disqualifyingOptions: ["I have non-permanent resident status"] },
    { question: "What is the current status of your Green Card?", options: ["Lost, Stolen, Damage or Destroyed Green Card", "Card Expired or Expiring Soon", "Card Issued but Never Received", "Incorrect Information on Card (USCIS Error)", "Biographic Information Changed (Name)", "Biographic Information Changed (Gender)", "Turning 14 Years Old", "None of the Above"], skipToEndOptions: ["Lost, Stolen, Damage or Destroyed Green Card", "Card Issued but Never Received", "Incorrect Information on Card (USCIS Error)", "Biographic Information Changed (Name)", "Biographic Information Changed (Gender)", "Turning 14 Years Old"], disqualifyingOptions: ["None of the Above"] }
  ],
  "Bring a fiancé(e) or spouse/relative to the U.S.": [
    { question: "Who do you want to bring to the United States?", options: ["Fiancé(e)", "Spouse", "Child/Step Child", "Parent", "Sibling"] }
  ],
  "Adjust status to permanent resident / get a Green Card while in US": [
    { question: "Are you currently in the United States?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "Did you enter the United States through \"inspection and admission\" or \"inspection and parole\"?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "What criteria do you meet to qualify for a Green Card?", options: ["Family", "Employment", "Asylum/Special US government provisions", "None of the Above"], disqualifyingOptions: ["Employment", "Asylum/Special US government provisions", "None of the Above"] },
    { question: "What's your family relationship with the petitioner?", options: ["Spouse", "Child", "Parent", "None of the above"], disqualifyingOptions: ["None of the above"] }
  ],
  "Remove conditions on residence (marriage-based conditional LPR)": [
    { question: "Do you currently hold a Green Card?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "What is the basis for your conditional green card?", options: ["A marriage to a U.S. citizen or legal permanent resident (LPR)", "My parents' marriage to a U.S. citizen or legal permanent resident (LPR)", "Employment in the U.S."], disqualifyingOptions: ["Employment in the U.S."] },
    { question: "Are you currently residing in the United States?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "How do you plan to file?", options: ["File jointly with my spouse", "Request a waiver to file alone"], disqualifyingOptions: ["Request a waiver to file alone"] }
  ],
  "DACA (Deferred Action) — Renewal": [
    { question: "What is the current status of your DACA?", options: ["My DACA has not yet expired", "My DACA expired less than one year ago", "My DACA expired more than one year ago", "My DACA was terminated by USCIS"], disqualifyingOptions: ["My DACA expired more than one year ago", "My DACA was terminated by USCIS"] },
    { question: "Have you maintained continuous residence in the U.S. since your last DACA was Approved?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "Have you been convicted of any of the following since your last DACA approval?", options: ["A felony", "A significant misdemeanor", "Three or more other misdemeanors (that occurred on different dates and did not arise from the same incident)", "No, I have not been convicted of any of the above"], disqualifyingOptions: ["A felony", "A significant misdemeanor", "Three or more other misdemeanors (that occurred on different dates and did not arise from the same incident)"] },
    { question: "Do you pose a threat to national security or public safety?", options: ["No", "Yes"], disqualifyingOptions: ["Yes"] }
  ],
  "Apply for U.S. Citizenship (Naturalization)": [
    { question: "Were either or both of your parents U.S. citizens at the time of your birth?", options: ["Yes", "No"], disqualifyingOptions: ["Yes"] },
    { question: "Are you 18 years old or older?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "Are you a member of the United States armed forces?", options: ["Yes", "No"], disqualifyingOptions: ["Yes"] },
    { question: "Are you a lawful permanent resident of the United States?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "How long have you been a lawful permanent resident of the United States?", options: ["At least 4 years and 9 months", "At least 2 years and 9 months, married to a U.S. citizen during that time", "None of the above"], disqualifyingOptions: ["None of the above"] },
    { question: "Are you currently in the United States and have you maintained continuous residence here?", options: ["Yes", "No"], disqualifyingOptions: ["No"] },
    { question: "Have you been physically present in the United States for at least 30 months during the past 5 years, OR at least 18 months in the last 3 years if you are married to a US citizen?", options: ["Yes", "No"], disqualifyingOptions: ["No"] }
  ]
};

const goals = Object.keys(pathways);

const getPackagePricing = (selectedGoal: string | null, answers: Record<number, string>) => {
  const defaultPricing = {
    title: "Choose Your Plan",
    basic: "$349.99",
    advanced: "$449.99",
    premium: "$599.99"
  };

  if (!selectedGoal) return defaultPricing;

  if (selectedGoal === "Adjust status to permanent resident / get a Green Card while in US") {
    if (answers[4] === "Spouse") {
      return { title: "Marriage Green Card inside the U.S. – Concurrent Filing", basic: "$629.99", advanced: "$949.99", premium: "$1249.99" };
    }
    if (answers[4] === "Parent") {
      return { title: "Parent Adjustment of Status inside the U.S. – Concurrent Filing", basic: "$599.99", advanced: "$949.99", premium: "$1249.99" };
    }
    if (answers[4] === "Child") {
      return { title: "Child Adjustment of Status inside the U.S. – Concurrent Filing", basic: "$599.99", advanced: "$949.99", premium: "$1249.99" };
    }
  }

  if (selectedGoal === "Bring a fiancé(e) or spouse/relative to the U.S.") {
    if (answers[1] === "Spouse" || answers[1] === "Fiancé(e)") {
      return { title: "Petition for a Spouse outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
    }
    if (answers[1] === "Child/Step Child") {
      return { title: "Petition for a Child outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
    }
    if (answers[1] === "Parent" || answers[1] === "Sibling") {
      return { title: "Petition for a Parent outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
    }
  }

  if (selectedGoal === "Remove conditions on residence (marriage-based conditional LPR)") {
    return { title: "Petition to Remove Conditions on Conditional Residence", basic: "$399.99", advanced: "$499.99", premium: "$699.99" };
  }

  if (selectedGoal === "Replace or fix a Green Card") {
    return { title: "Renew or Replace Permanent Resident Card", basic: "$349.99", advanced: "$449.99", premium: "$599.99" };
  }

  if (selectedGoal === "DACA (Deferred Action) — Renewal") {
    return { title: "DACA Renewal (Deferred Action for Childhood Arrivals)", basic: "$299.99", advanced: "$399.99", premium: "$539.99" };
  }

  if (selectedGoal === "Apply for U.S. Citizenship (Naturalization)") {
    return { title: "Application for U.S. Citizenship", basic: "$349.99", advanced: "$449.99", premium: "$649.99" };
  }

  return defaultPricing;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function SignupFlowContent() {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Goal selection, 1+ = questions, Final = account creation
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [skippedFromStep, setSkippedFromStep] = useState<number | null>(null);

  // New States for Flow
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const stripe = useStripe();
  const elements = useElements();

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    setIsRegistering(true);
    try {
      await api.post('/api/auth/send-otp', { email });
      setCurrentStep(questions.length + 3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setIsRegistering(true);
    try {
      await api.post('/api/auth/verify-otp', { email, otp: code });
      setCurrentStep(questions.length + 4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStripeCheckout = async () => {
    setIsRegistering(true);
    setError('');
    try {
      // 1. Register the user so their account exists when they return from Stripe
      try {
        await register({
          name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: password,
          goal: selectedGoal || '',
          plan: selectedPlanName
        }, true);
      } catch (err: any) {
        // If they already registered (e.g. they clicked back), we can just proceed.
        // Or if it fails for another reason, we might want to log it, but we'll try to proceed to payment.
        console.log("Registration info:", err);
      }

      // 2. Prepare payment sum and description
      const baseAmount = parseFloat(selectedPlanPrice.replace('$', '')) || 0;
      const addonsList = [
        { id: 'translation', name: 'Document Translation', price: 25 },
        { id: 'notary', name: 'Certified Copy & E-Notary', price: 15 },
        { id: 'expedited', name: 'Expedited Form Preparation', price: 100 }
      ];
      const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + (addonsList.find(a => a.id === addonId)?.price || 0), 0);
      const amount = baseAmount + addonsTotal;

      let planDescription = "";
      if (selectedPlanName.includes("Basic")) {
        planDescription = "Complete form preparation and review, Dedicated case manager, Step-by-step guidance, 100% satisfaction guarantee";
      } else if (selectedPlanName.includes("Advanced")) {
        planDescription = "Everything in Basic Plan, Certified translation services, Legal review by an immigration attorney";
      } else if (selectedPlanName.includes("Premium")) {
        planDescription = "All Advanced Benefits, 30-minute 1-on-1 attorney consultation, USCIS Interview preparation kit, Priority email support";
      }

      if (selectedAddons.length > 0) {
        const addonNames = selectedAddons.map(id => addonsList.find(a => a.id === id)?.name).filter(Boolean);
        planDescription += " | Additional: " + addonNames.join(", ");
      }

      const pricing = getPackagePricing(selectedGoal, answers);
      const planTitle = `${pricing.title} - ${selectedPlanName}`;

      // 3. Get Stripe Checkout URL
      const response = await api.post('/api/payment/process', {
        amount: amount,
        email: email,
        plan: planTitle,
        goal: planDescription,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Payment processing failed');
      setIsRegistering(false);
    }
  };

  const handlePaymentAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      return;
    }

    setIsRegistering(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: email,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Extract raw amount (e.g., "$349.99" -> 349.99)
      const baseAmount = parseFloat(selectedPlanPrice.replace('$', '')) || 0;
      const addonsList = [
        { id: 'translation', price: 25 },
        { id: 'notary', price: 15 },
        { id: 'expedited', price: 100 }
      ];
      const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + (addonsList.find(a => a.id === addonId)?.price || 0), 0);
      const amount = baseAmount + addonsTotal;

      // Process payment with backend
      await api.post('/api/payment/process', {
        payment_method_id: paymentMethod.id,
        amount: amount,
        email: email
      });

      // Once payment is successful, register the user account
      await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
        goal: selectedGoal,
        plan: selectedPlanName
      });
      // Context will redirect to /dashboard
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Payment or registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    // Auto-advance after a brief delay to show selection state
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 350);
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));

    const currentQuestion = questions[currentStep - 1];
    if (currentQuestion?.disqualifyingOptions?.includes(answer)) {
      setTimeout(() => {
        setIsDisqualified(true);
      }, 350);
      return;
    }

    if (currentQuestion?.skipToEndOptions?.includes(answer)) {
      setTimeout(() => {
        setSkippedFromStep(currentStep);
        setCurrentStep(questions.length + 1);
      }, 350);
      return;
    }

    // Auto-advance after a brief delay
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 350);
  };

  const handleBack = () => {
    if (isDisqualified) {
      setIsDisqualified(false);
      return;
    }
    if (skippedFromStep !== null && currentStep === questions.length + 1) {
      setCurrentStep(skippedFromStep);
      setSkippedFromStep(null);
      return;
    }
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
    setIsDisqualified(false);
    setSkippedFromStep(null);
  };

  const getQuestions = () => {
    if (!selectedGoal) return [];

    let baseQuestions = [...pathways[selectedGoal]];

    if (selectedGoal === "Replace or fix a Green Card") {
      if (answers[3] === "Card Expired or Expiring Soon") {
        baseQuestions.push({
          question: "Is the Green Card valid for 2years or 10 years?",
          options: ["2 years", "10 years"],
          disqualifyingOptions: ["2 years"]
        });
      }
    } else if (selectedGoal === "Bring a fiancé(e) or spouse/relative to the U.S.") {
      if (answers[1] === "Fiancé(e)") {
        baseQuestions.push({
          question: "Are you a citizen of the United States?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Is your fiancé currently outside of the United States?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Have you met your fiancé in person in the past two years?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });

            if (answers[4] === "Yes") {
              baseQuestions.push({
                question: "Are you and your fiancé(e) legally free to marry? (This means being single, lawfully divorced, or separated)",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });

              if (answers[5] === "Yes") {
                baseQuestions.push({
                  question: "Do you and your fiancé plan to get married within 90 days of arriving in the US?",
                  options: ["Yes", "No"],
                  disqualifyingOptions: ["No"]
                });
              }
            }
          }
        }
      } else if (answers[1] === "Spouse") {
        baseQuestions.push({
          question: "Are you a United States citizen or a legal permanent resident?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Are you at least or will be 18 years old by the time you apply to USCIS?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Are you currently residing in the United States or have a US domicile? (US military members and employees working for the US government abroad can also select YES)",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });

            if (answers[4] === "Yes") {
              baseQuestions.push({
                question: "Is your marriage legitimate and Bona fide?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });
            }
          }
        }
      } else if (answers[1] === "Child/Step Child") {
        baseQuestions.push({
          question: "Are you currently residing in the United States or have a US domicile? (US military members and employees working for the US government abroad can also select YES)",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "What is your immigration status?",
            options: ["US Citizen", "Lawful Permanent Resident (Green Card holder)", "None of the Above"],
            disqualifyingOptions: ["None of the Above"]
          });

          if (answers[3] === "Lawful Permanent Resident (Green Card holder)") {
            baseQuestions.push({
              question: "Is your child at least 21 years old or younger?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });

            if (answers[4] === "Yes") {
              baseQuestions.push({
                question: "Is your child currently married?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["Yes"]
              });
            }
          }
        }
      } else if (answers[1] === "Parent") {
        baseQuestions.push({
          question: "Are you currently residing in the United States or have a US domicile? (US military members and employees working for the US government abroad can also select YES)",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Are you at least 21 years of age?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Are you a United States Citizen?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });
          }
        }
      } else if (answers[1] === "Sibling") {
        baseQuestions.push({
          question: "Are you at least 21 years of age?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Are you a United States Citizen?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Are you related to your sibling in one of these ways?",
              options: ["You share at least one biological parent", "You are half-siblings", "You are step-siblings", "You are adopted siblings", "One of the above"],
              disqualifyingOptions: ["One of the above"]
            });

            if (answers[4] === "You are step-siblings") {
              baseQuestions.push({
                question: "Were your parents married to each other before your 18th birthday?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });
            } else if (answers[4] === "You are adopted siblings") {
              baseQuestions.push({
                question: "Were you or your sibling adopted before the age of 16?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });
            }
          }
        }
      }
    } else if (selectedGoal === "Adjust status to permanent resident / get a Green Card while in US") {
      if (answers[4] === "Spouse") {
        baseQuestions.push({
          question: "Is the petitioner at least or will be 18 years old by the time they apply to USCIS?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[5] === "Yes") {
          baseQuestions.push({
            question: "What is the immigration status of the Petitioner?",
            options: ["US Citizen", "Lawful Permanent Resident (Green Card holder)", "None of the Above"],
            disqualifyingOptions: ["None of the Above"]
          });

          if (answers[6] === "Lawful Permanent Resident (Green Card holder)") {
            baseQuestions.push({
              question: "Are you currently in legal status and will you remain in that status until your adjustment of Status application is approved?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });
          }
        }
      } else if (answers[4] === "Child") {
        baseQuestions.push({
          question: "Is the petitioner at least 21 years of age?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[5] === "Yes") {
          baseQuestions.push({
            question: "What is the immigration status of the Petitioner?",
            options: ["US Citizen", "Lawful Permanent Resident (Green Card holder)"],
            disqualifyingOptions: ["Lawful Permanent Resident (Green Card holder)"]
          });
        }
      } else if (answers[4] === "Parent") {
        baseQuestions.push({
          question: "Are you under 21 years of age?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[5] === "Yes") {
          baseQuestions.push({
            question: "Are you currently married?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["Yes"]
          });

          if (answers[6] === "No") {
            baseQuestions.push({
              question: "What is the immigration status of the Petitioner?",
              options: ["US Citizen", "Lawful Permanent Resident (Green Card holder)", "None of the Above"],
              disqualifyingOptions: ["None of the Above"]
            });

            if (answers[7] === "Lawful Permanent Resident (Green Card holder)") {
              baseQuestions.push({
                question: "Are you currently in legal status and will you remain in that status until your adjustment of Status application is approved?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });
            }
          }
        }
      }
    }

    return baseQuestions;
  };

  const questions = getQuestions();
  const totalSteps = questions.length;
  const isQuestionsDone = selectedGoal && currentStep > totalSteps;

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
    if (isDisqualified) {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-[600px] mx-auto text-center pt-8">
          <div className="w-20 h-20 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="material-icons text-white text-[36px]">warning_amber</span>
          </div>
          <h1 className="text-3xl md:text-[32px] font-black text-[#101F38] tracking-tight mb-4">Assessment Results</h1>

          <div className="w-16 h-1 bg-gradient-to-r from-[#E3755D] to-[#101F38] mx-auto mb-8 rounded-full"></div>

          <div className="bg-[#FDF3E4] border border-[#F3D9B8] rounded-[16px] p-8 shadow-sm text-left mb-10">
            <h3 className="flex items-center text-[17px] font-bold text-[#101F38] mb-4">
              <span className="material-icons text-[#E3755D] mr-2">auto_awesome</span>
              Based on your current circumstances
            </h3>
            <p className="text-[#5B6472] font-medium text-[15px] mb-4 leading-relaxed">
              Thank you for completing the eligibility assessment. Based on your responses, it appears that you may not qualify for this particular service at this time, or this immigration option is not currently offered.
            </p>
            <p className="text-[#5B6472] font-medium text-[15px] leading-relaxed">
              We encourage you to explore other available options or reach out to our team for personalized guidance. We're here to help you find the best possible pathway forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleRestart}
              className="w-full bg-[#E3755D] hover:bg-[#C93500] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <span className="material-icons mr-2 text-[20px]">refresh</span>
              Retake Assessment
            </button>
            <Link
              href="/"
              className="w-full bg-[#F8F9FA] hover:bg-[#E9ECEF] text-[#101F38] font-bold py-4 rounded-xl shadow-sm border border-gray-200 transition-all flex items-center justify-center"
            >
              <span className="material-icons mr-2 text-gray-500 text-[20px]">home</span>
              Go Home
            </Link>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="text-[14px] text-gray-500 font-medium">
            Have questions? <a href="/contact" className="text-[#E3755D] font-bold hover:underline">Contact our team</a> for personalized guidance.
          </div>
        </div>
      );
    }

    if (currentStep === 0) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h1 className="text-[44px] leading-tight font-black text-[#101F38] mb-2 tracking-tight">Immigration Assessment</h1>
            <p className="text-[#5B6472] font-medium text-[17px]">
              Answer a few questions to find the right immigration path for you
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[22px] font-bold text-[#101F38] mb-6 tracking-tight">What is your primary immigration goal today?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.map((goal, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoalSelect(goal)}
                  className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${selectedGoal === goal
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
                    <span className={`text-[15px] leading-snug font-bold text-center transition-colors ${selectedGoal === goal ? 'text-[#E3755D]' : 'text-[#101F38]'}`}>
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
      const pricing = getPackagePricing(selectedGoal, answers);

      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-[#FDF3E4] border border-[#F3D9B8] rounded-full px-5 py-2 mb-6 shadow-sm">
              <span className="text-[#101F38] text-[11px] font-bold tracking-[0.1em] uppercase">
                {selectedGoal}
              </span>
            </div>
            <h1 className="text-4xl md:text-[40px] font-black text-[#101F38] mb-4 tracking-tight">
              {pricing.title}
            </h1>
            <p className="text-[#5B6472] font-medium text-[17px] max-w-2xl mx-auto">
              Select the service level that best fits your needs and budget. We ensure your application is complete and accurate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-[20px] font-bold text-[#101F38] text-center mb-2">Basic Plan</h3>
              <p className="text-[#5B6472] text-center text-[13px] font-medium mb-6">Essential services for your application</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">{pricing.basic}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Complete form preparation and review
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Dedicated case manager
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Step-by-step guidance
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  100% satisfaction guarantee
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Basic Plan');
                  setSelectedPlanPrice(pricing.basic);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-[#E3755D] shadow-[0_15px_30px_rgba(227,117,93,0.15)] flex flex-col hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E3755D] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-[20px] font-bold text-[#101F38] text-center mb-2">Advanced Plan</h3>
              <p className="text-[#5B6472] text-center text-[13px] font-medium mb-6">Comprehensive services with review</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">{pricing.advanced}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Everything in Basic Plan
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Certified translation services
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Legal review by an attorney
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Priority 24-hour support
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Phone support for real-time assistance
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Advanced Plan');
                  setSelectedPlanPrice(pricing.advanced);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#FDFBF9] rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-[20px] font-bold text-[#101F38] text-center mb-2">Premium Plan</h3>
              <p className="text-[#5B6472] text-center text-[13px] font-medium mb-6">Full-service support with consultation</p>
              <div className="text-center mb-8">
                <span className="text-[32px] font-black text-[#E3755D]">{pricing.premium}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  All Advanced Benefits
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  30-minute 1-on-1 attorney consultation
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  USCIS Interview preparation kit
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Priority email support (6 hour response)
                </li>
                <li className="flex items-start text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check</span>
                  Direct WhatsApp/Text support
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Premium Plan');
                  setSelectedPlanPrice(pricing.premium);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-[#E3755D] hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
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
            <div className="w-20 h-20 bg-[#FDF3E4] rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#F3D9B8]">
              <span className="material-icons text-[#101F38] text-[40px]">person_add</span>
            </div>
            <h1 className="text-4xl md:text-[40px] font-black text-[#101F38] mb-4 tracking-tight">Create Account</h1>
            <p className="text-[#5B6472] font-medium text-[17px]">
              Create an account to save your plan and start your application.
            </p>
          </div>

          <div className="bg-[#FDFBF9] border border-gray-100 rounded-[24px] p-8 shadow-[0_15px_30px_-10px_rgba(16,31,56,0.08)]">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#0F172A] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#0F172A] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#0F172A] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 11V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 11H19C20.1046 11 21 11.8954 21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#0F172A] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 11V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 11H19C20.1046 11 21 11.8954 21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#0F172A] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-[#475569]">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
                />
                <span>
                  I agree to the <a href="/terms" className="text-[#F97316] font-semibold hover:underline">terms and conditions</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-[#0F172A] hover:bg-[#111827] text-white font-bold py-4 rounded-3xl transition duration-300 shadow-[0_20px_45px_rgba(15,23,42,0.15)] disabled:opacity-50"
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </form>
        </div>
        </div >
      );
}

if (currentStep === questions.length + 3) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[480px] mx-auto">
      <div className="bg-white border border-gray-200 rounded-[12px] p-8 md:p-10 shadow-sm text-center">

        <div className="w-16 h-16 bg-[#FDF3E4] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-icons text-[#E3755D] text-[28px]">mail_outline</span>
        </div>

        <h1 className="text-[24px] font-bold text-[#101F38] mb-3">Enter Verification Code</h1>
        <p className="text-[#5B6472] font-medium text-[15px] mb-8">
          We sent a 6-digit code to <span className="font-bold text-[#101F38]">{email || 'your email'}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              className="w-12 h-14 border border-gray-300 rounded-[8px] text-center text-[20px] font-bold text-[#101F38] outline-none focus:border-[#E3755D] focus:ring-1 focus:ring-[#E3755D] transition-all bg-white"
            />
          ))}
        </div>

        <p className="text-[#5B6472] text-[14px] mb-6">
          Didn't get the code? Check your spam folder, or resend it below.
        </p>

        <button
          onClick={handleVerifyOtp}
          disabled={isRegistering}
          className="w-full bg-[#101F38] hover:bg-[#0A1526] text-white font-bold py-3.5 rounded-[12px] transition-all duration-300 shadow-[0_10px_20px_rgba(16,31,56,0.2)] mb-4 disabled:opacity-50"
        >
          {isRegistering ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          onClick={() => handleSendOtp()}
          className="w-full bg-[#F8F9FA] hover:bg-gray-100 text-[#101F38] font-medium py-3.5 rounded-[8px] border border-gray-200 transition-all mb-4"
        >
          Resend verification code
        </button>

        <button
          onClick={() => setCurrentStep(questions.length + 2)} // Go back to account details
          className="text-[#E3755D] hover:text-[#C93500] text-[14px] font-medium transition-colors"
        >
          Use a different email address
        </button>
      </div>
    </div>
  );
}

if (currentStep === questions.length + 4) {
  const addons = [
    { id: 'translation', name: 'Document Translation (per page)', description: 'Professional translation of additional document pages', price: 25 },
    { id: 'notary', name: 'Certified Copy & E-Notary', description: 'Certified copies of your documents, Electronic notary services', price: 15 },
    { id: 'expedited', name: 'Expedited Form Preparation (48hrs)', description: 'Priority preparation of the full application packet', price: 100 }
  ];

  const baseAmount = parseFloat(selectedPlanPrice.replace('$', '')) || 0;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + (addons.find(a => a.id === addonId)?.price || 0), 0);
  const totalAmount = baseAmount + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const pricing = getPackagePricing(selectedGoal, answers);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1000px] mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#101F38] mb-3 tracking-tight">Your Order</h1>
        <p className="text-[#5B6472] font-medium text-[16px]">
          Review your selected plan and services
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-grow space-y-6">
          {/* Account Information */}
          <div className="bg-[#FDF3E4] border border-[#F3D9B8] rounded-[16px] p-6">
            <h3 className="text-[#E3755D] text-[20px] font-bold mb-2">Account Information</h3>
            <p className="text-[#5B6472] font-medium text-[15px]">{firstName} {lastName}</p>
            <p className="text-[#5B6472] font-medium text-[15px]">{email}</p>
          </div>

          {/* Plan Details */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[#101F38] text-[18px] font-bold mb-2">{pricing.title}</h3>
                <span className="bg-[#E3755D] text-white text-[11px] font-bold px-3 py-1 rounded-full">{selectedPlanName}</span>
              </div>
              <div className="text-[20px] font-black text-[#101F38]">{selectedPlanPrice}</div>
            </div>

            <div className="mt-6">
              <h4 className="text-[#101F38] font-bold text-[16px] mb-4">What's Included:</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-[14px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check_circle_outline</span>
                  Complete form preparation and review
                </li>
                <li className="flex items-start text-[14px] text-[#5B6472] font-medium">
                  <span className="material-icons text-[#E3755D] text-[18px] mr-2">check_circle_outline</span>
                  Dedicated case manager
                </li>
                {selectedPlanName.includes('Advanced') || selectedPlanName.includes('Premium') ? (
                  <li className="flex items-start text-[14px] text-[#5B6472] font-medium">
                    <span className="material-icons text-[#E3755D] text-[18px] mr-2">check_circle_outline</span>
                    Legal review by an attorney
                  </li>
                ) : null}
                {selectedPlanName.includes('Premium') ? (
                  <li className="flex items-start text-[14px] text-[#5B6472] font-medium">
                    <span className="material-icons text-[#E3755D] text-[18px] mr-2">check_circle_outline</span>
                    30-minute 1-on-1 attorney consultation
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[#101F38] text-[18px] font-bold mb-4">Additional Services</h3>
            <div className="space-y-4">
              {addons.map(addon => (
                <div
                  key={addon.id}
                  className={`border rounded-[12px] p-4 flex items-center cursor-pointer transition-colors ${selectedAddons.includes(addon.id) ? 'border-[#E3755D] bg-[#FDF3E4]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <div className="mr-4 shrink-0">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedAddons.includes(addon.id) ? 'border-[#E3755D] bg-[#E3755D]' : 'border-gray-300'}`}>
                      {selectedAddons.includes(addon.id) && <span className="material-icons text-white text-[14px]">check</span>}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="text-[#101F38] font-bold text-[15px]">{addon.name}</div>
                    <div className="text-[#5B6472] text-[13px]">{addon.description}</div>
                  </div>
                  <div className="text-[#101F38] font-bold text-[16px] shrink-0 ml-4">${addon.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[350px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm sticky top-6">
            <h3 className="text-[#101F38] text-[18px] font-bold mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div className="text-[#5B6472] font-medium text-[14px] pr-4">{pricing.title}</div>
                <div className="text-[#101F38] font-bold text-[14px] shrink-0">{selectedPlanPrice}</div>
              </div>
              {selectedAddons.map(id => {
                const addon = addons.find(a => a.id === id);
                if (!addon) return null;
                return (
                  <div key={addon.id} className="flex justify-between items-start">
                    <div className="text-[#5B6472] font-medium text-[14px] pr-4">{addon.name}</div>
                    <div className="text-[#101F38] font-bold text-[14px] shrink-0">${addon.price}</div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <div className="text-[#101F38] font-bold text-[16px]">Total</div>
              <div className="text-[24px] font-black text-[#101F38]">${totalAmount.toFixed(2)}</div>
            </div>

            {error && <div className="text-red-500 text-[14px] font-medium mb-4 text-center">{error}</div>}
            <button
              onClick={handleStripeCheckout}
              disabled={isRegistering}
              className="w-full bg-[#E3755D] hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[12px] transition-colors shadow-sm disabled:opacity-50"
            >
              {isRegistering ? 'Processing...' : 'Continue Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

if (currentStep === questions.length + 5) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[500px] mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#101F38] mb-3 tracking-tight">Complete Payment</h1>
        <p className="text-[#5B6472] font-medium text-[16px]">
          You're almost there! Enter your payment details below.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-[0_15px_30px_-10px_rgba(16,31,56,0.08)]">
        <div className="bg-[#F8F9FA] p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#101F38] text-[16px]">{selectedPlanName}</h3>
            <p className="text-[13px] text-[#5B6472] font-medium">{selectedGoal}</p>
          </div>
          <div className="text-[24px] font-black text-[#E3755D]">{selectedPlanPrice}</div>
        </div>

        <form className="p-8 space-y-5" onSubmit={handlePaymentAndRegister}>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#101F38] uppercase tracking-wider">Card Information</label>
            <div className="border border-gray-200 rounded-[12px] overflow-hidden bg-white px-4 py-4">
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#101F38',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#101F38] uppercase tracking-wider">Name on Card</label>
            <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-white text-[#101F38] outline-none focus:border-[#E3755D] font-medium" />
          </div>

          <button type="submit" disabled={!stripe || isRegistering} className="w-full bg-[#101F38] hover:bg-[#0A1526] text-white font-bold py-4 rounded-[12px] transition-all duration-300 shadow-[0_10px_20px_rgba(16,31,56,0.2)] hover:-translate-y-0.5 mt-4 text-[16px] flex justify-center items-center space-x-2 disabled:opacity-50">
            <span className="material-icons text-[18px]">lock</span>
            <span>{isRegistering ? 'Processing...' : 'Pay & Create Account'}</span>
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
      <h1 className="text-[44px] leading-tight font-black text-[#101F38] mb-2 tracking-tight">Question {currentStep}</h1>
    </div>

    <div className="mb-12">
      <h2 className="text-[22px] font-bold text-[#101F38] mb-6 tracking-tight">{currentQuestion.question}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswerSelect(option)}
            className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${selectedAnswer === option
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
              <span className={`text-[15px] leading-snug font-bold text-center transition-colors ${selectedAnswer === option ? 'text-[#E3755D]' : 'text-[#101F38]'}`}>
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
  <main className="w-full min-h-screen bg-[#F5F4F1] pt-32 pb-24 px-4 md:px-8 lg:px-16 flex items-center justify-center">
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        main, main * { font-family: 'Inter', sans-serif; }
      `}</style>

    {isQuestionsDone ? (
      // Post-Questionnaire Views (Plan Selection, Account, Verification, Payment)
      <div className="w-full">
        {renderContent()}
      </div>
    ) : (
      // Questionnaire View - Card Layout
      <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[32px] shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] border border-gray-100 overflow-hidden flex min-h-[680px] relative">

        {/* Left Side - Gradient Panel */}
        <div className="hidden lg:flex lg:w-[42%] relative items-center justify-center bg-gradient-to-br from-[#EC4899] via-[#F59E0B] to-[#4338CA] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.5),_transparent_35%)]"></div>
          <div className="absolute inset-y-0 right-0 w-2/3 bg-white/10 blur-2xl"></div>
          <div className="relative z-10 max-w-md px-12 py-14">
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-xl mb-10">
              <p className="text-sm uppercase tracking-[0.24em] font-semibold text-white/90">Begin your U.S. immigration journey</p>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-6">Immigration support made simple.</h2>
            <p className="text-base leading-7 text-white/85 max-w-xl">
              Track your case progress, manage documents, and get expert guidance every step of the way. Join thousands of applicants who trust Horizon Pathways to simplify their legal process.
            </p>
          </div>
          <div className="absolute bottom-8 left-10 right-10 rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm text-white/90">Get personalized immigration guidance with fast application support and payment plans designed for your needs.</p>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-[58%] py-10 px-8 sm:px-12 lg:px-14 relative">
          <div className="flex items-center gap-3 mb-10">
            <button onClick={handleBack} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"></path>
                <path d="M12 19L5 12L12 5"></path>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white text-lg font-black">H</div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Horizon</p>
                <p className="text-xs uppercase tracking-[0.28em] text-[#F97316] font-bold">PATHWAYS</p>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-[44px] font-black text-slate-950 mb-3">Create Account</h1>
            <p className="text-base text-slate-600 mb-10">Start your immigration journey with us.</p>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSendOtp}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Email Address</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-slate-900 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17 11V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 11H19C20.1046 11 21 11.8954 21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-slate-900 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">Confirm Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17 11V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 11H19C20.1046 11 21 11.8954 21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-slate-900 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316]"
                  />
                  <span>
                    I agree to the <a href="/terms" className="text-[#F97316] font-semibold hover:underline">terms and conditions</a>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full rounded-3xl bg-[#0F172A] py-4 text-sm font-semibold uppercase tracking-[0.04em] text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRegistering ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              Already have an account? <Link href="/login" className="font-semibold text-[#F97316] hover:underline">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>
);
}

function SignupFlow() {
  return (
    <Elements stripe={stripePromise}>
      <SignupFlowContent />
    </Elements>
  );
}

export default SignupFlow;