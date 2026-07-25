import React from 'react';
import PrintingTeamLayoutClient from './PrintingTeamLayoutClient';

export const metadata = {
    title: 'Printing Team Portal | Horizon Pathways',
    description: 'Printing team portal for printing and document fulfillment tasks.',
};

export default function PrintingTeamLayout({ children }: { children: React.ReactNode }) {
    return <PrintingTeamLayoutClient>{children}</PrintingTeamLayoutClient>;
}
