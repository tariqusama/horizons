import Link from 'next/link';

export const metadata = {
    title: 'Attorney Client Files | Horizon Pathways',
    description: 'Manage client files and supporting documents for attorney review.',
};

export default function AttorneyClientFilesPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Client Files</p>
                            <h1 className="mt-3 text-3xl font-black text-slate-900">Client documents</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                View uploaded client files and supporting materials needed for your legal review.
                            </p>
                        </div>
                        <Link href="/attorney" className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            Back to dashboard
                        </Link>
                    </div>

                    <div className="mt-8 rounded-3xl border border-[#ECE9E2] bg-slate-50 p-6">
                        <p className="text-sm font-semibold text-slate-600">No client files are ready yet.</p>
                        <p className="mt-3 text-sm text-slate-600">Uploaded documents will appear here for attorney review and verification.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
