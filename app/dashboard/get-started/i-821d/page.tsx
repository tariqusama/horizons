"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';
import { getPrevFormPath } from '../formsHelper';

export default function I821DFormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        detention: '',
        dacaType: '',
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
                    if (latest.form_data && latest.form_data.i821d) {
                        setFormData({ ...formData, ...latest.form_data.i821d });
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
            await api.post(`/applications/${applicationId}/i821d`, formData);
            // After saving, navigate to the next form in the required forms list if present
            const res = await api.get('/applications');
            const latest = res.data[0];
            const title = (latest?.title || '').toLowerCase();
            const formsList = (() => {
                if (title.includes('replace') || title.includes('i-90') || title.includes('green card')) {
                    return [
                        { path: '/dashboard/get-started/i-90', code: 'i-90', name: 'Form I-90 (Green Card)' },
                        { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                    ];
                }
                if (title.includes('daca') || title.includes('821d')) {
                    return [
                        { path: '/dashboard/get-started/i-821d', code: 'i-821d', name: 'Form I-821D (DACA)' },
                        { path: '/dashboard/get-started/i-765', code: 'i-765', name: 'Form I-765 (Work Permit)' },
                        { path: '/dashboard/get-started/i-765ws', code: 'i-765ws', name: 'Form I-765WS (Worksheet)' },
                        { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                    ];
                }
                if (title.includes('naturalization') || title.includes('citizenship') || title.includes('n-400')) {
                    return [
                        { path: '/dashboard/get-started/n-400', code: 'n-400', name: 'Form N-400 (Naturalization)' },
                        { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                    ];
                }
                if (title.includes('adjust') || title.includes('485')) {
                    return [
                        { path: '/dashboard/get-started/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
                        { path: '/dashboard/get-started/i-485', code: 'i-485', name: 'Form I-485 (Green Card)' },
                        { path: '/dashboard/get-started/i-864', code: 'i-864', name: 'Form I-864 (Affidavit)' },
                        { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                    ];
                }
                if (title.includes('remove') || title.includes('751')) {
                    return [
                        { path: '/dashboard/get-started/i-751', code: 'i-751', name: 'Form I-751 (Remove Conditions)' },
                        { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                    ];
                }
                return [
                    { path: '/dashboard/get-started/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
                    { path: '/dashboard/get-started/i-130a', code: 'i-130a', name: 'Form I-130A (Spouse Supp.)' },
                    { path: '/dashboard/get-started/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
                ];
            })();

            const currentIndex = formsList.findIndex(f => f.path === '/dashboard/get-started/i-821d');
            if (currentIndex >= 0 && currentIndex < formsList.length - 1) {
                router.push(formsList[currentIndex + 1].path);
            } else {
                router.push('/dashboard/get-started/document-upload');
            }
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
                        <h1 className={styles.pageTitleText}>DACA Request for {applicantName}</h1>
                        <p className={styles.pageSubtitleText}>Provide information about your request for DACA.</p>
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
                    <h2 className={styles.questionText}>Information About You<span style={{ color: '#f97316' }}>*</span></h2>
                </div>
                <p className={styles.questionSubtext}>I am not in immigration detention and I have included Form I-765 and I-765WS:</p>

                <div className={styles.iconRadioRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label className={styles.iconRadioCircle}>
                        <input type="radio" name="detention" value="Yes" checked={formData.detention === 'Yes'} onChange={handleChange} />
                        <span className={styles.radioIndicator}></span>
                        <span>Yes</span>
                    </label>
                </div>
                {errors.detention && <div className="text-red-500 text-sm mt-2 ml-8">{errors.detention[0]}</div>}

                <p className={styles.questionSubtext} style={{ marginTop: '1.5rem' }}>I am applying for:</p>

                <div className={styles.iconRadioRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label className={styles.iconRadioCircle}>
                        <input type="radio" name="dacaType" value="Initial" checked={formData.dacaType === 'Initial'} onChange={handleChange} />
                        <span className={styles.radioIndicator}></span>
                        <span>Initial Request</span>
                    </label>
                    <label className={styles.iconRadioCircle} style={{ marginTop: '0.5rem' }}>
                        <input type="radio" name="dacaType" value="Renewal" checked={formData.dacaType === 'Renewal'} onChange={handleChange} />
                        <span className={styles.radioIndicator}></span>
                        <span>Renewal Request</span>
                    </label>
                </div>
                {errors.dacaType && <div className="text-red-500 text-sm mt-2 ml-8">{errors.dacaType[0]}</div>}
            </div>

            <div className={styles.footerScreenshot}>
                <button onClick={async () => { const prev = getPrevFormPath('/dashboard/get-started/i-821d', applicationTitle); router.push(prev); }} className={styles.btnTeal}>
                    &#8592; Previous
                </button>
                <button onClick={handleNext} disabled={isSaving} className={styles.btnTeal}>
                    {isSaving ? 'Saving...' : 'Save and Continue'}
                </button>
            </div>
        </div>
    );
}
