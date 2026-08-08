export type FormEntry = { path: string; code: string; name: string };

export function getFormsList(app: any, options?: { allowFallback?: boolean }): FormEntry[] {
    const allowFallback = options?.allowFallback !== false;
    let baseForms: FormEntry[] = [];

    // 1. Dynamic Forms Linking (Admin Driven)
    if (app && Array.isArray(app.linked_forms) && app.linked_forms.length > 0) {
        baseForms = app.linked_forms.map((f: any) => ({
            path: `/dashboard/get-started/dynamic/${f.slug}`,
            code: f.slug,
            name: f.name || `Form ${f.slug.toUpperCase()}`
        }));
    } else {
        // 2. Hardcoded Fallback (Legacy)
        const titleRaw = typeof app === 'string' ? app : (app?.title || '');
        const title = titleRaw.toLowerCase().trim();

        if (title.includes('replace') || title.includes('i-90') || title.includes('green card')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-90', code: 'i-90', name: 'Form I-90 (Green Card)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('daca') || title.includes('821d')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-821d', code: 'i-821d', name: 'Form I-821D (DACA)' },
                { path: '/dashboard/get-started/dynamic/i-765', code: 'i-765', name: 'Form I-765 (Work Permit)' },
                { path: '/dashboard/get-started/dynamic/i-765ws', code: 'i-765ws', name: 'Form I-765WS (Worksheet)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('naturalization') || title.includes('citizenship') || title.includes('n-400')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/n-400', code: 'n-400', name: 'Form N-400 (Naturalization)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('adjust') || title.includes('485')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
                { path: '/dashboard/get-started/dynamic/i-485', code: 'i-485', name: 'Form I-485 (Green Card)' },
                { path: '/dashboard/get-started/dynamic/i-864', code: 'i-864', name: 'Form I-864 (Affidavit)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('remove') || title.includes('751')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-751', code: 'i-751', name: 'Form I-751 (Remove Conditions)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('130') || title.includes('spouse') || title.includes('alien relative')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
                { path: '/dashboard/get-started/dynamic/i-130a', code: 'i-130a', name: 'Form I-130A (Spouse Supp.)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (title.includes('129f') || title.includes('fiance')) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-129f', code: 'i-129f', name: 'Form I-129F (Fiance Petition)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        } else if (allowFallback) {
            baseForms = [
                { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
                { path: '/dashboard/get-started/dynamic/i-130a', code: 'i-130a', name: 'Form I-130A (Spouse Supp.)' },
                { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
            ];
        }
    }

    if (baseForms.length === 0) return [];

    // CONDITIONAL FORMS WORKFLOW for Adjustment of Status (AOS)
    // First, filter out any auto-linked i-765 or i-131 if it's an AOS application
    const titleRaw = typeof app === 'string' ? app : (app?.title || '');
    const isAos = titleRaw.toLowerCase().includes('adjust') || titleRaw.toLowerCase().includes('485') || baseForms.some(f => f.code === 'i-485');
    
    if (isAos) {
        // Remove I-765 and I-131 from the default list
        baseForms = baseForms.filter(f => f.code !== 'i-765' && f.code !== 'i-131');
        
        // Add them back ONLY IF the user opted in via the I-485 optional questions
        const formData = app?.form_data || {};
        
        // Insert them right before G-1145 if it exists, otherwise at the end
        const insertIndex = baseForms.findIndex(f => f.code === 'g-1145');
        const targetIndex = insertIndex !== -1 ? insertIndex : baseForms.length;
        
        const optionalForms = [];
        if (formData.wants_i765 === 'yes') {
            optionalForms.push({ path: '/dashboard/get-started/dynamic/i-765', code: 'i-765', name: 'Form I-765 (Work Permit)' });
        }
        if (formData.wants_i131 === 'yes') {
            optionalForms.push({ path: '/dashboard/get-started/dynamic/i-131', code: 'i-131', name: 'Form I-131 (Advance Parole)' });
        }
        
        if (optionalForms.length > 0) {
            baseForms.splice(targetIndex, 0, ...optionalForms);
        }
    }

    return baseForms;
}

export function getNextFormPath(currentPath: string, app: any): string {
    const list = getFormsList(app, { allowFallback: false });
    const idx = list.findIndex(f => f.path === currentPath);
    if (idx >= 0 && idx < list.length - 1) return list[idx + 1].path;
    return '/dashboard/get-started/document-upload';
}

export function getPrevFormPath(currentPath: string, app: any): string {
    const list = getFormsList(app, { allowFallback: false });
    const idx = list.findIndex(f => f.path === currentPath);
    if (idx > 0) return list[idx - 1].path;
    // If current path is not in list or is first, go back to overview
    return '/dashboard/get-started';
}
