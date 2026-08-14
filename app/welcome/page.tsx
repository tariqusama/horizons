'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const VIDEO_URL = `${BACKEND_URL}/storage/testmonials/Horizon%201.mp4`;

function WelcomeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            api.post('/payment/verify', { session_id: sessionId })
               .then(() => {
                   // Clean up URL without refreshing the page
                   window.history.replaceState({}, document.title, window.location.pathname);
               })
               .catch(console.error);
        }
    }, [sessionId]);

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-6 sm:p-10 border border-slate-800">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                    Welcome to Horizon Pathways!
                </h1>
                <p className="text-slate-400 mb-8 text-center max-w-2xl">
                    Thank you for choosing us. Please watch this short video to learn how to get started with your application and make the most out of our platform.
                </p>
                
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-slate-800">
                    <video 
                        src={VIDEO_URL} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-cover"
                        onEnded={() => router.push('/dashboard')}
                    />
                </div>
                
                <div className="mt-8 flex gap-4 w-full justify-center">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}>
            <WelcomeContent />
        </Suspense>
    );
}
