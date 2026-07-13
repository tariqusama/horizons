'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide global Header and Footer on these distraction-free pages
  const isFullScreenPage = pathname === '/login';
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isManager = pathname?.startsWith('/manager');

  return (
    <>
      {!isFullScreenPage && !isAdmin && !isManager && !isDashboard && <Header isDashboard={isDashboard} />}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isFullScreenPage && !isDashboard && !isAdmin && !isManager && <Footer />}
    </>
  );
}

