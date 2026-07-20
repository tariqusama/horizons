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
    user: {
        name: string;
    };
}

export default function AdminCasesPage() {
    const [cases, setCases] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCases = () => {
        setIsLoading(true);
        api.get('/admin/applications')
            .then(res => setCases(res.data))
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
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.title}</td>
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
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[#E3755D] hover:text-[#C8634D] font-bold text-sm cursor-pointer transition-colors">View Details</span>
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
