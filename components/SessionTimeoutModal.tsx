'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SessionTimeoutModal() {
    const { isIdle, idleTime, resetIdleTimer, logout } = useAuth();

    if (!isIdle) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#F8F9FA] rounded-xl shadow-lg w-full max-w-md overflow-hidden relative border border-slate-200">
                {/* Close Button */}
                <button 
                    onClick={resetIdleTimer}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#1A2A43] mb-3">Session about to expire</h2>
                    <p className="text-[#5A6A80] text-sm leading-relaxed mb-6">
                        Your session is about to expire due to inactivity. Click "Continue" to stay signed in. You will be signed out automatically in <strong className="font-bold text-slate-900">{idleTime}s</strong>.
                    </p>

                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => logout()}
                            className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-[#304058] hover:bg-slate-50 transition-colors bg-white shadow-sm"
                        >
                            Sign out now
                        </button>
                        <button 
                            onClick={resetIdleTimer}
                            className="px-5 py-2.5 rounded-lg bg-[#F38618] hover:bg-[#D97613] text-white text-sm font-bold shadow-sm transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
