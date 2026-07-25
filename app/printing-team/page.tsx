import RoleDashboard from '@/components/RoleDashboard';

const actions = [
    {
        title: 'Prepare Documents',
        description: 'Review and print forms, letters, and filing packets for client submission.',
        href: '/printing-team/documents',
        accent: 'bg-cyan-100 text-cyan-700',
    },
    {
        title: 'Track Print Jobs',
        description: 'Monitor document readiness and coordinate urgent case deliveries.',
        href: '/printing-team/print-queue',
        accent: 'bg-violet-100 text-violet-700',
    },
    {
        title: 'Confirm Shipment',
        description: 'Mark documents ready for shipping with status updates for the team.',
        href: '/printing-team/shipment-status',
        accent: 'bg-orange-100 text-orange-700',
    },
];

export const metadata = {
    title: 'Printing Team Dashboard | Horizon Pathways',
    description: 'Dashboard for managing case printing and fulfillment tasks.',
};

export default function PrintingTeamPage() {
    return (
        <RoleDashboard
            title="Printing Team Dashboard"
            subtitle="Coordinate printed case materials and make sure each application is ready to file."
            roleName="Printing Team"
            actions={actions}
        />
    );
}
