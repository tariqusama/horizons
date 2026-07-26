'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function AdminCaseDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { user } = useAuth();

    const [caseData, setCaseData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ title: '', description: '', type: 'success' });
    const [managerNote, setManagerNote] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({ title: '', package_name: '', subtitle: '', amount: 0, paid_amount: 0, receipt_number: '', status: '', progress: '', next_step: '' });
    const [editFormJson, setEditFormJson] = useState<Record<string, any>>({});

    const getDocumentUrl = (path?: string | null) => {
        if (!path) return '#';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const stripped = path.replace(/^public\//, '');
        return `${BACKEND}/storage/${stripped}`;
    };

    useEffect(() => {
        if (!user || !id) return;

        const loadData = async () => {
            try {
                const resp = await api.get('/admin/applications');
                const allCases = resp.data as any[];
                const specificCase = allCases.find(c => c.id === Number(id));
                if (specificCase) {
                    setCaseData(specificCase);
                    setEditFormData({
                        title: specificCase.title || '',
                        package_name: specificCase.package_name || '',
                        subtitle: specificCase.subtitle || '',
                        amount: specificCase.amount || 0,
                        paid_amount: specificCase.paid_amount || 0,
                        receipt_number: specificCase.receipt_number || '',
                        status: specificCase.status || '',
                        progress: specificCase.progress || '',
                        next_step: specificCase.next_step || ''
                    });
                } else {
                    setCaseData(null);
                }
            } catch (err) {
                console.error('Failed to fetch admin case:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, id]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!caseData) return;
        setIsUpdating(true);
        try {
            const payload: any = { status: newStatus };
            if (managerNote.trim()) {
                const timeline = Array.isArray(caseData.timeline) ? [...caseData.timeline] : [];
                timeline.push({
                    id: 'note-' + Date.now(),
                    author: user?.email || 'Admin',
                    text: `Admin Note: ${managerNote}`,
                    created_at: new Date().toISOString()
                });
                payload.timeline = timeline;
            }

            const resp = await api.put(`/admin/applications/${caseData.id}`, payload);
            setCaseData(resp.data);
            setManagerNote('');

            setModalMessage({ title: 'Success!', description: `Case status updated to ${newStatus}.`, type: 'success' });
            setShowModal(true);
        } catch (err) {
            console.error('Failed to update case status (admin):', err);
            setModalMessage({ title: 'Error', description: 'Failed to update case status.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseData) return;
        setIsUpdating(true);
        try {
            const resp = await api.put(`/admin/applications/${caseData.id}`, editFormData);
            setCaseData(resp.data);
            setModalMessage({ title: 'Success!', description: 'Case details updated successfully.', type: 'success' });
            setShowModal(true);
            setShowEditModal(false);
        } catch (err) {
            console.error('Failed to update case details (admin):', err);
            setModalMessage({ title: 'Error', description: 'Failed to update case details.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseData) return;
        setIsUpdating(true);
        try {
            const resp = await api.put(`/admin/applications/${caseData.id}`, { form_data: editFormJson });
            setCaseData(resp.data);
            setModalMessage({ title: 'Success!', description: 'Form data updated successfully.', type: 'success' });
            setShowModal(true);
            setShowFormModal(false);
        } catch (err) {
            console.error('Failed to update form data:', err);
            setModalMessage({ title: 'Error', description: 'Failed to update form data.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto w-full h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="max-w-[1200px] mx-auto w-full py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Not Found</h2>
                <p className="text-gray-600 mb-8">This case does not exist.</p>
                <Link href="/admin/cases" className="text-orange-500 font-bold hover:underline">
                    &larr; Back to Cases
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="mb-6 flex items-center space-x-3 text-sm font-medium text-gray-500">
                <Link href="/admin/cases" className="hover:text-gray-900 transition-colors">Cases</Link>
                <span>/</span>
                <span className="text-gray-900">Case #{caseData.receipt_number || caseData.id}</span>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                        Review Case: #{caseData.receipt_number || caseData.id}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${caseData.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            caseData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                caseData.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {caseData.status}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Applicant: {caseData.user?.name} | {caseData.title}</p>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >
                    Edit Case
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Case & Applicant Information</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Case Name</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.title || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Package Name</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.package_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Plan Subtitle</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.subtitle || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Price</p>
                                <p className="text-sm font-semibold text-gray-900">${Number(caseData.amount || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Paid Amount</p>
                                <p className="text-sm font-semibold text-gray-900">${Number(caseData.paid_amount || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Submitted Date</p>
                                <p className="text-sm font-semibold text-gray-900">{new Date(caseData.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Receipt Number</p>
                                <p className="text-sm font-semibold text-gray-900">{caseData.receipt_number || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Submitted Documents</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{caseData.title} Form</p>
                                        <p className="text-xs text-gray-500">Filled digitally • {new Date(caseData.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    setEditFormJson(caseData.form_data || {});
                                    setShowFormModal(true);
                                }} className="text-sm font-bold text-orange-500 hover:underline">View</button>
                            </div>

                            {Array.isArray(caseData.documents) && caseData.documents.length > 0 ? (
                                caseData.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"></path><polyline points="17 2 17 8 23 8"></polyline></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {doc.file_path ? (
                                                <a href={getDocumentUrl(doc.file_path)} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Open</a>
                                            ) : (
                                                <span className="italic text-gray-400">No file uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">No documents uploaded.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-[100px]">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Review & Process</h2>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Admin Notes / Feedback</label>
                            <textarea
                                value={managerNote}
                                onChange={(e) => setManagerNote(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 min-h-[120px] resize-y"
                                placeholder="Add notes here..."
                            ></textarea>
                        </div>

                        {caseData.status !== 'Approved' && caseData.status !== 'Completed' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleUpdateStatus('Approved')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                                >
                                    {isUpdating ? 'Updating...' : 'Approve & Process Further'}
                                </button>

                                <button
                                    onClick={() => handleUpdateStatus('Under Review')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                                >
                                    Request Revisions
                                </button>

                                <button
                                    onClick={() => handleUpdateStatus('Denied')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                                >
                                    Reject Case
                                </button>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                Processing a case will notify the client and update the case status across the platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/60 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Edit Case Details</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Update package details, processing status, and financials.</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Package Information</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Case Name</label>
                                    <input type="text" required value={editFormData.title} onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Package Name</label>
                                    <input type="text" value={editFormData.package_name} onChange={e => setEditFormData({ ...editFormData, package_name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Subtotal</label>
                                        <input type="number" value={editFormData.amount} onChange={e => setEditFormData({ ...editFormData, amount: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Paid Amount</label>
                                        <input type="number" value={editFormData.paid_amount} onChange={e => setEditFormData({ ...editFormData, paid_amount: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Receipt Number</label>
                                    <input type="text" value={editFormData.receipt_number} onChange={e => setEditFormData({ ...editFormData, receipt_number: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Progress</label>
                                    <select value={editFormData.progress} onChange={e => setEditFormData({ ...editFormData, progress: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all">
                                        <option>Application received</option>
                                        <option>Biometrics scheduled</option>
                                        <option>Evidence review</option>
                                        <option>Decision pending</option>
                                        <option>Approved</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                                    <button type="submit" disabled={isUpdating} className="px-6 py-2 rounded-xl bg-orange-600 text-white font-bold">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/60 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{caseData.title} Form Data</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Review and update submitted questionnaire responses.</p>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
                        </div>
                        
                        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
                            {Object.keys(editFormJson).length === 0 ? (
                                <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">No Form Data</h4>
                                    <p className="text-gray-500 max-w-sm">There is no questionnaire data associated with this application yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(editFormJson).map(([key, val]) => (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{key}</label>
                                            {typeof val === 'object' && val !== null ? (
                                                <textarea
                                                    value={JSON.stringify(val, null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const parsed = JSON.parse(e.target.value);
                                                            setEditFormJson({ ...editFormJson, [key]: parsed });
                                                        } catch (err) {
                                                            setEditFormJson({ ...editFormJson, [key]: e.target.value });
                                                        }
                                                    }}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all min-h-[150px] font-mono text-xs"
                                                />
                                            ) : typeof val === 'string' && val.length > 50 ? (
                                                <textarea
                                                    value={val}
                                                    onChange={(e) => setEditFormJson({ ...editFormJson, [key]: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all min-h-[100px]"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={String(val)}
                                                    onChange={(e) => setEditFormJson({ ...editFormJson, [key]: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowFormModal(false)} className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                                {Object.keys(editFormJson).length > 0 && (
                                    <button type="submit" disabled={isUpdating} className="px-6 py-2 rounded-xl bg-orange-600 text-white font-bold">
                                        {isUpdating ? 'Saving...' : 'Save Form Data'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
