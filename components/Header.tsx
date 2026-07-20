'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getNotifications, markAsRead, Notification } from '../lib/api/notifications';

export default function Header({ isDashboard = false }: { isDashboard?: boolean }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pathname = usePathname();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  useEffect(() => {
    if (!isDashboard) return;
    loadNotifications();
  }, [isDashboard]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAsRead();
      await loadNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const navLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `pb-1 border-b-[3px] transition-colors font-bold ${isActive
      ? 'text-[#E3755D] border-[#E3755D]'
      : 'text-[#5A6579] border-transparent hover:text-[#1B3A64]'
      }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[88px] flex items-center justify-between w-full">
        {/* Logo */}
        <Link href={isDashboard ? "/dashboard" : "/"} className="flex items-center space-x-3 transition-opacity hover:opacity-80">
          <Image
            src="/horizonlogo.png"
            alt="Horizon Pathways Logo"
            width={200}
            height={60}
            className="h-[50px] w-auto object-contain"
          />
        </Link>

        {!isDashboard ? (
          <>
            {/* Navigation Links for Marketing Site */}
            <nav className="hidden lg:flex items-center space-x-10 text-[15px]">
              <Link href="/" className={navLinkClass("/")}>Home</Link>
              <Link href="/about" className={navLinkClass("/about")}>About Us</Link>
              <Link href="/how-it-works" className={navLinkClass("/how-it-works")}>How It Works</Link>
              <Link href="/services" className={navLinkClass("/services")}>Services</Link>
              <Link href="/resources" className={navLinkClass("/resources")}>Resources</Link>
              <Link href="/free-tools" className={navLinkClass("/free-tools")}>Free Tools</Link>
            </nav>

            {/* Right Section for Marketing Site */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/login" className="font-bold text-[#1B3A64] hover:text-[#E3755D] transition-colors text-[15px]">Login</Link>
              <Link href="/signup" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-7 py-3 rounded-[12px] font-bold transition-transform shadow-sm text-[15px]">
                Start Assessment
              </Link>
            </div>
          </>
        ) : (
          /* Dashboard Right Section */
          <div className="flex items-center space-x-5 relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#5A6579] hover:text-[#1B3A64] transition-colors focus:outline-none"
            >
              <span className="material-icons text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-4 min-w-[1rem] rounded-full bg-[#E3755D] px-[0.25rem] text-[10px] font-bold text-white items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-14 right-16 w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                  <h3 className="font-bold text-[#1B3A64] text-sm">Notifications</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={handleMarkAllRead} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Mark all as read</button>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Close</button>
                  </div>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-sm text-[#5B6472]">No notifications</div>
                  )}
                  {notifications.map((n) => {
                    const parsedData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                    const isUnread = !n.read_at;
                    return (
                      <div key={n.id} className={`p-4 transition-colors flex gap-3 items-start border-b border-gray-50 ${isUnread ? 'bg-[#FDFCFB]' : 'bg-white hover:bg-[#F9F8F6]'}`}>
                        <div className="w-3 h-3 mt-2 rounded-full shrink-0" style={{ background: isUnread ? '#E3755D' : '#D1D5DB' }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <p className={`text-sm ${isUnread ? 'font-black text-[#101F38]' : 'font-bold text-[#101F38]'}`}>{parsedData.title}</p>
                            <span className="text-[10px] font-semibold text-[#8A8F98] whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className={`text-sm ${isUnread ? 'text-[#101F38] font-medium' : 'text-[#5B6472]'}`}>{parsedData.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-5 py-3 border-t border-gray-100 text-center bg-[#F8F9FA]">
                  <Link href={pathname.startsWith('/admin') ? '/admin/notifications' : '/dashboard/notifications'} onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#E3755D] hover:text-[#C8634D]">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pl-5 border-l border-gray-200">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-bold text-[#1B3A64]">Alex Johnson</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E3755D]">Client</span>
              </div>
              <Link href="/dashboard/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B3A64] text-white font-bold tracking-wider hover:bg-[#122846] transition-colors shadow-sm">
                AJ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
