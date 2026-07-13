export default function DashboardCaseStatusPage() {
    const statusSteps = [
        { step: "Application received", description: "USCIS has accepted your Form I-130 and I-485 package.", complete: true },
        { step: "Biometrics scheduled", description: "Biometrics appointment booked for July 18, 2026.", complete: true },
        { step: "Evidence review", description: "Your documents are under attorney and USCIS review.", complete: false },
        { step: "Decision pending", description: "USCIS will issue a decision after reviewing all evidence.", complete: false },
    ];

    return (
        <div className="space-y-10">
            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Case status</p>
                <h1 className="mt-4 text-4xl font-black text-[#1B3A64]">Where your application stands</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                    See the latest progress on your immigration case, review upcoming milestones, and prepare the next documents USCIS will ask for.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[28px] border border-slate-200 bg-[#F8F6F3] p-6">
                        <p className="text-sm font-semibold text-[#5A6579]">Receipt number</p>
                        <p className="mt-3 text-2xl font-black text-[#1B3A64]">MSC-239-12345</p>
                    </div>
                    <div className="rounded-[28px] border border-slate-200 bg-[#F8F6F3] p-6">
                        <p className="text-sm font-semibold text-[#5A6579]">Current stage</p>
                        <p className="mt-3 text-2xl font-black text-[#1B3A64]">Evidence review</p>
                    </div>
                </div>
            </div>

            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <h2 className="text-2xl font-black text-[#1B3A64]">Progress timeline</h2>
                <div className="mt-8 space-y-6">
                    {statusSteps.map((item) => (
                        <div key={item.step} className="flex items-start gap-5 rounded-[28px] border border-slate-200 bg-[#FAF9F7] p-6">
                            <div className={`mt-1 h-4 w-4 rounded-full ${item.complete ? "bg-[#E3755D]" : "bg-slate-300"}`} />
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
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Expected next step</p>
                    <h3 className="mt-4 text-2xl font-black text-[#1B3A64]">Upload remaining evidence</h3>
                    <p className="mt-4 text-base leading-7 text-[#5A6579]">
                        USCIS is reviewing your proof of relationship and financial support. Submitting the final items now closes any gaps before the decision.
                    </p>
                    <ul className="mt-8 space-y-4 text-sm text-[#5A6579]">
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Certified translations for foreign language documents
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Updated employment verification and pay stubs
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Proof of residence and joint financial evidence
                        </li>
                    </ul>
                </div>

                <div className="rounded-[40px] bg-[#E3755D]/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Filing history</p>
                    <h3 className="mt-4 text-2xl font-black text-[#1B3A64]">USCIS receipts</h3>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-[#5A6579]">Form I-130</p>
                            <p className="mt-2 font-bold text-[#1B3A64]">Submitted April 13, 2026</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-[#5A6579]">Form I-485</p>
                            <p className="mt-2 font-bold text-[#1B3A64]">Submitted April 13, 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
