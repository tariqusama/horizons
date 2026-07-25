"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I130FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        relationship: '',
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
                    if (latest.form_data && latest.form_data.i130) {
                        setFormData({ ...formData, ...latest.form_data.i130 });
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
            await api.post(`/applications/${applicationId}/i130`, formData);
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
                <span>Question 1 of 12</span>
                <span>10%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '10%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Petition for Alien Relative — USCIS Form I-130</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity and your relationship to the relative you are petitioning for. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Relationship</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am filing this petition for my: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ gap: '20px' }}>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Spouse" checked={formData.relationship === 'Spouse'} onChange={handleChange} /> Spouse</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Parent" checked={formData.relationship === 'Parent'} onChange={handleChange} /> Parent</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Brother/Sister" checked={formData.relationship === 'Brother/Sister'} onChange={handleChange} /> Brother/Sister</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Child" checked={formData.relationship === 'Child'} onChange={handleChange} /> Child</label>
                        </div>
                        {errors.relationship && <div className="text-red-500 text-sm mt-1">{errors.relationship[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Information About You (Petitioner)</h2>

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
                        <label className={styles.label}>Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`${styles.input} ${errors.lastName ? '!border-red-500' : ''}`} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Given Name (First Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`${styles.input} ${errors.firstName ? '!border-red-500' : ''}`} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
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
