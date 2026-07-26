"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import styles from '../form.module.css';
import { getPrevFormPath } from '../formsHelper';

interface DocItem {
    key: string;
    label: string;
    required: boolean;
}

interface DocGroup {
    header: string;
    items: DocItem[];
}

interface FormChecklist {
    title: string;
    subtitle: string;
    requiredKeys: string[];
    groups: DocGroup[];
}

const formChecklists: Record<string, FormChecklist> = {
    "i-90": {
        title: "Document Upload — Form I-90",
        subtitle: "Upload the documents required to replace or renew your Permanent Resident Card (Green Card).",
        requiredKeys: ["prCard", "photoId", "statement"],
        groups: [
            {
                header: "Identity & Status",
                items: [
                    { key: "prCard", label: "Clear copy (front and back) of your current or expired Permanent Resident Card, if available", required: true },
                    { key: "photoId", label: "Government issued photo ID (driver's license, state ID, or passport biographic page)", required: true },
                    { key: "birthCert", label: "Birth certificate (with certified English translation if applicable)", required: false }
                ]
            },
            {
                header: "If Card Was Lost, Stolen, or Destroyed",
                items: [
                    { key: "statement", label: "Signed statement describing when and how the card was lost, stolen, or destroyed", required: true },
                    { key: "policeReport", label: "Copy of police report filed for lost/stolen card (recommended)", required: false }
                ]
            },
            {
                header: "If Name or Biographic Data Changed",
                items: [
                    { key: "marriageCert", label: "Marriage certificate (for name change due to marriage)", required: false },
                    { key: "divorceDecree", label: "Divorce decree (for name change due to divorce)", required: false },
                    { key: "courtOrder", label: "Court order legally changing your name", required: false }
                ]
            }
        ]
    },
    "i-130": {
        title: "Document Upload — Form I-130",
        subtitle: "Upload required supporting evidence to petition for your relative.",
        requiredKeys: ["usCitizenProof", "photoId", "beneficiaryPassport", "beneficiaryBirthCert", "marriageCert"],
        groups: [
            {
                header: "Petitioner's Proof of Status",
                items: [
                    { key: "usCitizenProof", label: "Proof of U.S. Citizenship (Birth Certificate, U.S. Passport, or Naturalization Cert)", required: true },
                    { key: "photoId", label: "Petitioner's Government-issued Photo ID", required: true }
                ]
            },
            {
                header: "Beneficiary Identification",
                items: [
                    { key: "beneficiaryPassport", label: "Beneficiary's Passport Biographic Page", required: true },
                    { key: "beneficiaryBirthCert", label: "Beneficiary's Birth Certificate with certified English translation", required: true },
                    { key: "passportPhotos", label: "Two 2x2 inch passport-style photos of Petitioner & Beneficiary", required: false }
                ]
            },
            {
                header: "Relationship & Marriage Evidence",
                items: [
                    { key: "marriageCert", label: "Marriage Certificate (for Spouse petitions)", required: true },
                    { key: "divorceDecree", label: "Proof of termination of prior marriages (Divorce Decree or Death Cert)", required: false },
                    { key: "bonaFideEvidence", label: "Evidence of bona fide marriage (joint bank accounts, joint lease, photos)", required: false }
                ]
            }
        ]
    },
    "i-485": {
        title: "Document Upload — Form I-485",
        subtitle: "Upload required supporting documents to adjust status and register permanent residence.",
        requiredKeys: ["passport", "i94Record", "birthCert", "photoId", "i693Medical", "i864Support"],
        groups: [
            {
                header: "Identity & Legal U.S. Entry",
                items: [
                    { key: "passport", label: "Copy of Passport biographic page & U.S. Entry Visa stamp", required: true },
                    { key: "i94Record", label: "Form I-94 Arrival/Departure Record", required: true },
                    { key: "birthCert", label: "Birth Certificate with certified English translation", required: true },
                    { key: "photoId", label: "Government-issued Photo ID", required: true },
                    { key: "passportPhotos", label: "Two recent 2x2 inch passport-style photos", required: false }
                ]
            },
            {
                header: "Medical Exam & Financial Support",
                items: [
                    { key: "i693Medical", label: "Form I-693 Report of Medical Examination and Vaccination Record", required: true },
                    { key: "i864Support", label: "Form I-864 Affidavit of Support with Sponsor Tax Returns & W-2s", required: true }
                ]
            }
        ]
    },
    "n-400": {
        title: "Document Upload — Form N-400",
        subtitle: "Upload required evidence to apply for U.S. Citizenship / Naturalization.",
        requiredKeys: ["prCard", "photoId", "taxTranscripts"],
        groups: [
            {
                header: "Permanent Residence & ID",
                items: [
                    { key: "prCard", label: "Copy of Permanent Resident Card (front and back)", required: true },
                    { key: "photoId", label: "State Driver's License or State Photo ID", required: true }
                ]
            },
            {
                header: "Tax & Residence Records",
                items: [
                    { key: "taxTranscripts", label: "IRS Tax Return Transcripts for the past 3 to 5 years", required: true },
                    { key: "marriageCert", label: "Marriage Certificate (if applying based on marriage to U.S. citizen for 3 years)", required: false }
                ]
            }
        ]
    },
    "i-765": {
        title: "Document Upload — Form I-765",
        subtitle: "Upload evidence to apply for an Employment Authorization Document (EAD Work Permit).",
        requiredKeys: ["priorEAD", "i94Record", "passportPhotos"],
        groups: [
            {
                header: "Work Permit Evidence",
                items: [
                    { key: "priorEAD", label: "Copy of previous EAD Work Permit or Passport biographic page", required: true },
                    { key: "i94Record", label: "Form I-94 Arrival/Departure Record", required: true },
                    { key: "passportPhotos", label: "Two 2x2 inch passport-style photos", required: true },
                    { key: "eligibilityProof", label: "Proof of eligibility category (e.g. pending I-485 receipt notice)", required: false }
                ]
            }
        ]
    },
    "i-751": {
        title: "Document Upload — Form I-751",
        subtitle: "Upload joint evidence to remove 2-year conditions on your Green Card.",
        requiredKeys: ["prCard", "jointLease", "jointTaxes"],
        groups: [
            {
                header: "Conditional Green Card",
                items: [
                    { key: "prCard", label: "Copy of 2-year Conditional Permanent Resident Card (front and back)", required: true }
                ]
            },
            {
                header: "Joint Marital Evidence",
                items: [
                    { key: "jointLease", label: "Joint lease, mortgage, or property deed", required: true },
                    { key: "jointTaxes", label: "Joint tax returns or joint bank account statements", required: true },
                    { key: "childrenBirthCert", label: "Birth certificates of children born to the marriage", required: false }
                ]
            }
        ]
    },
    "i-864": {
        title: "Document Upload — Form I-864",
        subtitle: "Upload sponsor income evidence for the Affidavit of Support.",
        requiredKeys: ["taxReturns", "payStubs", "sponsorCitizenship"],
        groups: [
            {
                header: "Sponsor Income & Status",
                items: [
                    { key: "taxReturns", label: "Most recent Federal Income Tax Return & W-2s", required: true },
                    { key: "payStubs", label: "Recent pay stubs or proof of current employment letter", required: true },
                    { key: "sponsorCitizenship", label: "Proof of Sponsor's U.S. Citizenship or Green Card status", required: true }
                ]
            }
        ]
    }
};

function DocumentUploadContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formCode, setFormCode] = useState<string>("i-90");
    const [activeDocType, setActiveDocType] = useState<string | null>(null);
    const [fileNames, setFileNames] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [uploads, setUploads] = useState<Record<string, boolean>>({});
    const [error, setError] = useState(false);
    const [applicationTitle, setApplicationTitle] = useState('');

    useEffect(() => {
        const paramCode = searchParams.get('form')?.toLowerCase();
        if (paramCode && formChecklists[paramCode]) {
            setFormCode(paramCode);
        } else {
            api.get('/applications')
                .then(res => {
                    if (res.data && res.data[0]) {
                        setApplicationTitle(res.data[0].title || '');
                        const title = (res.data[0].title || '').toLowerCase();
                        if (title.includes('130')) setFormCode('i-130');
                        else if (title.includes('485')) setFormCode('i-485');
                        else if (title.includes('400')) setFormCode('n-400');
                        else if (title.includes('765')) setFormCode('i-765');
                        else if (title.includes('751')) setFormCode('i-751');
                        else if (title.includes('864')) setFormCode('i-864');
                        else setFormCode('i-90');
                    }
                })
                .catch(() => { });
        }
    }, [searchParams]);

    const checklist = formChecklists[formCode] || formChecklists['i-90'];

    const docNameMap: Record<string, string> = {
        'Permanent Resident Card': 'prCard',
        'Government Issued Photo ID': 'photoId',
        'Birth Certificate': 'birthCert',
        'Police Report': 'policeReport',
        'Signed Statement': 'statement',
        'Marriage Certificate': 'marriageCert',
        'Divorce Decree': 'divorceDecree',
        'Court Order': 'courtOrder',
        'Residence Evidence': 'residenceEvidence',
        'Prior Green Card Copy': 'priorCard',
        'Supporting Evidence': 'otherDocs',
        'Proof of U.S. Citizenship': 'usCitizenProof',
        'Beneficiary Passport': 'beneficiaryPassport',
        'Beneficiary Birth Certificate': 'beneficiaryBirthCert',
        'Passport Photos': 'passportPhotos',
        'Medical Exam Report': 'i693Medical',
        'Affidavit of Support': 'i864Support',
        'Tax Transcripts': 'taxTranscripts',
        'Pay Stubs': 'payStubs'
    };

    useEffect(() => {
        api.get('/documents')
            .then(res => {
                if (Array.isArray(res.data)) {
                    res.data.forEach((doc: any) => {
                        if (doc.status === 'Uploaded' || doc.file_path) {
                            const key = docNameMap[doc.name] || doc.name;
                            setUploads(prev => ({ ...prev, [key]: true }));
                            if (doc.file_path) {
                                const filename = doc.file_path.split('/').pop() || 'Uploaded file';
                                setFileNames(prev => ({ ...prev, [key]: filename }));
                            }
                        }
                    });
                }
            })
            .catch(() => { });
    }, []);

    const totalRequired = checklist.requiredKeys.length;
    const uploadedRequiredCount = checklist.requiredKeys.filter(k => uploads[k]).length;
    const progress = totalRequired > 0 ? Math.round((uploadedRequiredCount / totalRequired) * 100) : 100;

    const handleUploadClick = (docKey: string) => {
        setActiveDocType(docKey);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeDocType) {
            const file = e.target.files[0];
            const currentDocKey = activeDocType;
            setIsUploading(currentDocKey);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('doc_type', currentDocKey);

            try {
                await api.post('/documents/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setUploads(prev => ({ ...prev, [currentDocKey]: true }));
                setFileNames(prev => ({ ...prev, [currentDocKey]: file.name }));
                if (error) setError(false);
            } catch (err) {
                console.error("Document upload failed", err);
                alert("Upload failed. Max file size is 10MB (PDF, JPG, PNG).");
            } finally {
                setIsUploading(null);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const missingRequired = checklist.requiredKeys.some(k => !uploads[k]);
        if (missingRequired) {
            setError(true);
            return;
        }
        router.push('/dashboard/get-started/submission');
    };

    const getIcon = (isUploaded: boolean) => (
        isUploaded
            ? <svg className={styles.statusIcon} style={{ color: '#10b981' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            : <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
    );

    return (
        <div className={styles.pageWrapper}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className={styles.formSection}>
                <h1 className={styles.pageTitle}>{checklist.title}</h1>
                <p className={styles.pageSubtitle}>{checklist.subtitle}</p>

                <div className={styles.alertBox}>
                    <p className={styles.alertTitle}>Need document translation?</p>
                    <p className={styles.alertDesc}>Any document not in English must be accompanied by a full English translation certified by the translator.</p>
                </div>

                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <span>Your uploads progress</span>
                        <span>{progress}% complete</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar} style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                        Please upload all <strong>*Required</strong> documents before continuing.
                    </div>
                )}

                {checklist.groups.map((group, gIdx) => (
                    <div key={gIdx} className={styles.uploadGroup}>
                        <div className={styles.uploadGroupHeader}>{group.header}</div>
                        {group.items.map((item) => {
                            const isUploaded = !!uploads[item.key];
                            return (
                                <div key={item.key} className={styles.uploadRow}>
                                    <div className={styles.uploadInfo}>
                                        {getIcon(isUploaded)}
                                        <span className={styles.uploadText}>
                                            {item.label}{' '}
                                            {item.required ? (
                                                <span className={styles.requiredText} style={{ color: error && !isUploaded ? '#ef4444' : '' }}>
                                                    *Required
                                                </span>
                                            ) : (
                                                <span className={styles.optionalText}>(optional)</span>
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleUploadClick(item.key)}
                                        disabled={isUploading === item.key}
                                        className={styles.btnUpload}
                                        style={{ backgroundColor: isUploaded ? '#f3f4f6' : '', color: isUploaded ? '#10b981' : '' }}
                                    >
                                        {isUploading === item.key ? 'Uploading...' : (isUploaded ? 'Uploaded' : 'Upload')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div className={styles.footerScreenshot}>
                    <button onClick={() => { const prev = getPrevFormPath('/dashboard/get-started/document-upload', applicationTitle); router.push(prev); }} className={styles.btnTeal}>
                        &#8592; Previous
                    </button>
                    <button onClick={handleNext} className={styles.btnTeal}>
                        Save and Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DocumentUploadPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading document checklist...</div>}>
            <DocumentUploadContent />
        </Suspense>
    );
}
