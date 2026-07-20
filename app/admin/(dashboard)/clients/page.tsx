'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Client {
    id: number;
    name: string;
    email: string;
    role: string;
    applications: any[];
}

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        api.get('/api/admin/clients')
            .then(res => setClients(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Client Directory</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage client profiles, contact information, and account access.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No clients registered yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1B3A64] to-[#3B66A5] text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                    {getInitials(client.name)}
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E3755D] transition-colors">{client.name}</h3>
                            <div className="mt-4 space-y-2 flex-1">
                                <div className="flex items-center text-sm text-gray-600 font-medium">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    {client.email}
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{client.applications?.length || 0} Active {(client.applications?.length || 0) === 1 ? 'Case' : 'Cases'}</span>
                                <span className="text-sm font-bold text-[#E3755D] hover:text-[#C8634D] transition-colors">View Profile</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
