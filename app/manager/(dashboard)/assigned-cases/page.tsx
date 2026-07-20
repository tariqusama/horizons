'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    getManagerAssignedCases,
    updateApplication,
    getManagerMessages,
    sendManagerMessage,
    getManagerDocuments,
    requestManagerDocuments,
    escalateApplication,
    Application,
} from '@/lib/api/cases';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    user: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M6 20a6 6 0 0 1 12 0" /></svg>,
    fileText: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>,
    folder: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
    checklist: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M4 12h10" /><path d="M4 17h16" /><path d="M8 6v2" /><path d="M8 11v2" /><path d="M8 16v2" /></svg>,
    clock: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v9l3 3" /><circle cx="12" cy="12" r="9" /></svg>,
    card: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    plus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    edit: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
    trash: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    alert: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    paperclip: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.41 17.41a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" /></svg>,
    send: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    x: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

const ACTIONS = [
    {
        label: 'View client profile',
        description: 'Personal details, contact info, and account information',
        icon: Icon.user,
        iconBg: '#E6F1FB',
        iconColor: '#185FA5',
    },
    {
        label: 'View submitted intake information',
        description: 'All answers the client submitted in their intake form',
        icon: Icon.fileText,
        iconBg: '#EAF3DE',
        iconColor: '#3B6D11',
    },
    {
        label: 'View uploaded supporting documents',
        description: 'Every document the client uploaded for their case',
        icon: Icon.folder,
        iconBg: '#FAEEDA',
        iconColor: '#BA7517',
    },
    {
        label: 'Required documents checklist',
        description: "See what's required for the client's service and what's still pending",
        icon: Icon.checklist,
        iconBg: '#FDEFE4',
        iconColor: '#C97B3D',
    },
    {
        label: 'View case timeline & status',
        description: "Track the client's progress through each stage",
        icon: Icon.clock,
        iconBg: '#EEEDFE',
        iconColor: '#534AB7',
    },
    {
        label: 'View payment & service details',
        description: 'Purchased services, invoices, and payment history',
        icon: Icon.card,
        iconBg: '#FCEBEB',
        iconColor: '#A32D2D',
    },
];

const TABS = ['Internal Case Notes', 'Messaging', 'Document Checklist', 'Request Additional Documents', 'Escalate to Super Admin'] as const;
type TabLabel = (typeof TABS)[number];

const ESCALATION_REASONS = ['Legal complexity', 'Client request', 'Missing critical documents', 'Approaching deadline', 'Other'];

type ChatMessage = { id: string; from: 'staff' | 'client'; text: string; createdAt: string };
type DocRequest = { id: string; documents: string; note: string; createdAt: string };

export default function AssignedCasesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [cases, setCases] = useState<Application[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabLabel>('Internal Case Notes');
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');

    // Messaging (UI-only until a messaging API is wired up)
    const [conversations, setConversations] = useState<{ id: string; email: string; messages: ChatMessage[] }[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messageDraft, setMessageDraft] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    // Request additional documents (UI-only until an API is wired up)
    const [docRequests, setDocRequests] = useState<DocRequest[]>([]);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [docsNeeded, setDocsNeeded] = useState('');
    const [docNote, setDocNote] = useState('');
    const [isSendingDocRequest, setIsSendingDocRequest] = useState(false);

    // Escalation (UI-only until an API is wired up)
    const [isReasonOpen, setIsReasonOpen] = useState(false);
    const [escalationReason, setEscalationReason] = useState('');
    const [isEscalating, setIsEscalating] = useState(false);

    const selectedCase = useMemo(
        () => cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? null,
        [cases, selectedCaseId]
    );

    const selectedCaseTimeline = Array.isArray(selectedCase?.timeline) ? selectedCase.timeline : [];
    const notes = selectedCaseTimeline;

    const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null;

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                const myCases = await getManagerAssignedCases();
                setCases(myCases);
            } catch (err) {
                console.error('Failed to fetch assigned cases:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    useEffect(() => {
        if (!selectedCaseId && cases.length > 0) {
            setSelectedCaseId(cases[0].id);
        }
    }, [cases, selectedCaseId]);

    useEffect(() => {
        const param = searchParams?.get?.('caseId');
        if (param && cases.length > 0) {
            const id = Number(param);
            if (!Number.isNaN(id)) {
                const exists = cases.some((c) => c.id === id);
                if (exists) setSelectedCaseId(id);
            }
        }
    }, [searchParams, cases]);

    // Handle filter from URL
    useEffect(() => {
        const filterParam = searchParams?.get?.('filter') as 'all' | 'urgent' | 'high' | 'medium' | 'low' | null;
        if (filterParam && ['all', 'urgent', 'high', 'medium', 'low'].includes(filterParam)) {
            setActiveFilter(filterParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!selectedCase) return;

        const loadWorkspaceData = async () => {
            try {
                const [messages, documents] = await Promise.all([
                    getManagerMessages(selectedCase.id),
                    getManagerDocuments(selectedCase.id),
                ]);

                const mappedMessages: ChatMessage[] = messages.map((message) => {
                    const from = message.is_admin ? 'staff' : 'client';
                    return {
                        id: String(message.id),
                        from,
                        text: message.message,
                        createdAt: message.created_at,
                    };
                });

                setConversations([
                    { id: `${selectedCase.id}-client`, email: selectedCase.user?.email || 'client@email.com', messages: mappedMessages },
                ]);
                setActiveConversationId(`${selectedCase.id}-client`);
                setDocRequests(documents.map((document) => ({
                    id: String(document.id),
                    documents: document.name,
                    note: document.status,
                    createdAt: document.created_at,
                })));
            } catch (err) {
                console.error('Failed to load workspace data:', err);
            }
        };

        loadWorkspaceData();
        setEscalationReason('');
    }, [selectedCase?.id]);

    const handleAddNote = async () => {
        if (!selectedCase || !newNote.trim()) return;

        setIsSavingNote(true);
        const nextNote = {
            id: `${selectedCase.id}-${Date.now()}`,
            author: user?.email || 'Internal Staff',
            text: newNote.trim(),
            created_at: new Date().toISOString(),
        };

        const updatedTimeline = [...selectedCaseTimeline, nextNote];

        try {
            const updatedCase = await updateApplication(selectedCase.id, {
                timeline: updatedTimeline,
            });

            setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
            setNewNote('');
        } catch (err) {
            console.error('Unable to save note:', err);
            alert('Unable to save internal note. Please try again.');
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedCase || !activeConversation || !messageDraft.trim()) return;

        setIsSendingMessage(true);
        try {
            const savedMessage = await sendManagerMessage(selectedCase.id, messageDraft.trim());
            const message: ChatMessage = {
                id: String(savedMessage.id),
                from: 'staff',
                text: savedMessage.message,
                createdAt: savedMessage.created_at,
            };
            setConversations((prev) =>
                prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: [...c.messages, message] } : c))
            );
            setMessageDraft('');
        } catch (err) {
            console.error('Unable to send message:', err);
            alert('Unable to send message. Please try again.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSendDocRequest = async () => {
        if (!selectedCase || !docsNeeded.trim()) return;

        setIsSendingDocRequest(true);
        try {
            await requestManagerDocuments(selectedCase.id, docsNeeded.trim(), docNote.trim());
            const newRequest: DocRequest = {
                id: `${Date.now()}`,
                documents: docsNeeded.trim(),
                note: docNote.trim(),
                createdAt: new Date().toISOString(),
            };
            setDocRequests((prev) => [newRequest, ...prev]);
            setDocsNeeded('');
            setDocNote('');
            setIsDocModalOpen(false);
        } catch (err) {
            console.error('Unable to request documents:', err);
            alert('Unable to send document request. Please try again.');
        } finally {
            setIsSendingDocRequest(false);
        }
    };

    const handleEscalate = async () => {
        if (!selectedCase || !escalationReason.trim()) return;

        setIsEscalating(true);
        try {
            await escalateApplication(selectedCase.id, escalationReason.trim());
            alert('Escalation submitted successfully.');
            setEscalationReason('');
        } catch (err) {
            console.error('Unable to escalate case:', err);
            alert('Unable to submit escalation. Please try again.');
        } finally {
            setIsEscalating(false);
        }
    };

    const handleFilterChange = (filter: 'all' | 'urgent' | 'high' | 'medium' | 'low') => {
        setActiveFilter(filter);
        if (filter === 'all') {
            router.push('?');
        } else {
            router.push(`?filter=${filter}`);
        }
    };

    const filteredCases = cases.filter((c) => {
        // Filter by search query
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (c.user?.name || '').toLowerCase().includes(q) || (c.user?.email || '').toLowerCase().includes(q);

        // Filter by priority
        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;

        const priority = c.priority?.toLowerCase() || 'medium';
        return priority === activeFilter;
    });

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto w-full h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3755D]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Filter buttons */}
            <div className="rounded-full border border-[#ECE9E2] bg-white shadow-sm p-1.5 mb-6 flex flex-wrap gap-1">
                {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((filter) => {
                    const labels: Record<typeof filter, string> = {
                        all: 'All Cases',
                        urgent: 'Urgent',
                        high: 'High Priority',
                        medium: 'Medium Priority',
                        low: 'Low Priority',
                    };
                    const colors: Record<typeof filter, { bg: string; text: string }> = {
                        all: { bg: '#101F38', text: '#FFFFFF' },
                        urgent: { bg: '#E24B4A', text: '#FFFFFF' },
                        high: { bg: '#E3755D', text: '#FFFFFF' },
                        medium: { bg: '#BA7517', text: '#FFFFFF' },
                        low: { bg: '#3B6D11', text: '#FFFFFF' },
                    };

                    return (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => handleFilterChange(filter)}
                            style={{
                                backgroundColor: activeFilter === filter ? colors[filter].bg : '#F7F5F0',
                                color: activeFilter === filter ? colors[filter].text : '#5B6472',
                            }}
                            className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
                        >
                            {labels[filter]}
                        </button>
                    );
                })}
            </div>

            {/* Client header + case switcher */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A8F98] font-semibold mb-1">Client</p>
                    <p className="text-base font-bold text-[#101F38]">{selectedCase?.user?.email || 'No client selected'}</p>
                    <p className="text-xs text-[#5B6472] font-medium">{selectedCase?.user?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-2.5">
                        <Icon.search width={15} height={15} className="text-[#8A8F98] shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cases..."
                            className="bg-transparent border-none outline-none text-sm text-[#101F38] placeholder:text-[#8A8F98] w-40"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={selectedCase?.id ?? ''}
                            onChange={(e) => setSelectedCaseId(Number(e.target.value))}
                            className="appearance-none rounded-full border border-[#ECE9E2] bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-[#101F38] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 cursor-pointer"
                        >
                            {filteredCases.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.user?.email || `Case #${c.id}`}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8A8F98]">
                            <Icon.chevronDown width={14} height={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {ACTIONS.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                        <button
                            key={action.label}
                            type="button"
                            className="flex items-center gap-4 rounded-3xl border border-[#ECE9E2] bg-white p-5 text-left shadow-sm hover:border-[#E3755D] transition-colors"
                        >
                            <span
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: action.iconBg, color: action.iconColor }}
                            >
                                <ActionIcon width={20} height={20} />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-[#101F38]">{action.label}</p>
                                <p className="text-xs text-[#5B6472] font-medium mt-0.5">{action.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="rounded-full border border-[#ECE9E2] bg-white shadow-sm p-1.5 mb-6 flex flex-wrap gap-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-[#101F38] text-white shadow-sm' : 'text-[#5B6472] hover:text-[#101F38]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab panel */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 lg:p-8">
                {activeTab === 'Internal Case Notes' && (
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h2 className="text-lg font-bold text-[#101F38]">Internal Case Notes</h2>
                            <button
                                type="button"
                                onClick={handleAddNote}
                                disabled={isSavingNote || !newNote.trim()}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE9E2] bg-white px-4 py-2 text-sm font-semibold text-[#101F38] hover:bg-[#F7F5F0] transition-colors disabled:opacity-50"
                            >
                                <Icon.plus width={14} height={14} />
                                Add Note
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            {notes.map((note: any) => (
                                <div key={note.id} className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] p-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm text-[#101F38]">{note.text}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-[#5B6472] font-medium mt-2">
                                                <Icon.clock width={13} height={13} className="text-[#E3755D]" />
                                                {new Date(note.created_at).toLocaleString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                            <p className="text-xs text-[#8A8F98] font-medium mt-0.5">by {note.author}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE9E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#101F38] hover:bg-[#F7F5F0] transition-colors">
                                                <Icon.edit width={12} height={12} />
                                                Edit
                                            </button>
                                            <button className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE9E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#A32D2D] hover:bg-[#FCEBEB] transition-colors">
                                                <Icon.trash width={12} height={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-start gap-2 rounded-2xl border border-[#F0D9CE] bg-[#FBF1EA] px-4 py-3 mb-6">
                            <Icon.alert width={15} height={15} className="text-[#E3755D] shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-[#BA5A3E]">Keep notes visible only to internal staff (not the client)</span>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#101F38] mb-2">Write a new internal note</label>
                            <textarea
                                value={newNote}
                                onChange={(event) => setNewNote(event.target.value)}
                                rows={4}
                                className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none transition focus:border-[#E3755D] focus:bg-white"
                                placeholder="Add a note for internal staff review..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'Messaging' && (
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Messages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 border-t border-[#ECE9E2] pt-4">
                            <div className="space-y-2">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        type="button"
                                        onClick={() => setActiveConversationId(conv.id)}
                                        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${activeConversation?.id === conv.id ? 'border-[#E3755D] bg-[#FBF1EA]' : 'border-[#ECE9E2] bg-white hover:bg-[#F7F5F0]'
                                            }`}
                                    >
                                        <span className="w-8 h-8 rounded-full bg-[#FAEEDA] text-[#BA7517] font-bold text-xs flex items-center justify-center shrink-0">
                                            {conv.email.charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[#101F38] truncate">{conv.email}</p>
                                            <p className="text-[11px] text-[#8A8F98] font-medium">Recent conversation</p>
                                        </div>
                                    </button>
                                ))}
                                {conversations.length === 0 && (
                                    <p className="text-xs text-[#8A8F98] font-medium px-1">No conversations yet.</p>
                                )}
                            </div>

                            <div className="flex flex-col rounded-2xl border border-[#ECE9E2] bg-white">
                                <div className="flex-1 min-h-[240px] p-4 space-y-3">
                                    {(activeConversation?.messages ?? []).length === 0 && (
                                        <p className="text-xs text-[#8A8F98] font-medium text-center pt-16">No messages yet. Start the conversation below.</p>
                                    )}
                                    {(activeConversation?.messages ?? []).map((m) => (
                                        <div key={m.id} className="inline-block max-w-[70%] rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-2.5">
                                            <p className="text-sm text-[#101F38]">{m.text}</p>
                                            <p className="text-[10px] text-[#8A8F98] font-medium mt-1">
                                                {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 border-t border-[#ECE9E2] p-3">
                                    <input
                                        type="text"
                                        value={messageDraft}
                                        onChange={(e) => setMessageDraft(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-[#F7F5F0] rounded-full border border-[#ECE9E2] px-4 py-2.5 text-sm text-[#101F38] outline-none focus:border-[#E3755D]"
                                    />
                                    <button className="text-[#8A8F98] hover:text-[#101F38] transition-colors shrink-0 p-2">
                                        <Icon.paperclip width={17} height={17} />
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageDraft.trim() || isSendingMessage}
                                        className="w-9 h-9 rounded-full bg-[#E3755D] text-white flex items-center justify-center shrink-0 hover:bg-[#D1644C] transition-colors disabled:opacity-50"
                                    >
                                        {isSendingMessage ? <span className="text-xs">…</span> : <Icon.send width={15} height={15} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Document Checklist' && (
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Required Documents Checklist</h2>
                        <p className="text-sm text-[#5B6472] font-medium mb-6">Application Type: {selectedCase?.service_type || 'Not specified'}</p>

                        <div className="space-y-6">
                            {/* Spouse Abroad Checklist */}
                            <div className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-base font-bold text-[#101F38]">Application for Spouse Abroad</h3>
                                        <p className="text-xs text-[#5B6472] font-medium mt-1">Form I-130 + I-130A</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3755D] text-white px-3 py-1 text-xs font-bold">
                                        17 Documents
                                    </span>
                                </div>

                                <p className="text-xs text-[#5B6472] font-medium mb-4">Forms Required: G-1145, I-130, I-130A</p>

                                <div className="space-y-4">
                                    {/* Petitioner Documents */}
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-xs">1</span>
                                            Petitioner Documents
                                        </p>
                                        <div className="space-y-2 pl-7">
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Proof of U.S. citizenship OR green card (front and back)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Government-issued photo ID (passport, driver's license, etc.)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Beneficiary Documents */}
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-xs">2</span>
                                            Beneficiary (Spouse) Documents
                                        </p>
                                        <div className="space-y-2 pl-7">
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Birth certificate (certified translation if not in English)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Passport biographic page</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Marriage & Relationship Evidence */}
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-xs">3</span>
                                            Marriage & Relationship Evidence
                                        </p>
                                        <div className="space-y-2 pl-7">
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Marriage certificate (original or certified copy)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Proof of termination of all prior marriages (if applicable)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Optional</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Photos together over time, labeled with dates/locations</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold mt-1">Required</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Birth certificates of children born to the marriage (if any)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Optional</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* At Least 5 of Following */}
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-xs">4</span>
                                            At Least Five (5) of the Following
                                        </p>
                                        <div className="space-y-2 pl-7">
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Proof of ongoing relationship (money transfers, shared accounts, etc.)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Wedding souvenir / invitation</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Wedding rings and/or wedding venue booking receipts</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Insurance policies naming each other (health, life)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Notarized affidavits from family/friends (at least 2 letters)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Travel records (flight itineraries, boarding passes, hotel bookings)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Social media evidence (posts, comments, tagged photos)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Correspondence (emails, chats, SMS, call records)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Pick 5+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Documents */}
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#E3755D] text-white flex items-center justify-center text-xs">5</span>
                                            Any Other Additional Documents
                                        </p>
                                        <div className="space-y-2 pl-7">
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#ECE9E2] accent-[#E3755D]" defaultChecked={false} />
                                                <div>
                                                    <p className="text-sm text-[#101F38]">Marriage certificate, divorce decree, adoption decree, or court order for name changes (if applicable)</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mt-1">Optional</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Request Additional Documents' && (
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#101F38]">Additional Documents</h2>
                                <p className="text-xs text-[#5B6472] font-medium mt-0.5">Requests for {selectedCase?.user?.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDocModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE9E2] bg-white px-4 py-2 text-sm font-semibold text-[#101F38] hover:bg-[#F7F5F0] transition-colors shrink-0"
                            >
                                <Icon.plus width={14} height={14} />
                                Request Additional Document
                            </button>
                        </div>

                        {docRequests.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#ECE9E2] py-16 text-center">
                                <p className="text-sm text-[#8A8F98] font-medium">No document requests yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {docRequests.map((req) => (
                                    <div key={req.id} className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] p-5">
                                        <p className="text-sm font-semibold text-[#101F38] whitespace-pre-wrap">{req.documents}</p>
                                        {req.note && <p className="text-xs text-[#5B6472] font-medium mt-2">{req.note}</p>}
                                        <p className="text-[11px] text-[#8A8F98] font-medium mt-2">
                                            {new Date(req.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isDocModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="text-base font-bold text-[#101F38]">Request Additional Documents</h3>
                                        <button onClick={() => setIsDocModalOpen(false)} className="text-[#8A8F98] hover:text-[#101F38] transition-colors">
                                            <Icon.x width={18} height={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#5B6472] font-medium mb-5">
                                        List the documents you need from {selectedCase?.user?.email}. They will be notified.
                                    </p>

                                    <label className="block text-xs font-semibold text-[#101F38] mb-2">Documents needed</label>
                                    <textarea
                                        value={docsNeeded}
                                        onChange={(e) => setDocsNeeded(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-[#E3755D] bg-white px-3 py-2.5 text-sm text-[#101F38] outline-none focus:ring-2 focus:ring-[#E3755D]/30 mb-4"
                                        placeholder="e.g. Updated passport copy, proof of address"
                                    />

                                    <label className="block text-xs font-semibold text-[#101F38] mb-2">Note (optional)</label>
                                    <textarea
                                        value={docNote}
                                        onChange={(e) => setDocNote(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-xl border border-[#ECE9E2] bg-white px-3 py-2.5 text-sm text-[#101F38] outline-none focus:border-[#E3755D] mb-6"
                                        placeholder="Add any extra context for the client"
                                    />

                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => setIsDocModalOpen(false)}
                                            className="text-sm font-semibold text-[#5B6472] px-4 py-2 hover:text-[#101F38] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendDocRequest}
                                            disabled={!docsNeeded.trim() || isSendingDocRequest}
                                            className="rounded-full bg-[#E3755D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#D1644C] transition-colors disabled:opacity-50"
                                        >
                                            {isSendingDocRequest ? 'Sending...' : 'Send request'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Escalate to Super Admin' && (
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Escalate To Super Admin</h2>
                        <div className="border-t border-[#ECE9E2] pt-6">
                            <div className="relative max-w-md">
                                <button
                                    type="button"
                                    onClick={() => setIsReasonOpen((v) => !v)}
                                    className="w-full flex items-center justify-between rounded-xl border border-[#E3755D] bg-white px-4 py-3 text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30"
                                >
                                    <span className={escalationReason ? 'text-[#101F38] font-medium' : 'text-[#8A8F98]'}>
                                        {escalationReason || 'Select reason for escalation.'}
                                    </span>
                                    <Icon.chevronDown width={15} height={15} className="text-[#8A8F98] shrink-0" />
                                </button>

                                {isReasonOpen && (
                                    <div className="absolute z-10 mt-1 w-full rounded-xl border border-[#ECE9E2] bg-white shadow-lg overflow-hidden">
                                        <button
                                            onClick={() => {
                                                setEscalationReason('');
                                                setIsReasonOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm bg-[#F7F5F0] text-[#5B6472] font-medium"
                                        >
                                            Select reason for escalation.
                                        </button>
                                        {ESCALATION_REASONS.map((reason) => (
                                            <button
                                                key={reason}
                                                onClick={() => {
                                                    setEscalationReason(reason);
                                                    setIsReasonOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-[#185FA5] font-medium hover:bg-[#F7F5F0] transition-colors"
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {escalationReason && (
                                <button
                                    onClick={handleEscalate}
                                    disabled={isEscalating}
                                    className="mt-6 rounded-full bg-[#E3755D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#D1644C] transition-colors disabled:opacity-50"
                                >
                                    {isEscalating ? 'Submitting...' : 'Submit escalation'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}