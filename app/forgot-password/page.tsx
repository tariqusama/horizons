'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api, { initCsrf } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        try {
            await initCsrf();
            const response = await api.post('/password/forgot', { email });
            setMessage(response.data.message || 'Password reset link sent to your email.');
            setEmail('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Unable to send reset link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F4F1] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#ECE9E2] p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-[#101F38]">Forgot Password</h1>
                    <p className="mt-2 text-sm text-[#5B6472]">
                        Enter your email and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                {message ? (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#101F38]">
                            Email Address<span className="text-[#E3755D]">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-2xl border border-[#E5E3DC] bg-white px-4 py-3 text-sm text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/40 focus:border-[#E3755D] transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-[#101F38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1526] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#5B6472]">
                    <p>
                        Remembered your password?{' '}
                        <Link href="/login" className="font-semibold text-[#E3755D] hover:text-[#C93500]">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
