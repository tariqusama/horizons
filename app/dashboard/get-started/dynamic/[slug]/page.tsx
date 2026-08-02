"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './dynamic.module.css';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface SubStep {
    id: string;
    sectionTitle: string;
    subSectionTitle: string;
    tabLabel: string;
    questions: any[];
}

/**
 * Capitalizes names nicely (e.g. "muhamamd baksh" -> "Muhamamd Baksh")
 */
function capitalizeName(name: string): string {
    if (!name) return 'Applicant';
    return name
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Transforms standard USCIS question labels into friendly, personalized questions
 * addressing the applicant by name (e.g. "How tall is [Applicant Name]?*")
 */
function personalizeQuestionText(text: string, applicantName: string): string {
    if (!text) return '';
    const name = capitalizeName(applicantName);
    const possessiveName = name.endsWith('s') ? `${name}'` : `${name}'s`;

    // Explicit template tokens
    let output = text
        .replace(/\{applicant_name\}|\{full_name\}|\{name\}|\[Applicant Name\]|\[Applicant\]|\[Name\]/gi, name)
        .replace(/\{first_name\}|\[First Name\]/gi, name.split(' ')[0] || name)
        .replace(/\{last_name\}|\[Last Name\]/gi, name.split(' ').slice(1).join(' ') || name)
        .replace(/\{possessive_name\}|\[Possessive Name\]/gi, possessiveName);

    if (output !== text) {
        return output;
    }

    const trimmed = text.trim();
    const cleanLower = trimmed.toLowerCase().replace(/[?:.*]/g, '').trim();

    // Biometrics & physical appearance conversions
    if (/^height(\s*\(.*\))?$/i.test(cleanLower) || /^how tall are you$/i.test(cleanLower)) {
        return `How tall is ${name}?`;
    }
    if (/^weight(\s*\(.*\))?$/i.test(cleanLower) || /^how much do you weigh$/i.test(cleanLower) || /^how much does/i.test(cleanLower)) {
        return `How much does ${name} weigh?`;
    }
    if (/^eye color$/i.test(cleanLower)) {
        return `What color are ${possessiveName} eyes?`;
    }
    if (/^hair color$/i.test(cleanLower)) {
        return `What color is ${possessiveName} hair?`;
    }
    if (/^sex$/i.test(cleanLower) || /^gender$/i.test(cleanLower)) {
        return `What is ${possessiveName} sex?`;
    }
    if (/^date of birth$/i.test(cleanLower) || /^dob$/i.test(cleanLower)) {
        return `What is ${possessiveName} date of birth?`;
    }
    if (/^city\/town\/village of birth$/i.test(cleanLower) || /^place of birth$/i.test(cleanLower)) {
        return `What city or town was ${name} born in?`;
    }
    if (/^country of birth$/i.test(cleanLower)) {
        return `What is ${possessiveName} country of birth?`;
    }
    if (/^country of citizenship or nationality$/i.test(cleanLower)) {
        return `What is ${possessiveName} country of citizenship or nationality?`;
    }
    if (/^alien registration number(\s*\(a-number\))?$/i.test(cleanLower) || /^a-number$/i.test(cleanLower)) {
        return `What is ${possessiveName} Alien Registration Number (A-Number)?`;
    }
    if (/^uscis online account number$/i.test(cleanLower)) {
        return `What is ${possessiveName} USCIS Online Account Number?`;
    }
    if (/^u\.?s\.?\s*social security number(\s*\(if any\))?$/i.test(cleanLower) || /^social security number/i.test(cleanLower)) {
        return `What is ${possessiveName} U.S. Social Security Number?`;
    }
    if (/^class of admission$/i.test(cleanLower)) {
        return `What is ${possessiveName} Class of Admission?`;
    }
    if (/^date of admission$/i.test(cleanLower)) {
        return `What was ${possessiveName} Date of Admission?`;
    }
    if (/^mother'?s first name$/i.test(cleanLower)) {
        return `What is ${possessiveName} mother's first name?`;
    }
    if (/^father'?s first name$/i.test(cleanLower)) {
        return `What is ${possessiveName} father's first name?`;
    }
    if (/^ethnicity$/i.test(cleanLower)) {
        return `What is ${possessiveName} ethnicity?`;
    }
    if (/^race$/i.test(cleanLower)) {
        return `What is ${possessiveName} race?`;
    }
    if (/^daytime telephone number$/i.test(cleanLower) || /^daytime phone number$/i.test(cleanLower)) {
        return `What is ${possessiveName} daytime phone number?`;
    }
    if (/^mobile telephone number$/i.test(cleanLower) || /^mobile phone number$/i.test(cleanLower)) {
        return `What is ${possessiveName} mobile phone number?`;
    }
    if (/^email address$/i.test(cleanLower)) {
        return `What is ${possessiveName} email address?`;
    }

    // Conversational grammar transformations
    if (/^have you ever\b/i.test(trimmed)) {
        return trimmed.replace(/^have you ever\b/i, `Has ${name} ever`);
    }
    if (/^have you\b/i.test(trimmed)) {
        return trimmed.replace(/^have you\b/i, `Has ${name}`);
    }
    if (/^are you currently\b/i.test(trimmed)) {
        return trimmed.replace(/^are you currently\b/i, `Is ${name} currently`);
    }
    if (/^are you\b/i.test(trimmed)) {
        return trimmed.replace(/^are you\b/i, `Is ${name}`);
    }
    if (/^do you currently\b/i.test(trimmed)) {
        return trimmed.replace(/^do you currently\b/i, `Does ${name} currently`);
    }
    if (/^do you\b/i.test(trimmed)) {
        return trimmed.replace(/^do you\b/i, `Does ${name}`);
    }

    return trimmed.replace(/\byour\b/gi, possessiveName).replace(/\byou\b/gi, name);
}

/**
 * Builds clean, major steps based directly on database form sections
 */
function buildFormSteps(formSchema: any, applicantName: string): SubStep[] {
    const steps: SubStep[] = [];
    const name = capitalizeName(applicantName);

    // Step 1: Personal & Basic Information
    steps.push({
        id: 'basic-info',
        sectionTitle: 'Personal Information',
        subSectionTitle: `${name}'s Basic Information`,
        tabLabel: 'Personal Information',
        questions: [
            {
                field_name: 'firstName',
                question_text: 'What is the applicant\'s First Name?',
                field_type: 'text',
                is_required: true,
                placeholder: 'e.g. Mohamed'
            },
            {
                field_name: 'lastName',
                question_text: 'What is the applicant\'s Last Name?',
                field_type: 'text',
                is_required: true,
                placeholder: 'e.g. Bah'
            },
            {
                field_name: 'email',
                question_text: `What is ${name}'s Email Address?`,
                field_type: 'email',
                is_required: true,
                placeholder: 'e.g. name@example.com'
            },
            {
                field_name: 'phone',
                question_text: `What is ${name}'s Phone Number?`,
                field_type: 'tel',
                is_required: true,
                placeholder: '+1 (555) 000-0000'
            },
            {
                field_name: 'dob',
                question_text: `What is ${name}'s Date of Birth?`,
                field_type: 'date',
                is_required: true
            }
        ]
    });

    if (!formSchema?.sections) return steps;

    const seenFields = new Set<string>(['firstname', 'lastname', 'email', 'phone']);

    // Group each database section cleanly into 1 step
    formSchema.sections.forEach((section: any, idx: number) => {
        const questions = (section.questions || []).filter((q: any) => {
            const fn = (q.field_name || '').toLowerCase();
            if (seenFields.has(fn)) return false;
            seenFields.add(fn);
            return true;
        });

        if (questions.length === 0) return;

        const cleanTitle = section.title.replace(/^Part\s*\d+\.?\s*/i, '').trim();

        steps.push({
            id: `sec-${section.id || idx}`,
            sectionTitle: section.title,
            subSectionTitle: `${name}'s ${cleanTitle}`,
            tabLabel: cleanTitle || `Step ${idx + 2}`,
            questions: questions
        });
    });

    return steps;
}

export default function DynamicFormEnginePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const router = useRouter();
    const { user } = useAuth();
    const tabsTrackRef = useRef<HTMLDivElement>(null);

    const [formSchema, setFormSchema] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<any>({});
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [unitsState, setUnitsState] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);

    // Pre-fill user session data
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || '').trim().split(' ');
            setFormData((prev: any) => ({
                ...prev,
                firstName: prev.firstName || nameParts[0] || '',
                lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
                email: prev.email || user.email || '',
                phone: prev.phone || (user as any).phone || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await api.get(`/guide-engine/forms/${slug}`);
                setFormSchema(res.data);
                
                const initialUnits: any = {};
                if (res.data?.sections) {
                    res.data.sections.forEach((section: any) => {
                        section.questions?.forEach((q: any) => {
                            if (/height/i.test(q.field_name) || /height/i.test(q.question_text)) {
                                initialUnits[q.field_name] = 'cm';
                            } else if (/weight/i.test(q.field_name) || /weight/i.test(q.question_text)) {
                                initialUnits[q.field_name] = 'kg';
                            }
                        });
                    });
                }
                setUnitsState(initialUnits);

            } catch (err) {
                console.error(err);
                setError('Failed to load form structure from the database.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchForm();
        }
    }, [slug]);

    useEffect(() => {
        if (tabsTrackRef.current) {
            const activeElem = tabsTrackRef.current.querySelector(`.${styles.tabItemActive}`) as HTMLElement;
            if (activeElem) {
                activeElem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentStepIndex]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const applicantRawName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || user?.name || '';
    const applicantFullName = capitalizeName(applicantRawName);

    const steps = formSchema ? buildFormSteps(formSchema, applicantFullName) : [];
    const currentStep = steps[currentStepIndex] || steps[0];
    const totalSteps = steps.length;
    const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

    const handleNext = async () => {
        if (steps.length === 0) return;

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
            } else {
                router.push('/dashboard/get-started/document-upload');
            }
        } catch (err) {
            console.error('Error saving step', err);
        } finally {
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else {
            router.push('/dashboard/get-started');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 border-4 border-[#F0501A] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-orange-500/20" />
                <p className="text-[#1e293b] font-bold text-xl">Loading Application Wizard...</p>
                <p className="text-[#8896ab] text-sm mt-1.5">Preparing application questions</p>
            </div>
        );
    }

    if (error || !formSchema || steps.length === 0) {
        return (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-red-100 rounded-2xl shadow-xl text-center">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">!</div>
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">{error || 'Form Not Found'}</h3>
                <p className="text-[#8896ab] text-sm mb-6 leading-relaxed">
                    Make sure you have created the form using the Admin Form Builder with the slug: <code className="bg-slate-100 px-2 py-1 rounded text-red-600 font-mono">{slug}</code>
                </p>
                <button 
                    onClick={() => router.push('/dashboard/get-started')} 
                    className="px-6 py-2.5 bg-[#F0501A] hover:bg-[#D94514] text-white font-semibold rounded-lg shadow-md transition-all"
                >
                    Return to Overview
                </button>
            </div>
        );
    }

    const firstNameFormatted = applicantFullName.split(' ')[0] || 'Applicant';
    
    // Short clean name for mobile header
    const rawFormName = formSchema.name || 'Application';
    const formCodeName = slug ? slug.toUpperCase() : 'FORM';
    const packetHeaderTitle = `${firstNameFormatted}'s ${formCodeName} ${rawFormName} Packet`;

    return (
        <div className={styles.pageWrapper}>
            {/* Top Packet Header Bar */}
            <div className={styles.headerBannerCard}>
                <div className={styles.headerContentRow}>
                    <div className={styles.headerLeftGroup}>
                        <button 
                            type="button" 
                            className={styles.packetBackBtn}
                            onClick={handlePrev}
                            title="Go Back"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                        <div className={styles.headerTitleGroup}>
                            <h1 className={styles.packetTitle}>{packetHeaderTitle}</h1>
                            <p className={styles.packetSubtitle}>
                                Step {currentStepIndex + 1} of {totalSteps} &bull; {currentStep?.tabLabel}
                            </p>
                        </div>
                    </div>

                    <div className={styles.progressCounterGroup}>
                        <div className={styles.progressBadge}>
                            <span>{progressPercent}% Completed</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Track */}
                <div className={styles.progressBarTrack}>
                    <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${progressPercent}%` }} 
                    />
                </div>
            </div>

            {/* Horizontal Step Tabs Strip */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabsTrack} ref={tabsTrackRef}>
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;

                        return (
                            <button 
                                key={step.id} 
                                type="button"
                                className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ''} ${isCompleted ? styles.tabItemCompleted : ''}`}
                                onClick={() => {
                                    setCurrentStepIndex(idx);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                <span className={styles.tabStepNum}>{idx + 1}</span>
                                <span>{step.tabLabel}</span>
                                {isCompleted && <span className={styles.tabCheckSmall}>&check;</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Form Area in 2-Column Grid */}
            <div className={styles.layoutContainer}>
                {/* 2-Column Form Card */}
                <div className={styles.formCard}>
                    {/* Page Section Header */}
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionMainTitle}>{currentStep?.sectionTitle}</h2>
                        <p className={styles.sectionSubtitle}>{currentStep?.subSectionTitle}</p>
                        <hr className={styles.sectionDivider} />
                    </div>

                    {/* Questions in 2-Column Grid Layout */}
                    <div className={styles.questionsGrid}>
                        {currentStep?.questions?.map((q: any, idx: number) => {
                            const personalizedLabel = personalizeQuestionText(q.question_text, applicantFullName);
                            const val = formData[q.field_name];
                            const isAnswered = val !== undefined && val !== '' && val !== null;
                            const isHeightQuestion = /height/i.test(q.field_name) || /height/i.test(q.question_text);
                            const isWeightQuestion = /weight/i.test(q.field_name) || /weight/i.test(q.question_text);
                            const isFullWidth = isHeightQuestion || isWeightQuestion || q.field_type === 'textarea' || q.field_type === 'radio' || (q.options && q.options.length > 2);
                            const currentUnit = unitsState[q.field_name] || (isHeightQuestion ? 'cm' : 'kg');

                            // Height conversion notice
                            let heightNotice = null;
                            if (isHeightQuestion && val) {
                                const num = parseFloat(val);
                                if (!isNaN(num) && num > 0) {
                                    if (currentUnit === 'cm') {
                                        const totalIn = Math.round(num / 2.54);
                                        const ft = Math.floor(totalIn / 12);
                                        const inc = totalIn % 12;
                                        heightNotice = `We'll convert your height into feet and inches for the final form. Your height is: ${ft} feet, ${inc} inches.`;
                                    } else {
                                        const cm = Math.round(num * 2.54);
                                        heightNotice = `Your height is: ${num} inches (${cm} cm).`;
                                    }
                                }
                            }

                            // Weight conversion notice
                            let weightNotice = null;
                            if (isWeightQuestion && val) {
                                const num = parseFloat(val);
                                if (!isNaN(num) && num > 0) {
                                    if (currentUnit === 'kg') {
                                        const lbs = Math.round(num * 2.20462);
                                        weightNotice = `We'll convert your weight to pounds (lbs) for the final form. Your weight in pounds (lbs) is: ${lbs} lbs`;
                                    } else {
                                        const kg = (num / 2.20462).toFixed(1);
                                        weightNotice = `Your weight is: ${num} lbs (${kg} kg)`;
                                    }
                                }
                            }

                            return (
                                <div 
                                    key={q.field_name || idx}
                                    className={`${styles.questionBlock} ${isFullWidth ? styles.questionBlockFullWidth : ''}`}
                                >
                                    <div className={styles.questionHeaderRow}>
                                        <div className={isAnswered ? styles.statusCheckCircle : styles.statusCheckEmpty}>
                                            {isAnswered ? '\u2713' : (idx + 1)}
                                        </div>
                                        <h3 className={styles.questionTitle}>
                                            {personalizedLabel} {q.is_required && <span className={styles.requiredStar}>*</span>}
                                        </h3>
                                    </div>

                                    <div className={styles.questionBody}>
                                        {/* SPECIAL HEIGHT QUESTION */}
                                        {isHeightQuestion ? (
                                            <div>
                                                <div className={styles.dualInputGrid}>
                                                    <div>
                                                        <label className={styles.subFieldLabel}>Units <span className={styles.requiredStar}>*</span></label>
                                                        <select 
                                                            className={styles.selectField}
                                                            value={currentUnit}
                                                            onChange={(e) => setUnitsState(prev => ({ ...prev, [q.field_name]: e.target.value }))}
                                                        >
                                                            <option value="cm">Metric (Centimeters)</option>
                                                            <option value="in">US Standard (Inches)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className={styles.subFieldLabel}>
                                                            {currentUnit === 'cm' ? 'Centimeters' : 'Inches'}
                                                        </label>
                                                        <input 
                                                            type="number"
                                                            className={styles.inputField}
                                                            placeholder={currentUnit === 'cm' ? 'e.g. 178' : 'e.g. 70'}
                                                            value={formData[q.field_name] || ''}
                                                            onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {heightNotice && (
                                                    <p className={styles.helperNotice}>{heightNotice}</p>
                                                )}
                                            </div>
                                        ) : isWeightQuestion ? (
                                            /* SPECIAL WEIGHT QUESTION */
                                            <div>
                                                <div className={styles.dualInputGrid}>
                                                    <div>
                                                        <label className={styles.subFieldLabel}>Units <span className={styles.requiredStar}>*</span></label>
                                                        <select 
                                                            className={styles.selectField}
                                                            value={currentUnit}
                                                            onChange={(e) => setUnitsState(prev => ({ ...prev, [q.field_name]: e.target.value }))}
                                                        >
                                                            <option value="kg">Kilograms (kgs)</option>
                                                            <option value="lbs">Pounds (lbs)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className={styles.subFieldLabel}>
                                                            {currentUnit === 'kg' ? 'Kilograms' : 'Pounds'}
                                                        </label>
                                                        <input 
                                                            type="number"
                                                            step="any"
                                                            className={styles.inputField}
                                                            placeholder={currentUnit === 'kg' ? 'e.g. 72.5' : 'e.g. 160'}
                                                            value={formData[q.field_name] || ''}
                                                            onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {weightNotice && (
                                                    <p className={styles.helperNotice}>{weightNotice}</p>
                                                )}
                                            </div>
                                        ) : (
                                            /* STANDARD INPUT FIELDS */
                                            <div>
                                                {/* Text / Tel Field */}
                                                {(q.field_type === 'text' || q.field_type === 'tel' || !q.field_type) && (
                                                    <input
                                                        type={q.field_type === 'tel' ? 'tel' : 'text'}
                                                        className={styles.inputField}
                                                        placeholder={q.placeholder || 'Type your response...'}
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    />
                                                )}

                                                {/* Email Field */}
                                                {q.field_type === 'email' && (
                                                    <input
                                                        type="email"
                                                        className={styles.inputField}
                                                        placeholder={q.placeholder || 'e.g. name@example.com'}
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    />
                                                )}

                                                {/* Number Field */}
                                                {q.field_type === 'number' && (
                                                    <input
                                                        type="number"
                                                        className={styles.inputField}
                                                        placeholder="0"
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    />
                                                )}

                                                {/* Textarea Field */}
                                                {q.field_type === 'textarea' && (
                                                    <textarea
                                                        className={styles.textareaField}
                                                        placeholder="Provide detailed information here..."
                                                        rows={4}
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    />
                                                )}

                                                {/* Radio Group */}
                                                {q.field_type === 'radio' && (
                                                    <div className={styles.radioGrid}>
                                                        {q.options?.map((opt: any) => {
                                                            const isChecked = formData[q.field_name] === opt.option_value;
                                                            return (
                                                                <label 
                                                                    key={opt.id || opt.option_value} 
                                                                    className={`${styles.radioCard} ${isChecked ? styles.radioCardActive : ''}`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={q.field_name}
                                                                        value={opt.option_value}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                                    />
                                                                    <span>{opt.option_label}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Select Dropdown */}
                                                {q.field_type === 'select' && (
                                                    <select
                                                        className={styles.selectField}
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    >
                                                        <option value="">Select an option...</option>
                                                        {q.options?.map((opt: any) => (
                                                            <option key={opt.id || opt.option_value} value={opt.option_value}>
                                                                {opt.option_label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                
                                                {/* Date Picker */}
                                                {q.field_type === 'date' && (
                                                    <input
                                                        type="date"
                                                        className={styles.inputField}
                                                        value={formData[q.field_name] || ''}
                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                        required={q.is_required}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {q.help_text && (
                                            <p className={styles.helperNotice}>
                                                {personalizeQuestionText(q.help_text, applicantFullName)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Action Buttons */}
                    <div className={styles.footerActions}>
                        <button 
                            type="button" 
                            className={styles.btnExit} 
                            onClick={handlePrev} 
                            disabled={isSaving}
                        >
                            &larr; {currentStepIndex === 0 ? 'Exit' : 'Previous'}
                        </button>
                        <button 
                            type="button" 
                            className={styles.btnSaveContinue} 
                            onClick={handleNext} 
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : (currentStepIndex === totalSteps - 1 ? 'Finish and Continue' : 'Save and Continue')}
                        </button>
                    </div>
                </div>

                {/* Right Side Helper / Tips Panel */}
                <div className={styles.tipsSidePanel}>
                    <div className={styles.tipsCard}>
                        <div className={styles.tipsHeaderRow}>
                            <div className={styles.tipsIconBox}>💡</div>
                            <h4 className={styles.tipsTitle}>Form Guide & Tips</h4>
                        </div>
                        <p className={styles.tipsText}>
                            Your progress is automatically saved as you complete each section. You can return to review or update your answers at any time.
                        </p>

                        <div className={styles.tipsFeatureList}>
                            <div className={styles.tipsFeatureItem}>
                                <span className={styles.tipsFeatureDot} />
                                <span>Double check dates and legal spellings against official documents.</span>
                            </div>
                            <div className={styles.tipsFeatureItem}>
                                <span className={styles.tipsFeatureDot} />
                                <span>Unit conversions (cm/in, kg/lbs) are handled automatically for final USCIS forms.</span>
                            </div>
                        </div>

                        <div className={styles.securityBadgeRow}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d9a8d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Bank-level 256-Bit Data Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
