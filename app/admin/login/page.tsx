import React from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FBFAF8] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-feature-settings: 'ss01' 1; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }

        @keyframes draw-path {
          from { stroke-dashoffset: 900; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes rise-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .path-line {
          stroke-dasharray: 900;
          animation: draw-path 2.4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .waypoint {
          opacity: 0;
          animation: rise-fade 0.6s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .path-line { animation: none; stroke-dashoffset: 0; }
          .waypoint { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm lg:w-[380px]">

          {/* System status eyebrow */}
          <div className="flex items-center gap-2 mb-10 font-mono text-[11px] tracking-wider text-[#8A8F98] uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BAE8C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5BAE8C]"></span>
            </span>
            Secure channel &middot; TLS 1.3
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 shrink-0 bg-[#101F38] rounded-lg flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19C7 19 7 14 10 14C13 14 13 8 16 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="16" cy="8" r="2.2" fill="#E3755D" />
              </svg>
            </div>
            <div className="font-mono text-xs text-[#8A8F98] leading-tight">
              HORIZON PATHWAYS<br />CASE MANAGEMENT SYSTEM
            </div>
          </div>

          <h2 className="font-display text-4xl font-semibold text-[#101F38] tracking-tight leading-[1.05]">
            Admin access
          </h2>
          <p className="mt-3 text-[15px] text-[#5B6472] font-body leading-relaxed">
            Sign in to manage cases, coordinate staff, and oversee program operations.
          </p>

          <div className="mt-10">
            <form className="space-y-7">
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#8A8F98]">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@horizonpathways.us"
                  className="mt-2 block w-full bg-transparent border-0 border-b-2 border-[#E5E3DC] px-0 py-2.5 text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:border-[#E3755D] transition-colors font-body text-[15px]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#8A8F98]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••"
                  className="mt-2 block w-full bg-transparent border-0 border-b-2 border-[#E5E3DC] px-0 py-2.5 text-[#101F38] placeholder-[#B7B4AA] focus:outline-none focus:border-[#E3755D] transition-colors font-body text-[15px]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-[#5B6472] font-body cursor-pointer select-none">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded-[3px] text-[#E3755D] focus:ring-[#E3755D] border-[#CBC8BF] cursor-pointer"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm font-semibold text-[#E3755D] hover:text-[#C93500] transition-colors font-body">
                  Forgot password?
                </a>
              </div>

              <Link
                href="/admin"
                className="group w-full flex justify-center items-center gap-2 py-4 px-4 rounded-lg text-sm font-semibold text-white bg-[#101F38] hover:bg-[#0A1526] transition-colors font-body"
              >
                Sign in to dashboard
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </form>

            <div className="mt-10 pt-6 border-t border-[#E5E3DC] flex items-center justify-between">
              <Link href="/" className="text-sm font-semibold text-[#8A8F98] hover:text-[#101F38] transition-colors flex items-center font-body">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Return to main site
              </Link>
              <span className="font-mono text-[11px] text-[#B7B4AA]">v4.2.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Signature horizon/pathway visual */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-[#0C1A30]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 700 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0C1A30" />
              <stop offset="55%" stopColor="#152A48" />
              <stop offset="78%" stopColor="#4A2E1E" />
              <stop offset="100%" stopColor="#E3755D" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB088" />
              <stop offset="100%" stopColor="#E3755D" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="700" height="900" fill="url(#sky)" />

          {/* faint contour lines - the "horizon" */}
          {[560, 590, 622, 656, 692].map((y, i) => (
            <path
              key={y}
              d={`M0 ${y} Q175 ${y - 14} 350 ${y} T700 ${y}`}
              stroke="#FFFFFF"
              strokeOpacity={0.05 + i * 0.015}
              strokeWidth="1.5"
              fill="none"
            />
          ))}

          {/* rising sun at horizon */}
          <circle cx="350" cy="640" r="160" fill="url(#sun)" />
          <circle cx="350" cy="640" r="46" fill="#E3755D" opacity="0.85" />

          {/* the pathway: a single case's route drawn as a line */}
          <path
            className="path-line"
            d="M60 780 C 140 760, 170 700, 230 660 S 320 590, 350 530 S 430 420, 470 340 S 560 210, 610 150"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* waypoints along the path */}
          {[
            { x: 60, y: 780, label: 'Intake', delay: '0.4s' },
            { x: 230, y: 660, label: 'Assessment', delay: '1.0s' },
            { x: 350, y: 530, label: 'Placement', delay: '1.6s' },
            { x: 470, y: 340, label: 'Follow-up', delay: '2.0s' },
            { x: 610, y: 150, label: 'Resolved', delay: '2.4s' },
          ].map((p) => (
            <g key={p.label} className="waypoint" style={{ animationDelay: p.delay }}>
              <circle cx={p.x} cy={p.y} r="5" fill="#E3755D" />
              <circle cx={p.x} cy={p.y} r="9" stroke="#E3755D" strokeOpacity="0.4" strokeWidth="1" fill="none" />
              <text
                x={p.x}
                y={p.y - 16}
                textAnchor="middle"
                fill="#FFFFFF"
                fillOpacity="0.75"
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="0.5"
              >
                {p.label.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        {/* caption + live stats */}
        <div className="absolute bottom-0 left-0 right-0 p-14 z-10">
          <h3 className="font-display text-3xl font-medium text-white leading-tight max-w-sm">
            Every case has a path forward.
          </h3>
          <p className="mt-3 text-blue-100/70 font-body text-[15px] leading-relaxed max-w-sm">
            Real-time case data, staff coordination, and program oversight, all from one secure command center.
          </p>

          <div className="mt-10 flex items-center gap-8 font-mono text-xs text-white/50">
            <div>
              <div className="text-white text-lg font-semibold font-body">1,204</div>
              active cases
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="text-white text-lg font-semibold font-body">48</div>
              states served
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="text-white text-lg font-semibold font-body">99.98%</div>
              uptime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}