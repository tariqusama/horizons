'use client';

import React from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function TidioChat() {
  const pathname = usePathname();
  
  // The chat widget will be hidden on any route that starts with these paths
  const hideChatOnPaths = [
    '/dashboard',
    '/admin',
    '/manager',
    '/paralegal',
    '/attorney',
    '/printing-team',
    '/beneficiary',
  ];

  const shouldHideChat = hideChatOnPaths.some(path => pathname?.startsWith(path));

  return (
    <>
      {shouldHideChat && (
        <style>{`
          #tidio-chat-iframe, #tidio-chat { 
            display: none !important; 
          }
        `}</style>
      )}
      <Script src="//code.tidio.co/09r1t1s3uxdlfvmkh3crhe3rmk8vck9w.js" strategy="lazyOnload" />
    </>
  );
}
