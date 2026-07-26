"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';

export default function SubmissionPage() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appData, setAppData] = useState<any>(null);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const res = await api.get('/applications');
                if (res.data && res.data[0]) setAppData(res.data[0]);
            } catch (e) {
                console.error("Failed to load application data", e);
            }
        };
        fetchApp();
    }, []);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!agreed) {
            setError(true);
            return;
        }

        setError(false);
        setIsSubmitting(true);

        try {
            if (appData && appData.id) {
                await api.post(`/applications/${appData.id}/submit`);
            } else {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            router.push('/dashboard/applications');
        } catch (err) {
            console.error("Submission failed", err);
            alert("Failed to submit. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.pageTitle}>Ready to Submit Your Application</h1>
            <p className={styles.pageSubtitle}>Congratulations! You have completed your application and uploaded all required supporting documents.</p>

            <div className={styles.formSection}>
                {/* --- Review Section --- */}
                <h2 className={styles.sectionHeading}>Review Your Application</h2>
                <p className={styles.sectionDesc}>
                    Please review your provided information and uploaded documents before finalizing your submission.
                </p>

                <div className={styles.reviewContainer}>
                    <div className={styles.reviewBlock}>
                        <div className={styles.reviewHeader}>
                            <h3 className={styles.reviewTitle}>Forms & Questionnaires</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); router.push('/dashboard/get-started/preview'); }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm"
                                >
                                    Preview Data
                                </button>
                                <Link href="/dashboard/get-started/preview" className={styles.btnEdit}>Edit</Link>
                            </div>
                        </div>
                        <p className={styles.reviewStatus}>
                            <span className={styles.statusDot}></span> Complete
                        </p>
                    </div>

                    <div className={styles.reviewBlock}>
                        <div className={styles.reviewHeader}>
                            <h3 className={styles.reviewTitle}>Uploaded Documents</h3>
                            <Link href="/dashboard/get-started/document-upload" className={styles.btnEdit}>Edit</Link>
                        </div>
                        <p className={styles.reviewStatus}>
                            <span className={styles.statusDot}></span> Complete
                        </p>
                    </div>
                </div>

                <hr className={styles.divider} />

                {/* --- Acknowledgments --- */}
                <h2 className={styles.sectionHeading}>Before submitting, please review and acknowledge the following:</h2>
                <p className={styles.sectionDesc}>
                    Horizon Pathways offers professional document translation services for USCIS-required documents. If your documents are not in English, you may purchase our translation service or upload a certified English translation with your original document.
                </p>

                <div className={styles.ackList}>
                    <div className={styles.ackItem}>
                        I confirm that all information and documents I have provided are true, accurate, and complete to the best of my knowledge.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that Horizon Pathways is an immigration document preparation and support company and is not a law firm. Legal services, when applicable, are provided only by independently licensed immigration attorneys.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that my application will first be reviewed by my assigned Case Manager for completeness and quality assurance.
                    </div>
                    <div className={styles.ackItem}>
                        If my package includes Attorney Review (or I have purchased it as an add-on), I understand that my application will also be reviewed by a licensed immigration attorney before final preparation and filing.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that additional information, supporting documents, or corrections may be requested during the review process.
                    </div>
                    <div className={styles.ackItem}>
                        I acknowledge that the review process, including Case Manager and, if applicable, Attorney Review, may take up to five (5) business days, although some cases may require additional time depending on complexity.
                    </div>
                </div>

                <h2 className={styles.sectionHeading}>After you submit your application:</h2>
                <ol className={styles.orderedList}>
                    <li>Your assigned Case Manager will review your application and supporting documents.</li>
                    <li>If applicable, your file will be forwarded for Attorney Review.</li>
                    <li>If additional information is needed, you will be notified through your dashboard.</li>
                    <li>Once all reviews are complete, your application will proceed to the next stage of processing.</li>
                </ol>

                <h2 className={styles.sectionHeading}>Need Assistance?</h2>
                <p className={styles.helpText}>If you have any questions, please contact your assigned Case Manager through your dashboard messaging system.</p>
                <p className={styles.helpText}>If your matter is urgent or you need immediate assistance, please contact our Support Team, and we'll be happy to help.</p>

                <div style={{ display: 'flex', gap: '1rem', width: '100%', flexDirection: 'column' }}>
                    {appData && ['submitted', 'completed', 'review'].includes(appData.status?.toLowerCase()) ? (
                        <div style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem', backgroundColor: '#ECFDF5', borderRadius: '0.75rem', border: '1px solid #10B981' }}>
                            <p style={{ color: '#047857', fontWeight: 600, fontSize: '1.1rem' }}>
                                ✓ This application has already been submitted and is currently under review.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.agreementRow}>
                            <label className={styles.agreementLabel} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="agreement"
                                    checked={agreed}
                                    onChange={(e) => {
                                        setAgreed(e.target.checked);
                                        if (e.target.checked) setError(false);
                                    }}
                                    style={{ marginTop: '4px' }}
                                />
                                <span style={{ color: error ? '#ef4444' : 'inherit' }}>
                                    I have read, understood, and agree to the above terms before submitting my application.
                                </span>
                            </label>
                            {error && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px', marginLeft: '24px' }}>You must agree to the terms before submitting.</p>}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); router.push('/dashboard/get-started/preview'); }}
                            className={styles.btnUpload}
                            style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', borderRadius: '9999px' }}
                        >
                            View Application Form
                        </button>
                        {(!appData || !['submitted', 'completed', 'review'].includes(appData.status?.toLowerCase())) ? (
                            <button
                                onClick={handleSubmit}
                                className={styles.btnSubmit}
                                disabled={isSubmitting}
                                style={{ flex: 1, border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className={styles.btnSubmit}
                                style={{ flex: 1, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
                            >
                                Back to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Application preview now opens in a dedicated page instead of a modal */}
        </div>
    );
}
