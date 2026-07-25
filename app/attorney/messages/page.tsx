import Link from 'next/link';

export const metadata = {
    title: 'Attorney Messages | Horizon Pathways',
    description: 'Secure attorney messaging with clients and case staff.',
};

export default function AttorneyMessagesPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Attorney Messages</p>
                            <h1 className="mt-3 text-3xl font-black text-slate-900">Secure conversations</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                Communicate securely with case managers and clients about case updates, document requests, and review outcomes.
                            </p>
                        </div>
                        <Link href="/attorney" className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            Back to dashboard
                        </Link>
                    </div>

                    <div className="mt-8 rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                        <p className="text-sm font-semibold text-slate-600">Messages will appear here once you receive them.</p>
                        <p className="mt-3 text-sm text-slate-600">Use the inbox to stay up to date on client questions and review requests.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
