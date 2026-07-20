'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide global Header, Footer, and ChatWidget on internal dashboard pages
  const isFullScreenPage = pathname === '/login';
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isManager = pathname?.startsWith('/manager');
  const hideShell = isFullScreenPage || isDashboard || isAdmin || isManager;

  return (
    <>
      {!hideShell && <Header isDashboard={isDashboard} />}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!hideShell && <Footer />}
      {!hideShell && <ChatWidget />}
    </>
  );
}

