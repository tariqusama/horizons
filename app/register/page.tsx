'use client';
import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsRegistering(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        email,
        password,
        password_confirmation: confirmPassword,
      }, !!redirectUrl);

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to register');
    } finally {
      setIsRegistering(false);
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
                  Join Horizon Pathways. Collaborate on applications, upload documents, and track progress effortlessly.
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

              <h1 className="text-3xl font-bold text-[#101F38] tracking-tight">Create an Account</h1>
              <p className="mt-3 text-[15px] text-[#5B6472] leading-relaxed">
                Enter your details below to get started and accept your invitation.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleRegister}>
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#101F38]">
                      First Name<span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-[#E5E3DC] bg-white px-3 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#101F38]">
                      Last Name<span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-[#E5E3DC] bg-white px-3 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#101F38]">
                    Email Address<span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-[#E5E3DC] bg-white px-3 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#101F38]">
                    Password<span className="text-orange-500">*</span>
                  </label>
                  <div className="mt-1.5 relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-[#E5E3DC] bg-white pl-3 pr-10 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#101F38]"
                    >
                      {showPassword ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.7 19.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#101F38]">
                    Confirm Password<span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-[#E5E3DC] bg-white px-3 py-2.5 text-[15px] text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#101F38] hover:bg-[#0A1526] transition-colors disabled:opacity-50"
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="mt-6 text-center text-[15px] text-[#5B6472]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-orange-500 hover:text-[#C93500] transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
