"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = React.use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const isAuthenticated = !!user;
    
    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accepting, setAccepting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const res = await api.get(`/applications/invites/${token}`);
                setInviteData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'This invite link is invalid or has expired.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        setAccepting(true);
        setError('');
        try {
            await api.post(`/applications/invites/${token}/accept`);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to accept invite.');
            setAccepting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                {error && !inviteData ? (
                    <div>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invite Invalid</h1>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <div>
                        {success ? (
                            <div>
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">Success!</h1>
                                <p className="text-slate-600 mb-6">
                                    You have successfully joined the <strong>{inviteData?.application_title}</strong> application.
                                </p>
                                <Link 
                                    href="/dashboard"
                                    className="inline-flex w-full items-center justify-center px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
                                <p className="text-slate-600 mb-6">
                                    <strong>{inviteData?.petitioner_name}</strong> has invited you to collaborate on their <strong>{inviteData?.application_title}</strong> application as a <strong>{inviteData?.role?.replace('_', ' ')}</strong>.
                                </p>

                                {!isAuthenticated ? (
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                                            Please create an account or log in to accept this invitation.
                                        </p>
                                        <Link 
                                            href={`/register?redirect=/invite/${token}`}
                                            className="flex w-full items-center justify-center px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
                                        >
                                            Create Account
                                        </Link>
                                        <Link 
                                            href={`/login?redirect=/invite/${token}`}
                                            className="flex w-full items-center justify-center px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                                        >
                                            Log In
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-500 mb-4">
                                            You are logged in as <strong>{user?.email}</strong>.
                                            {user?.email !== inviteData?.email && (
                                                <span className="block mt-2 text-red-500">Warning: This email does not match the invited email ({inviteData?.email}). You can still accept it, but please verify this is correct.</span>
                                            )}
                                        </p>
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        <button 
                                            onClick={handleAccept}
                                            disabled={accepting}
                                            className="flex w-full items-center justify-center px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                                        >
                                            {accepting ? 'Accepting...' : 'Accept Invitation'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
