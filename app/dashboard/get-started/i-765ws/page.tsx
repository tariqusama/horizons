"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I765WSFormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        currentAnnualIncome: '',
        currentAnnualExpenses: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    if (latest.form_data && latest.form_data.i765ws) {
                        setFormData({ ...formData, ...latest.form_data.i765ws });
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
            await api.post(`/applications/${applicationId}/i765ws`, formData);
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
                <span>Question 1 of 3</span>
                <span>33%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '33%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Form I-765 Worksheet (DACA) — USCIS Form I-765WS</h1>
            <p className={styles.pageSubtitle}>Answer every question about your financial situation. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Financial Information</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>My current annual income is: <span className={styles.required}>*</span></label>
                        <input type="text" name="currentAnnualIncome" value={formData.currentAnnualIncome} onChange={handleChange} className={`${styles.input} ${errors.currentAnnualIncome ? '!border-red-500' : ''}`} placeholder="$" />
                        {errors.currentAnnualIncome && <div className="text-red-500 text-sm mt-1">{errors.currentAnnualIncome[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>My current annual expenses are: <span className={styles.required}>*</span></label>
                        <input type="text" name="currentAnnualExpenses" value={formData.currentAnnualExpenses} onChange={handleChange} className={`${styles.input} ${errors.currentAnnualExpenses ? '!border-red-500' : ''}`} placeholder="$" />
                        {errors.currentAnnualExpenses && <div className="text-red-500 text-sm mt-1">{errors.currentAnnualExpenses[0]}</div>}
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
