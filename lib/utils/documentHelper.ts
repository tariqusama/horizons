export interface Document {
    id: number;
    name: string;
    status: string;
    file_path: string | null;
    required?: boolean;
}

export const defaultChecklist: Document[] = [
    { id: -1, name: 'Passport photo page', status: 'Missing', file_path: null, required: true },
    { id: -2, name: 'Birth certificate', status: 'Missing', file_path: null, required: true },
    { id: -3, name: 'Proof of residency', status: 'Missing', file_path: null, required: true },
    { id: -4, name: 'Medical exam report', status: 'Missing', file_path: null, required: true },
    { id: -5, name: 'Affidavit of support', status: 'Missing', file_path: null, required: true },
    { id: -6, name: 'Government Issued Photo ID', status: 'Missing', file_path: null, required: true },
    { id: -7, name: 'Permanent Resident Card', status: 'Missing', file_path: null, required: true },
    { id: -8, name: 'Signed Statement', status: 'Missing', file_path: null, required: true },
];

export const isMatch = (reqName: string, docName: string) => {
    if (!docName || !reqName) return false;
    const r = reqName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const d = docName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return r.includes(d) || d.includes(r) || (r.includes('greencard') && d.includes('permanentresident')) || (r.includes('photo') && d.includes('photo')) || (r.includes('statement') && d.includes('statement'));
};

export const getChecklistKeyFromService = (serviceText: string) => {
    const normalized = serviceText.trim().toLowerCase();
    if (!normalized) return null;

    if (normalized.includes('spouse abroad') || normalized.includes('i-130a') || (normalized.includes('spouse') && normalized.includes('abroad'))) return 'spouse_abroad';
    if (normalized.includes('parent abroad')) return 'parent_abroad';
    if (normalized.includes('child abroad')) return 'child_abroad';
    if (normalized.includes('sibling abroad')) return 'sibling_abroad';
    if (normalized.includes('k-1') || normalized.includes('k1') || normalized.includes('fianc')) return 'k1_fiance';
    if (normalized.includes('spouse aos') || normalized.includes('marriage-based adjustment') || (normalized.includes('adjustment') && normalized.includes('spouse'))) return 'spouse_aos';
    if (normalized.includes('parent aos') || (normalized.includes('adjustment') && normalized.includes('parent'))) return 'parent_aos';
    if (normalized.includes('child aos') || (normalized.includes('adjustment') && normalized.includes('child'))) return 'child_aos';
    if (normalized.includes('i-751') || normalized.includes('remove conditions') || normalized.includes('conditions on residence')) return 'i751';
    if (normalized.includes('daca') || normalized.includes('821d')) return 'daca';
    if (normalized.includes('n-400') || normalized.includes('naturalization') || normalized.includes('citizenship')) return 'n400';
    if (normalized.includes('i-90') || normalized.includes('replace permanent resident card') || normalized.includes('green card replacement') || normalized.includes('replace or fix a green card') || normalized.includes('replace a green card') || normalized.includes('fix a green card') || normalized.includes('fix green card')) return 'i90';

    return 'i90'; // fallback to i90 if nothing matched, as this is the most common default
};

export const resolveDocuments = (latestApp: any, checklistsData: any, uploadedDocs: any[]): Document[] => {
    let expectedDocs: Document[] = [];
    
    if (latestApp) {
        const serviceText = `${latestApp.title || ''} ${latestApp.service_type || ''}`;
        const checklistKey = getChecklistKeyFromService(serviceText);
        
        const matchingChecklist = checklistKey ? checklistsData[checklistKey] : null;
        
        if (matchingChecklist) {
            let tempId = -1000;
            matchingChecklist.sections.forEach((section: any) => {
                section.documents.forEach((d: any) => {
                    expectedDocs.push({
                        id: tempId--,
                        name: d.name,
                        status: 'Missing',
                        file_path: null,
                        required: d.required === true  // preserve required flag from DB checklist
                    });
                });
            });
        } else {
            expectedDocs = [...defaultChecklist];
        }
    } else {
        expectedDocs = [...defaultChecklist];
    }

    const finalDocs = [...expectedDocs];
    
    uploadedDocs.forEach((uploaded: Document) => {
        const matchIndex = finalDocs.findIndex(f => f.status === 'Missing' && isMatch(f.name, uploaded.name));
        if (matchIndex !== -1) {
            // Preserve the required flag from the checklist entry when merging with uploaded doc
            finalDocs[matchIndex] = { ...uploaded, required: finalDocs[matchIndex].required };
        } else {
            finalDocs.push({ ...uploaded, required: false });
        }
    });

    return finalDocs;
};


export interface DocItem {
    key: string;
    label: string;
    required: boolean;
}

export interface DocGroup {
    header: string;
    items: DocItem[];
}

export interface FormChecklist {
    title: string;
    subtitle: string;
    requiredKeys: string[];
    groups: DocGroup[];
}

export const generateFormChecklist = (latestApp: any, checklistsData: any): FormChecklist | null => {
    if (!latestApp) return null;
    
    const serviceText = `${latestApp.title || ''} ${latestApp.service_type || ''}`;
    const checklistKey = getChecklistKeyFromService(serviceText);
    const backendChecklist = checklistKey ? checklistsData[checklistKey] : null;

    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!backendChecklist) {
        // Fallback to defaultChecklist mapping
        return {
            title: "Document Upload",
            subtitle: "Upload required supporting evidence.",
            requiredKeys: defaultChecklist.map(d => sanitize(d.name)),
            groups: [{
                header: "Required Documents",
                items: defaultChecklist.map(d => ({
                    key: sanitize(d.name),
                    label: d.name,
                    required: true
                }))
            }]
        };
    }

    const requiredKeys: string[] = [];
    const groups: DocGroup[] = backendChecklist.sections.map((s: any) => {
        const items = s.documents.map((d: any) => {
            const key = sanitize(d.name);
            if (d.required) requiredKeys.push(key);
            return {
                key,
                label: d.name,
                required: d.required
            };
        });
        return { header: s.title, items };
    });

    return {
        title: backendChecklist.title || "Document Upload",
        subtitle: backendChecklist.subtitle || "Upload required supporting evidence.",
        requiredKeys,
        groups
    };
};
