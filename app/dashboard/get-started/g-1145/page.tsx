"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import { getNextFormPath, getPrevFormPath } from '../formsHelper';
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
    const [applicationTitle, setApplicationTitle] = useState('');

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    setApplicationTitle(latest.title || '');
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
            const apps = await api.get('/applications');
            const latest = apps.data[0];
            const next = getNextFormPath('/dashboard/get-started/g-1145', latest?.title || '');
            router.push(next);
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



    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(val => typeof val === 'string' && val.trim() !== '').length;
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    const applicantName = [(formData as any).firstName, (formData as any).lastName].filter(Boolean).join(' ') || 'the Applicant';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Completed {filledFields} of {totalFields} fields</span>
                <span>{percentage}%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
            </div>
            <div className={styles.pageHeader}>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={styles.pageTitleText}>e-Notification for {applicantName}</h1>
                        <p className={styles.pageSubtitleText}>Provide the applicant/petitioner's contact details.</p>
                    </div>
                    {applicantName !== 'the Applicant' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Applicant: {applicantName}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>Applicant Name</h2>
                </div>
                <p className={styles.questionSubtext}>Please provide your full legal name.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>First Name <span style={{ color: '#f97316' }}>*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Last Name <span style={{ color: '#f97316' }}>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.footerScreenshot}>
                <button onClick={() => { const prev = getPrevFormPath('/dashboard/get-started/g-1145', applicationTitle); router.push(prev); }} className={styles.btnTeal}>
                    &#8592; Previous
                </button>
                <button onClick={handleNext} disabled={isSaving} className={styles.btnTeal}>
                    {isSaving ? 'Saving...' : 'Save and Continue'}
                </button>
            </div>
        </div>
    );
}
