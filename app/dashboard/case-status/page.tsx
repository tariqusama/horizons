'use client';
import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const getApplicationStatusBadge = (status?: string) => {
    const normalized = (status || '').toString().trim().toLowerCase();

    if (['approved', 'approved by admin', 'approved by uscis'].includes(normalized)) {
        return { label: 'Approved', classes: 'bg-emerald-100 text-emerald-700' };
    }

    if (['denied', 'rejected', 'declined'].includes(normalized)) {
        return { label: 'Denied', classes: 'bg-rose-100 text-rose-700' };
    }

    if (['submitted', 'completed', 'review', 'in review', 'under review'].includes(normalized)) {
        return { label: 'In Review', classes: 'bg-sky-100 text-sky-700' };
    }

    if (['pending', 'in progress', 'active', 'processing'].includes(normalized)) {
        return { label: 'In Progress', classes: 'bg-amber-100 text-amber-700' };
    }

    return { label: status || 'Pending', classes: 'bg-slate-100 text-slate-600' };
};

export default function DashboardCaseStatusPage() {
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setApplication(res.data[0]); // Just pick the first active one for now
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div className="p-10">Loading case status...</div>;
    }

    if (!application) {
        return <div className="p-10">No active cases found.</div>;
    }

    const statusSteps = application.timeline || [];
    const statusBadge = getApplicationStatusBadge(application.status);

    return (
        <div className="space-y-10">
            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Case status</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-black text-[#1B3A64]">Where your application stands</h1>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusBadge.classes}`}>
                        {statusBadge.label}
                    </span>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                    See the latest progress on your immigration case, review upcoming milestones, and prepare the next documents USCIS will ask for.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[28px] border border-slate-200 bg-[#F8F6F3] p-6">
                        <p className="text-sm font-semibold text-[#5A6579]">Receipt number</p>
                        <p className="mt-3 text-2xl font-black text-[#1B3A64]">{application.receipt_number || 'N/A'}</p>
                    </div>
                    <div className="rounded-[28px] border border-slate-200 bg-[#F8F6F3] p-6">
                        <p className="text-sm font-semibold text-[#5A6579]">Current stage</p>
                        <p className="mt-3 text-2xl font-black text-[#1B3A64]">{application.status || application.progress}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <h2 className="text-2xl font-black text-[#1B3A64]">Progress timeline</h2>
                <div className="mt-8 space-y-6">
                    {statusSteps.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-5 rounded-[28px] border border-slate-200 bg-[#FAF9F7] p-6">
                            <div className={`mt-1 h-4 w-4 rounded-full ${item.complete ? "bg-gradient-to-b from-orange-500 to-orange-600" : "bg-slate-300"}`} />
                            <div>
                                <p className="text-lg font-semibold text-[#1B3A64]">{item.step}</p>
                                <p className="mt-2 text-sm leading-7 text-[#5A6579]">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Expected next step</p>
                    <h3 className="mt-4 text-2xl font-black text-[#1B3A64]">{application.next_step}</h3>
                    <p className="mt-4 text-base leading-7 text-[#5A6579]">
                        USCIS is reviewing your proof of relationship and financial support. Submitting the final items now closes any gaps before the decision.
                    </p>
                    <ul className="mt-8 space-y-4 text-sm text-[#5A6579]">
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
                            Certified translations for foreign language documents
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
                            Updated employment verification and pay stubs
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
                            Proof of residence and joint financial evidence
                        </li>
                    </ul>
                </div>

                <div className="rounded-[40px] bg-gradient-to-b from-orange-500 to-orange-600/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Filing history</p>
                    <h3 className="mt-4 text-2xl font-black text-[#1B3A64]">USCIS receipts</h3>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-[#5A6579]">{application.title}</p>
                            <p className="mt-2 font-bold text-[#1B3A64]">Submitted on {new Date(application.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
