"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function I90FormPage() {
    const router = useRouter();
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        aNumber: '',
        uscisOnlineAccount: '',
        lastName: '',
        firstName: '',
        middleName: '',
        otherNames: '',
        dob: '',
        countryOfBirth: '',
        countryOfCitizenship: '',
        ssn: '',
        gender: '',
        motherFirstName: '',
        fatherFirstName: '',
        classOfAdmission: '',
        dateOfAdmission: '',
        portOfAdmissionCity: '',
        portOfAdmissionState: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications');
                const latest = res.data[0];
                if (latest) {
                    setApplicationId(latest.id);
                    if (latest.form_data && latest.form_data.i90) {
                        setFormData({ ...formData, ...latest.form_data.i90 });
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
        // Clear error for this field
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
            await api.post(`/applications/${applicationId}/i90`, formData);
            router.push('/dashboard/get-started/g-1145');
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

    const totalFields = 17;
    const filledFields = Object.values(formData).filter(val => val.trim() !== '').length;
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

            <h1 className={styles.pageTitle}>Application to Replace Permanent Resident Card — USCIS Form I-90</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, your current Permanent Resident Card, and the reason you are requesting a replacement. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You</h2>

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
                        <label className={styles.label}>Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`${styles.input} ${errors.lastName ? '!border-red-500' : ''}`} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Given Name (First Name) <span className={styles.required}>*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`${styles.input} ${errors.firstName ? '!border-red-500' : ''}`} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Have you ever used any other names (including maiden name / nicknames / aliases)? <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="otherNames" value="Yes" checked={formData.otherNames === 'Yes'} onChange={handleChange} />
                                Yes
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="otherNames" value="No" checked={formData.otherNames === 'No'} onChange={handleChange} />
                                No
                            </label>
                        </div>
                        {errors.otherNames && <div className="text-red-500 text-sm mt-1">{errors.otherNames[0]}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Birth (mm/dd/yyyy) <span className={styles.required}>*</span></label>
                        <div className={styles.dateInputWrapper}>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`${styles.dateInput} ${errors.dob ? '!border-red-500' : ''}`} />
                        </div>
                        {errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Country of Birth <span className={styles.required}>*</span></label>
                        <input type="text" name="countryOfBirth" value={formData.countryOfBirth} onChange={handleChange} className={`${styles.input} ${errors.countryOfBirth ? '!border-red-500' : ''}`} />
                        {errors.countryOfBirth && <div className="text-red-500 text-sm mt-1">{errors.countryOfBirth[0]}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Country of Citizenship or Nationality <span className={styles.required}>*</span></label>
                        <input type="text" name="countryOfCitizenship" value={formData.countryOfCitizenship} onChange={handleChange} className={`${styles.input} ${errors.countryOfCitizenship ? '!border-red-500' : ''}`} />
                        {errors.countryOfCitizenship && <div className="text-red-500 text-sm mt-1">{errors.countryOfCitizenship[0]}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>U.S. Social Security Number (if any)</label>
                        <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Gender <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                                Male
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                                Female
                            </label>
                        </div>
                        {errors.gender && <div className="text-red-500 text-sm mt-1">{errors.gender[0]}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mother's First Name at Birth</label>
                        <input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Father's First Name at Birth</label>
                        <input type="text" name="fatherFirstName" value={formData.fatherFirstName} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Class of Admission (from current Green Card)</label>
                        <input type="text" name="classOfAdmission" value={formData.classOfAdmission} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Admission as LPR (mm/dd/yyyy)</label>
                        <div className={styles.dateInputWrapper}>
                            <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} className={styles.dateInput} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Port of Admission — City</label>
                        <input type="text" name="portOfAdmissionCity" value={formData.portOfAdmissionCity} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Port of Admission — State</label>
                        <input type="text" name="portOfAdmissionState" value={formData.portOfAdmissionState} onChange={handleChange} className={styles.input} />
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <button className={styles.btnPrev} disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Previous
                    </button>
                    <button onClick={handleNext} disabled={isSaving} className={styles.btnNext} style={{ opacity: isSaving ? 0.7 : 1 }}>
                        {isSaving ? 'Saving...' : 'Next'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
