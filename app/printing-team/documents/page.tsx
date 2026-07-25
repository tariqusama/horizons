export const metadata = {
    title: 'Documents | Horizon Pathways',
    description: 'Printing team document review dashboard.',
};

export default function PrintingTeamDocumentsPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-black text-slate-900">Documents</h1>
                <p className="mt-3 text-sm text-slate-600">Manage printable documents and case packet preparation.</p>
            </div>
        </div>
    );
}
