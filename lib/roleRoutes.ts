export function getRoleRoute(role: string) {
    const normalized = (role || '').toString().trim().toLowerCase();

    if (normalized.includes('admin')) return '/admin';
    if (normalized.includes('manager')) return '/manager';
    if (normalized.includes('case manager')) return '/manager';
    if (normalized.includes('immigration-attorney') || normalized.includes('immigration attorney') || normalized.includes('attorney')) return '/attorney';
    if (normalized.includes('paralegal')) return '/paralegal';
    if (normalized.includes('printing-team') || normalized.includes('printing team') || normalized.includes('printing')) return '/printing-team';
    if (normalized.includes('viewer') || normalized.includes('read-only') || normalized.includes('read only')) return '/viewer';

    return '/dashboard';
}
