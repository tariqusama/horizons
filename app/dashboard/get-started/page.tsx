"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./get-started.module.css";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { getChecklists } from "@/lib/api/cases";
import { getChecklistKeyFromService } from "@/lib/utils/documentHelper";

export default function GetStartedPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [message, setMessage] = useState("Hi, I think I selected the wrong package. Could you please help me pick the correct one?");
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [application, setApplication] = useState<any>(null);
    const [checklist, setChecklist] = useState<any>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const [appsRes, checklistsData] = await Promise.all([
                    api.get('/applications'),
                    getChecklists()
                ]);
                const apps = appsRes.data || [];
                const latest = apps[0];
                if (!latest) {
                    router.push('/dashboard');
                    return;
                }
                const pendingBalance = (Number(latest.amount || 0) - Number(latest.paid_amount || 0));
                if (pendingBalance > 0 || latest.status === 'Pending') {
                    router.push('/dashboard');
                    return;
                }
                setApplication(latest);

                // Load matching checklist from DB
                const serviceText = `${latest.title || ''} ${latest.service_type || ''}`;
                const checklistKey = getChecklistKeyFromService(serviceText);
                if (checklistKey && checklistsData[checklistKey]) {
                    setChecklist(checklistsData[checklistKey]);
                }
            } catch (error) {
                console.error(error);
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, [router]);

    const handleConfirm = () => {
        // Show the welcome screen instead of routing directly
        setShowWelcome(true);
    };

    const handleContinueToForm = () => {
        let slug = "i-90"; // default fallback

        if (application?.title) {
            const title = application.title.toLowerCase();
            if (title.includes('n-400') || title.includes('naturalization') || title.includes('citizenship')) {
                slug = "n-400";
            } else if (title.includes('fiancé') || title.includes('fiance') || title.includes('spouse') || title.includes('relative')) {
                slug = "i-130";
            } else if (title.includes('daca') || title.includes('821d')) {
                slug = "i-821d";
            } else if (title.includes('replace') || title.includes('fix') || title.includes('green card') || title.includes('i-90')) {
                slug = "i-90";
            }
        }

        router.push(`/dashboard/get-started/dynamic/${slug}`);
    };

    const handleWrongPackage = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        try {
            await api.post('/messages', { message: message.trim() });
            setIsModalOpen(false);
            setMessage(""); // Clear message
            localStorage.setItem('wrong_package_reported', 'true');
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.pageWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ color: '#5B6472', fontWeight: 600 }}>Loading...</p>
            </div>
        );
    }

    const getWelcomeContent = () => {
        const title = application?.title?.toLowerCase() || '';
        
        if (title.includes('n-400') || title.includes('naturalization') || title.includes('citizenship')) {
            return {
                title: "Congratulations!",
                p1: "You are taking the first step towards U.S. citizenship. We are so excited to work with you to make your immigration dreams a reality.",
                p2: "Horizon Pathways has helped thousands of green card holders successfully become U.S. citizens through the filing of Form N-400 Application for Naturalization.",
                p3: "Pay close attention to the information in this section, as it will guide you through how to use Horizon Pathways.",
                eligibilityTitle: "Am I Eligible for Naturalization?",
                eligibilityText: "You are eligible to apply for U.S. citizenship if you have been a lawful permanent resident for at least 5 years (or 3 years if married to a U.S. citizen) and meet all other eligibility requirements.",
                eligibilityBullets: [
                    "You must be at least 18 years old at the time of filing.",
                    "You must have lived within the state or USCIS district with jurisdiction over your place of residence for at least 3 months prior to the date of filing.",
                    "You must demonstrate good moral character and an attachment to the principles of the U.S. Constitution."
                ]
            };
        } else if (title.includes('fiancé') || title.includes('fiance') || title.includes('spouse') || title.includes('relative') || title.includes('i-130')) {
            return {
                title: "Congratulations!",
                p1: "You are taking the first step towards reuniting with your family in the U.S. We are so excited to work with you to make your immigration dreams a reality.",
                p2: "Horizon Pathways has helped thousands of families successfully stay together through the filing of Family-Based Immigration Petitions (like the I-130).",
                p3: "Pay close attention to the information in this section, as it will guide you through how to use Horizon Pathways.",
                eligibilityTitle: "Am I Eligible to Petition a Relative?",
                eligibilityText: "You are eligible to petition for a relative if you are a U.S. citizen or a lawful permanent resident and can prove a qualifying family relationship.",
                eligibilityBullets: [
                    "U.S. citizens can petition for their spouse, children, parents, and siblings.",
                    "Lawful permanent residents can petition for their spouse and unmarried children.",
                    "You will need to provide proof of your U.S. citizenship or green card status, as well as proof of the family relationship."
                ]
            };
        } else if (title.includes('daca') || title.includes('821d')) {
            return {
                title: "Congratulations!",
                p1: "You are taking the first step towards renewing your DACA status. We are so excited to work with you to make your immigration dreams a reality.",
                p2: "Horizon Pathways has helped thousands of Dreamers successfully renew their DACA status through the filing of Form I-821D.",
                p3: "Pay close attention to the information in this section, as it will guide you through how to use Horizon Pathways.",
                eligibilityTitle: "Am I Eligible To Renew DACA?",
                eligibilityText: "You are eligible to renew your DACA status if you previously received DACA and continue to meet the guidelines.",
                eligibilityBullets: [
                    "You must not have departed the U.S. on or after Aug. 15, 2012, without advance parole.",
                    "You must have continuously resided in the U.S. since you submitted your most recent DACA request.",
                    "You must not have been convicted of a felony, a significant misdemeanor, or three or more misdemeanors."
                ]
            };
        } else {
            // Default to I-90 Green Card Renewal
            return {
                title: "Congratulations!",
                p1: "You are taking the first step towards renewing your green card's status. We are so excited to work with you to make your immigration dreams a reality.",
                p2: "Horizon Pathways has helped over a thousand green card holders successfully renew their green card through the filing of Form I-90 Application to Replace Permanent Resident Card.",
                p3: "Pay close attention to the information in this section, as it will guide you through how to use Horizon Pathways.",
                eligibilityTitle: "Am I Eligible To Renew a Green Card?",
                eligibilityText: "You are eligible to renew your Green Card if you are a lawful permanent resident whose 10-year card is expired or will expire within the next 6 months, provided you have not committed any deportable offenses or abandoned your U.S. residence.",
                eligibilityBullets: [
                    "Lawful permanent residents must file Form I-90 (Application to Replace Permanent Resident Card) with U.S. Citizenship and Immigration Services (USCIS).",
                    "You should file as soon as your card expires or up to six months before it does, as this triggers an automatic 36-month extension of your card's validity while the application is processed.",
                    "You will need the expired green card and the I-90 receipt notice to prove your status for employment and travel."
                ]
            };
        }
    };

    const welcomeContent = getWelcomeContent();

    if (showWelcome) {
        return (
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', background: '#fff' }}>
                <h1 style={{ fontSize: '24px', color: '#6B7280', fontWeight: 300, borderBottom: '1px solid #E5E7EB', paddingBottom: '20px', marginBottom: '30px' }}>
                    Welcome to Horizon Pathways!
                </h1>
                
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '30px' }}>
                    <div style={{ flex: '1', minWidth: '350px' }}>
                        <h2 style={{ color: '#1b2559', fontSize: '20px', fontWeight: 600, marginBottom: '15px' }}>{welcomeContent.title}</h2>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                            {welcomeContent.p1}
                        </p>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                            <span dangerouslySetInnerHTML={{ __html: welcomeContent.p2.replace(/(Form [A-Z0-9-]+[a-zA-Z\s]*)/, '<strong>$1</strong>') }} />
                        </p>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
                            {welcomeContent.p3}
                        </p>
                    </div>
                    <div style={{ flex: '1', minWidth: '350px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <div style={{ width: '100%', maxWidth: '400px', background: '#f4f7fe', borderRadius: '80px', padding: '40px', border: '1px solid #dfe7f6', position: 'relative', overflow: 'hidden', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', top: '20px', right: '30px', fontSize: '40px' }}>🇺🇸</div>
                            <div style={{ position: 'absolute', top: '30px', left: '30px', fontSize: '30px' }}>📄</div>
                            <div style={{ position: 'absolute', bottom: '80px', right: '60px', fontSize: '30px' }}>📋</div>
                            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '50px', marginBottom: '-10px' }}>👩🏽‍💻</div>
                                <div style={{ width: '120px', height: '40px', background: '#374151', borderRadius: '4px 4px 0 0' }}></div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '4px', background: '#374151' }}></div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#1b2559', fontSize: '20px', fontWeight: 600, marginBottom: '15px' }}>Who We Help</h2>
                    <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
                        Each year, we guide thousands of immigrants through the application process. Our software is designed to identify potential red flags that might require specialized legal support, and while our platform is a great fit for many, we recognize it may not be right for everyone.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#1b2559', fontSize: '20px', fontWeight: 600, marginBottom: '15px' }}>{welcomeContent.eligibilityTitle}</h2>
                    <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                        {welcomeContent.eligibilityText}
                    </p>
                    <ul style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', paddingLeft: '24px', marginBottom: '24px', listStyleType: 'disc' }}>
                        {welcomeContent.eligibilityBullets.map((bullet, idx) => (
                            <li key={idx} style={{ marginBottom: '8px' }}>{bullet}</li>
                        ))}
                    </ul>
                    
                    <div style={{ background: '#E0F2FE', padding: '16px 20px', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ background: '#1b2559', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontStyle: 'italic', fontSize: '14px' }}>i</div>
                        <p style={{ margin: 0, color: '#374151', fontSize: '14px', fontWeight: 500 }}>Have questions or concerns about your eligibility or immigration history? Reach out to our live chat team.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '30px', marginTop: '40px' }}>
                    <button onClick={() => setShowWelcome(false)} style={{ background: '#1b2559', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                        &larr; Previous
                    </button>
                    <button onClick={handleContinueToForm} style={{ background: '#1b2559', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Save and Continue
                    </button>
                </div>
            </div>
        );
    }

    // Pull description and forms from DB checklist; fallback to safe defaults
    const packageDescription = checklist?.description || application?.title || 'processing your immigration application';
    const includedForms = checklist?.forms ? (checklist.forms as string[]).join(', ') : 'G-1145';

    const stepLabels = [
        'Initiation',
        'Collect Info',
        'Review',
        'Assembly',
        'Submission',
        'Post Sub.'
    ];

    const dynamicPackageName = application?.title || checklist?.description || 'immigration application';
    const welcomeText = `Welcome to your ${dynamicPackageName}. This section is designed to help you know how our software works and where to get started. Click the “Start Here” button below to begin.`;

    return (
        <div className={styles.stepPageWrapper}>
            <div className={styles.stepHeader}>
                <h2>Step 1: Getting Started</h2>
            </div>

            <div className={styles.progressRow}>
                <div className={styles.progressTrack} aria-label="Application progress bar">
                    {stepLabels.map((label, index) => (
                        <div
                            key={label}
                            className={`${styles.progressSegment} ${index === 0 ? styles.progressSegmentActive : ''}`}
                        >
                            <span className={`${styles.progressLabel} ${index === 0 ? styles.progressLabelActive : ''}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.infoPanel}>
                <div className={styles.processIllustrationWrap}>
                    <div className={styles.processIllustration}>
                        <div className={styles.illustrationBoard}>
                            <span className={styles.illustrationLabel}>Starting the</span>
                            <span className={styles.illustrationLabelLarge}>Immigration</span>
                            <span className={styles.illustrationLabelLarge}>Process</span>
                        </div>
                        <div className={styles.illustrationPerson}>
                            <div className={styles.personHead} />
                            <div className={styles.personBody} />
                            <div className={styles.personDesk} />
                            <div className={styles.personPlant} />
                        </div>
                    </div>
                </div>

                <p className={styles.welcomeText}>{welcomeText}</p>
            </div>

            <div className={styles.learningSectionHeader}>
                <h3>Here&apos;s What You&apos;ll Learn in Step 1</h3>
                <button className={styles.languageToggle} type="button" aria-label="Language selector">
                    <span className={styles.languageFlag}>🇺🇸</span>
                    <span>English</span>
                    <span className={styles.languageArrow}>›</span>
                </button>
            </div>

            <div className={styles.learningSection}>
                <ul>
                    <li>How the process works and how to get extra help</li>
                    <li>What information you will need to provide</li>
                    <li>What documents you will need to upload</li>
                    <li>Tips and tricks for using Horizon Pathways</li>
                    <li>How to contact us if you need help or have questions</li>
                </ul>
            </div>
            <div className={styles.infoSection}>
                <h2 className={styles.beginHeader}>Let&apos;s Begin Your Immigration Application.</h2>
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Petitioner&apos;s Full Legal Name</span>
                        <div className={styles.infoCardValue}>{user?.name || 'Pending'}</div>
                    </div>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Beneficiary&apos;s Full Legal Name</span>
                        <div className={styles.infoCardValue}>To be provided</div>
                    </div>
                </div>
            </div>

            <div className={styles.confirmationCard}>
                <h3 className={styles.confirmationTitle}>Application Confirmation</h3>
                <p className={styles.confirmationText}>
                    Can you confirm this package is for {packageDescription}?
                </p>
                <p className={styles.confirmationSubtext}>
                    This package includes: {includedForms}.
                </p>
                <div className={styles.confirmationActions}>
                    <button className={styles.confirmPrimary} onClick={handleConfirm}>
                        ✓ Yes, I can confirm
                    </button>
                    <button className={styles.confirmSecondary} onClick={handleWrongPackage}>
                        ✕ No, I selected the wrong package
                    </button>
                </div>
            </div>
        </div>
    );
}

