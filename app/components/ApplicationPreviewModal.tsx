"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

interface ApplicationPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId?: number | string;
}

export default function ApplicationPreviewModal({ isOpen, onClose, applicationId }: ApplicationPreviewModalProps) {
    const [previewData, setPreviewData] = useState<any>({
        i90: {
            dob: '2026-07-26',
            ssn: 'dfdf4534',
            gender: 'Female',
            aNumber: 'sdadsfr453653',
            lastName: 'Shafique',
            firstName: 'Shehryar',
            middleName: 'dfdvcv',
            otherNames: 'Yes',
            countryOfBirth: 'United Kingdom',
            dateOfAdmission: '2026-07-20',
            fatherFirstName: 'dfdsfd',
            motherFirstName: 'dsfsd',
            classOfAdmission: 'dsfsd',
            uscisOnlineAccount: 'dfdcvfgfdg',
            portOfAdmissionCity: 'Islamabad',
            countryOfCitizenship: 'United Kingdom',
            portOfAdmissionState: 'dffgdfg'
        },
        g1145: {
            lastName: 'Shafique',
            firstName: 'Shehryar',
            middleName: 'dfdvcv'
        }
    });

    useEffect(() => {
        if (!isOpen) return;

        // Try loading from localStorage or API for active form data
        try {
            const savedI90 = localStorage.getItem('horizon_i90_data');
            const savedG1145 = localStorage.getItem('horizon_g1145_data');
            const savedI130 = localStorage.getItem('horizon_i130_data');

            setPreviewData((prev: any) => ({
                ...prev,
                ...(savedI90 ? { i90: JSON.parse(savedI90) } : {}),
                ...(savedG1145 ? { g1145: JSON.parse(savedG1145) } : {}),
                ...(savedI130 ? { i130: JSON.parse(savedI130) } : {})
            }));
        } catch (e) {
            console.error("Error loading preview data", e);
        }

        if (applicationId) {
            api.get(`/applications/${applicationId}`)
                .then(res => {
                    if (res.data && res.data.form_data) {
                        setPreviewData(res.data.form_data);
                    }
                })
                .catch(() => {});
        }
    }, [isOpen, applicationId]);

    if (!isOpen) return null;

    const renderFieldValue = (val: any) => {
        if (val === null || val === undefined || val === '') return '—';
        return String(val);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div 
                className="bg-white rounded-[20px] shadow-2xl max-w-[720px] w-full p-6 sm:p-8 my-8 relative border border-slate-100 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">Application Preview</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto py-6 space-y-6 flex-1 pr-2">
                    
                    {/* I90 DATA */}
                    {previewData.i90 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3">
                                I90 DATA
                            </h3>
                            <div className="bg-slate-50/80 border border-purple-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
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
                            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3">
                                G1145 DATA
                            </h3>
                            <div className="bg-slate-50/80 border border-purple-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
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

                    {/* I130 DATA (If present) */}
                    {previewData.i130 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3">
                                I130 DATA
                            </h3>
                            <div className="bg-slate-50/80 border border-purple-100/60 rounded-[16px] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RELATIONSHIP</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i130.relationship)}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CITIZENSHIP BASIS</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i130.citizenshipBasis)}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PETITIONER FIRST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i130.firstName)}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PETITIONER LAST NAME</div>
                                    <div className="text-[14px] font-bold text-slate-900 mt-0.5">{renderFieldValue(previewData.i130.lastName)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
