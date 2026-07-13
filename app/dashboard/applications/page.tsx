import React from "react";

const applications = [
    {
        title: "Green Card Renewal / Replacement",
        subtitle: "Form I-90 with G-1145 e-Notification",
        status: "Active",
        progress: "In progress",
        nextStep: "Upload supporting documents",
    },
    {
        title: "Family-based Adjustment",
        subtitle: "Form I-130 and I-485",
        status: "Review",
        progress: "Evidence review",
        nextStep: "Respond to USCIS request",
    },
];

export default function DashboardApplicationsPage() {
    return (
        <div className="space-y-10">
            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">My Applications</p>
                <h1 className="mt-4 text-4xl font-black text-[#1B3A64]">Continue your application journey</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                    Review the status of your active applications, resume work where you left off, and access the next required action for each case.
                </p>
            </div>

            <div className="space-y-6">
                {applications.map((application) => (
                    <div key={application.title} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(61,68,101,0.08)]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-[#42526E]">{application.subtitle}</p>
                                <h2 className="mt-3 text-3xl font-black text-[#1B3A64]">{application.title}</h2>
                                <p className="mt-3 text-sm leading-7 text-[#5A6579]">Next step: {application.nextStep}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#047857]">{application.status}</span>
                                <span className="rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]">{application.progress}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[24px] bg-[#F8F6F3] p-5">
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5A6579]">Status overview</p>
                                <p className="mt-3 text-lg font-bold text-[#1B3A64]">{application.progress}</p>
                            </div>
                            <div className="rounded-[24px] bg-[#F8F6F3] p-5">
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5A6579]">Next action</p>
                                <p className="mt-3 text-lg font-bold text-[#1B3A64]">{application.nextStep}</p>
                            </div>
                            <div className="rounded-[24px] bg-[#F8F6F3] p-5">
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5A6579]">Support</p>
                                <p className="mt-3 text-lg font-bold text-[#1B3A64]">Chat with your case manager</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button className="inline-flex items-center justify-center rounded-full bg-[#1B3A64] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#172e52]">
                                Continue application
                            </button>
                            <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#1B3A64] transition hover:bg-slate-50">
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
