'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api, { initCsrf } from '@/lib/api';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token') || '';
    const emailParam = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailParam);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Missing password reset token. Please request a new reset link.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            await initCsrf();
            const response = await api.post('/password/reset', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setIsSuccess(true);
            setMessage(response.data.message || 'Password has been successfully reset! You can now sign in.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            const serverMessage =
                err.response?.data?.errors?.password?.[0] ||
                err.response?.data?.errors?.email?.[0] ||
                err.response?.data?.message ||
                'Unable to reset password. The link may have expired or is invalid.';
            setError(serverMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#ECE9E2] p-8">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-[#101F38]">Reset Password</h1>
                <p className="mt-2 text-sm text-[#5B6472]">
                    Create a new, secure password for your account.
                </p>
            </div>

            {message ? (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <p className="font-semibold">{message}</p>
                    {isSuccess && (
                        <p className="mt-1 text-xs text-green-600">Redirecting to login in 3 seconds...</p>
                    )}
                </div>
            ) : null}

            {error ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {!token && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p className="font-medium">No valid reset token was found in this link.</p>
                    <p className="mt-1 text-xs text-amber-700">
                        Please request a new reset link from the{' '}
                        <Link href="/forgot-password" className="font-semibold underline hover:text-amber-900">
                            Forgot Password
                        </Link>{' '}
                        page.
                    </p>
                </div>
            )}

            {isSuccess ? (
                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="inline-block w-full rounded-2xl bg-[#101F38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1526]"
                    >
                        Go to Sign In
                    </Link>
                </div>
            ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#101F38]">
                            Email Address<span className="text-orange-500">*</span>
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
                                className="w-full rounded-2xl border border-[#E5E3DC] bg-white px-4 py-3 text-sm text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#101F38]">
                            New Password<span className="text-orange-500">*</span>
                        </label>
                        <div className="mt-2 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-2xl border border-[#E5E3DC] bg-white px-4 py-3 pr-12 text-sm text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5B6472] hover:text-[#101F38] transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-[#5B6472]">Minimum 8 characters</p>
                    </div>

                    <div>
                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-[#101F38]">
                            Confirm New Password<span className="text-orange-500">*</span>
                        </label>
                        <div className="mt-2 relative">
                            <input
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-2xl border border-[#E5E3DC] bg-white px-4 py-3 pr-12 text-sm text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5B6472] hover:text-[#101F38] transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !token}
                        className="w-full rounded-2xl bg-[#101F38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1526] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center text-sm text-[#5B6472]">
                <p>
                    Back to{' '}
                    <Link href="/login" className="font-semibold text-orange-500 hover:text-[#C93500]">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#F5F4F1] flex items-center justify-center p-6">
            <Suspense fallback={
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#ECE9E2] p-8 text-center text-sm text-[#5B6472]">
                    Loading password reset...
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
