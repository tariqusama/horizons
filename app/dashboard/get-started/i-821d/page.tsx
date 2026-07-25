"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I821DFormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        detention: '',
        dacaType: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
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


    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(val => typeof val === 'string' && val.trim() !== '').length;
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Completed {filledFields} of {totalFields} fields</span>
                <span>{percentage}%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `%` }}></div>
            </div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitleText}>Consideration of Deferred Action for Childhood Arrivals</h1>
                <p className={styles.pageSubtitleText}>Provide information about your request for DACA.</p>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>Information About You<span style={{color: '#f97316'}}>*</span></h2>
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
                <Link href="/dashboard/get-started" className={styles.btnTeal}>
                    &#8592; Previous
                </Link>
                <button onClick={handleNext} disabled={isSaving} className={styles.btnTeal}>
                    {isSaving ? 'Saving...' : 'Save and Continue'}
                </button>
            </div>
        </div>
    );
}
