'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getManagerAssignedCases, Application, updateApplication, getServices, Service } from '@/lib/api/cases';

export default function CaseReviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { user } = useAuth();
    const [caseData, setCaseData] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApprovingCase, setIsApprovingCase] = useState(false);
    const [isDenyingCase, setIsDenyingCase] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ title: '', description: '', type: 'success' });
    const [managerNote, setManagerNote] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editFormData, setEditFormData] = useState({ title: '', package_name: '', subtitle: '', amount: 0, paid_amount: 0, receipt_number: '', status: '', progress: '', next_step: '' });
    const [servicesList, setServicesList] = useState<Service[]>([]);

    // Revision request modal state
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionNote, setRevisionNote] = useState('');

    useEffect(() => {
        if (!user || !id) return;

        const loadData = async () => {
            try {
                const [allCases, servicesRes] = await Promise.all([
                    getManagerAssignedCases(),
                    getServices()
                ]);
                setServicesList(servicesRes);
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
                console.error('Failed to fetch case:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, id]);

    const handleApprove = async () => {
        if (!caseData) return;
        setIsApprovingCase(true);
        try {
            const payload: any = { status: 'Approved' };
            if (managerNote.trim()) {
                const timeline = Array.isArray(caseData.timeline) ? [...caseData.timeline] : [];
                timeline.push({ id: 'note-' + Date.now(), author: user?.email || 'Manager', text: `Manager Note: ${managerNote}`, created_at: new Date().toISOString() });
                payload.timeline = timeline;
            }
            const updatedCase = await updateApplication(caseData.id, payload);
            setCaseData(updatedCase);
            setManagerNote('');
            setModalMessage({ title: 'Success!', description: 'Case approved successfully!', type: 'success' });
            setShowModal(true);
        } catch (err) {
            console.error('Failed to approve case:', err);
            setModalMessage({ title: 'Error', description: 'Failed to approve case.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsApprovingCase(false);
        }
    };

    const handleDeny = async () => {
        if (!caseData) return;
        setIsDenyingCase(true);
        try {
            const payload: any = { status: 'Denied' };
            if (managerNote.trim()) {
                const timeline = Array.isArray(caseData.timeline) ? [...caseData.timeline] : [];
                timeline.push({ id: 'note-' + Date.now(), author: user?.email || 'Manager', text: `Manager Note: ${managerNote}`, created_at: new Date().toISOString() });
                payload.timeline = timeline;
            }
            const updatedCase = await updateApplication(caseData.id, payload);
            setCaseData(updatedCase);
            setManagerNote('');
            setModalMessage({ title: 'Case Rejected', description: 'Case has been rejected.', type: 'error' });
            setShowModal(true);
        } catch (err) {
            console.error('Failed to deny case:', err);
            setModalMessage({ title: 'Error', description: 'Failed to reject case.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsDenyingCase(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!caseData) return;
        setIsUpdating(true);
        try {
            const payload: any = { status: newStatus };
            if (managerNote.trim()) {
                const timeline = Array.isArray(caseData.timeline) ? [...caseData.timeline] : [];
                timeline.push({
                    id: 'note-' + Date.now(),
                    author: user?.email || 'Manager',
                    text: `Manager Note: ${managerNote}`,
                    created_at: new Date().toISOString()
                });
                payload.timeline = timeline;
            }
            
            const updatedCase = await updateApplication(caseData.id, payload);
            setCaseData(updatedCase);
            setManagerNote('');
            
            let message = `Case status updated to ${newStatus}.`;
            if (newStatus === 'Approved') message = 'Case approved successfully!';
            if (newStatus === 'Denied') message = 'Case rejected.';

            setModalMessage({ title: 'Success!', description: message, type: 'success' });
            setShowModal(true);
        } catch (err) {
            console.error('Failed to update case status:', err);
            setModalMessage({ title: 'Error', description: 'Failed to update case status.', type: 'error' });
            setShowModal(true);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubmitRevision = async () => {
        if (!caseData) return;
        if (!revisionNote.trim()) {
            alert('Please describe what revisions are needed before submitting.');
            return;
        }
        setIsUpdating(true);
        try {
            const timeline = Array.isArray(caseData.timeline) ? [...caseData.timeline] : [];
            timeline.push({
                id: 'revision-' + Date.now(),
                author: user?.email || 'Manager',
                text: `Revision Requested: ${revisionNote}`,
                created_at: new Date().toISOString()
            });
            const updatedCase = await updateApplication(caseData.id, {
                status: 'Under Review',
                timeline
            });
            setCaseData(updatedCase);
            setRevisionNote('');
            setShowRevisionModal(false);
            setModalMessage({
                title: 'Revision Requested',
                description: 'The client has been notified that revisions are needed. Case status set to Under Review.',
                type: 'success'
            });
            setShowModal(true);
        } catch (err) {
            console.error('Failed to request revision:', err);
            setModalMessage({ title: 'Error', description: 'Failed to send revision request.', type: 'error' });
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
            const updatedCase = await updateApplication(caseData.id, editFormData);
            setCaseData(updatedCase);
            setModalMessage({ title: 'Success!', description: 'Case details updated successfully.', type: 'success' });
            setShowModal(true);
            setShowEditModal(false);
        } catch (err) {
            console.error('Failed to update case details:', err);
            setModalMessage({ title: 'Error', description: 'Failed to update case details.', type: 'error' });
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
                <p className="text-gray-600 mb-8">This case does not exist or is not assigned to you.</p>
                <Link href="/manager/assigned-cases" className="text-orange-500 font-bold hover:underline">
                    &larr; Back to Assigned Cases
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Header / Breadcrumbs */}
            <div className="mb-6 flex items-center space-x-3 text-sm font-medium text-gray-500">
                <Link href="/manager/assigned-cases" className="hover:text-gray-900 transition-colors">Assigned Cases</Link>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Details & Documents */}
                <div className="lg:col-span-2 space-y-8" style={{position: 'relative', zIndex: 1}}>

                    {/* Case Details */}
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

                    {/* Submitted Documents */}
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
                                <button onClick={() => setShowFormModal(true)} className="text-sm font-bold text-orange-500 hover:underline">View</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Processing Workflow */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Review & Process</h2>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Manager Notes / Feedback</label>
                            <textarea
                                value={managerNote}
                                onChange={(e) => setManagerNote(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 min-h-[120px] resize-y"
                                placeholder="Add notes here. If requesting revisions, detail exactly what the client needs to fix..."
                            ></textarea>
                        </div>

                        {caseData.status !== 'Approved' && caseData.status !== 'Completed' && (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>

                                {/* ── Approve ── */}
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={isApprovingCase}
                                    style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: isApprovingCase ? '#86efac' : '#16a34a', color: 'white', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: isApprovingCase ? 'not-allowed' : 'pointer'}}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    {isApprovingCase ? 'Approving...' : 'Approve & Process Further'}
                                </button>

                                {/* ── Request Revisions ── */}
                                <button
                                    type="button"
                                    onClick={() => setShowRevisionModal(true)}
                                    style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#111827', color: 'white', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer'}}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Request Revisions
                                </button>

                                {/* ── Reject ── */}
                                <button
                                    type="button"
                                    onClick={handleDeny}
                                    disabled={isDenyingCase}
                                    style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'white', color: '#dc2626', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid #fecaca', cursor: isDenyingCase ? 'not-allowed' : 'pointer'}}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                    {isDenyingCase ? 'Rejecting...' : 'Reject Case'}
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

            {/* ── Revision Request Modal ── */}
            {showRevisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827] text-base">Request Revisions</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Describe what changes the client needs to make</p>
                            </div>
                            <button
                                onClick={() => { setShowRevisionModal(false); setRevisionNote(''); }}
                                className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#111827] mb-2">
                                    Revision Instructions <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={revisionNote}
                                    onChange={e => setRevisionNote(e.target.value)}
                                    rows={5}
                                    placeholder="Describe the specific changes the client needs to make. For example:&#10;• Passport copy is missing — please re-upload a clearer scan&#10;• Birth certificate translation is incomplete&#10;• Affidavit of support signature is missing"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-slate-400 mt-1">{revisionNote.length} characters</p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <p className="text-xs text-amber-700">
                                    Submitting this will set the case status to <strong>Under Review</strong> and add a revision note visible to the client and admin.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => { setShowRevisionModal(false); setRevisionNote(''); }}
                                disabled={isUpdating}
                                className="flex-1 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitRevision}
                                disabled={isUpdating || !revisionNote.trim()}
                                className="flex-1 bg-[#111827] hover:bg-gray-800 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {isUpdating ? (
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                )}
                                {isUpdating ? 'Sending...' : 'Send Revision Request'}
                            </button>
                        </div>
                    </div>
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

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/60 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Edit Case Details</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Update package details, processing status, and financials.</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                            
                            {/* Section 1: Package Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Package Information</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Case Name</label>
                                    <input type="text" required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Package Name</label>
                                    <select 
                                        required 
                                        value={editFormData.package_name || ''} 
                                        onChange={e => {
                                            const newPackage = e.target.value;
                                            const matchedService = servicesList.find(s => s.name === newPackage);
                                            setEditFormData({
                                                ...editFormData, 
                                                package_name: newPackage,
                                                ...(matchedService ? { 
                                                    amount: Number(matchedService.price),
                                                    subtitle: matchedService.tier ? `Plan: ${matchedService.tier} Plan` : (matchedService.description || '')
                                                } : {})
                                            });
                                        }} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    >
                                        <option value="" disabled>Select a package...</option>
                                        {servicesList.map(service => (
                                            <option key={service.id} value={service.name}>{service.name} (${Number(service.price).toFixed(2)})</option>
                                        ))}
                                        {/* Allow keeping existing package if it doesn't match a service */}
                                        {!servicesList.find(s => s.name === editFormData.package_name) && editFormData.package_name && (
                                            <option value={editFormData.package_name}>{editFormData.package_name} (Custom)</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Plan Subtitle</label>
                                    <input type="text" value={editFormData.subtitle} onChange={e => setEditFormData({...editFormData, subtitle: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                </div>
                            </div>

                            {/* Section 2: Processing Status */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Processing Status</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Receipt Number</label>
                                        <input type="text" value={editFormData.receipt_number} onChange={e => setEditFormData({...editFormData, receipt_number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Current Status</label>
                                        <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all">
                                            <option value="Pending">Pending</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Denied">Denied</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Progress (%)</label>
                                        <input type="text" value={editFormData.progress} onChange={e => setEditFormData({...editFormData, progress: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Next Step</label>
                                        <input type="text" value={editFormData.next_step} onChange={e => setEditFormData({...editFormData, next_step: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Financials */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Financials</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Total Price ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input type="number" step="0.01" required value={editFormData.amount} onChange={e => setEditFormData({...editFormData, amount: parseFloat(e.target.value) || 0})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-8 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Paid Amount ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input type="number" step="0.01" required value={editFormData.paid_amount} onChange={e => setEditFormData({...editFormData, paid_amount: parseFloat(e.target.value) || 0})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-8 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition-all shadow-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUpdating} className="flex-1 bg-[#101F38] hover:bg-[#1a2e51] text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                    {isUpdating ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/60 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{caseData.title} Form</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Submitted on {new Date(caseData.created_at).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">No Form Data Available</h4>
                            <p className="text-gray-500 max-w-sm">The digital form viewer is currently under development. Detailed form inputs will be displayed here soon.</p>
                            <button onClick={() => setShowFormModal(false)} className="mt-6 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
