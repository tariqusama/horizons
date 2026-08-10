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
    
    const formData = app?.form_data || {};
    
    // 1. ALL APPLICATIONS: Filter out G-1145 from the beginning, we will ask it at the end.
    baseForms = baseForms.filter(f => f.code !== 'g-1145');
    
    const optionalForms = [];

    // CONDITIONAL FORMS WORKFLOW for Adjustment of Status (AOS)
    if (isAos) {
        // Remove AOS optional forms from the default list so we can sequence them properly
        baseForms = baseForms.filter(f => !['i-765', 'i-131', 'i-864a', 'i-864-joint'].includes(f.code));
        
        // 1. I-765
        optionalForms.push({ path: '/dashboard/get-started/optional-forms?ask=i-765', code: 'ask-i-765', name: 'Optional Form: I-765' });
        if (formData.wants_ead === true || formData.wants_ead === 'yes' || formData.wants_i765 === 'yes') {
            optionalForms.push({ path: '/dashboard/get-started/dynamic/i-765', code: 'i-765', name: 'Form I-765 (Work Permit)' });
        }

        // 2. I-131
        optionalForms.push({ path: '/dashboard/get-started/optional-forms?ask=i-131', code: 'ask-i-131', name: 'Optional Form: I-131' });
        if (formData.wants_ap === true || formData.wants_ap === 'yes' || formData.wants_i131 === 'yes') {
            optionalForms.push({ path: '/dashboard/get-started/dynamic/i-131', code: 'i-131', name: 'Form I-131 (Advance Parole)' });
        }

        // 3. I-864A
        optionalForms.push({ path: '/dashboard/get-started/optional-forms?ask=i-864a', code: 'ask-i-864a', name: 'Optional Form: I-864A' });
        if (formData.wants_household_member === true || formData.wants_household_member === 'yes') {
            optionalForms.push({ path: '/dashboard/get-started/dynamic/i-864a', code: 'i-864a', name: 'Form I-864A (Contract Between Sponsor and Household Member)' });
        }
    }
    
    // G-1145 is asked for ALL applications at the very end
    optionalForms.push({ path: '/dashboard/get-started/optional-forms?ask=g-1145', code: 'ask-g-1145', name: 'Optional Form: G-1145' });
    if (formData.wants_g1145 === true || formData.wants_g1145 === 'yes') {
        optionalForms.push({ path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' });
    }
    
    if (optionalForms.length > 0) {
        baseForms.splice(baseForms.length, 0, ...optionalForms);
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
