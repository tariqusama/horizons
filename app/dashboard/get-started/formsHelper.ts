export type FormEntry = { path: string; code: string; name: string };

export function getFormsList(titleRaw: string, options?: { allowFallback?: boolean }): FormEntry[] {
    const title = (titleRaw || '').toLowerCase().trim();
    const allowFallback = options?.allowFallback !== false;

    if (title.includes('replace') || title.includes('i-90') || title.includes('green card')) {
        return [
            { path: '/dashboard/get-started/dynamic/i-90', code: 'i-90', name: 'Form I-90 (Green Card)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }
    if (title.includes('daca') || title.includes('821d')) {
        return [
            { path: '/dashboard/get-started/dynamic/i-821d', code: 'i-821d', name: 'Form I-821D (DACA)' },
            { path: '/dashboard/get-started/dynamic/i-765', code: 'i-765', name: 'Form I-765 (Work Permit)' },
            { path: '/dashboard/get-started/dynamic/i-765ws', code: 'i-765ws', name: 'Form I-765WS (Worksheet)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }
    if (title.includes('naturalization') || title.includes('citizenship') || title.includes('n-400')) {
        return [
            { path: '/dashboard/get-started/dynamic/n-400', code: 'n-400', name: 'Form N-400 (Naturalization)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }
    if (title.includes('adjust') || title.includes('485')) {
        return [
            { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
            { path: '/dashboard/get-started/dynamic/i-485', code: 'i-485', name: 'Form I-485 (Green Card)' },
            { path: '/dashboard/get-started/dynamic/i-864', code: 'i-864', name: 'Form I-864 (Affidavit)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }
    if (title.includes('remove') || title.includes('751')) {
        return [
            { path: '/dashboard/get-started/dynamic/i-751', code: 'i-751', name: 'Form I-751 (Remove Conditions)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }
    if (title.includes('130') || title.includes('spouse') || title.includes('alien relative')) {
        return [
            { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
            { path: '/dashboard/get-started/dynamic/i-130a', code: 'i-130a', name: 'Form I-130A (Spouse Supp.)' },
            { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
        ];
    }

    if (!allowFallback) {
        return [];
    }

    return [
        { path: '/dashboard/get-started/dynamic/i-130', code: 'i-130', name: 'Form I-130 (Petition)' },
        { path: '/dashboard/get-started/dynamic/i-130a', code: 'i-130a', name: 'Form I-130A (Spouse Supp.)' },
        { path: '/dashboard/get-started/dynamic/g-1145', code: 'g-1145', name: 'Form G-1145 (e-Notification)' }
    ];
}

export function getNextFormPath(currentPath: string, titleRaw: string): string {
    const list = getFormsList(titleRaw, { allowFallback: false });
    const idx = list.findIndex(f => f.path === currentPath);
    if (idx >= 0 && idx < list.length - 1) return list[idx + 1].path;
    return '/dashboard/get-started/document-upload';
}

export function getPrevFormPath(currentPath: string, titleRaw: string): string {
    const list = getFormsList(titleRaw, { allowFallback: false });
    const idx = list.findIndex(f => f.path === currentPath);
    if (idx > 0) return list[idx - 1].path;
    // If current path is not in list or is first, go back to overview
    return '/dashboard/get-started';
}
