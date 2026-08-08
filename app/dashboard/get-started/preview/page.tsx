"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';
import api from '@/lib/api';
import { getFormsList, getPrevFormPath } from '../formsHelper';

export default function ApplicationPreviewPage() {
    const router = useRouter();
    const [previewData, setPreviewData] = useState<any>({});
    const [applicationTitle, setApplicationTitle] = useState('');
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const app = res.data[0];
                    setApplicationTitle(app.title || '');
                    setApplication(app);
                    if (app.form_data && typeof app.form_data === 'object' && Object.keys(app.form_data).length > 0) {
                        setPreviewData(app.form_data);
                    } else {
                        setNoData(true);
                    }
                } else {
                    setNoData(true);
                }
            })
            .catch(() => setNoData(true))
            .finally(() => setLoading(false));
    }, []);

    const renderFieldValue = (val: any) => {
        if (val === null || val === undefined || val === '') return '—';
        return String(val);
    };

    const formatLabel = (key: string) =>
        key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().toUpperCase();

    const getFirstFormRoute = () => {
        const firstForm = getFormsList(application, { allowFallback: false })[0];
        if (firstForm) return firstForm.path;
        return '/dashboard/get-started';
    };

    // Build sections from previewData
    const formSectionMap: Record<string, { label: string; editPath: string }> = {
        i90: { label: 'Form I-90', editPath: '/dashboard/get-started/i-90' },
        g1145: { label: 'Form G-1145', editPath: '/dashboard/get-started/g-1145' },
        i130: { label: 'Form I-130 (Petition)', editPath: '/dashboard/get-started/dynamic/i-130' },
        i130a: { label: 'Form I-130A (Spouse Supp.)', editPath: '/dashboard/get-started/dynamic/i-130a' },
        i485: { label: 'Form I-485', editPath: '/dashboard/get-started/dynamic/i-485' },
        i864: { label: 'Form I-864', editPath: '/dashboard/get-started/dynamic/i-864' },
        i751: { label: 'Form I-751', editPath: '/dashboard/get-started/dynamic/i-751' },
        i765: { label: 'Form I-765', editPath: '/dashboard/get-started/dynamic/i-765' },
        i821d: { label: 'Form I-821D', editPath: '/dashboard/get-started/dynamic/i-821d' },
        n400: { label: 'Form N-400', editPath: '/dashboard/get-started/dynamic/n-400' },
    };

    const nestedSections = Object.keys(previewData).filter(k => typeof previewData[k] === 'object' && previewData[k] !== null);
    const flatFields = Object.keys(previewData).filter(k => !k.startsWith('_current_step') && typeof previewData[k] !== 'object' && previewData[k] !== null && previewData[k] !== '');

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.previewPageCard}>

                {/* ── Header ── */}
                <div className={styles.previewPageHeader}>
                    <div>
                        <h1 className={styles.previewPageTitle}>Application Preview</h1>
                        <p className={styles.previewPageSubtitle}>Review your answers before submitting</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/get-started')}
                        className={styles.previewCloseBtn}
                        aria-label="Close"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className={styles.previewEmptyState}>
                        <div className={styles.previewSpinner} />
                        <p>Loading your application data...</p>
                    </div>
                )}

                {/* ── No Data ── */}
                {!loading && noData && (
                    <div className={styles.previewEmptyState}>
                        <div className={styles.previewEmptyIcon}>📋</div>
                        <h2 className={styles.previewEmptyTitle}>No Data Saved Yet</h2>
                        <p className={styles.previewEmptyDesc}>
                            You haven't completed any form steps yet. Fill out your application form and your answers will appear here.
                        </p>
                        <button onClick={() => router.push('/dashboard/get-started')} className={styles.btnPreviewPrimary}>
                            Go to Application Form
                        </button>
                    </div>
                )}

                {/* ── Sections ── */}
                {!loading && !noData && (
                    <div className={styles.previewSections}>

                        {/* Nested object sections (i130, g1145, etc.) */}
                        {nestedSections.map(key => {
                            const meta = formSectionMap[key];
                            const sectionData = previewData[key];
                            const fields = Object.keys(sectionData).filter(f => !f.startsWith('_current_step') && sectionData[f] !== null && sectionData[f] !== '' && typeof sectionData[f] !== 'object');
                            if (!fields.length) return null;
                            return (
                                <div key={key} className={styles.previewSection}>
                                    <div className={styles.previewSectionHeader}>
                                        <div className={styles.previewSectionBadge}>{meta?.label || key.toUpperCase()}</div>
                                        <Link href={meta?.editPath || getFirstFormRoute()} className={styles.btnPreviewEdit}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    </div>
                                    <div className={styles.previewFieldGrid}>
                                        {fields.map(f => (
                                            <div key={f} className={styles.previewField}>
                                                <div className={styles.previewFieldLabel}>{formatLabel(f)}</div>
                                                <div className={styles.previewFieldValue}>{renderFieldValue(sectionData[f])}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Flat fields (dynamic form data) */}
                        {flatFields.length > 0 && (
                            <div className={styles.previewSection}>
                                <div className={styles.previewSectionHeader}>
                                    <div className={styles.previewSectionBadge}>Application Data</div>
                                    <button onClick={() => router.push(getFirstFormRoute())} className={styles.btnPreviewEdit}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                                <div className={styles.previewFieldGrid}>
                                    {flatFields.map(key => (
                                        <div key={key} className={styles.previewField}>
                                            <div className={styles.previewFieldLabel}>{formatLabel(key)}</div>
                                            <div className={styles.previewFieldValue}>{renderFieldValue(previewData[key])}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Footer ── */}
                {!loading && (
                    <div className={styles.previewPageFooter}>
                        <button
                            onClick={() => router.push(getPrevFormPath('/dashboard/get-started/preview', application))}
                            className={styles.btnPreviewBack}
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/get-started/submission')}
                            className={styles.btnPreviewPrimary}
                        >
                            Continue →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
