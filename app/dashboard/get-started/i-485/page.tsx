"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I485FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        category: '',
        aNumber: '',
        uscisOnlineAccount: '',
        lastName: '',
        firstName: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    if (latest.form_data && latest.form_data.i485) {
                        setFormData({ ...formData, ...latest.form_data.i485 });
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
            await api.post(`/applications/${applicationId}/i485`, formData);
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
                <span>Question 1 of 14</span>
                <span>8%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '8%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application to Register Permanent Residence or Adjust Status — USCIS Form I-485</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, immigration history, and eligibility to adjust status. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alien Registration Number (A-Number) (if any)</label>
                        <input type="text" name="aNumber" value={formData.aNumber} onChange={handleChange} className={styles.input} />
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
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Application Type or Filing Category</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am applying to register lawful permanent residence or adjust status because: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Family" checked={formData.category === 'Family'} onChange={handleChange} />
                                Family-based (Immediate relative of a U.S. citizen, fiancé(e), etc.)
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Employment" checked={formData.category === 'Employment'} onChange={handleChange} />
                                Employment-based
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Special" checked={formData.category === 'Special'} onChange={handleChange} />
                                Special Immigrant
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Asylum" checked={formData.category === 'Asylum'} onChange={handleChange} />
                                Asylum or Refugee
                            </label>
                        </div>
                        {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category[0]}</div>}
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
