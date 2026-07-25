"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I765FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        reason: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    if (latest.form_data && latest.form_data.i765) {
                        setFormData({ ...formData, ...latest.form_data.i765 });
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
            await api.post(`/applications/${applicationId}/i765`, formData);
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
                <span>Question 1 of 11</span>
                <span>9%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '9%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application for Employment Authorization — USCIS Form I-765</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity and eligibility category to request an Employment Authorization Document (EAD). Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Reason for Applying</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am applying for: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Initial" checked={formData.reason === 'Initial'} onChange={handleChange} />
                                Initial permission to accept employment.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Replacement" checked={formData.reason === 'Replacement'} onChange={handleChange} />
                                Replacement of lost, stolen, or damaged employment authorization document.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Renewal" checked={formData.reason === 'Renewal'} onChange={handleChange} />
                                Renewal of my permission to accept employment.
                            </label>
                        </div>
                        {errors.reason && <div className="text-red-500 text-sm mt-1">{errors.reason[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.btnSecondary}>Save Draft</button>
                <div className={styles.rightActions}>
                    <Link href="/dashboard/get-started" className={styles.btnOutline}>Back</Link>
                    <button onClick={handleNext} disabled={isSaving} className={styles.btnPrimary} style={{ opacity: isSaving ? 0.7 : 1 }}>
                        {isSaving ? 'Saving...' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
