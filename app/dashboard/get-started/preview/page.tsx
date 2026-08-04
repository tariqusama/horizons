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
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const app = res.data[0];
                    setApplicationTitle(app.title || '');
                    // Try nested form_data first
                    if (app.form_data && typeof app.form_data === 'object' && Object.keys(app.form_data).length > 0) {
                        setPreviewData(app.form_data);
                    } else {
                        setNoData(true);
                    }
                } else {
                    setNoData(true);
                }
            })
            .catch(() => { setNoData(true); })
            .finally(() => setLoading(false));
    }, []);

    const renderFieldValue = (val: any) => {
        if (val === null || val === undefined || val === '') return '—';
        return String(val);
    };

    const getFirstFormRoute = () => {
        const firstForm = getFormsList(applicationTitle, { allowFallback: false })[0];
        if (firstForm) return firstForm.path;

        try {
            const keys = Object.keys(previewData || {}).filter(k => previewData[k]);
            if (keys.length === 0) return '/dashboard/get-started';
            const first = keys[0];
            switch (first.toLowerCase()) {
                case 'i90': return '/dashboard/get-started/i-90';
                case 'g1145': return '/dashboard/get-started/g-1145';
                case 'i130': return '/dashboard/get-started/i-130';
                case 'i130a': return '/dashboard/get-started/i-130a';
                case 'i485': return '/dashboard/get-started/i-485';
                case 'i864': return '/dashboard/get-started/i-864';
                case 'i751': return '/dashboard/get-started/i-751';
                case 'i765': return '/dashboard/get-started/i-765';
                case 'i765ws': return '/dashboard/get-started/i-765ws';
                case 'i821d': return '/dashboard/get-started/i-821d';
                case 'n400': return '/dashboard/get-started/n-400';
                default: return '/dashboard/get-started';
            }
        } catch (e) {
            return '/dashboard/get-started';
        }
    };


    return (
        <div className={styles.pageWrapper}>
            <div className="bg-white rounded-[20px] shadow-xl max-w-[800px] w-full mx-auto p-6 sm:p-10 my-4 border border-slate-100 relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Application Preview</h1>
                    <button
                        onClick={() => router.push('/dashboard/get-started')}
                        className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 text-sm font-medium">Loading your application data...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && noData && (
                    <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="text-5xl">📋</div>
                        <h2 className="text-lg font-bold text-slate-800">No Data Saved Yet</h2>
                        <p className="text-slate-500 text-sm max-w-sm">
                            You haven't completed any form steps yet. Fill out your application form and your answers will appear here.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/get-started')}
                            className="mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow"
                        >
                            Go to Application Form
                        </button>
                    </div>
                )}

                {/* Body Content */}
                {!loading && !noData && <div className="py-6 space-y-8">

                    {/* I90 DATA */}
                    {previewData.i90 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                    I90 DATA
                                </h2>
                                <Link
                                    href="/dashboard/get-started/i-90"
                                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors"
                                >
                                    Edit Section
                                </Link>
                            </div>
                            <div className="bg-slate-50/80 border border-purple-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 shadow-sm">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DOB</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.dob || previewData.i90.dateOfBirth)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SSN</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.ssn || previewData.i90.socialSecurityNumber)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">GENDER</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.gender || previewData.i90.sex)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">A NUMBER</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.aNumber || previewData.i90.alienRegistrationNumber)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LAST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.lastName || previewData.i90.familyName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FIRST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.firstName || previewData.i90.givenName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MIDDLE NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.middleName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">OTHER NAMES</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.otherNames || previewData.i90.usedOtherNames)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">COUNTRY OF BIRTH</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.countryOfBirth)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DATE OF ADMISSION</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.dateOfAdmission)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FATHER FIRST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.fatherFirstName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MOTHER FIRST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.motherFirstName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CLASS OF ADMISSION</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.classOfAdmission)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">USCIS ONLINE ACCOUNT</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.uscisOnlineAccount)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PORT OF ADMISSION CITY</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.portOfAdmissionCity)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">COUNTRY OF CITIZENSHIP</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.countryOfCitizenship)}</div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PORT OF ADMISSION STATE</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i90.portOfAdmissionState)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* G1145 DATA */}
                    {previewData.g1145 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                    G1145 DATA
                                </h2>
                                <Link
                                    href="/dashboard/get-started/g-1145"
                                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors"
                                >
                                    Edit Section
                                </Link>
                            </div>
                            <div className="bg-slate-50/80 border border-purple-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 shadow-sm">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LAST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.g1145.lastName)}</div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FIRST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.g1145.firstName)}</div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MIDDLE NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.g1145.middleName)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC/FLAT FORM DATA */}
                    {previewData && Object.keys(previewData).filter(key => key !== '_current_step' && typeof previewData[key] !== 'object' && previewData[key] !== null && previewData[key] !== '').length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                    APPLICATION DATA
                                </h2>
                                <button
                                    onClick={() => router.push(getFirstFormRoute())}
                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
                                >
                                    Edit Section
                                </button>
                            </div>
                            <div className="bg-slate-50/80 border border-emerald-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 shadow-sm">
                                {Object.keys(previewData).filter(key => key !== '_current_step' && typeof previewData[key] !== 'object' && previewData[key] !== null && previewData[key] !== '').map(key => (
                                    <div key={key}>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</div>
                                        <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData[key])}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>}

                {/* Footer */}
                <div className="pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                        <button
                            onClick={() => router.push(getFirstFormRoute())}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
                        >
                            Open Full Form
                        </button>
                        <button
                            onClick={() => router.push(getPrevFormPath('/dashboard/get-started/preview', applicationTitle))}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
                        >
                            ← Back to Forms
                        </button>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/get-started/submission')}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm w-full md:w-auto"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
