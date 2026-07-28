'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Application {
    id: number;
    title: string;
    status: string;
    progress: string;
    receipt_number: string;
    created_at: string;
    is_escalated?: boolean;
    user: {
        name: string;
    };
    manager?: {
        name: string;
    } | null;
}

export default function AdminCasesPage() {
    const [cases, setCases] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCases = () => {
        setIsLoading(true);
        api.get('/admin/applications')
            .then(res => setCases(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await api.put(`/admin/applications/${id}`, { progress: newStatus });
            fetchCases();
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    const resolveEscalation = async (id: number) => {
        try {
            await api.put(`/admin/applications/${id}`, { is_escalated: false });
            fetchCases();
        } catch (error) {
            console.error('Failed to resolve escalation', error);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Case Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Track, manage, and update all client cases in one place.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading cases...</td></tr>
                            ) : cases.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No cases found.</td></tr>
                            ) : cases.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{c.receipt_number || `APP-${c.id}`}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">{c.user.name}</p>
                                        {c.is_escalated && (
                                            <span className="inline-flex mt-1 items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                                ESCALATED
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.title}</td>
                                    <td className="px-6 py-4">
                                        {c.manager ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                                {c.manager.name}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={c.progress}
                                            onChange={(e) => updateStatus(c.id, e.target.value)}
                                            className="text-xs font-bold bg-blue-50 text-blue-800 rounded-md p-1 border-0 focus:ring-0"
                                        >
                                            <option value="Application received">Application received</option>
                                            <option value="Biometrics scheduled">Biometrics scheduled</option>
                                            <option value="Evidence review">Evidence review</option>
                                            <option value="Decision pending">Decision pending</option>
                                            <option value="Approved">Approved</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right space-y-2">
                                        <Link href={`/admin/cases/${c.id}`} className="block">
                                            <span className="text-orange-500 hover:text-orange-600 font-bold text-sm cursor-pointer transition-colors">View Details</span>
                                        </Link>
                                        {c.is_escalated && (
                                            <button
                                                onClick={() => resolveEscalation(c.id)}
                                                className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors w-full"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
