import RoleDashboard from '@/components/RoleDashboard';

const actions = [
    {
        title: 'Review Case Notes',
        description: 'See case details, prepare documents, and coordinate with the attorney.',
        href: '/manager/assigned-cases',
        accent: 'bg-emerald-100 text-emerald-700',
    },
    {
        title: 'Update Client Files',
        description: 'Access and update client documentation to keep cases moving forward.',
        href: '/dashboard/documents',
        accent: 'bg-slate-100 text-slate-700',
    },
    {
        title: 'Collaborate with Team',
        description: 'Send case updates and coordinate directly with legal staff.',
        href: '/manager/messages',
        accent: 'bg-blue-100 text-blue-700',
    },
];

export const metadata = {
    title: 'Paralegal Dashboard | Horizon Pathways',
    description: 'Paralegal portal for case preparation and client support.',
};

export default function ParalegalPage() {
    return (
        <RoleDashboard
            title="Paralegal Dashboard"
            subtitle="Support attorneys and clients with document preparation and case management tasks."
            roleName="Paralegal"
            actions={actions}
        />
    );
}
