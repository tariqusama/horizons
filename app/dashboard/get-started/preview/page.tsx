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

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                if (res.data && res.data[0] && res.data[0].form_data) {
                    setPreviewData(res.data[0].form_data);
                    setApplicationTitle(res.data[0].title || '');
                }
            })
            .catch(() => { });
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

                {/* Body Content */}
                <div className="py-6 space-y-8">

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
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(getFirstFormRoute())}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                        >
                            Open Full Form
                        </button>
                        <button
                            onClick={() => router.push(getPrevFormPath('/dashboard/get-started/preview', applicationTitle))}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                        >
                            ← Back to Forms
                        </button>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/get-started/submission')}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
