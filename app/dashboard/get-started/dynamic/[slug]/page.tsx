"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import styles from './dynamic.module.css';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { SubStep, capitalizeName, personalizeQuestionText, buildFormSteps } from '../formsEngine';

export default function DynamicFormEnginePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const router = useRouter();
    const { user } = useAuth();
    const tabsTrackRef = useRef<HTMLDivElement>(null);

    const [formSchema, setFormSchema] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applicationId, setApplicationId] = useState<number | null>(null);

    const searchParams = useSearchParams();
    const initialStep = searchParams?.get('step');
    const mode = searchParams?.get('mode');
    
    const [formData, setFormData] = useState<any>({});
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStep ? parseInt(initialStep, 10) : 0);
    const [unitsState, setUnitsState] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

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
                // Load form schema
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

                // Load existing application progress
                try {
                    const appRes = await api.get('/applications');
                    if (appRes.data && appRes.data.length > 0) {
                        const app = appRes.data[0];
                        setApplicationId(app.id);
                        // Restore saved form data if exists
                        if (app.form_data && typeof app.form_data === 'object' && Object.keys(app.form_data).length > 0) {
                            const { _current_step, ...savedFormData } = app.form_data;
                            setFormData((prev: any) => ({ ...savedFormData, _current_step, ...prev }));
                            const stepKey = `_current_step_${slug}`;
                            const fallback = typeof _current_step === 'number' ? _current_step : 0;
                            const savedStep = typeof savedFormData[stepKey] === 'number' ? savedFormData[stepKey] : fallback;
                            // Only restore saved step index if URL didn't provide one
                            if (!initialStep && savedStep > 0) {
                                setCurrentStepIndex(savedStep);
                            }
                        }
                    }
                } catch {
                    // Application may not exist yet, that's fine
                }

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
        setSaveError('');

        // Validate required fields in the current step
        const missingFields = currentStep.questions.filter((q: any) => {
            if (q.is_required) {
                if (q.field_type === 'name_group') {
                    // Check first and last name for name_group type
                    if (!formData.firstName || !formData.lastName) return true;
                } else {
                    const val = formData[q.field_name];
                    if (val === undefined || val === null || val === '') return true;
                }
            }
            return false;
        });

        if (missingFields.length > 0) {
            setSaveError(`Please fill out all required fields: ${missingFields.map((q: any) => q.question_text).join(', ')}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true);
        try {
            const proposedNextStep = currentStepIndex + 1;
            const stepKey = `_current_step_${slug}`;
            const fallback = typeof formData._current_step === 'number' ? formData._current_step : 0;
            const newMaxStep = Math.max(formData[stepKey] || fallback, proposedNextStep);

            // Save progress to backend
            if (applicationId) {
                await api.put(`/applications/${applicationId}/save-progress`, {
                    form_data: { ...formData, [stepKey]: newMaxStep, _current_step: newMaxStep },
                    current_step: newMaxStep,
                });
                setFormData((prev: any) => ({ ...prev, [stepKey]: newMaxStep, _current_step: newMaxStep }));
            }

            if (mode === 'edit') {
                router.push(`/dashboard/get-started/overview?form=${slug}`);
            } else if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
            } else {
                // Return to overview dashboard after finishing a section
                router.push(`/dashboard/get-started/overview?form=${slug}`);
            }
        } catch (err) {
            console.error('Error saving step', err);
            setSaveError('Failed to save your progress. Please try again.');
        } finally {
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else {
            router.push(`/dashboard/get-started/overview?form=${slug}`);
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
                                {isCompleted && <span className={styles.tabCheckSmall}>{"\u2713"}</span>}
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

                    {/* Validation / Save Error Banner */}
                    {saveError && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1.5px solid #fca5a5',
                            borderRadius: '10px',
                            padding: '0.85rem 1.25rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                        }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>{saveError}</p>
                        </div>
                    )}

                    {/* Questions in 2-Column Grid Layout */}
                    <div className={styles.questionsGrid}>
                        {currentStep?.questions?.map((q: any, idx: number) => {
                            const personalizedLabel = personalizeQuestionText(q.question_text, applicantFullName);
                            const val = formData[q.field_name];
                            const isHeightQuestion = /height/i.test(q.field_name) || /height/i.test(q.question_text);
                            const isWeightQuestion = /weight/i.test(q.field_name) || /weight/i.test(q.question_text);
                            const isFullWidth = isHeightQuestion || isWeightQuestion || q.field_type === 'textarea' || q.field_type === 'radio' || (q.options && q.options.length > 2);
                            const currentUnit = unitsState[q.field_name] || (isHeightQuestion ? 'cm' : 'kg');

                            // Determine if this question is answered for the checkmark
                            let isAnswered = val !== undefined && val !== '' && val !== null;
                            if (q.field_type === 'name_group') {
                                isAnswered = !!(formData.firstName && formData.lastName);
                            }

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

                            // Parse Image from Help Text
                            const imageMatch = q.help_text ? q.help_text.match(/\[IMAGE:(.+?)\]/) : null;
                            const imageUrl = imageMatch ? imageMatch[1] : null;
                            const cleanHelpText = q.help_text ? q.help_text.replace(/\[IMAGE:.+?\]/, '') : null;

                            return (
                                <div 
                                    key={q.field_name || idx}
                                    className={`${styles.questionBlock} ${isFullWidth ? styles.questionBlockFullWidth : ''}`}
                                >
                                    {imageUrl && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <img src={imageUrl} alt="Helper Instruction" style={{ maxWidth: '100%', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
                                        </div>
                                    )}

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

                                                {/* Custom Name Group Box Layout */}
                                                {q.field_type === 'name_group' && (
                                                    <div className={styles.nameGroupContainer}>
                                                        <div className={styles.nameInputBox}>
                                                            <span className={styles.nameInputLabel}>First Name</span>
                                                            <input
                                                                type="text"
                                                                className={`${styles.nameInputField} ${formData.firstName ? styles.nameInputFieldFilled : ''}`}
                                                                placeholder="e.g. Mohamed"
                                                                value={formData.firstName || ''}
                                                                onChange={(e) => handleChange('firstName', e.target.value)}
                                                                required={q.is_required}
                                                            />
                                                        </div>
                                                        <div className={styles.nameInputBox}>
                                                            <span className={styles.nameInputLabel}>Middle Name</span>
                                                            <input
                                                                type="text"
                                                                className={`${styles.nameInputField} ${formData.middleName ? styles.nameInputFieldFilled : ''}`}
                                                                placeholder=""
                                                                value={formData.middleName || ''}
                                                                onChange={(e) => handleChange('middleName', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className={styles.nameInputBox}>
                                                            <span className={styles.nameInputLabel}>Last Name</span>
                                                            <input
                                                                type="text"
                                                                className={`${styles.nameInputField} ${formData.lastName ? styles.nameInputFieldFilled : ''}`}
                                                                placeholder="e.g. Bah"
                                                                value={formData.lastName || ''}
                                                                onChange={(e) => handleChange('lastName', e.target.value)}
                                                                required={q.is_required}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Yes/No Large Toggles */}
                                                {q.field_type === 'radio_yes_no' && (
                                                    <div className={styles.yesNoGroup}>
                                                        {q.options?.map((opt: any) => {
                                                            const isChecked = formData[q.field_name] === opt.option_value;
                                                            return (
                                                                <label 
                                                                    key={opt.option_value} 
                                                                    className={`${styles.yesNoOption} ${isChecked ? styles.yesNoOptionActive : ''}`}
                                                                >
                                                                    <div className={styles.yesNoRadioCircle}></div>
                                                                    <span>{opt.option_label}</span>
                                                                    <input
                                                                        type="radio"
                                                                        name={q.field_name}
                                                                        value={opt.option_value}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Gender Icon Toggles */}
                                                {q.field_type === 'radio_gender' && (
                                                    <div className={styles.genderGroup}>
                                                        {q.options?.map((opt: any) => {
                                                            const isChecked = formData[q.field_name] === opt.option_value;
                                                            return (
                                                                <label 
                                                                    key={opt.option_value} 
                                                                    className={`${styles.genderOption} ${isChecked ? styles.genderOptionActive : ''}`}
                                                                >
                                                                    <div className={styles.genderIcon}>
                                                                        {opt.option_value === 'Female' ? (
                                                                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                                                                                <path d="M12 18v4m-2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                                                                                <path d="M12 2v6m4-4L12 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    <span>{opt.option_label}</span>
                                                                    <input
                                                                        type="radio"
                                                                        name={q.field_name}
                                                                        value={opt.option_value}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleChange(q.field_name, e.target.value)}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Radio Group Standard */}
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

                                        {cleanHelpText && (
                                            <p className={styles.helperNotice}>
                                                {personalizeQuestionText(cleanHelpText, applicantFullName)}
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
                            <span className={styles.btnIcon}>&larr;</span>
                            <span className={styles.btnText}>{currentStepIndex === 0 ? 'Exit' : 'Previous'}</span>
                        </button>
                        <button 
                            type="button" 
                            className={styles.btnSaveContinue} 
                            onClick={handleNext} 
                            disabled={isSaving}
                        >
                            {/* Assuming there might be a gear or loading icon here, separating text cleanly */}
                            <span className={styles.btnText}>
                                {isSaving ? 'Saving...' : (currentStepIndex === totalSteps - 1 ? 'Finish and Continue' : 'Save and Continue')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
