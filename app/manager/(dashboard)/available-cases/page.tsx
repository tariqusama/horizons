'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getManagerUnassignedCases, requestCaseAssignment, Application } from '@/lib/api/cases';

export default function AvailableCasesPage() {
    const { user } = useAuth();
    const [cases, setCases] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestingId, setRequestingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ title: '', description: '', type: 'success' });

    useEffect(() => {
        if (!user) return;
        loadCases();
    }, [user]);

    const loadCases = async () => {
        setIsLoading(true);
        try {
            const data = await getManagerUnassignedCases();
            setCases(data);
        } catch (err) {
            console.error('Failed to load available cases:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestAssignment = async (id: number) => {
        setRequestingId(id);
        try {
            await requestCaseAssignment(id);
            setModalMessage({
                title: 'Success!',
                description: 'Assignment requested successfully! Waiting for admin approval.',
                type: 'success'
            });
            setShowModal(true);
            // Update local state to show it as requested
            setCases(prev => prev.map(c => c.id === id ? { ...c, is_requested: true } : c));
        } catch (err: any) {
            console.error('Failed to request assignment:', err);
            setModalMessage({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to request assignment.',
                type: 'error'
            });
            setShowModal(true);
        } finally {
            setRequestingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Available Cases</h1>
                <p className="text-gray-500 mt-2 font-medium">Browse unassigned cases and request assignment to them.</p>
            </div>

            {cases.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-12 text-center">
                    <p className="text-gray-500 font-medium">No available cases at the moment. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((c) => (
                        <div key={c.id} className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 flex flex-col">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#F7F5F0] text-[#101F38] flex items-center justify-center font-bold">
                                        {c.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#101F38]">{c.user?.name || 'Unknown Client'}</p>
                                        <p className="text-xs text-gray-500">{c.user?.email}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Package</p>
                                    <p className="font-semibold text-gray-900">{c.title || c.service_type || 'Unknown'}</p>
                                </div>

                                <div className="mb-6">
                                    <p className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Submitted</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {new Date(c.created_at).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRequestAssignment(c.id)}
                                disabled={requestingId === c.id || c.is_requested}
                                className={`w-full font-bold py-2.5 px-4 rounded-xl transition-colors ${
                                    c.is_requested 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-b from-orange-500 to-orange-600 hover:bg-[#D1644C] text-white disabled:opacity-50'
                                }`}
                            >
                                {c.is_requested 
                                    ? 'Pending Approval' 
                                    : requestingId === c.id ? 'Requesting...' : 'Request Assignment'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl transform transition-all">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto ${modalMessage.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {modalMessage.type === 'success' ? (
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                            {modalMessage.title}
                        </h3>
                        <p className="text-center text-gray-500 mb-6">
                            {modalMessage.description}
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-[#101F38] hover:bg-[#1a2e51] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
