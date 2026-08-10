'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import styles from "./overview.module.css";
import api from "@/lib/api";
import { getFormsList } from "../formsHelper";
import { buildFormSteps } from "../dynamic/formsEngine";

// This layout mimics the provided screenshot for the Questionnaire Overview Dashboard
export default function QuestionnaireOverviewPage() {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const formCode = searchParams?.get('form');
    
    const [activeTab, setActiveTab] = useState("Immigrant Information");
    const [currentFormCode, setCurrentFormCode] = useState("");
    const [applicationTitle, setApplicationTitle] = useState("");
    const [application, setApplication] = useState<any>(null);
    const [currentStepTitle, setCurrentStepTitle] = useState("Step 2");

    const [sections, setSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [applicantName, setApplicantName] = useState("");
    const [globalStep, setGlobalStep] = useState(1); // 0=Initiation, 1=Collect Info, 2=Review, 3=Assembly, 4=Submission, 5=Post Sub.

    useEffect(() => {
        api.get('/applications')
            .then(async (res) => {
                const apps = res.data || [];
                const activeApp = apps[0];
                if (activeApp) {
                    // Map application status to global step index
                    const status = (activeApp.status || '').toLowerCase();
                    if (status.includes('review')) setGlobalStep(2);
                    else if (status.includes('assembly')) setGlobalStep(3);
                    else if (status.includes('submit')) setGlobalStep(4);
                    else if (status.includes('complete') || status.includes('post')) setGlobalStep(5);
                    else if (status.includes('initiation')) setGlobalStep(0);
                    else setGlobalStep(1); // Default to 'Collect Info' for active/pending

                    const formData = activeApp.form_data || {};
                    
                    const name = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim();
                    if (name) setApplicantName(name);

                    setApplicationTitle(activeApp.title || '');
                    setApplication(activeApp);
                    const forms = getFormsList(activeApp, { allowFallback: true });
                    const allSections: any[] = [];
                    
                    const currentForm = forms.find(f => f.code === formCode) || forms[0];
                    const currentFormIndex = forms.indexOf(currentForm) !== -1 ? forms.indexOf(currentForm) : 0;
                    
                    setCurrentStepTitle(`Step ${currentFormIndex + 2}`);
                    
                    const dynamicFormName = forms.length > 1 
                        ? `${activeApp.title || 'Form Intake'} (Part ${currentFormIndex + 1})`
                        : activeApp.title || 'Form Intake';
                        
                    setActiveTab(currentForm ? currentForm.name : dynamicFormName);

                    if (currentForm) {
                        setCurrentFormCode(currentForm.code);
                        try {
                            const schemaRes = await api.get(`/guide-engine/forms/${currentForm.code}`);
                            const schema = schemaRes.data;
                            
                            // Determine user role
                            let userRole = 'petitioner';
                            if (activeApp.user_id !== user?.id) {
                                const participant = activeApp.participants?.find((p: any) => p.user_id === user?.id);
                                if (participant) {
                                    userRole = participant.role;
                                }
                            }

                            // Filter sections based on role
                            if (schema?.sections) {
                                schema.sections = schema.sections.filter((section: any) => {
                                    const roles = section.assignee_roles;
                                    if (!roles || (Array.isArray(roles) && roles.length === 0)) {
                                        return userRole === 'petitioner';
                                    }
                                    
                                    let parsedRoles = roles;
                                    if (typeof roles === 'string') {
                                        try {
                                            parsedRoles = JSON.parse(roles);
                                        } catch (e) {
                                            parsedRoles = [roles];
                                        }
                                    }
                                    return Array.isArray(parsedRoles) && parsedRoles.includes(userRole);
                                });
                            }

                            const steps = buildFormSteps(schema, name || 'Applicant');
                            
                            const stepKey = `_current_step_${currentForm.code}`;
                            // fallback to generic _current_step for backward compatibility ONLY for the first form
                            const isFirstForm = currentForm === forms[0];
                            const fallback = isFirstForm ? (typeof formData._current_step === 'number' ? formData._current_step : 0) : 0;
                            const currentStepIndexInDb = typeof formData[stepKey] === 'number' ? formData[stepKey] : fallback;

                            steps.forEach((step: any, index: number) => {
                                allSections.push({
                                    formName: dynamicFormName,
                                    title: step.sectionTitle,
                                    desc: step.subSectionTitle,
                                    status: index < currentStepIndexInDb ? "completed" : "pending",
                                    applicant: name,
                                    slug: currentForm.code,
                                    stepIndex: index
                                });
                            });
                        } catch (err) {
                            console.error(`Failed to load schema for ${currentForm.code}`, err);
                        }
                    }
                    
                    if (allSections.length > 0) {
                        setSections(allSections);
                    } else {
                        setSections([{
                            formName: dynamicFormName,
                            title: "Personal Information",
                            desc: "Basic information about the applicant",
                            status: "pending",
                            slug: currentForm.code,
                            stepIndex: 0
                        }]);
                    }
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [formCode]);

    const handleNavigate = (slug: string, stepIndex: number, mode?: string) => {
        const query = mode ? `?step=${stepIndex}&mode=${mode}` : `?step=${stepIndex}`;
        router.push(`/dashboard/get-started/dynamic/${slug}${query}`);
    };

    const handleContinue = () => {
        const firstPending = sections.find(s => s.status === 'pending');
        if (firstPending) {
            handleNavigate(firstPending.slug, firstPending.stepIndex);
        } else {
            const forms = getFormsList(application, { allowFallback: true });
            const currentIndex = forms.findIndex(f => f.code === currentFormCode);
            if (currentIndex >= 0 && currentIndex < forms.length - 1) {
                const nextCode = forms[currentIndex + 1].code;
                if (nextCode.startsWith('ask-')) {
                    router.push(`/dashboard/get-started/optional-forms?ask=${nextCode.replace('ask-', '')}`);
                } else if (nextCode === 'optional-forms') {
                    router.push('/dashboard/get-started/optional-forms');
                } else {
                    router.push(`/dashboard/get-started/overview?form=${nextCode}`);
                }
            } else {
                router.push('/dashboard/get-started/document-upload');
            }
        }
    };

    if (isLoading) {
        return <div className="p-10 text-[#5A6579]">Loading overview...</div>;
    }

    return (
        <div className={styles.pageWrapper}>
            {/* Tabs Strip Removed */}

            {/* Main Sections Layout */}
            <div className={styles.layoutContainer}>
                {/* Dynamic Header */}
                <div className={styles.dynamicHeader}>
                    <h1 className={styles.dynamicHeaderTitle}>{currentStepTitle}: {activeTab}</h1>
                    
                    <div className={styles.progressRow}>
                        <div className={styles.progressTrack} aria-label="Application progress bar">
                            {["Initiation", "Collect Info", "Review", "Assembly", "Submission", "Post Sub."].map((label, i) => {
                                let state = "pending";
                                if (i < globalStep) state = "done";
                                else if (i === globalStep) state = "active";
                                
                                return (
                                    <div
                                        key={label}
                                        className={`${styles.progressSegment} ${state === 'active' || state === 'done' ? styles.progressSegmentActive : ''}`}
                                    >
                                        <span className={`${styles.progressLabel} ${state === 'active' || state === 'done' ? styles.progressLabelActive : ''}`}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.illustrationContainer}>
                        <Image src="/assets/images/immigrant-info.png" alt="Illustration" width={180} height={120} style={{ objectFit: 'contain' }} />
                    </div>
                </div>

                {sections.map((section, idx) => (
                    <div key={idx} className={styles.sectionBlock}>
                        <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>
                                        {section.title}: {section.status === 'completed' && <span className={styles.statusCompleted}>Completed</span>}
                                    </h2>
                                </div>
                                <p className={styles.sectionDesc}>{section.desc}</p>
                                
                                {/* Box content specific to completed state, mimicking screenshot */}
                                {section.status === 'completed' && section.applicant && (
                                    <div className={styles.completedBox}>
                                        <span className={styles.completedBoxText}>{section.applicant}</span>
                                        <button 
                                            className={`${styles.btnAction} ${styles.btnEdit}`}
                                            onClick={() => handleNavigate(section.slug, section.stepIndex, 'edit')}
                                        >
                                            Edit Questionnaire
                                        </button>
                                    </div>
                                )}

                                <div className={styles.sectionActionRow}>
                                    {section.status === 'pending' && (
                                        <button 
                                            className={`${styles.btnAction} ${styles.btnStart}`}
                                            onClick={() => handleNavigate(section.slug, section.stepIndex)}
                                        >
                                            Start Here
                                        </button>
                                    )}
                                </div>
                    </div>
                ))}
            </div>

            {/* Bottom Nav */}
            <div className={styles.bottomNav}>
                <button 
                    type="button" 
                    className={styles.btnNav}
                    onClick={() => router.back()}
                >
                    &larr; Previous
                </button>
                <button 
                    type="button" 
                    className={styles.btnNav}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
