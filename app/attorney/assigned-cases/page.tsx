import Link from 'next/link';

export const metadata = {
    title: 'Attorney Assigned Cases | Horizon Pathways',
    description: 'Assigned cases for attorneys to review and manage.',
};

export default function AttorneyAssignedCasesPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Attorney Assigned Cases</p>
                            <h1 className="mt-3 text-3xl font-black text-slate-900">Assigned cases</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                Review the cases assigned to you and take action on legal analysis, approvals, and case notes.
                            </p>
                        </div>
                        <Link href="/attorney" className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            Back to dashboard
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                            <p className="text-sm font-semibold text-slate-600">Upcoming review queue</p>
                            <p className="mt-3 text-lg font-bold text-slate-900">No cases assigned yet.</p>
                            <p className="mt-2 text-sm text-slate-600">Assigned cases will appear here when a client case is ready for attorney review.</p>
                        </div>
                        <div className="rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                            <p className="text-sm font-semibold text-slate-600">What to do next</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                <li>• Review client intake and supporting documents.</li>
                                <li>• Provide legal recommendations or request additional information.</li>
                                <li>• Approve each case when ready for submission.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
