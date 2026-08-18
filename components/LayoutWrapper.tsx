'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import SessionTimeoutModal from './SessionTimeoutModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide global Header, Footer, and ChatWidget on internal dashboard pages
  const isFullScreenPage = pathname === '/login';
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isManager = pathname?.startsWith('/manager');
  const isAttorney = pathname?.startsWith('/attorney');
  const isParalegal = pathname?.startsWith('/paralegal');
  const isPrintingTeam = pathname?.startsWith('/printing-team');
  const isViewer = pathname?.startsWith('/viewer');
  const hideShell = isFullScreenPage || isDashboard || isAdmin || isManager || isAttorney || isParalegal || isPrintingTeam || isViewer;

  return (
    <>
      {!hideShell && <Header isDashboard={isDashboard} />}
      <main className={`flex-grow flex flex-col${!hideShell ? ' pt-[84px]' : ''}`}>
        {children}
      </main>
      {!hideShell && <Footer />}
      <SessionTimeoutModal />
    </>
  );
}

