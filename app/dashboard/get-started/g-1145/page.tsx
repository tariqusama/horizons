"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function G1145FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
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
                    if (latest.form_data && latest.form_data.g1145) {
                        setFormData({ ...formData, ...latest.form_data.g1145 });
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
            await api.post(`/applications/${applicationId}/g1145`, formData);
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

    const totalFields = 3;
    const filledFields = [formData.lastName, formData.firstName, formData.middleName].filter(val => val.trim() !== '').length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Completed {filledFields} of {totalFields} fields</span>
                <span>{percentage}%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
            </div>

            <h1 className={styles.pageTitle}>e-Notification of Application/Petition Acceptance — USCIS Form G-1145</h1>
            <p className={styles.pageSubtitle}>Provide the applicant/petitioner's contact details so USCIS can send electronic notifications when they accept the application.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>APPLICANT / PETITIONER INFORMATION</div>
                <h2 className={styles.sectionHeading}>Applicant / Petitioner Information</h2>
                <p className={styles.sectionDesc}>This information must match exactly what appears on the main petition or application you're filing with G-1145.</p>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Applicant / Petitioner Full Last Name <span className={styles.required}>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`${styles.input} ${errors.lastName ? '!border-red-500' : ''}`} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Applicant / Petitioner Full First Name <span className={styles.required}>*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`${styles.input} ${errors.firstName ? '!border-red-500' : ''}`} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Applicant / Petitioner Full Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={styles.input} />
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <Link href="/dashboard/get-started/i-90" className={styles.btnPrev}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Previous
                    </Link>
                    <button onClick={handleNext} disabled={isSaving} className={styles.btnNext} style={{ opacity: isSaving ? 0.7 : 1 }}>
                        {isSaving ? 'Saving...' : 'Next'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
