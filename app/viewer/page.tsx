import RoleDashboard from '@/components/RoleDashboard';

const actions = [
    {
        title: 'Review Cases',
        description: 'View case summaries, application statuses, and client progress updates.',
        href: '/dashboard/applications',
        accent: 'bg-slate-100 text-slate-700',
    },
    {
        title: 'View Activity',
        description: 'Monitor recent notifications and case activity in read-only mode.',
        href: '/dashboard/notifications',
        accent: 'bg-indigo-100 text-indigo-700',
    },
    {
        title: 'Access Client Documents',
        description: 'Open documents and case files without editing privileges.',
        href: '/dashboard/documents',
        accent: 'bg-sky-100 text-sky-700',
    },
];

export const metadata = {
    title: 'Viewer Dashboard | Horizon Pathways',
    description: 'Read-only viewer portal for case review and monitoring.',
};

export default function ViewerPage() {
    return (
        <RoleDashboard
            title="Viewer Dashboard"
            subtitle="Access case details and monitor progress in a secure read-only environment."
            roleName="Read-Only Viewer"
            actions={actions}
        />
    );
}
