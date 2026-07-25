import RoleDashboard from '@/components/RoleDashboard';

const actions = [
    {
        title: 'Review Assigned Cases',
        description: 'Open your current assignments and provide legal guidance.',
        href: '/manager/assigned-cases',
        accent: 'bg-orange-100 text-orange-700',
    },
    {
        title: 'Pending Reviews',
        description: 'Track cases that are waiting for attorney review and approval.',
        href: '/manager/cases-awaiting-review',
        accent: 'bg-indigo-100 text-indigo-700',
    },
    {
        title: 'Client Messages',
        description: 'Respond securely to questions from clients and case managers.',
        href: '/manager/messages',
        accent: 'bg-sky-100 text-sky-700',
    },
];

export const metadata = {
    title: 'Attorney Dashboard | Horizon Pathways',
    description: 'Attorney portal for case review and client communication.',
};

export default function AttorneyPage() {
    return (
        <RoleDashboard
            title="Attorney Dashboard"
            subtitle="Manage legal reviews, client questions, and case assignments all in one place."
            roleName="Immigration Attorney"
            actions={actions}
        />
    );
}
