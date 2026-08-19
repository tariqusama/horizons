'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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



const stepImages: { [key: string]: string } = {
  default: "url('https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
  goalSelection: "url('https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=80')",
  statusQuestion: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')",
  familyQuestion: "url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80')",
  citizenshipQuestion: "url('https://images.unsplash.com/photo-1494496545165-4f0be2d4bd51?auto=format&fit=crop&w=1200&q=80')",
  dacaQuestion: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80')",
  adjustmentQuestion: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
};

const getQuestionBackgroundImage = (question?: string) => {
  if (!question) return undefined;
  const text = question.toLowerCase();
  if (text.includes('green card') || text.includes('permanent resident') || text.includes('replace') || text.includes('status')) {
    return stepImages.statusQuestion;
  }
  if (text.includes('fiancé') || text.includes('spouse') || text.includes('child') || text.includes('relative') || text.includes('petitioner')) {
    return stepImages.familyQuestion;
  }
  if (text.includes('citizenship') || text.includes('naturalization') || text.includes('parents') || text.includes('lawful permanent resident') || text.includes('present in the united states')) {
    return stepImages.citizenshipQuestion;
  }
  if (text.includes('daca') || text.includes('continuous residence') || text.includes('convicted') || text.includes('national security') || text.includes('public safety')) {
    return stepImages.dacaQuestion;
  }
  if (text.includes('conditional') || text.includes('marriage') || text.includes('waiver') || text.includes('file jointly')) {
    return stepImages.citizenshipQuestion;
  }
  if (text.includes('inspection') || text.includes('immigration status') || text.includes('lawful permanent resident')) {
    return stepImages.adjustmentQuestion;
  }
  return undefined;
};

const getSignupBackgroundImage = (selectedGoal: string | null, currentStep: number, question?: string, dynamicGoalImages: Record<string, string> = {}) => {
  if (currentStep === 0) {
    return stepImages.goalSelection;
  }

  const questionImage = getQuestionBackgroundImage(question);
  if (questionImage) {
    return questionImage;
  }

  if (selectedGoal) {
    return dynamicGoalImages[selectedGoal] ?? stepImages.default;
  }

  return stepImages.default;
};

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

  if (selectedGoal === "Bring a fiancé(e) to the U.S.") {
    return { title: "Petition for a Fiancé(e) outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$849.99", premium: "$1049.99" };
  }
  if (selectedGoal === "Bring a spouse to the U.S.") {
    return { title: "Petition for a Spouse outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
  }
  if (selectedGoal === "Bring a sibling to the U.S.") {
    return { title: "Petition for a Sibling outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
  }
  if (selectedGoal?.includes("relative to the U.S.")) {
    if (answers[1] === "Child/Step Child") {
      return { title: "Petition for a Child outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
    }
    if (answers[1] === "Parent") {
      return { title: "Petition for a Parent outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
    }
    return { title: "Petition for a Relative outside the U.S. – USCIS Petition only", basic: "$549.99", advanced: "$789.99", premium: "$999.99" };
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

const defaultStripeKey = 'pk_test_51QQ24fAJEL5Up1VaSpBRWbAfKrBCobEsVPtv2yo8eFSRJYKHs3GtB78nuyteFvcU0Q1RW5MtKQ5TMNk6R9vxbd8u00cwahnxJ9';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || defaultStripeKey;
const stripePromise = loadStripe(stripeKey);
const hasStripeEnvKey = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function SignupFlowContent() {
  const { register } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Goal selection, 1+ = questions, Final = account creation
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [skippedFromStep, setSkippedFromStep] = useState<number | null>(null);

  const [pathways, setPathways] = useState<Record<string, Question[]> | null>(null);
  const [goalImages, setGoalImages] = useState<Record<string, string>>({});
  const [goals, setGoals] = useState<string[]>([]);
  const [isLoadingPathways, setIsLoadingPathways] = useState(true);

  React.useEffect(() => {
    api.get('/public/signup-pathways')
      .then(res => {
        setPathways(res.data.pathways);
        setGoalImages(res.data.goalImages);
        setGoals(res.data.goals);
        setIsLoadingPathways(false);
      })
      .catch(err => {
        console.error("Failed to fetch pathways:", err);
        setIsLoadingPathways(false);
      });
  }, []);

  const [dynamicPricing, setDynamicPricing] = useState<{ title: string, basic: string, advanced: string, premium: string } | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);

  React.useEffect(() => {
    // Only run if pathways is loaded and we have a selected goal
    if (!pathways || !selectedGoal) return;

    // We recreate getQuestions logic here to find the length to avoid hook dependency cycle
    let baseQuestions = [...(pathways[selectedGoal] || [])];
    if (selectedGoal === "Replace or fix a Green Card") {
      if (answers[3] === "Card Expired or Expiring Soon") baseQuestions.push({ question: "dummy", options: [] });
    } else if (selectedGoal === "Bring a fiancé(e) to the U.S.") {
      baseQuestions.push({ question: "dummy", options: [] });
      if (answers[1] === "Yes") {
        baseQuestions.push({ question: "dummy", options: [] });
        if (answers[2] === "Yes") {
          baseQuestions.push({ question: "dummy", options: [] });
          if (answers[3] === "Yes") baseQuestions.push({ question: "dummy", options: [] });
        }
      }
    } else if (selectedGoal === "Bring a spouse to the U.S.") {
      baseQuestions.push({ question: "dummy", options: [] });
      if (answers[1] === "Yes") {
        baseQuestions.push({ question: "dummy", options: [] });
        if (answers[2] === "Yes") baseQuestions.push({ question: "dummy", options: [] });
      }
    } else if (selectedGoal === "Bring a sibling to the U.S.") {
      baseQuestions.push({ question: "dummy", options: [] });
      if (answers[1] === "Yes") baseQuestions.push({ question: "dummy", options: [] });
    } else if (selectedGoal === "Bring relative to the U.S.") {
      if (answers[1] === "Child/Step Child") {
        baseQuestions.push({ question: "dummy", options: [] });
        if (answers[2] === "Yes") {
          baseQuestions.push({ question: "dummy", options: [] });
          if (answers[3] === "Lawful Permanent Resident (Green Card holder)") {
            baseQuestions.push({ question: "dummy", options: [] });
            if (answers[4] === "Yes") baseQuestions.push({ question: "dummy", options: [] });
          }
        }
      } else if (answers[1] === "Parent") {
        baseQuestions.push({ question: "dummy", options: [] });
        if (answers[2] === "Yes") {
          baseQuestions.push({ question: "dummy", options: [] });
          if (answers[3] === "Yes") baseQuestions.push({ question: "dummy", options: [] });
        }
      }
    } else if (selectedGoal === "Adjust status to permanent resident / get a Green Card while in US") {
      if (answers[3] === "Family") {
        baseQuestions.push({ question: "dummy", options: [] });
        if (answers[4] === "Spouse") {
          baseQuestions.push({ question: "dummy", options: [] });
          if (answers[5] === "U.S. Citizen") baseQuestions.push({ question: "dummy", options: [] });
        }
      }
    }

    if (currentStep > 0 && currentStep === baseQuestions.length + 1 && !dynamicPricing && !isLoadingPricing) {
      setIsLoadingPricing(true);
      api.post('/public/signup-pricing', { goal: selectedGoal, answers })
        .then(res => {
          setDynamicPricing(res.data);
          setIsLoadingPricing(false);
        })
        .catch(err => {
          console.error("Failed to fetch pricing:", err);
          setIsLoadingPricing(false);
        });
    }
  }, [currentStep, selectedGoal, answers, dynamicPricing, isLoadingPricing, pathways]);



  // New States for Flow
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({
    wants_g1145: true,
    wants_ead: false,
    wants_ap: false,
    wants_joint_sponsor: false,
    wants_household_member: false
  });

  const getServiceId = (goal: string | null, formAnswers: Record<number, string>) => {
    if (!goal) return null;
    if (goal.includes("Adjust status")) return 'aos';
    if (goal.includes("fiancé(e)")) return 'fiance_petition';
    if (goal.includes("spouse to the U.S.")) return 'spouse';
    if (goal.includes("sibling to the U.S.")) return 'sibling';
    if (goal.includes("another relative")) {
      if (formAnswers[1] === "Child/Step Child") return 'child';
      if (formAnswers[1] === "Parent") return 'parent';
    }
    if (goal.includes("Remove conditions")) return 'i751';
    if (goal.includes("Replace or fix")) return 'i90';
    if (goal.includes("Citizenship")) return 'n400';
    return null;
  };

  const stripe = useStripe();
  const elements = useElements();

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
    { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
    { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
    { label: 'One number', test: (value: string) => /\d/.test(value) },
    { label: 'One special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
  ];

  const getPasswordValidation = (value: string) => {
    return passwordRequirements.map((requirement) => ({
      ...requirement,
      passed: requirement.test(value),
    }));
  };

  const passwordValidation = getPasswordValidation(password);
  const passwordScore = passwordValidation.filter((item) => item.passed).length;
  const passwordStrength = password.length === 0
    ? 'Enter a password'
    : passwordScore <= 2
      ? 'Weak'
      : passwordScore <= 4
        ? 'Fair'
        : 'Strong';
  const passwordProgressClass = password.length === 0
    ? 'bg-gray-200'
    : passwordScore <= 2
      ? 'bg-gradient-to-r from-red-500 to-red-400'
      : passwordScore <= 4
        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
        : 'bg-gradient-to-r from-emerald-500 to-emerald-400';

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    const passwordErrors = passwordValidation.filter((item) => !item.passed);
    if (passwordErrors.length > 0) {
      setError('Password must include at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    setIsRegistering(true);
    try {
      await api.post('/auth/send-otp', { email });
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
      await api.post('/auth/verify-otp', { email, otp: code });
      setCurrentStep(questions.length + 4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsRegistering(true);
    try {
      await api.post('/auth/send-otp', { email });
      setError('Verification code resent — check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStripeCheckout = async () => {
    setIsRegistering(true);
    setError('');
    try {
      // 1. Register the user so their account exists when they return from Stripe
      // Prepare payment sum
      const baseAmount = parseFloat(selectedPlanPrice.replace('$', '')) || 0;
      const addonsList = [
        { id: 'translation', name: 'Document Translation (per page)', price: 25 },
        { id: 'notary', name: 'Certified Copy & E-Notary', price: 15 },
        { id: 'expedited', name: 'Expedited Form Preparation (48hrs)', price: 100 }
      ];
      const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + ((addonsList.find(a => a.id === addonId)?.price || 0) * (addonQuantities[addonId] || 1)), 0);
      const amount = baseAmount + addonsTotal;

      // 1. Register the user so their account exists when they return from Stripe
      try {
        const addonsData = selectedAddons.map(id => ({
          id,
          name: addonsList.find(a => a.id === id)?.name || id,
          quantity: addonQuantities[id] || 1
        }));

        await register({
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`,
          email,
          password,
          password_confirmation: confirmPassword,
          goal: selectedGoal || '',
          plan: selectedPlanName,
          amount: amount,
          addons: addonsData,
          questionnaire: questionnaireAnswers,
          service_id: getServiceId(selectedGoal, answers)
        }, true);
      } catch (err: any) {
        // If they already registered (e.g. they clicked back), we can just proceed.
        // Or if it fails for another reason, we might want to log it, but we'll try to proceed to payment.
        console.log("Registration info:", err);
      }

      // 2. Prepare description
      let planDescription = "";
      if (selectedPlanName.includes("Basic")) {
        planDescription = "Complete form preparation and review, Dedicated case manager, Step-by-step guidance, 100% satisfaction guarantee";
      } else if (selectedPlanName.includes("Advanced")) {
        planDescription = "Everything in Basic Plan, Certified translation services, Legal review by an immigration attorney";
      } else if (selectedPlanName.includes("Premium")) {
        planDescription = "All Advanced Benefits, 30-minute 1-on-1 attorney consultation, USCIS Interview preparation kit, Priority email support";
      }

      if (selectedAddons.length > 0) {
        const addonNames = selectedAddons.map(id => {
          const a = addonsList.find(a => a.id === id);
          if (!a) return null;
          const qty = addonQuantities[id] || 1;
          return qty > 1 ? `${a.name} (x${qty})` : a.name;
        }).filter(Boolean);
        planDescription += " | Additional: " + addonNames.join(", ");
      }

      const pricing = getPackagePricing(selectedGoal, answers);
      const planTitle = `${pricing.title} - ${selectedPlanName}`;

      // 3. Get Stripe Checkout URL
      const response = await api.post('/payment/process', {
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
        { id: 'translation', name: 'Document Translation (per page)', price: 25 },
        { id: 'notary', name: 'Certified Copy & E-Notary', price: 15 },
        { id: 'expedited', name: 'Expedited Form Preparation (48hrs)', price: 100 }
      ];
      const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + ((addonsList.find(a => a.id === addonId)?.price || 0) * (addonQuantities[addonId] || 1)), 0);
      const amount = baseAmount + addonsTotal;

      // Process payment with backend
      await api.post('/payment/process', {
        payment_method_id: paymentMethod.id,
        amount: amount,
        email: email
      });

      const addonsData = selectedAddons.map(id => ({
        id,
        name: addonsList.find(a => a.id === id)?.name || id,
        quantity: addonQuantities[id] || 1
      }));

      // Once payment is successful, register the user account
      await register({
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        email,
        password,
        password_confirmation: confirmPassword,
        goal: selectedGoal,
        plan: selectedPlanName,
        amount: amount,
        addons: addonsData,
        questionnaire: questionnaireAnswers,
        service_id: getServiceId(selectedGoal, answers)
      }, true); // skip default redirect
      
      router.push('/welcome');
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
    if (!selectedGoal || !pathways) return [];

    let baseQuestions = [...(pathways[selectedGoal] || [])];

    if (selectedGoal === "Replace or fix a Green Card") {
      if (answers[3] === "Card Expired or Expiring Soon") {
        baseQuestions.push({
          question: "Is the Green Card valid for 2years or 10 years?",
          options: ["2 years", "10 years"],
          disqualifyingOptions: ["2 years"]
        });
      }
    } else if (selectedGoal === "Bring a fiancé(e) to the U.S.") {
      baseQuestions.push({
        question: "Are you a citizen of the United States?",
        options: ["Yes", "No"],
        disqualifyingOptions: ["No"]
      });

      if (answers[1] === "Yes") {
        baseQuestions.push({
          question: "Is your fiancé currently outside of the United States?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Have you met your fiancé in person in the past two years?",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Are you and your fiancé(e) legally free to marry? (This means being single, lawfully divorced, or separated)",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });

            if (answers[4] === "Yes") {
              baseQuestions.push({
                question: "Do you and your fiancé plan to get married within 90 days of arriving in the US?",
                options: ["Yes", "No"],
                disqualifyingOptions: ["No"]
              });
            }
          }
        }
      }
    } else if (selectedGoal === "Bring a spouse to the U.S.") {
      baseQuestions.push({
        question: "Are you a United States citizen or a legal permanent resident?",
        options: ["Yes", "No"],
        disqualifyingOptions: ["No"]
      });

      if (answers[1] === "Yes") {
        baseQuestions.push({
          question: "Are you at least or will be 18 years old by the time you apply to USCIS?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Are you currently residing in the United States or have a US domicile? (US military members and employees working for the US government abroad can also select YES)",
            options: ["Yes", "No"],
            disqualifyingOptions: ["No"]
          });

          if (answers[3] === "Yes") {
            baseQuestions.push({
              question: "Is your marriage legitimate and Bona fide?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });
          }
        }
      }
    } else if (selectedGoal === "Bring a sibling to the U.S.") {
      baseQuestions.push({
        question: "Are you at least 21 years of age?",
        options: ["Yes", "No"],
        disqualifyingOptions: ["No"]
      });

      if (answers[1] === "Yes") {
        baseQuestions.push({
          question: "Are you a United States Citizen?",
          options: ["Yes", "No"],
          disqualifyingOptions: ["No"]
        });

        if (answers[2] === "Yes") {
          baseQuestions.push({
            question: "Are you related to your sibling in one of these ways?",
            options: ["You share at least one biological parent", "You are half-siblings", "You are step-siblings", "You are adopted siblings", "One of the above"],
            disqualifyingOptions: ["One of the above"]
          });

          if (answers[3] === "You are step-siblings") {
            baseQuestions.push({
              question: "Were your parents married to each other before your 18th birthday?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });
          } else if (answers[3] === "You are adopted siblings") {
            baseQuestions.push({
              question: "Were you or your sibling adopted before the age of 16?",
              options: ["Yes", "No"],
              disqualifyingOptions: ["No"]
            });
          }
        }
      }
    } else if (selectedGoal === "Bring relative to the U.S.") {
      if (answers[1] === "Child/Step Child") {
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
  const currentQuestion = questions[currentStep - 1];
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
            <span className="material-icons text-white text-3xl sm:text-[36px]">warning_amber</span>
          </div>
          <h1 className="text-3xl md:text-[32px] font-black text-[#101F38] tracking-tight mb-4">Assessment Results</h1>

          <div className="w-16 h-1 bg-gradient-to-r from-[#E3755D] to-[#101F38] mx-auto mb-8 rounded-full"></div>

          <div className="bg-[#FDF3E4] border border-[#F3D9B8] rounded-[16px] p-6 sm:p-8 shadow-sm text-left mb-10">
            <h3 className="flex items-center text-base sm:text-[17px] font-bold text-[#101F38] mb-4">
              <span className="material-icons text-orange-500 mr-2 text-lg sm:text-[20px]">auto_awesome</span>
              Based on your current circumstances
            </h3>
            <p className="text-sm sm:text-[15px] text-[#5B6472] font-medium mb-4 leading-relaxed">
              Thank you for completing the eligibility assessment. Based on your responses, it appears that you may not qualify for this particular service at this time, or this immigration option is not currently offered.
            </p>
            <p className="text-sm sm:text-[15px] text-[#5B6472] font-medium leading-relaxed">
              We encourage you to explore other available options or reach out to our team for personalized guidance. We're here to help you find the best possible pathway forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#C93500] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <span className="material-icons mr-2 text-lg sm:text-[20px]">refresh</span>
              Retake Assessment
            </button>
            <Link
              href="/"
              className="w-full bg-[#F8F9FA] hover:bg-[#E9ECEF] text-[#101F38] font-bold py-4 rounded-xl shadow-sm border border-gray-200 transition-all flex items-center justify-center"
            >
              <span className="material-icons mr-2 text-gray-500 text-lg sm:text-[20px]">home</span>
              Go Home
            </Link>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="text-sm sm:text-[14px] text-gray-500 font-medium">
            Have questions? <a href="/contact" className="text-orange-500 font-bold hover:underline">Contact our team</a> for personalized guidance.
          </div>
        </div>
      );
    }

    if (isLoadingPathways) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (currentStep === 0) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-[44px] leading-tight font-black text-[#101F38] mb-2 tracking-tight">Immigration Assessment</h1>
            <p className="text-[#5B6472] font-medium text-base sm:text-[17px]">
              Answer a few questions to find the right immigration path for you
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-xl sm:text-[22px] font-bold text-[#101F38] mb-6 tracking-tight">What is your primary immigration goal today?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.map((goal, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoalSelect(goal)}
                  className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${selectedGoal === goal
                    ? 'border-orange-500 bg-[#FDFBF9] shadow-[0_10px_20px_rgba(227,117,93,0.1)]'
                    : 'border-gray-200 bg-white hover:border-orange-500/50 hover:shadow-sm'
                    }`}
                >
                  <div className="shrink-0 w-6 h-6 rounded-full border-[1.5px] border-orange-500 flex items-center justify-center transition-colors">
                    {selectedGoal === goal && (
                      <div className="w-3 h-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600"></div>
                    )}
                  </div>
                  <div className="flex-grow flex justify-center items-center px-4">
                    <span className={`text-sm sm:text-[15px] leading-snug font-bold text-center transition-colors ${selectedGoal === goal ? 'text-orange-500' : 'text-[#101F38]'}`}>
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
      if (isLoadingPricing || !dynamicPricing) {
        return (
          <div className="flex items-center justify-center min-h-[400px] w-full max-w-[1000px] mx-auto">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-[#5B6472] font-medium">Calculating your options...</p>
          </div>
        );
      }

      const pricing = dynamicPricing;

      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-[#FDF3E4] border border-[#F3D9B8] rounded-full px-5 py-2 mb-6 shadow-sm">
              <span className="text-xs sm:text-[11px] font-bold text-[#101F38] tracking-[0.1em] uppercase">
                {selectedGoal}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-[40px] font-black text-[#101F38] mb-4 tracking-tight">
              {pricing.title}
            </h1>
            <p className="text-sm sm:text-[17px] text-[#5B6472] font-medium max-w-2xl mx-auto">
              Select the service level that best fits your needs and budget. We ensure your application is complete and accurate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-[20px] font-bold text-[#101F38] text-center mb-2">Basic Plan</h3>
              <p className="text-[#5B6472] text-center text-xs sm:text-[13px] font-medium mb-6">Essential services for your application</p>
              <div className="text-center mb-8">
                <span className="text-3xl sm:text-[32px] font-black text-orange-500">{pricing.basic}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Complete form preparation and review
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Dedicated case manager
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Step-by-step guidance
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  100% satisfaction guarantee
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Basic Plan');
                  setSelectedPlanPrice(pricing.basic);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-orange-500 shadow-[0_15px_30px_rgba(227,117,93,0.15)] flex flex-col hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-orange-500 to-orange-600 text-xs sm:text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#101F38] text-center mb-2">Advanced Plan</h3>
              <p className="text-[#5B6472] text-center text-xs sm:text-[13px] font-medium mb-6">Comprehensive services with review</p>
              <div className="text-center mb-8">
                <span className="text-3xl sm:text-[32px] font-black text-orange-500">{pricing.advanced}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Everything in Basic Plan
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Certified translation services
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Legal review by an attorney
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Priority 24-hour support
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Phone support for real-time assistance
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Advanced Plan');
                  setSelectedPlanPrice(pricing.advanced);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#FDFBF9] rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-[20px] font-bold text-[#101F38] text-center mb-2">Premium Plan</h3>
              <p className="text-[#5B6472] text-center text-xs sm:text-[13px] font-medium mb-6">Full-service support with consultation</p>
              <div className="text-center mb-8">
                <span className="text-3xl sm:text-[32px] font-black text-orange-500">{pricing.premium}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  All Advanced Benefits
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  30-minute 1-on-1 attorney consultation
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  USCIS Interview preparation kit
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Priority email support (6 hour response)
                </li>
                <li className="flex items-start text-xs sm:text-[13px] text-[#5B6472] font-medium">
                  <span className="material-icons text-orange-500 text-lg sm:text-[20px] mr-2">check</span>
                  Direct WhatsApp/Text support
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedPlanName('Premium Plan');
                  setSelectedPlanPrice(pricing.premium);
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#C93500] text-white font-bold py-3.5 rounded-[16px] transition-colors shadow-sm"
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
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full min-h-[680px] sm:min-h-[760px] max-w-[1440px] bg-[#F5F5F5] lg:rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.12)]">
            <div className="relative hidden lg:block overflow-hidden rounded-[32px] m-4">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 25% 35%, rgb(255, 122, 69) 0%, rgb(233, 69, 96) 25%, rgb(139, 42, 107) 50%, rgb(59, 42, 122) 70%, rgb(30, 58, 138) 90%, rgb(30, 64, 175) 100%)',
                }}
              />
              <div className="absolute left-6 right-6 bottom-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6">
                <p className="text-white/95 text-base leading-relaxed">
                  Begin your U.S. immigration journey with confidence. Track your case progress, manage documents, and get expert guidance every step of the way.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-6 lg:py-8 lg:overflow-y-auto">
              <Link
                href="/"
                className="inline-flex items-center text-[#1e3a8a] font-medium mb-6 hover:opacity-80 transition-opacity w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back
              </Link>

              <Link href="/" className="inline-block mb-6 w-fit">
                <Image src="/horizonlogo.png" alt="Horizon Pathways" width={160} height={42} className="h-14 w-auto object-contain" />
              </Link>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#0f1b3d] tracking-tight">Create Account</h1>
              <p className="text-slate-500 mt-2 mb-6">Start your immigration journey with us</p>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder=""
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-slate-50/50 px-4 py-2 text-base text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder=""
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-slate-50/50 px-4 py-2 text-base text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Email Address<span className="text-orange-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer flex h-12 w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-11 pr-4 py-2 text-base text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-xs sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 peer-focus:text-orange-500 transition-colors">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer flex h-12 w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-11 pr-11 py-2 text-base text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.7 19.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {password.length === 0 ? (
                      <p className="mt-2 text-[13px] text-slate-500">
                        Must be at least 8 characters.
                      </p>
                    ) : (
                      <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl border border-white/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs sm:text-[11px] font-bold tracking-widest uppercase text-slate-500">Password strength</p>
                          <span className={`inline-flex items-center gap-1.5 text-xs sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors duration-300 ${passwordScore <= 2 ? 'bg-red-50 text-red-600' : passwordScore <= 4 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${passwordScore <= 2 ? 'bg-red-500 animate-pulse' : passwordScore <= 4 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                            {passwordStrength}
                          </span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-slate-100/80 overflow-hidden mb-5">
                          <div className={`h-full rounded-full transition-all duration-500 ease-out ${passwordScore <= 2 ? 'bg-gradient-to-r from-red-500 to-orange-400' : passwordScore <= 4 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`} style={{ width: passwordScore <= 2 ? '30%' : passwordScore <= 4 ? '66%' : '100%' }} />
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {passwordValidation.map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 py-1 transition-all duration-300 group">
                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${item.passed ? 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)] scale-110' : 'bg-slate-200 text-transparent'}`}>
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={item.passed ? 'opacity-100' : 'opacity-0'}>
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                              <div className={`text-xs font-medium transition-colors duration-300 ${item.passed ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-xs sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="peer flex h-12 w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-11 pr-11 py-2 text-base text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.7 19.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-5 w-5 rounded-full border-2 border-orange-500 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="agreeToTerms" className="cursor-pointer text-sm text-slate-600">
                    I agree to the{' '}
                    <a href="/terms" className="font-medium text-orange-500 hover:underline">
                      terms and conditions
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="mt-2 flex h-14 w-full items-center justify-center rounded-xl bg-[#0f1b3d] px-4 py-2 text-base font-semibold text-white shadow-md transition-all hover:bg-[#16265a] active:scale-95 active:brightness-110 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isRegistering ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs tracking-widest">
                  <span className="bg-[#f3f4f6] px-4 text-slate-500 uppercase">Already a member?</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-orange-500 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === questions.length + 3) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[480px] mx-auto px-2 sm:px-0">
          <div className="bg-white border border-gray-200 rounded-[12px] p-5 sm:p-8 md:p-10 shadow-sm text-center">

            <div className="w-16 h-16 bg-[#FDF3E4] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons text-2xl sm:text-[28px] text-orange-500">mail_outline</span>
            </div>

            <h1 className="text-xl sm:text-[24px] font-bold text-[#101F38] mb-3">Enter Verification Code</h1>
            <p className="text-sm sm:text-[15px] text-[#5B6472] font-medium mb-8">
              We sent a 6-digit code to <span className="font-bold text-[#101F38]">{email || 'your email'}</span>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body">
                {error}
              </div>
            )}

            <div className="flex justify-between gap-1.5 sm:gap-2 mb-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="flex-1 min-w-0 max-w-[52px] h-12 sm:h-14 border border-gray-300 rounded-[8px] text-center text-base sm:text-[20px] font-bold text-[#101F38] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-white"
                />
              ))}
            </div>

            <p className="text-[#5B6472] text-sm sm:text-[14px] mb-6">
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
              onClick={handleResendOtp}
              disabled={isRegistering}
              className="w-full bg-[#F8F9FA] hover:bg-gray-100 text-[#101F38] font-medium py-3.5 rounded-[8px] border border-gray-200 transition-all mb-4 disabled:opacity-50"
            >
              Resend verification code
            </button>

            <button
              onClick={() => setCurrentStep(questions.length + 2)} // Go back to account details
              className="text-orange-500 hover:text-[#C93500] text-sm sm:text-[14px] font-medium transition-colors"
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
      const addonsTotal = selectedAddons.reduce((sum, addonId) => sum + ((addons.find(a => a.id === addonId)?.price || 0) * (addonQuantities[addonId] || 1)), 0);
      const totalAmount = baseAmount + addonsTotal;

      const toggleAddon = (id: string) => {
        setSelectedAddons(prev => {
          if (prev.includes(id)) {
            return prev.filter(a => a !== id);
          } else {
            setAddonQuantities(q => ({ ...q, [id]: 1 }));
            return [...prev, id];
          }
        });
      };

      const updateAddonQty = (e: React.MouseEvent, id: string, delta: number) => {
        e.stopPropagation();
        setAddonQuantities(q => {
          const newQty = Math.max(1, (q[id] || 1) + delta);
          return { ...q, [id]: newQty };
        });
      };

      const pricing = getPackagePricing(selectedGoal, answers);

      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-[20px] border border-gray-200 bg-white shadow-sm text-card-foreground p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">{pricing.title}</h3>
                    <div className="mt-3 inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {selectedPlanName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{selectedPlanPrice}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">What&apos;s Included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      Everything in Basic Plan
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      Certified translation services
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      Legal review by an immigration attorney
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      Priority support with 24-hour response time
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      Phone support for real-time assistance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Optional Additional Services</h3>
                <p className="mb-4 text-sm text-gray-500">
                  These services are completely optional and are not required to complete your application. Select them only if you need the additional assistance.
                </p>
                <div className="space-y-3">
                  {addons.map(addon => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex flex-1 items-start space-x-3">
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-gray-300 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                          <div className="mt-1 text-xs text-gray-600">{addon.description}</div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-semibold text-gray-900">${addon.price * (addonQuantities[addon.id] || 1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg bg-white p-6 sticky top-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="text-[#5B6472] font-medium text-sm sm:text-[14px] pr-4">{pricing.title}</div>
                    <div className="text-[#101F38] font-bold text-sm sm:text-[14px] shrink-0">{selectedPlanPrice}</div>
                  </div>
                  {selectedAddons.map(id => {
                    const addon = addons.find(a => a.id === id);
                    if (!addon) return null;
                    const qty = addonQuantities[id] || 1;
                    return (
                      <div key={addon.id} className="flex justify-between items-start">
                        <div className="text-[#5B6472] font-medium text-sm sm:text-[14px] pr-4">
                          {addon.name} {qty > 1 ? `(x${qty})` : ''}
                        </div>
                        <div className="text-[#101F38] font-bold text-sm sm:text-[14px] shrink-0">${addon.price * qty}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
                  <div className="text-[#101F38] font-bold text-sm sm:text-[16px]">Total</div>
                  <div className="text-2xl sm:text-[24px] font-black text-[#101F38]">${totalAmount.toFixed(2)}</div>
                </div>

                {error && <div className="text-red-500 text-sm sm:text-[14px] font-medium mb-4 text-center">{error}</div>}
                <button
                  onClick={handleStripeCheckout}
                  disabled={isRegistering}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-orange-500 px-4 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95 active:brightness-110 disabled:opacity-50"
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
            <p className="text-base sm:text-[16px] text-[#5B6472] font-medium">
              You're almost there! Enter your payment details below.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-[0_15px_30px_-10px_rgba(16,31,56,0.08)]">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <button type="button" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-[16px] bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-900">
                  <span className="text-lg sm:text-[18px]"></span>
                  Apple Pay
                </button>
                <button type="button" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-[16px] bg-emerald-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-600">
                  <span className="text-lg sm:text-[18px]">link</span>
                  Link
                </button>
              </div>
            </div>

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">or</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-[20px] border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Contact information</div>
                <div className="mt-3 rounded-[16px] border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">
                  {email}
                </div>
              </div>

              <div className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700">💳</span>
                    Card
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[16px] border border-gray-200 bg-[#F8F9FA] px-4 py-4">
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#101F38',
                          '::placeholder': {
                            color: '#9CA3AF',
                          },
                        },
                        invalid: {
                          color: '#b91c1c',
                        },
                      },
                    }} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-gray-500">Cardholder name</label>
                    <input type="text" placeholder="Full name on card" required className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-gray-500">Country or region</label>
                    <select className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500">
                      <option>Pakistan</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[20px] border border-gray-200 bg-white px-4 py-4">
                <input id="save-card-info" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <label htmlFor="save-card-info" className="text-sm text-gray-700">
                  Save my information for faster checkout
                  <span className="block text-xs text-gray-500">Pay securely on this site and everywhere Link is accepted.</span>
                </label>
              </div>

              <button type="submit" disabled={!stripe || isRegistering} className="w-full rounded-[16px] bg-[#101F38] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#0a1526] disabled:opacity-50">
                {isRegistering ? 'Processing...' : 'Pay & Create Account'}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs sm:text-[12px] text-gray-400 flex items-center justify-center font-medium">
              <span className="material-icons text-sm sm:text-[14px] mr-1">security</span>
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
          <h1 className="text-3xl sm:text-[44px] leading-tight font-black text-[#101F38] mb-2 tracking-tight">Question {currentStep}</h1>

          <div className="mb-12">
            <h2 className="text-xl sm:text-[22px] font-bold text-[#101F38] mb-6 tracking-tight">{currentQuestion.question}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`relative flex items-center p-6 border rounded-[20px] transition-all duration-300 ${selectedAnswer === option
                    ? 'border-orange-500 bg-[#FDFBF9] shadow-[0_10px_20px_rgba(227,117,93,0.1)]'
                    : 'border-gray-200 bg-white hover:border-orange-500/50 hover:shadow-sm'
                    }`}
                >
                  <div className="shrink-0 w-6 h-6 rounded-full border-[1.5px] border-orange-500 flex items-center justify-center transition-colors">
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600"></div>
                    )}
                  </div>
                  <div className="flex-grow flex justify-center items-center px-4">
                    <span className={`text-sm sm:text-[15px] leading-snug font-bold text-center transition-colors ${selectedAnswer === option ? 'text-orange-500' : 'text-[#101F38]'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="w-full min-h-screen bg-[#F5F4F1] py-8 sm:py-16 px-4 sm:px-6 lg:px-12 flex items-center justify-center">

      {isQuestionsDone ? (
        // Post-Questionnaire Views (Plan Selection, Account, Verification, Payment)
        <div className="w-full">
          {renderContent()}
        </div>
      ) : (
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(16,31,56,0.12)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[650px] relative">

          {/* Left Side - Image/Illustration */}
          <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: getSignupBackgroundImage(selectedGoal, currentStep, currentQuestion?.question, goalImages) }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101F38]/90 via-[#101F38]/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20 shadow-sm">
                <div className="w-[140px]">
                  <Image src="/horizonlogo.png" alt="Horizon Pathways" width={140} height={32} className="object-contain" />
                </div>
              </div>
              <p className="text-base sm:text-[16px] font-medium leading-relaxed max-w-md text-white/80">
                Start your U.S. immigration journey with confidence. Answer a few quick questions and we'll guide you to the right path — with experienced attorneys by your side.
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-[60%] flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-16 relative">
            <div className="w-full max-w-full lg:max-w-[600px] mx-auto flex-grow flex flex-col justify-center">

              {!isQuestionsDone && !isDisqualified && (
                <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-[#C93500] transition-colors self-start mb-6">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              )}

              {!isQuestionsDone && !isDisqualified && currentStep > 0 && (
                <div className="text-orange-500 font-bold text-sm sm:text-[15px] mb-3">
                  Step {currentStep} of {totalSteps}
                </div>
              )}

              {!isQuestionsDone && !isDisqualified && (
                <div className="mb-10 w-full">
                  <div className="flex justify-between font-mono text-xs sm:text-[11px] text-[#8A8F98] mb-1.5">
                    <span>{Math.round(progress)}%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EEE8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5BAE8C] to-[#3F9A73] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex-grow w-full flex flex-col justify-center">
                {renderContent()}
              </div>

              {!isDisqualified && currentStep > 0 && (
                <div className="flex justify-end items-center pb-2 mt-12 w-full pt-6 border-t border-gray-100">
                  <button
                    onClick={handleRestart}
                    className="bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#C93500] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center space-x-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
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

function SignupFlow() {
  return (
    <Elements stripe={stripePromise}>
      <SignupFlowContent />
    </Elements>
  );
}

export default SignupFlow;
