export default function DashboardDocumentsPage() {
    const documentChecklist = [
        { name: "Passport photo page", status: "Uploaded", badge: "Complete" },
        { name: "Birth certificate", status: "Pending", badge: "Pending" },
        { name: "Proof of residency", status: "Uploaded", badge: "Complete" },
        { name: "Medical exam report", status: "Missing", badge: "Action required" },
        { name: "Affidavit of support", status: "Uploaded", badge: "Complete" },
    ];

    return (
        <div className="space-y-10">
            <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Documents</p>
                <h1 className="mt-4 text-4xl font-black text-[#1B3A64]">Upload and review files</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                    Keep your case moving by uploading documents early and checking the status of every required file.
                </p>

                <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200">
                    <div className="grid grid-cols-12 gap-4 bg-[#F8F6F3] px-6 py-4 text-sm font-semibold text-[#5A6579]">
                        <span className="col-span-7">Document</span>
                        <span className="col-span-3">Status</span>
                        <span className="col-span-2 text-right">Action</span>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                        {documentChecklist.map((item) => (
                            <div key={item.name} className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-[#5A6579]">
                                <div className="col-span-7">
                                    <p className="font-semibold text-[#1B3A64]">{item.name}</p>
                                    <p className="mt-1 text-sm">{item.status}</p>
                                </div>
                                <div className="col-span-3">
                                    <span className="inline-flex rounded-full bg-[#E3755D]/10 px-3 py-1 text-xs font-semibold text-[#1B3A64]">
                                        {item.badge}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right">
                                    {item.status !== "Uploaded" ? (
                                        <button className="rounded-full bg-[#E3755D] px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-[#C8634D]">
                                            Upload
                                        </button>
                                    ) : (
                                        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1B3A64] hover:bg-slate-50 transition-colors">
                                            Replace
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[40px] bg-[#E3755D]/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Upload reminders</p>
                    <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Documents still needed</h2>
                    <ul className="mt-6 space-y-4 text-sm leading-7 text-[#5A6579]">
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Medical exam report and vaccination records
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Certified translations for foreign language documents
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                            Proof of joint residence for spouse/petitioner
                        </li>
                    </ul>
                </div>

                <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Document tips</p>
                    <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Submit clean files the first time</h2>
                    <ul className="mt-6 space-y-4 text-sm text-[#5A6579]">
                        <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                            Use clear scans or photos with all text legible and edges visible.
                        </li>
                        <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                            Upload PDF, JPG, or PNG files under 10MB each for faster review.
                        </li>
                        <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                            Label every file with document type and client name before uploading.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
