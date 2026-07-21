'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-[120px] bg-[#F5F4F1] flex items-center justify-center p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
          .font-body { font-family: 'Inter', sans-serif; }
          .font-mono { font-family: 'IBM Plex Mono', monospace; }
        `}</style>

        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden flex min-h-[660px] font-body">
          {/* Left Column: Gradient visual panel */}
          <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #F2A65A 0%, #E3755D 22%, #B23A63 45%, #5B3B8C 68%, #2E2A6E 100%)',
              }}
            />
            <div className="relative z-10 flex flex-col justify-end h-full p-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-white text-[15px] leading-relaxed">
                  Sign in to continue your U.S. immigration journey. Track your case progress, manage
                  documents, and stay connected with your legal team every step of the way.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 py-12">
            <div className="w-full max-w-sm mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#5B6472] hover:text-[#101F38] transition-colors mb-8"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
              </Link>

              {/* Logo */}
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-[160px]">
                  <Image src="/horizonlogo.png" alt="Horizon Pathways" width={160} height={42} className="object-contain" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#101F38] tracking-tight">Welcome Back</h1>
              <p className="mt-3 text-[15px] text-[#5B6472] leading-relaxed">
                Sign in to continue your immigration journey, access your case dashboard, and pick up
                right where you left off.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#101F38]">
                    Email Address<span className="text-[#E3755D]">*</span>
                  </label>
                  <div className="mt-1.5 relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-[#8A8F98]">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full rounded-lg border border-[#E5E3DC] bg-white pl-10 pr-3 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/40 focus:border-[#E3755D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-[#101F38]">
                      Password<span className="text-[#E3755D]">*</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm font-semibold text-[#E3755D] hover:text-[#C93500] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1.5 relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-[#8A8F98]">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="10" width="16" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="block w-full rounded-lg border border-[#E5E3DC] bg-white pl-10 pr-10 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/40 focus:border-[#E3755D] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#101F38] transition-colors"
                    >
                      {showPassword ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.7 19.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-[#5B6472] cursor-pointer select-none">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-full text-[#E3755D] focus:ring-[#E3755D] border-[#CBC8BF] cursor-pointer"
                  />
                  Remember me for 30 days
                </label>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#101F38] hover:bg-[#0A1526] transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8 relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E3DC]" />
                </div>
                <span className="relative bg-white px-3 font-mono text-[11px] tracking-wider text-[#8A8F98] uppercase">
                  New to Horizon Pathways?
                </span>
              </div>

              <p className="mt-4 text-center text-[15px] text-[#5B6472]">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-[#E3755D] hover:text-[#C93500] transition-colors">
                  Create new account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Floating help widget */}
        <div className="fixed bottom-6 right-6 flex items-center gap-3">
          <div className="hidden sm:block bg-white rounded-full shadow-md px-4 py-2 text-sm font-medium text-[#101F38]">
            Need help? Chat Nancy
          </div>
          <button
            aria-label="Open chat"
            className="w-12 h-12 rounded-full bg-[#E3755D] hover:bg-[#C93500] transition-colors shadow-md flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}