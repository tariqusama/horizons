"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import { getNextFormPath, getPrevFormPath } from '../formsHelper';
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
            const apps = await api.get('/applications');
            const latest = apps.data[0];
            const next = getNextFormPath('/dashboard/get-started/i-90', latest?.title || '');
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
                        <h1 className={styles.pageTitleText}>Immigrant Information</h1>
                        <p className={styles.pageSubtitleText}>Basic information about the Green Card applicant</p>
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
                    <h2 className={styles.questionText}>What is the full legal name of the green card Applicant?<span style={{ color: '#f97316' }}>*</span></h2>
                </div>
                <p className={styles.questionSubtext}>This is the Applicant's CURRENT full legal name, including first, middle, and last names.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName[0]}</div>}
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>What is the sex of {applicantName}?<span style={{ color: '#f97316' }}>*</span></h2>
                </div>
                <p className={styles.questionSubtext}>USCIS allows individuals to self-identify their gender marker.</p>

                <div className={styles.iconRadioRow}>
                    <label className={styles.iconRadioCircle}>
                        <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                        <div className={styles.genderIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 8V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z" /></svg>
                        </div>
                        <span>Female</span>
                    </label>
                    <label className={styles.iconRadioCircle}>
                        <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                        <div className={styles.genderIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 105 5 5.006 5.006 0 00-5-5zm0 8a3 3 0 113-3 3.003 3.003 0 01-3 3zm9 11v-1a7 7 0 00-7-7h-4a7 7 0 00-7 7v1h2v-1a5 5 0 015-5h4a5 5 0 015 5v1z" /></svg>
                        </div>
                        <span>Male</span>
                    </label>
                </div>
                {errors.gender && <div className="text-red-500 text-sm mt-2 ml-8">{errors.gender[0]}</div>}
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>Has {applicantName} used other name(s)?<span style={{ color: '#f97316' }}>*</span></h2>
                </div>
                <p className={styles.questionSubtext}>This includes names such as maiden names, nicknames, and aliases.</p>

                <div className={styles.radioRow}>
                    <label className={styles.radioCircle}>
                        <input type="radio" name="otherNames" value="Yes" checked={formData.otherNames === 'Yes'} onChange={handleChange} />
                        <span className={styles.radioIndicator}></span>
                        <span>Yes</span>
                    </label>
                    <label className={styles.radioCircle}>
                        <input type="radio" name="otherNames" value="No" checked={formData.otherNames === 'No'} onChange={handleChange} />
                        <span className={styles.radioIndicator}></span>
                        <span>No</span>
                    </label>
                </div>
                {errors.otherNames && <div className="text-red-500 text-sm mt-2 ml-8">{errors.otherNames[0]}</div>}
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>What are {applicantName}'s identification numbers?</h2>
                </div>
                <p className={styles.questionSubtext}>Provide the Alien Registration Number and USCIS Online Account Number if you have them.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Alien Registration Number (A-Number)</label>
                        <input type="text" name="aNumber" value={formData.aNumber} onChange={handleChange} className={styles.screenshotInput} />
                    </div>

                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>USCIS Online Account Number</label>
                        <input type="text" name="uscisOnlineAccount" value={formData.uscisOnlineAccount} onChange={handleChange} className={styles.screenshotInput} />
                    </div>

                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>U.S. Social Security Number (if any)</label>
                        <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                </div>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>{applicantName}'s Birth Information<span style={{ color: '#f97316' }}>*</span></h2>
                </div>
                <p className={styles.questionSubtext}>Provide details regarding the date and location of birth.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Date of Birth (mm/dd/yyyy)</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob[0]}</div>}
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Country of Birth</label>
                        <input type="text" name="countryOfBirth" value={formData.countryOfBirth} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.countryOfBirth && <div className="text-red-500 text-sm mt-1">{errors.countryOfBirth[0]}</div>}
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Country of Citizenship</label>
                        <input type="text" name="countryOfCitizenship" value={formData.countryOfCitizenship} onChange={handleChange} className={styles.screenshotInput} />
                        {errors.countryOfCitizenship && <div className="text-red-500 text-sm mt-1">{errors.countryOfCitizenship[0]}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>{applicantName}'s Parents' Information</h2>
                </div>
                <p className={styles.questionSubtext}>Please provide the first names of the Applicant's parents.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Mother's First Name at Birth</label>
                        <input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Father's First Name at Birth</label>
                        <input type="text" name="fatherFirstName" value={formData.fatherFirstName} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                </div>
            </div>

            <div className={styles.formQuestion}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionCheck}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.questionText}>Green Card Details</h2>
                </div>
                <p className={styles.questionSubtext}>Provide information regarding the current admission as a Lawful Permanent Resident.</p>

                <div className={styles.screenshotInputGroup}>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Class of Admission</label>
                        <input type="text" name="classOfAdmission" value={formData.classOfAdmission} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Date of Admission (mm/dd/yyyy)</label>
                        <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Port of Admission — City</label>
                        <input type="text" name="portOfAdmissionCity" value={formData.portOfAdmissionCity} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                    <div className={styles.screenshotInputWrapper}>
                        <label className={styles.screenshotInputLabel}>Port of Admission — State</label>
                        <input type="text" name="portOfAdmissionState" value={formData.portOfAdmissionState} onChange={handleChange} className={styles.screenshotInput} />
                    </div>
                </div>
            </div>

            <div className={styles.footerScreenshot}>
                <button onClick={() => { const prev = getPrevFormPath('/dashboard/get-started/i-90', applicationTitle); router.push(prev); }} className={styles.btnTeal}>
                    &#8592; Previous
                </button>
                <button onClick={handleNext} disabled={isSaving} className={styles.btnTeal}>
                    {isSaving ? 'Saving...' : 'Save and Continue'}
                </button>
            </div>
        </div>
    );
}
