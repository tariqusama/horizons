'use client';
import React, { useState, useEffect } from 'react';
import { getAuditLogs, AuditLog as ApiAuditLog } from '../../../../lib/api/audit';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    filter: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
    download: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

// API data

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<ApiAuditLog[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error('Failed to load audit logs', err);
        }
    };

    const filteredLogs = logs.filter(log => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (log.ip_address?.toLowerCase().includes(q) || log.user?.name.toLowerCase().includes(q) || log.action.toLowerCase().includes(q));
    });

    const pageCount = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount);
        }
    }, [pageCount, page]);

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Audit Logs</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Review detailed system events, user actions, and security alerts for compliance.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-[#ECE9E2] hover:border-[#101F38] text-[#101F38] px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm w-fit">
                    <Icon.download width={16} height={16} />
                    Export Logs (CSV)
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm flex flex-col h-[calc(100vh-220px)] overflow-hidden">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-[#ECE9E2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F9F8F6]">
                    <div className="relative w-full sm:max-w-md">
                        <Icon.search width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B7B4AA]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by IP, user, or action..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ECE9E2] bg-white text-sm text-[#101F38] placeholder-[#B7B4AA] outline-none focus:border-[#E3755D] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#ECE9E2] bg-white text-[#5B6472] hover:text-[#101F38] hover:border-[#101F38] transition-colors text-sm font-bold shadow-sm">
                            <Icon.filter width={14} height={14} />
                            Filter Options
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-[#1E1E1E]">
                    <table className="w-full text-left border-collapse font-mono text-sm">
                        <thead className="sticky top-0 bg-[#2D2D2D] z-10 shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">Timestamp (UTC)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">User / Service</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">Action Event</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">Target Resource</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">IP Address</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#404040]">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D2D2D]">
                            {pageLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-[#252525] transition-colors">
                                    <td className="px-6 py-3 text-[#B0B0B0]">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-3 text-[#64B5F6]">{log.user?.name || 'System'}</td>
                                    <td className="px-6 py-3 text-[#FFB74D] font-bold">{log.action}</td>
                                    <td className="px-6 py-3 text-[#E0E0E0]">{log.target || 'System'}</td>
                                    <td className="px-6 py-3 text-[#9CCC65]">{log.ip_address || '127.0.0.1'}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1B5E20] text-[#A5D6A7]`}>
                                            Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-3 border-t border-[#404040] bg-[#1E1E1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#A0A0A0] font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#A5D6A7]"></div> System Healthy</span>
                        <span>Log Level: <span className="text-[#E0E0E0]">ALL</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Showing {pageLogs.length ? startIndex + 1 : 0} - {startIndex + pageLogs.length} of {filteredLogs.length} records</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-[#2D2D2D] text-[#5A5A5A]' : 'bg-[#1B1B1B] text-white hover:bg-[#333333]'}`}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                                disabled={page === pageCount}
                                className={`px-3 py-1 rounded-md ${page === pageCount ? 'bg-[#2D2D2D] text-[#5A5A5A]' : 'bg-[#1B1B1B] text-white hover:bg-[#333333]'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
