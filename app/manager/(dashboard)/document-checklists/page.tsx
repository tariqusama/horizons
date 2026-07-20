'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Icon = {
    chevronRight: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
};

const CHECKLISTS = {
    spouse_abroad: {
        id: 'spouse_abroad',
        title: 'Application for Spouse Abroad',
        forms: ['G-1145 (E-notification)', 'I-130 (Petition for Alien Relative)', 'I-130A (Beneficiary Supplement)'],
        totalDocuments: 17,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen or Green Card Holder) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship OR green card (front and back)', required: true },
                    { name: 'Government-issued photo ID (passport, driver\'s license, etc.)', required: true },
                ],
            },
            {
                title: 'Beneficiary (Spouse) Documents',
                documents: [
                    { name: 'Birth certificate (certified translation if not in English)', required: true },
                    { name: 'Passport biographic page', required: true },
                ],
            },
            {
                title: 'Marriage & Relationship Evidence',
                documents: [
                    { name: 'Marriage certificate (original or certified copy)', required: true },
                    { name: 'Proof of termination of all prior marriages (if applicable)', required: false },
                    { name: 'Photos together over time, labeled with dates/locations', required: true },
                    { name: 'Birth certificates of children born to the marriage (if any)', required: false },
                ],
            },
            {
                title: 'At Least Five (5) of the Following — Required',
                documents: [
                    { name: 'Proof of ongoing relationship (money transfers, shared accounts, etc.)', required: false },
                    { name: 'Wedding souvenir / invitation', required: false },
                    { name: 'Wedding rings and/or wedding venue booking receipts', required: false },
                    { name: 'Insurance policies naming each other (health, life)', required: false },
                    { name: 'Notarized affidavits from family/friends (at least 2 letters)', required: false },
                    { name: 'Travel records (flight itineraries, boarding passes, hotel bookings)', required: false },
                    { name: 'Social media evidence (posts, comments, tagged photos)', required: false },
                    { name: 'Correspondence (emails, chats, SMS, call records)', required: false },
                ],
            },
            {
                title: 'Any Other Additional Documents (Optional)',
                documents: [
                    { name: 'Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)', required: false },
                ],
            },
        ],
    },
    parent_abroad: {
        id: 'parent_abroad',
        title: 'Application for Parent Abroad',
        forms: ['G-1145 (E-notification)', 'I-130 (Petition for Alien Relative)'],
        totalDocuments: 17,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen Child) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship (birth certificate, U.S. passport bio page, or Certificate of Naturalization/Citizenship)', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Relationship',
                documents: [
                    { name: "U.S. citizen child's birth certificate showing parent's name", required: true },
                    { name: 'If adopted: final adoption decree + proof of legal custody and residency before age 16', required: false },
                    { name: "If step-parent: marriage certificate of U.S. citizen child's parent + proof of termination of prior marriages", required: false },
                    { name: 'If father & child born out of wedlock: proof of legitimation or emotional/financial relationship', required: false },
                    { name: 'Paternal or maternal DNA test result from a USCIS-approved lab', required: false },
                ],
            },
            {
                title: 'At Least Five (5) of the Following — Required',
                documents: [
                    { name: "Medical/health records showing parent and child's names", required: false },
                    { name: "Church or religious records listing parent and child's name", required: false },
                    { name: 'Insurance records naming both petitioner and beneficiary', required: false },
                    { name: "Employment records showing parent and child's names", required: false },
                    { name: 'Financial records (tax returns) listing parent and child\'s name', required: false },
                    { name: 'Census or tribal records in both names', required: false },
                    { name: 'Government records or ID documents showing names of both', required: false },
                    { name: 'Proof of ongoing parent-child relationship (money transfers/remittance)', required: false },
                ],
            },
            {
                title: 'Beneficiary (Parent) Documents',
                documents: [
                    { name: 'Passport biographic page', required: true },
                ],
            },
            {
                title: 'Any Other Additional Documents (Optional)',
                documents: [
                    { name: 'Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)', required: false },
                ],
            },
        ],
    },
    child_abroad: {
        id: 'child_abroad',
        title: 'Application for Child Abroad',
        forms: ['G-1145 (E-notification)', 'I-130 (Petition for Alien Relative)'],
        totalDocuments: 16,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen or Green Card Holder) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship OR green card (front and back)', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Relationship',
                documents: [
                    { name: "Child's birth certificate showing sponsoring parent's name", required: true },
                    { name: 'If adopted: final adoption decree + proof of legal custody and residency before age 16', required: false },
                    { name: 'If stepchild: marriage certificate between parent and stepparent + proof of prior marriage terminations', required: false },
                    { name: 'Paternal or maternal DNA test result from a USCIS-approved lab', required: false },
                ],
            },
            {
                title: 'At Least Five (5) of the Following — Required',
                documents: [
                    { name: "Medical/health records showing parent and child's names", required: false },
                    { name: "Church or religious records listing parent and child's name", required: false },
                    { name: 'Insurance records naming both petitioner and beneficiary', required: false },
                    { name: "Employment records showing parent and child's names", required: false },
                    { name: 'Financial records (tax returns) listing parent and child\'s name', required: false },
                    { name: 'Census or tribal records in both names', required: false },
                    { name: 'Government records or ID documents showing names of both', required: false },
                    { name: 'Proof of ongoing parent-child relationship (money transfers/remittance)', required: false },
                ],
            },
            {
                title: 'Beneficiary (Child) Documents',
                documents: [
                    { name: 'Passport biographic page', required: true },
                ],
            },
            {
                title: 'Any Other Additional Documents (Optional)',
                documents: [
                    { name: 'Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)', required: false },
                ],
            },
        ],
    },
    sibling_abroad: {
        id: 'sibling_abroad',
        title: 'Application for Sibling Abroad',
        forms: ['G-1145 (E-notification)', 'I-130 (Petition for Alien Relative)'],
        totalDocuments: 15,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen Sibling) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Relationship',
                documents: [
                    { name: "Petitioner's birth certificate", required: true },
                    { name: "Sibling's birth certificate (showing at least one common parent)", required: true },
                    { name: "If half-siblings: proof of termination of parents' prior marriages", required: false },
                    { name: 'If adopted siblings: adoption decrees + proof both adopted by same parent(s) before age 16', required: false },
                    { name: 'If step-siblings: marriage certificate of common parent to stepparent + proof of prior marriage terminations (relationship formed before age 18)', required: false },
                ],
            },
            {
                title: 'At Least Four (4) of the Following — Required',
                documents: [
                    { name: 'Sibling DNA test result from a USCIS-approved lab', required: false },
                    { name: 'Medical/health records showing parent and sibling names', required: false },
                    { name: 'Church or religious records listing parent and sibling names', required: false },
                    { name: 'Insurance records (health or life) listing both siblings', required: false },
                    { name: 'Employment records showing both sibling names', required: false },
                    { name: 'Financial records listing both siblings', required: false },
                    { name: 'Census or tribal records showing names', required: false },
                    { name: 'Proof of ongoing sibling relationship (money transfers/remittance)', required: false },
                ],
            },
        ],
    },
    k1_fiance: {
        id: 'k1_fiance',
        title: 'Application for K-1 Fiancé(e) Petition',
        forms: ['G-1145 (E-notification)', 'I-129F (Petition for Alien Fiancé(e))'],
        totalDocuments: 10,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Beneficiary (Foreign Fiancé(e)) Documents',
                documents: [
                    { name: 'Passport biographic page', required: true },
                    { name: 'Birth certificate (certified translation if not in English)', required: true },
                ],
            },
        ],
    },
    spouse_aos: {
        id: 'spouse_aos',
        title: 'Application for Marriage-Based Adjustment of Status (AOS)',
        forms: ['G-1145', 'I-130', 'I-130A', 'I-485', 'I-864', 'Optional: I-765 (EAD), I-131 (Advance Parole)'],
        totalDocuments: 36,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen or Green Card Holder) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship OR green card (front and back)', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Beneficiary (Immigrant Spouse) Documents',
                documents: [
                    { name: 'Birth certificate (certified translation if not in English)', required: true },
                    { name: 'Passport biographic page', required: true },
                    { name: 'Form I-94 Arrival/Departure Record', required: true },
                    { name: 'Proof of lawful entry (visa, admission stamp, or parole documents)', required: true },
                ],
            },
        ],
    },
    parent_aos: {
        id: 'parent_aos',
        title: 'Application for Parent Adjustment of Status (AOS)',
        forms: ['G-1145', 'I-130', 'I-485', 'I-864', 'Optional: I-765 (EAD), I-131 (Advance Parole)'],
        totalDocuments: 33,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen Child) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Relationship',
                documents: [
                    { name: "U.S. citizen child's birth certificate showing parent's name", required: true },
                    { name: 'If adopted: final adoption decree + proof of legal custody and residency before age 16', required: false },
                    { name: 'If step-parent: marriage certificate + proof of prior marriage terminations', required: false },
                    { name: 'If father & child born out of wedlock: legitimation proof or evidence of emotional/financial relationship', required: false },
                ],
            },
            {
                title: 'At Least Five (5) of the Following — Required',
                documents: [
                    { name: 'Paternal or maternal DNA test result from a USCIS-approved lab', required: false },
                    { name: "Medical/health records showing parent and child's names", required: false },
                    { name: "Church or religious records listing parent and child's name", required: false },
                    { name: 'Insurance records naming both petitioner and beneficiary', required: false },
                    { name: "Employment records showing parent and child's names", required: false },
                    { name: 'Financial records (tax returns) listing parent and child\'s name', required: false },
                    { name: 'Census or tribal records in both names', required: false },
                    { name: 'Government records or ID documents showing both names', required: false },
                ],
            },
            {
                title: "Parent's Identity & Immigration Documents",
                documents: [
                    { name: "Parent's birth certificate (with certified English translation if needed)", required: true },
                    { name: 'Passport biographic page', required: true },
                    { name: 'Form I-94 Arrival/Departure Record', required: true },
                    { name: 'Proof of lawful entry (visa, admission stamp, or parole documents)', required: true },
                ],
            },
            {
                title: 'Petitioner Financial Affidavit Documents',
                documents: [
                    { name: 'Most recent 3 years IRS tax return, transcript, or Form 1040 with W-2s', required: true },
                    { name: 'Employment verification letter and/or 6 months\' pay stubs OR proof of self-employment', required: true },
                    { name: '6 months\' bank statements', required: false },
                    { name: 'Evidence of assets (if income is insufficient)', required: false },
                ],
            },
            {
                title: 'Joint Sponsor Documents (If Applicable)',
                documents: [
                    { name: 'Joint sponsor: proof of U.S. citizenship OR green card', required: false },
                    { name: 'Joint sponsor: government-issued photo ID', required: false },
                    { name: 'Joint sponsor: most recent 3 years IRS tax return or transcript', required: false },
                    { name: 'Joint sponsor: 1099s and/or W-2s for the most recent tax year', required: false },
                    { name: 'Joint sponsor: employment verification/6 mo pay stubs OR proof of self-employment', required: false },
                ],
            },
            {
                title: 'Household Member Income Documents (If Applicable)',
                documents: [
                    { name: 'Household member: proof of U.S. citizenship OR green card', required: false },
                    { name: 'Household member: government-issued photo ID', required: false },
                    { name: 'Household member: most recent 3 years IRS tax return or transcript', required: false },
                    { name: 'Household member: 1099s and/or W-2s for the most recent tax year', required: false },
                    { name: 'Household member: employment verification/6 mo pay stubs OR proof of self-employment', required: false },
                ],
            },
            {
                title: 'Any Other Additional Documents (Optional)',
                documents: [
                    { name: 'Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)', required: false },
                ],
            },
        ],
    },
    child_aos: {
        id: 'child_aos',
        title: 'Application for Child Adjustment of Status (AOS)',
        forms: ['G-1145', 'I-130', 'I-485', 'I-864', 'Optional: I-765 (EAD), I-131 (Advance Parole)'],
        totalDocuments: 32,
        sections: [
            {
                title: 'Petitioner (U.S. Citizen or Green Card Holder) Documents',
                documents: [
                    { name: 'Proof of U.S. citizenship OR green card (front and back)', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Relationship',
                documents: [
                    { name: "Child's birth certificate showing sponsoring parent's name", required: true },
                    { name: 'If adopted: final adoption decree + proof of legal custody and residency before age 16', required: false },
                    { name: 'If stepchild: marriage certificate + proof of prior marriage terminations', required: false },
                    { name: 'Paternal or maternal DNA test result from a USCIS-approved lab', required: false },
                ],
            },
            {
                title: 'At Least Five (5) of the Following — Required',
                documents: [
                    { name: "Medical/health records showing parent and child's names", required: false },
                    { name: "Church or religious records listing parent and child's name", required: false },
                    { name: 'Insurance records naming both petitioner and beneficiary', required: false },
                    { name: "Employment records showing parent and child's names", required: false },
                    { name: 'Financial records (tax returns) listing parent and child\'s name', required: false },
                    { name: 'Census or tribal records in both names', required: false },
                    { name: 'Government records or ID documents showing both names', required: false },
                ],
            },
            {
                title: "Child's Identity & Immigration Documents",
                documents: [
                    { name: "Child's birth certificate (with certified English translation if not in English)", required: true },
                    { name: 'Passport biographic page', required: true },
                    { name: 'Form I-94 Arrival/Departure Record', required: true },
                    { name: 'Proof of lawful entry (visa, admission stamp, or parole documents)', required: true },
                ],
            },
            {
                title: 'Petitioner Financial Affidavit Documents',
                documents: [
                    { name: 'Most recent 3 years IRS tax return, transcript, or Form 1040 with W-2s', required: true },
                    { name: 'Employment verification letter and/or 6 months\' pay stubs OR proof of self-employment', required: true },
                    { name: '6 months\' bank statements', required: false },
                    { name: 'Evidence of assets (if income is insufficient)', required: false },
                ],
            },
            {
                title: 'Joint Sponsor Documents (If Applicable)',
                documents: [
                    { name: 'Joint sponsor: proof of U.S. citizenship OR green card', required: false },
                    { name: 'Joint sponsor: government-issued photo ID', required: false },
                    { name: 'Joint sponsor: most recent 3 years IRS tax return or transcript', required: false },
                    { name: 'Joint sponsor: 1099s and/or W-2s for the most recent tax year', required: false },
                    { name: 'Joint sponsor: employment verification/6 mo pay stubs OR proof of self-employment', required: false },
                ],
            },
            {
                title: 'Household Member Income Documents (If Applicable)',
                documents: [
                    { name: 'Household member: proof of U.S. citizenship OR green card', required: false },
                    { name: 'Household member: government-issued photo ID', required: false },
                    { name: 'Household member: most recent 3 years IRS tax return or transcript', required: false },
                    { name: 'Household member: 1099s and/or W-2s for the most recent tax year', required: false },
                    { name: 'Household member: employment verification/6 mo pay stubs OR proof of self-employment', required: false },
                ],
            },
            {
                title: 'Any Other Additional Documents (Optional)',
                documents: [
                    { name: 'Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)', required: false },
                ],
            },
        ],
    },
    i90: {
        id: 'i90',
        title: 'Application to Replace Permanent Resident Card',
        forms: ['G-1145 (E-notification)', 'I-90 (Application to Replace Permanent Resident Card)'],
        totalDocuments: 13,
        sections: [
            {
                title: 'General Required Documents',
                documents: [
                    { name: 'Government-issued photo ID (passport, driver\'s license, etc.)', required: true },
                ],
            },
            {
                title: 'If Lost, Stolen, Damaged or Destroyed',
                documents: [
                    { name: 'Copy of the lost/stolen/destroyed green card (if available)', required: false },
                    { name: 'Copy of Form I-797 (Notice of Action) or copy of immigrant visa (even if expired)', required: false },
                ],
            },
            {
                title: 'If Card Expired or Expiring Soon',
                documents: [
                    { name: 'Copy of expiring/expired green card', required: false },
                ],
            },
            {
                title: 'If Card Issued but Never Received',
                documents: [
                    { name: 'Copy of Form I-797 (Notice of Action showing approval)', required: false },
                    { name: 'Proof of mailing address', required: false },
                ],
            },
            {
                title: 'If Incorrect Information on Card (USCIS Error)',
                documents: [
                    { name: 'Incorrect green card', required: false },
                    { name: 'Evidence of correct information (birth certificate, passport, marriage certificate, court order)', required: false },
                ],
            },
            {
                title: 'If Biographic Information Changed (Name)',
                documents: [
                    { name: 'Copy of current green card', required: false },
                    { name: 'Legal document for name change (marriage certificate, divorce decree, court order)', required: false },
                ],
            },
            {
                title: 'If Biographic Information Changed (Gender)',
                documents: [
                    { name: 'Copy of current green card', required: false },
                    { name: 'Medical certification or court order (for gender change)', required: false },
                ],
            },
            {
                title: 'If Turning 14 Years Old',
                documents: [
                    { name: 'Copy of green card issued before age 14', required: false },
                ],
            },
        ],
    },
    i751: {
        id: 'i751',
        title: 'Application for Removal of Conditions on Residence (Joint Filing)',
        forms: ['G-1145 (E-notification)', 'I-751 (Petition to Remove Conditions)'],
        totalDocuments: 18,
        sections: [
            {
                title: 'Proof of Conditional Green Card',
                documents: [
                    { name: 'Copy of the front and back of the conditional green card', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Marriage & Relationship Evidence',
                documents: [
                    { name: 'Marriage certificate (original or certified copy)', required: true },
                    { name: 'Proof of termination of all prior marriages (if applicable)', required: false },
                    { name: 'Photos together (family events, holidays, trips) with captions', required: true },
                ],
            },
            {
                title: 'At Least Eight (8) of the Following — Required',
                documents: [
                    { name: 'Birth certificates of children born to the marriage (if any)', required: false },
                    { name: 'Joint lease/mortgage or property documents in both names', required: false },
                    { name: 'Proof of name change with Social Security and/or MVA', required: false },
                    { name: 'Joint bank account statements', required: false },
                    { name: 'Joint federal and state tax returns (or IRS transcripts)', required: false },
                    { name: 'Joint loan and/or credit card statements', required: false },
                    { name: 'Insurance policies naming each other', required: false },
                    { name: 'Utility bills showing both names', required: false },
                    { name: 'Notarized affidavits from family/friends (at least 2 letters)', required: false },
                    { name: 'Travel records (airline tickets, hotel reservations, passport stamps)', required: false },
                    { name: 'Health, auto, or life insurance listing spouse as beneficiary/dependent', required: false },
                    { name: 'Adoption records of children (if applicable)', required: false },
                    { name: 'Vehicle registrations in both names', required: false },
                ],
            },
        ],
    },
    daca: {
        id: 'daca',
        title: 'Application for Deferred Action for Childhood Arrivals (DACA Renewal)',
        forms: ['G-1145', 'I-821D (DACA Renewal)', 'I-765 (Employment Authorization)', 'I-765WS (Worksheet)'],
        totalDocuments: 6,
        sections: [
            {
                title: 'Identity Documents',
                documents: [
                    { name: 'Copy of current Employment Authorization Document (EAD)', required: true },
                    { name: 'Government-issued photo ID', required: true },
                ],
            },
            {
                title: 'Proof of Continuous Residence — At Least One Required',
                documents: [
                    { name: 'Updated school, employment, or medical records', required: false },
                    { name: 'Updated rent, bills, or bank statements', required: false },
                ],
            },
            {
                title: 'Criminal / Immigration Records (If Applicable)',
                documents: [
                    { name: 'Certified court dispositions for any new arrests, charges, or convictions', required: false },
                    { name: 'Immigration documents (new proceedings, filings, or notices)', required: false },
                ],
            },
        ],
    },
    n400: {
        id: 'n400',
        title: 'Application for Naturalization',
        forms: ['G-1145 (E-notification)', 'N-400 (Application for Citizenship)'],
        totalDocuments: 13,
        sections: [
            {
                title: 'Identity Documents',
                documents: [
                    { name: 'Copy of valid permanent resident card (green card) — front and back', required: true },
                    { name: 'State-issued ID (driver\'s license or state ID)', required: true },
                ],
            },
            {
                title: 'Biographic & Civil Documents',
                documents: [
                    { name: 'Birth certificate (if needed for special cases)', required: false },
                    { name: 'Marriage certificate(s) (if applicable)', required: false },
                    { name: 'Divorce decrees / annulments / death certificates for prior marriages', required: false },
                    { name: 'Name change documents (if legally changed name)', required: false },
                ],
            },
            {
                title: 'Proof of Residence & Eligibility',
                documents: [
                    { name: 'Proof of continuous residence & physical presence (leases, mortgages, utility bills, employment records)', required: true },
                    { name: 'Selective Service registration proof (male, age 18–26 if required)', required: false },
                    { name: 'Certified tax transcripts or returns (esp. for marriage-based cases or tax issues)', required: false },
                ],
            },
            {
                title: 'Family-Related Evidence (If Applicable)',
                documents: [
                    { name: "Proof of spouse's U.S. citizenship (3-year marriage rule)", required: false },
                    { name: "Proof of ongoing marital union (joint accounts, leases, children's birth certificates)", required: false },
                ],
            },
            {
                title: 'Military Service (If Applicable)',
                documents: [
                    { name: 'Form N-426 — Request for Certification of Military/National Guard Service', required: false },
                    { name: 'Military records (DD Form 214, NGB Form 22, discharge papers)', required: false },
                ],
            },
        ],
    },
};

export default function DocumentChecklistPage() {
    const searchParams = useSearchParams();
    const type = (searchParams?.get?.('type') as keyof typeof CHECKLISTS) || 'spouse_abroad';
    const checklist = CHECKLISTS[type];

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!checklist) {
        return (
            <div className="max-w-[1200px] mx-auto w-full pb-12">
                <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-8 text-center">
                    <p className="text-lg font-bold text-[#101F38]">Checklist not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto w-full pb-12">
            {/* Header */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#101F38] mb-2">{checklist.title}</h1>
                        <p className="text-sm text-[#5B6472] font-medium mb-3">Required Forms</p>
                        <div className="flex flex-wrap gap-2">
                            {checklist.forms.map((form, idx) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-[#E5F1FF] text-[#2563EB] text-xs font-semibold">
                                    {form}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FBF1EA]">
                        <span className="text-2xl font-bold text-[#E3755D]">{checklist.totalDocuments}</span>
                    </div>
                </div>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-6">
                {checklist.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#101F38] mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-sm font-bold">
                                {sectionIdx + 1}
                            </span>
                            {section.title}
                        </h2>

                        <div className="space-y-3">
                            {section.documents.map((doc, docIdx) => {
                                const docId = `${sectionIdx}-${docIdx}`;
                                const isChecked = checkedItems[docId] || false;

                                return (
                                    <div key={docId} className="flex items-start gap-3 p-4 rounded-2xl border border-[#ECE9E2] hover:bg-[#F7F5F0] transition-colors cursor-pointer" onClick={() => toggleCheck(docId)}>
                                        <div className="w-6 h-6 rounded border-2 border-[#ECE9E2] flex items-center justify-center shrink-0 mt-1 bg-white transition-all" style={{
                                            borderColor: isChecked ? '#E3755D' : '#ECE9E2',
                                            backgroundColor: isChecked ? '#E3755D' : 'white',
                                        }}>
                                            {isChecked && <Icon.check width={16} height={16} className="text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${isChecked ? 'line-through text-[#8A8F98]' : 'text-[#101F38]'}`}>{doc.name}</p>
                                            <div className="mt-2 flex gap-2">
                                                {doc.required ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold">
                                                        Required
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                                                        Optional
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#101F38]">Document Collection Progress</p>
                    <span className="text-xs font-bold text-[#E3755D]">
                        {Object.values(checkedItems).filter(Boolean).length} of {checklist.totalDocuments}
                    </span>
                </div>
                <div className="w-full bg-[#ECE9E2] rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-[#E3755D] transition-all"
                        style={{ width: `${(Object.values(checkedItems).filter(Boolean).length / checklist.totalDocuments) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
