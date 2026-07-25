"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function N400FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        eligibility: '',
        aNumber: '',
        uscisOnlineAccount: '',
        lastName: '',
        firstName: '',
        middleName: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    if (latest.form_data && latest.form_data.n400) {
                        setFormData({ ...formData, ...latest.form_data.n400 });
                    }
                }
            } catch (e) {
                console.error("Failed to load application", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplication();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: [] }));
        }
    };

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!applicationId) return;
        
        setIsSaving(true);
        setErrors({});
        
        try {
            await api.post(`/applications/${applicationId}/n400`, formData);
            router.push('/dashboard/get-started/document-upload');
        } catch (error: any) {
            console.error("Validation failed", error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                alert("Please fill out all required fields correctly.");
            } else {
                alert("An error occurred while saving your progress.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className={styles.pageWrapper}><div className="p-8 text-center text-gray-500">Loading form data...</div></div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 18</span>
                <span>5%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '5%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application for Naturalization — USCIS Form N-400</h1>
            <p className={styles.pageSubtitle}>Answer every question about your eligibility, identity, and residence to apply for U.S. citizenship. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About Your Eligibility</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>You are at least 18 years of age and: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="5_years" checked={formData.eligibility === '5_years'} onChange={handleChange} />
                                Have been a lawful permanent resident of the United States for at least 5 years.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="3_years" checked={formData.eligibility === '3_years'} onChange={handleChange} />
                                Have been a lawful permanent resident of the United States for at least 3 years, AND have been married to and living with the same U.S. citizen spouse.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="military" checked={formData.eligibility === 'military'} onChange={handleChange} />
                                Are applying on the basis of qualifying military service.
                            </label>
                        </div>
                        {errors.eligibility && <div className="text-red-500 text-sm mt-1">{errors.eligibility[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Information About You (Person Applying for Naturalization)</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alien Registration Number (A-Number) <span className={styles.required}>*</span></label>
                        <input type="text" name="aNumber" value={formData.aNumber} onChange={handleChange} className={`${styles.input} ${errors.aNumber ? '!border-red-500' : ''}`} />
                        {errors.aNumber && <div className="text-red-500 text-sm mt-1">{errors.aNumber[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>USCIS Online Account Number (if any)</label>
                        <input type="text" name="uscisOnlineAccount" value={formData.uscisOnlineAccount} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Current Legal Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`${styles.input} ${errors.lastName ? '!border-red-500' : ''}`} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Current Legal Given Name (First Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`${styles.input} ${errors.firstName ? '!border-red-500' : ''}`} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Current Legal Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={styles.input} />
                    </div>
                </div>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.btnPrev} disabled={isSaving}>Save Draft</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.btnPrev} onClick={() => router.push('/dashboard/get-started')} disabled={isSaving}>Back</button>
                    <button onClick={handleNext} disabled={isSaving} className={styles.btnNext} style={{ opacity: isSaving ? 0.7 : 1 }}>
                        {isSaving ? 'Saving...' : 'Continue'}
                        {!isSaving && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem', display: 'inline-block' }}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>}
                    </button>
                </div>
            </div>
        </div>
    );
}
