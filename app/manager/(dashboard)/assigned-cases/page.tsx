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
    DocumentPayload,
    getChecklists,
    getFormSchema,
} from '@/lib/api/cases';
import { getStorageUrl } from '@/lib/api';
import { getChecklistKeyFromService, forceDownload } from '@/lib/utils/documentHelper';

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

type ChatMessage = { id: string; from: 'staff' | 'client'; text: string; createdAt: string; attachmentPath?: string };
type DocRequest = { id: string; documents: string; note: string; createdAt: string };
type ChecklistDocument = { name: string; required: boolean };
type ChecklistSection = { title: string; documents: ChecklistDocument[] };
type ChecklistData = { id: string; title: string; forms: string[]; totalDocuments: number; sections: ChecklistSection[] };
type ChecklistKey = string;

export default function AssignedCasesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [cases, setCases] = useState<Application[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<DocumentPayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checklistsData, setChecklistsData] = useState<Record<string, any>>({});
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Request additional documents (UI-only until an API is wired up)
    const [docRequests, setDocRequests] = useState<DocRequest[]>([]);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [showEscalationSuccessModal, setShowEscalationSuccessModal] = useState(false);
    const [docsNeeded, setDocsNeeded] = useState('');
    const [docNote, setDocNote] = useState('');
    const [isSendingDocRequest, setIsSendingDocRequest] = useState(false);
    const [selectedActionInfo, setSelectedActionInfo] = useState<string | null>(null);
    const [checkedDocuments, setCheckedDocuments] = useState<Record<string, boolean>>({});

    // Escalation (UI-only until an API is wired up)
    const [isReasonOpen, setIsReasonOpen] = useState(false);
    const [escalationReason, setEscalationReason] = useState('');
    const [escalationMessage, setEscalationMessage] = useState('');
    const [isEscalating, setIsEscalating] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [caseFormSchema, setCaseFormSchema] = useState<any>(null);

    const selectedCase = useMemo(
        () => cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? null,
        [cases, selectedCaseId]
    );

    const selectedCaseTimeline = Array.isArray(selectedCase?.timeline) ? selectedCase.timeline : [];
    const notes = Array.isArray(selectedCase?.internal_notes) ? selectedCase.internal_notes : [];

    const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null;

    // getChecklistKeyFromService is now imported from @/lib/utils/documentHelper

    const currentChecklistKey = useMemo<ChecklistKey | null>(() => {
        const serviceText = `${selectedCase?.title || ''} ${selectedCase?.service_type || ''}`;
        return getChecklistKeyFromService(serviceText);
    }, [selectedCase?.title, selectedCase?.service_type]);

    const currentChecklist = currentChecklistKey ? checklistsData[currentChecklistKey] : null;
    const applicationTypeLabel = currentChecklist?.title || selectedCase?.service_type || 'Not specified';

    useEffect(() => {
        if (!selectedCase || !currentChecklist) {
            setCheckedDocuments({});
            return;
        }

        const storageKey = `manager-checklist-${selectedCase.id}`;
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setCheckedDocuments(JSON.parse(stored));
                return;
            }
        } catch (error) {
            console.warn('Unable to read checklist state from localStorage', error);
        }

        const initialState: Record<string, boolean> = {};
        currentChecklist.sections.forEach((section: any) => {
            section.documents.forEach((document: any) => {
                initialState[document.name] = false;
            });
        });

        setCheckedDocuments(initialState);
    }, [selectedCase?.id, currentChecklist]);

    useEffect(() => {
        if (!selectedCase) return;
        const storageKey = `manager-checklist-${selectedCase.id}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify(checkedDocuments));
        } catch (error) {
            console.warn('Unable to save checklist state to localStorage', error);
        }
    }, [selectedCase?.id, checkedDocuments]);

    const toggleChecklistItem = (documentName: string) => {
        setCheckedDocuments((current) => ({
            ...current,
            [documentName]: !current[documentName],
        }));
    };

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                const [myCases, checks] = await Promise.all([
                    getManagerAssignedCases(),
                    getChecklists()
                ]);
                setCases(myCases);
                setChecklistsData(checks);
            } catch (err) {
                console.error('Failed to fetch assigned cases or checklists:', err);
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
                
                if (selectedCase.form_slug) {
                    try {
                        const schema = await getFormSchema(selectedCase.form_slug);
                        setCaseFormSchema(schema);
                    } catch (err) {
                        console.error('Failed to load form schema:', err);
                        setCaseFormSchema(null);
                    }
                } else {
                    setCaseFormSchema(null);
                }

                const mappedMessages: ChatMessage[] = messages.map((message) => {
                    const from = message.is_admin ? 'staff' : 'client';
                    return {
                        id: String(message.id),
                        from,
                        text: message.message,
                        createdAt: message.created_at,
                        attachmentPath: message.attachment_path,
                    };
                });

                setConversations([
                    { id: `${selectedCase.id}-client`, email: selectedCase.user?.email || 'client@email.com', messages: mappedMessages },
                ]);
                setUploadedDocuments(documents);
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

        const updatedNotes = [...notes, nextNote];

        try {
            const updatedCase = await updateApplication(selectedCase.id, {
                internal_notes: updatedNotes,
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
        if (!selectedCase || !activeConversation || (!messageDraft.trim() && !selectedFile)) return;

        setIsSendingMessage(true);
        try {
            const savedMessage = await sendManagerMessage(selectedCase.id, messageDraft.trim(), selectedFile);
            const message: ChatMessage = {
                id: String(savedMessage.id),
                from: 'staff',
                text: savedMessage.message,
                createdAt: savedMessage.created_at,
                attachmentPath: savedMessage.attachment_path,
            };
            setConversations((prev) =>
                prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: [...c.messages, message] } : c))
            );
            setMessageDraft('');
            setSelectedFile(null);
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

        if (!selectedCase || !escalationReason) return;
        setIsEscalating(true);
        try {
            await escalateApplication(selectedCase.id, escalationReason);
            setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? { ...c, is_escalated: true } : c)));
            setShowEscalationSuccessModal(true);
            setEscalationReason('');
            setEscalationMessage('');
        } catch (err) {
            console.error('Failed to escalate case:', err);
            alert('Unable to escalate case. Please try again.');
        } finally {
            setIsEscalating(false);
        }
    };

    const handleResolveEscalation = async () => {
        if (!selectedCase) return;
        setIsResolving(true);
        try {
            const updatedCase = await updateApplication(selectedCase.id, { is_escalated: false });
            setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
        } catch (err) {
            console.error('Failed to resolve escalation:', err);
            alert('Unable to resolve escalation. Please try again.');
        } finally {
            setIsResolving(false);
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Filter buttons */}
            <div className="rounded-2xl sm:rounded-full border border-[#ECE9E2] bg-white shadow-sm p-1.5 mb-6 flex flex-wrap gap-1">
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
                        high: { bg: '#f97316', text: '#FFFFFF' },
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
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A8F98] font-semibold mb-1">Client</p>
                        <div className="flex items-center gap-2">
                            <p className="text-base font-bold text-[#101F38]">{selectedCase?.user?.name || 'No client selected'}</p>
                            {selectedCase?.is_escalated && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E24B4A]/10 px-2 py-0.5 text-xs font-semibold text-[#E24B4A]">
                                    <Icon.alert width={12} height={12} />
                                    Escalated to Super Admin
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[#5B6472] font-medium">{selectedCase?.user?.email}</p>
                    </div>

                    {selectedCase && (
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A8F98] font-semibold mb-1">Current Package</p>
                            <p className="text-sm font-bold text-[#101F38]">{selectedCase.title || selectedCase.service_type || 'Unknown Package'}</p>
                            <p className="text-xs text-[#5B6472] font-medium mt-0.5">
                                Price: <span className="font-semibold">${Number(selectedCase.amount || 0).toFixed(2)}</span>
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 rounded-full border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-2.5 w-full sm:w-auto">
                        <Icon.search width={15} height={15} className="text-[#8A8F98] shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cases..."
                            className="bg-transparent border-none outline-none text-sm text-[#101F38] placeholder:text-[#8A8F98] w-full sm:w-40"
                        />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={selectedCase?.id ?? ''}
                            onChange={(e) => setSelectedCaseId(Number(e.target.value))}
                            className="w-full appearance-none rounded-full border border-[#ECE9E2] bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-[#101F38] focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
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
                            onClick={() => setSelectedActionInfo(action.label)}
                            className="flex items-center gap-4 rounded-3xl border border-[#ECE9E2] bg-white p-5 text-left shadow-sm hover:border-orange-500 transition-colors"
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
            <div className="rounded-2xl sm:rounded-full border border-[#ECE9E2] bg-white shadow-sm p-1.5 mb-6 flex flex-wrap gap-1">
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
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-4 sm:p-6 lg:p-8">
                {activeTab === 'Internal Case Notes' && (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                                            <p className="text-sm text-[#101F38]">{note.text || 'Invalid note data'}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-[#5B6472] font-medium mt-2">
                                                <Icon.clock width={13} height={13} className="text-orange-500" />
                                                {note.created_at ? new Date(note.created_at).toLocaleString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                }) : 'Unknown date'}
                                            </div>
                                            <p className="text-xs text-[#8A8F98] font-medium mt-0.5">by {note.author || 'Unknown author'}</p>
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
                            <Icon.alert width={15} height={15} className="text-orange-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-[#BA5A3E]">Keep notes visible only to internal staff (not the client)</span>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#101F38] mb-2">Write a new internal note</label>
                            <textarea
                                value={newNote}
                                onChange={(event) => setNewNote(event.target.value)}
                                rows={4}
                                className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none transition focus:border-orange-500 focus:bg-white"
                                placeholder="Add a note for internal staff review..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'Messaging' && (
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Messages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 border-t border-[#ECE9E2] pt-4">
                            <div className="space-y-2 max-h-[180px] md:max-h-none overflow-y-auto pr-1 md:pr-0">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        type="button"
                                        onClick={() => setActiveConversationId(conv.id)}
                                        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${activeConversation?.id === conv.id ? 'border-orange-500 bg-[#FBF1EA]' : 'border-[#ECE9E2] bg-white hover:bg-[#F7F5F0]'
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

                            <div className="flex flex-col rounded-2xl border border-[#ECE9E2] bg-white overflow-hidden">
                                <div className="flex-1 min-h-[240px] p-4 space-y-3">
                                    {(activeConversation?.messages ?? []).length === 0 && (
                                        <p className="text-xs text-[#8A8F98] font-medium text-center pt-16">No messages yet. Start the conversation below.</p>
                                    )}
                                    {(activeConversation?.messages ?? []).map((m) => (
                                        <div key={m.id} className={`flex w-full ${m.from === 'staff' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`inline-block max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 ${m.from === 'staff' ? 'bg-orange-500 text-white rounded-br-sm' : 'border border-[#ECE9E2] bg-[#F7F5F0] text-[#101F38] rounded-bl-sm'}`}>
                                                <div className={`text-[10px] mb-1 font-semibold opacity-70 ${m.from === 'staff' ? 'text-white' : 'text-[#5B6472]'}`}>
                                                    {m.from === 'staff' ? 'Manager' : 'Client'}
                                                </div>
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {m.text.split(/\[Attachment:\s*(.+?)\]/g).map((part, i) => {
                                                        if (i % 2 === 0) {
                                                            return part ? <span key={i}>{part}</span> : null;
                                                        } else {
                                                            const filename = part;
                                                            return (
                                                                <a key={i} href={m.attachmentPath ? getStorageUrl(m.attachmentPath) : '#'} target={m.attachmentPath ? "_blank" : "_self"} download={m.attachmentPath ? filename : undefined} onClick={(e) => { if (!m.attachmentPath) { e.preventDefault(); alert('Downloading ' + filename); } }} className={`mt-1.5 flex items-center gap-2 rounded-lg p-2.5 text-sm font-medium transition-colors border max-w-full ${m.from === 'staff' ? 'bg-orange-600/20 border-orange-400 hover:bg-orange-600/30 text-white' : 'bg-white border-[#ECE9E2] hover:bg-gray-50 text-[#101F38]'}`}>
                                                                    <Icon.fileText width={16} height={16} className={m.from === 'staff' ? 'text-orange-200 shrink-0' : 'text-orange-500 shrink-0'} />
                                                                    <span className="truncate">{filename}</span>
                                                                </a>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                                <p className={`text-[10px] font-medium mt-1 ${m.from === 'staff' ? 'text-orange-200' : 'text-[#8A8F98]'}`}>
                                                    {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                </p>
                                            </div>
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
                                        className="flex-1 min-w-0 bg-[#F7F5F0] rounded-full border border-[#ECE9E2] px-4 py-2.5 text-sm text-[#101F38] outline-none focus:border-orange-500"
                                    />
                                    <input 
                                        type="file" 
                                        id="file-upload-assigned" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSelectedFile(e.target.files[0]);
                                                setMessageDraft(prev => prev + (prev ? ' ' : '') + `[Attachment: ${e.target.files![0].name}] `);
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => document.getElementById('file-upload-assigned')?.click()}
                                        className="text-[#8A8F98] hover:text-[#101F38] transition-colors shrink-0 p-2 relative"
                                    >
                                        <Icon.paperclip width={17} height={17} />
                                        {selectedFile && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 border border-white"></span>}
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={(!messageDraft.trim() && !selectedFile) || isSendingMessage}
                                        className="w-9 h-9 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white flex items-center justify-center shrink-0 hover:bg-[#D1644C] transition-colors disabled:opacity-50"
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
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[#101F38] mb-2">Required Documents Checklist</h2>
                                <p className="text-sm text-[#5B6472] font-medium">Application Type: {applicationTypeLabel}</p>
                            </div>
                            {currentChecklist && (
                                <div className="rounded-full bg-[#F7F5F0] px-4 py-2 text-sm font-semibold text-[#101F38]">
                                    {Object.values(checkedDocuments).filter(Boolean).length} of {currentChecklist.sections.reduce((total: any, section: any) => total + section.documents.length, 0)} items completed
                                </div>
                            )}
                        </div>

                        {currentChecklist ? (
                            <>
                                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#ECE9E2]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
                                        style={{
                                            width: `${currentChecklist.sections.length ? Math.round((Object.values(checkedDocuments).filter(Boolean).length / currentChecklist.sections.reduce((total: any, section: any) => total + section.documents.length, 0)) * 100) : 0}%`,
                                        }}
                                    />
                                </div>

                                <div className="space-y-6">
                                    {currentChecklist.sections.map((section: any, sectionIndex: number) => (
                                        <div key={section.title} className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] p-6">
                                            <div className="mb-4">
                                                <p className="text-sm font-bold text-[#101F38] mb-2 flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white flex items-center justify-center text-xs">{sectionIndex + 1}</span>
                                                    {section.title}
                                                </p>
                                                <p className="text-xs text-[#5B6472]">{section.documents.filter((doc: any) => doc.required).length} required • {section.documents.filter((doc: any) => !doc.required).length} optional</p>
                                            </div>

                                            <div className="space-y-3 pl-4">
                                                {section.documents.map((document: any) => {
                                                    const checked = Boolean(checkedDocuments[document.name]);
                                                    return (
                                                        <label key={document.name} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-3xl border border-transparent bg-white px-4 py-3 shadow-sm transition hover:border-[#ECE9E2]">
                                                            <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1 min-w-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => toggleChecklistItem(document.name)}
                                                                    className="mt-1 h-4 w-4 shrink-0 rounded border-[#ECE9E2] accent-[#E3755D]"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm text-[#101F38] break-words">{document.name}</p>
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${document.required ? 'bg-[#E24B4A]/10 text-[#E24B4A]' : 'bg-gray-100 text-gray-600'}`}>
                                                                        {document.required ? 'Required' : 'Optional'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {(() => {
                                                                const isMatch = (reqName: string, docName: string) => {
                                                                    if (!docName) return false;
                                                                    const r = reqName.toLowerCase().replace(/[^a-z0-9]/g, '');
                                                                    const d = docName.toLowerCase().replace(/[^a-z0-9]/g, '');
                                                                    return r.includes(d) || d.includes(r) || (r.includes('greencard') && d.includes('permanentresident')) || (r.includes('photo') && d.includes('photo')) || (r.includes('statement') && d.includes('statement'));
                                                                };
                                                                const uploadedMatch = uploadedDocuments.find(d => isMatch(document.name, d.name) && d.file_path);
                                                                if (uploadedMatch) {
                                                                    return (
                                                                        <a href={getStorageUrl(uploadedMatch.file_path)} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors relative z-10" onClick={(e) => e.stopPropagation()}>
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                                            Preview
                                                                        </a>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
                                <p className="text-sm text-orange-700 font-medium mb-2">Unable to load a document checklist for this application type.</p>
                                <p className="text-sm text-[#5B6472]">If this package is not recognized, confirm the service type with the client or use the full manager checklist library.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Request Additional Documents' && (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                                        className="w-full rounded-xl border border-orange-500 bg-white px-3 py-2.5 text-sm text-[#101F38] outline-none focus:ring-2 focus:ring-orange-500/30 mb-4"
                                        placeholder="e.g. Updated passport copy, proof of address"
                                    />

                                    <label className="block text-xs font-semibold text-[#101F38] mb-2">Note (optional)</label>
                                    <textarea
                                        value={docNote}
                                        onChange={(e) => setDocNote(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-xl border border-[#ECE9E2] bg-white px-3 py-2.5 text-sm text-[#101F38] outline-none focus:border-orange-500 mb-6"
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
                                            className="rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-[#D1644C] transition-colors disabled:opacity-50"
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
                        {selectedCase?.is_escalated ? (
                            <div className="bg-[#FDFCFB] rounded-2xl border border-orange-500/30 p-6 max-w-2xl">
                                <h2 className="text-xl font-black text-[#101F38] mb-2 flex items-center gap-2">
                                    <Icon.alert width={20} height={20} className="text-orange-500" />
                                    Escalation is Active
                                </h2>
                                <p className="text-sm font-medium text-[#5B6472] mb-6">
                                    This case has been escalated to a Super Admin for review. Once the issue has been addressed and you are ready to resume standard processing, you can resolve the escalation status below.
                                </p>
                                <button
                                    onClick={handleResolveEscalation}
                                    disabled={isResolving}
                                    className="rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-[#D1644C] transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {isResolving ? 'Resolving...' : 'Resolve Escalation'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-[#101F38] mb-4">Escalate To Super Admin</h2>
                                <div className="border-t border-[#ECE9E2] pt-6">
                                    <div className="relative max-w-md">
                                        <button
                                            type="button"
                                            onClick={() => setIsReasonOpen((v) => !v)}
                                            className="w-full flex items-center justify-between rounded-xl border border-orange-500 bg-white px-4 py-3 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-500/30"
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

                                    <div className="mt-4 max-w-md">
                                        <label className="block text-xs font-semibold text-[#101F38] mb-2">Message (Optional)</label>
                                        <textarea
                                            value={escalationMessage}
                                            onChange={(e) => setEscalationMessage(e.target.value)}
                                            rows={4}
                                            className="w-full rounded-xl border border-[#ECE9E2] bg-white px-3 py-2.5 text-sm text-[#101F38] outline-none focus:border-orange-500"
                                            placeholder="Explain exactly what happened..."
                                        />
                                    </div>

                                    {escalationReason && (
                                        <button
                                            onClick={handleEscalate}
                                            disabled={isEscalating}
                                            className="mt-6 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-[#D1644C] transition-colors disabled:opacity-50"
                                        >
                                            {isEscalating ? 'Escalating...' : 'Submit Escalation'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {showEscalationSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            backgroundColor: '#e2f5e9', color: '#16a34a',
                            width: '64px', height: '64px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Escalation Submitted!</h3>
                        <p style={{ color: '#6B7280', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            The escalation has been successfully submitted to the Super Admin team.
                        </p>
                        <button
                            onClick={() => setShowEscalationSuccessModal(false)}
                            style={{
                                backgroundColor: '#1E40AF', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {selectedActionInfo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.70) 100%)', backdropFilter: 'blur(18px)' }}
                >
                    {/* Modal card */}
                    <div
                        className="relative w-full max-w-2xl overflow-hidden"
                        style={{
                            borderRadius: '28px',
                            background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 32px 80px rgba(15,23,42,0.28), 0 0 0 1px rgba(255,255,255,0.6) inset',
                            animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both'
                        }}
                    >
                        <style>{`
                            @keyframes modalPop {
                                from { opacity: 0; transform: scale(0.88) translateY(24px); }
                                to   { opacity: 1; transform: scale(1) translateY(0); }
                            }
                            @keyframes shimmer {
                                0%   { background-position: -200% center; }
                                100% { background-position:  200% center; }
                            }
                            @keyframes pulseRing {
                                0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.45); }
                                50%      { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
                            }
                            .modal-info-card {
                                transition: transform 0.2s ease, box-shadow 0.2s ease;
                            }
                            .modal-info-card:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 12px 32px rgba(15,23,42,0.10);
                            }
                        `}</style>

                        {/* Animated gradient header bar */}
                        <div style={{
                            height: '5px',
                            background: 'linear-gradient(90deg, #f97316, #fb923c, #fdba74, #fb923c, #f97316)',
                            backgroundSize: '200% auto',
                            animation: 'shimmer 3s linear infinite'
                        }} />

                        {/* Decorative orbs */}
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedActionInfo(null)}
                            aria-label="Close modal"
                            style={{
                                position: 'absolute', top: '18px', right: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '38px', height: '38px', borderRadius: '50%',
                                background: 'rgba(241,245,249,0.9)',
                                border: '1px solid rgba(226,232,240,0.8)',
                                color: '#64748b', cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(15,23,42,0.08)'
                            }}
                            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; (e.currentTarget as HTMLButtonElement).style.color = '#0f172a'; (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(90deg)'; }}
                            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(241,245,249,0.9)'; (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)'; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="max-h-[85vh] overflow-y-auto hide-scrollbar" style={{ padding: '36px 40px 32px' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '32px' }}>
                                <div style={{
                                    flexShrink: 0, width: '60px', height: '60px', borderRadius: '18px',
                                    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ea580c', animation: 'pulseRing 2.4s ease-in-out infinite',
                                    boxShadow: '0 4px 16px rgba(249,115,22,0.18), 0 0 0 1px rgba(249,115,22,0.12)'
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z" />
                                        <path d="M6 20c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{selectedActionInfo}</h3>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Quick access to the most important details for this case.</p>
                                </div>
                            </div>

                            {selectedActionInfo === 'View client profile' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name card */}
                                    <div className="modal-info-card" style={{
                                        borderRadius: '18px', padding: '20px',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        border: '1px solid rgba(226,232,240,0.8)',
                                        boxShadow: '0 2px 12px rgba(15,23,42,0.06)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                                </svg>
                                            </span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>Name</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{selectedCase?.user?.name || 'N/A'}</p>
                                    </div>
                                    {/* Email card */}
                                    <div className="modal-info-card" style={{
                                        borderRadius: '18px', padding: '20px',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        border: '1px solid rgba(226,232,240,0.8)',
                                        boxShadow: '0 2px 12px rgba(15,23,42,0.06)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                                </svg>
                                            </span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>Email</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>{selectedCase?.user?.email || 'N/A'}</p>
                                    </div>
                                    {/* Phone card */}
                                    <div className="modal-info-card sm:col-span-2" style={{
                                        borderRadius: '18px', padding: '20px',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        border: '1px solid rgba(226,232,240,0.8)',
                                        boxShadow: '0 2px 12px rgba(15,23,42,0.06)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                                </svg>
                                            </span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>Phone</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: selectedCase?.user?.phone ? '#0f172a' : '#94a3b8' }}>
                                                {selectedCase?.user?.phone || 'Not provided'}
                                            </p>
                                            {!selectedCase?.user?.phone && (
                                                <span style={{ fontSize: '0.72rem', fontWeight: 600, background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.3)' }}>Missing</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedActionInfo === 'View submitted intake information' && (() => {
                                let formData = selectedCase?.form_data || {};
                                if (typeof formData === 'string') {
                                    try {
                                        formData = JSON.parse(formData);
                                    } catch (e) {
                                        formData = {};
                                    }
                                }
                                const palette = [
                                    { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '#fed7aa', label: '#c2410c', value: '#9a3412', dot: '#f97316' },
                                    { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', label: '#1d4ed8', value: '#1e3a8a', dot: '#3b82f6' },
                                    { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '#bbf7d0', label: '#15803d', value: '#14532d', dot: '#22c55e' },
                                    { bg: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', border: '#e9d5ff', label: '#7e22ce', value: '#581c87', dot: '#a855f7' },
                                    { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: '#fecdd3', label: '#be123c', value: '#881337', dot: '#f43f5e' },
                                    { bg: 'linear-gradient(135deg,#f0fdfa,#ccfbf1)', border: '#99f6e4', label: '#0f766e', value: '#134e4a', dot: '#14b8a6' },
                                ];

                                if (caseFormSchema && caseFormSchema.sections) {
                                    // Calculate progress
                                    let totalFields = 0;
                                    let completedFields = 0;
                                    caseFormSchema.sections.forEach((section: any) => {
                                        section.questions?.forEach((q: any) => {
                                            if (q.field_name && q.field_name !== 'name_group') {
                                                totalFields++;
                                                if (formData[q.field_name] !== undefined && formData[q.field_name] !== null && String(formData[q.field_name]).trim() !== '') {
                                                    completedFields++;
                                                }
                                            }
                                        });
                                    });
                                    const progress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

                                    if (totalFields > 0) {
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                                                {/* Progress Bar */}
                                                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Application Progress</span>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: progress === 100 ? '#10b981' : '#3b82f6' }}>{progress}% ({completedFields}/{totalFields})</span>
                                                </div>
                                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : '#3b82f6', borderRadius: '4px', transition: 'width 0.3s' }}></div>
                                                </div>
                                            </div>

                                            {caseFormSchema.sections.map((section: any, sectionIdx: number) => {
                                                if (!section.questions || section.questions.length === 0) return null;
                                                const p = palette[sectionIdx % palette.length];
                                                
                                                return (
                                                    <div key={section.id || sectionIdx} style={{ flexShrink: 0, borderRadius: '20px', overflow: 'hidden', border: `1.5px solid ${p.border}`, boxShadow: '0 4px 16px rgba(15,23,42,0.07)' }}>
                                                        <div style={{ background: p.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${p.border}` }}>
                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.dot, flexShrink: 0, boxShadow: `0 0 6px ${p.dot}` }}></span>
                                                            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.label }}>{section.title}</span>
                                                            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.7)', color: p.label, padding: '2px 10px', borderRadius: '20px', border: `1px solid ${p.border}` }}>
                                                                {section.questions.length} fields
                                                            </span>
                                                        </div>
                                                        <div style={{ background: '#ffffff' }}>
                                                            {section.questions.map((q: any, fieldIdx: number) => {
                                                                if (q.field_name === 'name_group') return null;
                                                                const fieldVal = formData[q.field_name];
                                                                const isEmpty = fieldVal === undefined || fieldVal === null || String(fieldVal).trim() === '';
                                                                return (
                                                                    <div key={q.id || fieldIdx} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 px-4 py-3 sm:px-5 sm:py-3.5 transition-colors ${fieldIdx < section.questions.length - 1 ? 'border-b border-[#f1f5f9]' : ''}`}>
                                                                        <span className="text-[0.78rem] font-semibold text-[#64748b] sm:min-w-[120px] shrink-0" style={{ maxWidth: '60%' }}>
                                                                            {q.question_text || q.field_name}
                                                                        </span>
                                                                        <div className="flex sm:justify-end w-full sm:w-auto">
                                                                            {isEmpty ? (
                                                                                <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#fef2f2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', border: '1px solid #fecaca' }}>Missing</span>
                                                                            ) : (
                                                                                <span style={{
                                                                                    display: 'inline-block',
                                                                                    fontSize: '0.85rem', fontWeight: 700,
                                                                                    color: '#0f172a',
                                                                                    wordBreak: 'break-word',
                                                                                    background: p.bg,
                                                                                    padding: '4px 14px',
                                                                                    borderRadius: '20px',
                                                                                    border: `1px solid ${p.border}`,
                                                                                }}>
                                                                                    {typeof fieldVal === 'object' ? JSON.stringify(fieldVal) : String(fieldVal)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                    }
                                }

                                if (!formData || Object.keys(formData).length === 0) {
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '16px' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.15)' }}>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                </svg>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>No Intake Data Yet</h4>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', maxWidth: '200px' }}>Questionnaire responses will appear here once the client submits.</p>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                                        {Object.entries(formData).map(([sectionKey, sectionVal], sectionIdx) => {
                                            const p = palette[sectionIdx % palette.length];
                                            const isNested = typeof sectionVal === 'object' && sectionVal !== null && !Array.isArray(sectionVal);
                                            const nestedEntries = isNested ? Object.entries(sectionVal as Record<string, any>) : null;
                                            return (
                                                <div key={sectionKey} style={{ flexShrink: 0, borderRadius: '20px', overflow: 'hidden', border: `1.5px solid ${p.border}`, boxShadow: '0 4px 16px rgba(15,23,42,0.07)' }}>
                                                    {/* Section header */}
                                                    <div style={{ background: p.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${p.border}` }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.dot, flexShrink: 0, boxShadow: `0 0 6px ${p.dot}` }}></span>
                                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.label }}>{sectionKey}</span>
                                                        {nestedEntries && (
                                                            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.7)', color: p.label, padding: '2px 10px', borderRadius: '20px', border: `1px solid ${p.border}` }}>
                                                                {nestedEntries.length} fields
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Fields */}
                                                    <div style={{ background: '#ffffff' }}>
                                                        {isNested && nestedEntries ? (
                                                            nestedEntries.map(([fieldKey, fieldVal], fieldIdx) => {
                                                                const isEmpty = fieldVal === null || fieldVal === undefined || String(fieldVal).trim() === '';
                                                                return (
                                                                    <div key={fieldKey} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 px-4 py-3 sm:px-5 sm:py-3.5 transition-colors ${fieldIdx < nestedEntries.length - 1 ? 'border-b border-[#f1f5f9]' : ''}`}>
                                                                        <span className="text-[0.78rem] font-semibold text-[#64748b] sm:min-w-[120px] shrink-0">{fieldKey}</span>
                                                                        <div className="flex sm:justify-end w-full sm:w-auto">
                                                                            <span style={{
                                                                                display: 'inline-block',
                                                                                fontSize: '0.85rem', fontWeight: 700,
                                                                                color: isEmpty ? '#cbd5e1' : '#0f172a',
                                                                                wordBreak: 'break-word',
                                                                                background: isEmpty ? 'none' : p.bg,
                                                                                padding: isEmpty ? '0' : '4px 14px',
                                                                                borderRadius: '20px',
                                                                                border: isEmpty ? 'none' : `1px solid ${p.border}`,
                                                                            }}>
                                                                                {isEmpty ? '—' : typeof fieldVal === 'object' ? JSON.stringify(fieldVal) : String(fieldVal)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <div style={{ padding: '14px 18px', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>
                                                                {typeof sectionVal === 'object' ? JSON.stringify(sectionVal, null, 2) : String(sectionVal)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            {selectedActionInfo === 'View uploaded supporting documents' && (
                                <div className="space-y-4">
                                    {(() => {
                                        const validDocs = uploadedDocuments.filter(doc => !!doc.file_path);
                                        return validDocs.length ? (
                                            <ul className="space-y-3">
                                                {validDocs.map((doc) => (
                                                    <li key={doc.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                                                                <span className="font-medium text-slate-900 break-words">{doc.name || doc.file_path?.split('/').pop() || 'Document'}</span>
                                                                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shrink-0">{doc.status}</span>
                                                            </div>
                                                            {doc.file_path && (
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <a href={getStorageUrl(doc.file_path)} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full transition-colors hover:bg-orange-100">
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                                        Preview
                                                                    </a>
                                                                    <a href={getStorageUrl(doc.file_path)} onClick={(e) => forceDownload(e as any, getStorageUrl(doc.file_path!), doc.name || doc.file_path?.split('/').pop() || 'document')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors hover:bg-blue-100 cursor-pointer">
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                                                <p className="text-sm text-slate-600">No documents uploaded yet.</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {selectedActionInfo === 'Required documents checklist' && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                                        <p className="text-sm font-semibold text-slate-900 mb-2">Service Type: {selectedCase?.service_type || 'N/A'}</p>
                                        
                                        {(() => {
                                            const completed = uploadedDocuments.filter(doc => !!doc.file_path).map(doc => doc.name);
                                            const missing = uploadedDocuments.filter(doc => !doc.file_path).map(doc => doc.name);

                                            return (
                                                <div className="mt-4 space-y-6">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            Completed Documents ({completed.length})
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {completed.length > 0 ? completed.map((docName, idx) => (
                                                                <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                                                    <span className="text-emerald-500 mt-0.5">•</span> {docName}
                                                                </li>
                                                            )) : <li className="text-sm text-slate-500">No required documents uploaded yet.</li>}
                                                        </ul>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="text-sm font-bold text-orange-600 mb-2 flex items-center gap-2">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                            Missing Required Documents ({missing.length})
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {missing.length > 0 ? missing.map((docName, idx) => (
                                                                <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                                                    <span className="text-orange-500 mt-0.5">•</span> {docName}
                                                                </li>
                                                            )) : <li className="text-sm text-emerald-600">All required documents have been uploaded!</li>}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <button
                                        className="w-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110"
                                        onClick={() => { setSelectedActionInfo(null); setActiveTab('Document Checklist'); }}
                                    >
                                        Open Full Document Checklist
                                    </button>
                                </div>
                            )}

                            {selectedActionInfo === 'View case timeline & status' && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Current Status</p>
                                        <p className="mt-3 text-base font-semibold text-slate-900">{selectedCase?.status || 'N/A'}</p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Progress</p>
                                        <p className="mt-3 text-base font-semibold text-slate-900">{selectedCase?.progress ?? 'N/A'}%</p>
                                    </div>
                                    <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Created On</p>
                                        <p className="mt-3 text-base font-semibold text-slate-900">{selectedCase?.created_at ? new Date(selectedCase.created_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            )}

                            {selectedActionInfo === 'View payment & service details' && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Service Package</p>
                                        <p className="mt-3 text-base font-semibold text-slate-900">{selectedCase?.title || selectedCase?.service_type || 'N/A'}</p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Payment Status</p>
                                        <p className="mt-3 text-base font-semibold text-emerald-700">Paid</p>
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    onClick={() => setSelectedActionInfo(null)}
                                    style={{
                                        padding: '10px 24px', borderRadius: '50px',
                                        background: 'transparent',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '0.875rem', fontWeight: 600, color: '#64748b',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; (e.currentTarget as HTMLButtonElement).style.color = '#0f172a'; }}
                                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => setSelectedActionInfo(null)}
                                    style={{
                                        padding: '10px 28px', borderRadius: '50px',
                                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                        border: 'none',
                                        fontSize: '0.875rem', fontWeight: 700, color: '#fff',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                        boxShadow: '0 6px 20px rgba(234,88,12,0.35)'
                                    }}
                                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px rgba(234,88,12,0.45)'; }}
                                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(234,88,12,0.35)'; }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}