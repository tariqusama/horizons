'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF6FF] via-[#FFF6EE] to-[#FFD9C2] px-6 py-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .font-display-italic { font-family: 'Fraunces', serif; font-style: italic; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(18px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .float-slow { animation: float-slow 6s ease-in-out infinite; }
        .card-enter { animation: card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .float-slow, .card-enter { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* Reliable background: gradient wash + soft color glows */}
      <div className="absolute top-[-12%] right-[-8%] w-[560px] h-[560px] bg-[#FF6B4A]/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-18%] left-[-10%] w-[560px] h-[560px] bg-[#2AA198]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] left-[6%] w-[280px] h-[280px] bg-[#FFC857]/25 rounded-full blur-[110px] pointer-events-none" />

      {/* Small static route illustration, contained so it always renders in view */}
      <svg
        className="hidden lg:block absolute top-16 right-16 w-[260px] h-[170px] opacity-90"
        viewBox="0 0 260 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 150 C 60 120, 90 110, 120 90 S 190 50, 240 20"
          stroke="#16233F"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
        <circle cx="10" cy="150" r="5" fill="#FF6B4A" />
        <circle cx="240" cy="20" r="5" fill="#2AA198" />
        <g transform="translate(140,72) rotate(-28)">
          <path d="M-11 0 L11 0 L5 -4 L-3 -4 Z" fill="#16233F" fillOpacity="0.55" />
        </g>
      </svg>

      {/* Decorative passport-stamp badge, floating near the card */}
      <div className="float-slow hidden lg:flex absolute bottom-24 right-[14%] w-24 h-24 rounded-full border-2 border-dashed border-[#2AA198]/50 items-center justify-center text-center pointer-events-none">
        <span className="font-body text-[10px] font-bold tracking-wider text-[#2AA198]/80 leading-tight">
          APPROVED<br />SINCE 2016
        </span>
      </div>

      {/* Card */}
      <div className="card-enter relative w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-[28px] border border-white shadow-[0_20px_60px_-15px_rgba(22,35,63,0.25)] px-8 py-10 sm:px-10 sm:py-12">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8A5B] flex items-center justify-center shadow-md shadow-[#FF6B4A]/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19C7 19 7 14 10 14C13 14 13 8 16 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="16" cy="8" r="2.2" fill="white" />
            </svg>
          </div>
          <span className="font-body text-sm font-semibold text-[#16233F] tracking-tight">Horizon Pathways</span>
        </div>

        <h1 className="font-display-italic text-4xl text-[#16233F] leading-[1.05] mb-2">
          Welcome back
        </h1>
        <p className="text-[#6B7280] font-body text-[15px] leading-relaxed mb-8">
          Log in to continue your immigration journey.
        </p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A3A9B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 6l-10 7L2 6"></path>
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            </svg>
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#EDE8E1] bg-[#FAF8F5] text-[#16233F] outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/15 focus:bg-white transition-all placeholder:text-[#A3A9B7] font-body text-[15px]"
            />
          </div>

          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A3A9B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#EDE8E1] bg-[#FAF8F5] text-[#16233F] outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/15 focus:bg-white transition-all placeholder:text-[#A3A9B7] font-body text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A9B7] hover:text-[#6B7280] transition-colors"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-sm font-semibold text-[#FF6B4A] hover:text-[#E05539] transition-colors font-body">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A5B] hover:from-[#F0603F] hover:to-[#F57E4F] text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-[#FF6B4A]/25 hover:shadow-xl hover:shadow-[#FF6B4A]/30 hover:-translate-y-0.5 font-body text-[15px]"
          >
            Sign in
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <div className="mt-8 text-center text-[#6B7280] font-body text-[15px]">
          New here?{' '}
          <Link href="/signup" className="text-[#FF6B4A] font-semibold hover:text-[#E05539] transition-colors">
            Create an account
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#EDE8E1] flex items-center justify-center gap-2 font-body text-xs text-[#A3A9B7]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Your information is encrypted end-to-end
        </div>
      </div>
    </main>
  );
}