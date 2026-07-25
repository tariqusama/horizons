'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ActionItem {
    title: string;
    description: string;
    href: string;
    accent: string;
}

interface RoleDashboardProps {
    title: string;
    subtitle: string;
    roleName: string;
    actions: ActionItem[];
}

export default function RoleDashboard({ title, subtitle, roleName, actions }: RoleDashboardProps) {
    const { user } = useAuth();
    const displayName = user?.name?.split(' ')[0] || roleName;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px] space-y-6">
                <section className="grid gap-6">
                    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-10 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">{roleName} Portal</p>
                            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
                            <p className="mt-4 max-w-3xl text-sm md:text-base text-orange-50 leading-7">{subtitle}</p>
                        </div>
                        <div className="px-8 py-8">
                            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
                                <p className="text-sm font-semibold text-slate-600">Welcome back</p>
                                <p className="mt-3 text-3xl font-black text-slate-900">{displayName}</p>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    Your role-based dashboard is ready. Use the shortcuts below to move quickly through your daily work.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Quick Actions</p>
                                <h2 className="mt-3 text-xl font-bold text-slate-900">Your task shortcuts</h2>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {actions.map((action) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="rounded-3xl border border-[#ECE9E2] bg-slate-50 px-4 py-4 shadow-sm transition hover:border-orange-500/30 hover:shadow-md"
                                >
                                    <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${action.accent}`}>
                                        {roleName}
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-slate-900">{action.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8">
                            <h2 className="font-bold text-slate-900 text-lg mb-5">Recent Activity</h2>
                            <div className="space-y-6">
                                {actions.length === 0 ? (
                                    <div className="text-gray-500 text-sm">No recent activity.</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
