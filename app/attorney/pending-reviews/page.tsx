import Link from 'next/link';

export const metadata = {
    title: 'Attorney Pending Reviews | Horizon Pathways',
    description: 'Attorney reviews that are pending completion.',
};

export default function AttorneyPendingReviewsPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Pending Reviews</p>
                            <h1 className="mt-3 text-3xl font-black text-slate-900">Cases awaiting your review</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                See all cases that need attorney input, review documents, and complete pending legal tasks.
                            </p>
                        </div>
                        <Link href="/attorney" className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            Back to dashboard
                        </Link>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                            <p className="text-sm font-semibold text-slate-600">Review queue empty</p>
                            <p className="mt-3 text-lg font-bold text-slate-900">No pending reviews right now.</p>
                            <p className="mt-2 text-sm text-slate-600">Once a case is ready for attorney review it will appear here.</p>
                        </div>
                        <div className="rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                            <p className="text-sm font-semibold text-slate-600">Standard review workflow</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                <li>• Open the case details.</li>
                                <li>• Verify supporting documents and legal eligibility.</li>
                                <li>• Submit your review decision and comments.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
