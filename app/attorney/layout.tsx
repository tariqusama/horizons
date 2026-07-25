import React from 'react';
import AttorneyLayoutClient from './AttorneyLayoutClient';

export const metadata = {
    title: 'Attorney Portal | Horizon Pathways',
    description: 'Attorney portal for reviewing and approving immigration cases.',
};

export default function AttorneyLayout({ children }: { children: React.ReactNode }) {
    return <AttorneyLayoutClient>{children}</AttorneyLayoutClient>;
}
