"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { getManagerAssignedCases, getManagerMessages, sendManagerMessage, Application, MessagePayload } from '@/lib/api/cases';

const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'Resolved'] as const;
const PRIORITY_OPTIONS = ['All Priorities', 'High', 'Medium', 'Low'] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number];
type PriorityOption = (typeof PRIORITY_OPTIONS)[number];

type TicketRow = {
    id: number;
    title: string;
    email: string;
    status: string;
    priority: 'High' | 'Medium' | 'Low';
    lastMessage: string;
    updatedAt: string;
    unreadCount: number;
    application: Application;
};

const getPriority = (application: Application): 'High' | 'Medium' | 'Low' => {
    const created = new Date(application.created_at);
    const days = Math.max(0, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
    if (days > 14 || Number(application.progress.toString().replace('%', '')) < 30) return 'High';
    if (days > 7 || Number(application.progress.toString().replace('%', '')) < 70) return 'Medium';
    return 'Low';
};

export default function ManagerMessagesPage() {
    const [cases, setCases] = useState<Application[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messageDraft, setMessageDraft] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusOption>('All');
    const [priorityFilter, setPriorityFilter] = useState<PriorityOption>('All Priorities');

    useEffect(() => {
        const loadCases = async () => {
            try {
                const list = await getManagerAssignedCases();
                setCases(list);
                if (list.length > 0) setSelectedCaseId(list[0].id);
            } catch (err) {
                console.error('Failed to load manager messages cases', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCases();
    }, []);

    const selectedCase = useMemo(
        () => cases.find((item) => item.id === selectedCaseId) ?? null,
        [cases, selectedCaseId]
    );

    useEffect(() => {
        if (!selectedCase) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const result = await getManagerMessages(selectedCase.id);
                setMessages(result);
            } catch (err) {
                console.error('Failed to load messages', err);
                setMessages([]);
            } finally {
                setIsLoadingMessages(false);
            }
        };
        loadMessages();
    }, [selectedCase]);

    const ticketRows: TicketRow[] = useMemo(() => {
        return cases.map((app) => {
            const email = app.user?.email || 'unknown@example.com';
            const title = app.title || `Case #${app.id}`;
            const status = app.status || 'Open';
            const priority = getPriority(app);
            const lastMessage = messages.length ? messages[messages.length - 1].message : 'No messages yet';
            return {
                id: app.id,
                title,
                email,
                status,
                priority,
                lastMessage,
                updatedAt: app.created_at,
                unreadCount: 0,
                application: app,
            };
        });
    }, [cases, messages]);

    const filteredRows = useMemo(() => {
        return ticketRows.filter((row) => {
            const query = searchQuery.toLowerCase().trim();
            if (query && !(`${row.title} ${row.email} ${row.status} ${row.priority}`.toLowerCase().includes(query))) {
                return false;
            }
            if (statusFilter !== 'All' && row.status !== statusFilter) return false;
            if (priorityFilter !== 'All Priorities' && row.priority !== priorityFilter) return false;
            return true;
        });
    }, [ticketRows, searchQuery, statusFilter, priorityFilter]);

    const totalTickets = cases.length;
    const openTickets = cases.filter((app) => app.status !== 'resolved').length;
    const inProgressTickets = cases.filter((app) => app.status === 'in-progress' || Number(app.progress.toString().replace('%', '')) < 100).length;
    const resolvedTickets = cases.filter((app) => app.status === 'resolved' || Number(app.progress.toString().replace('%', '')) >= 100).length;

    const handleSend = async () => {
        if (!selectedCase || !messageDraft.trim()) return;
        setIsSending(true);
        try {
            const saved = await sendManagerMessage(selectedCase.id, messageDraft.trim());
            setMessages((prev) => [...prev, saved]);
            setMessageDraft('');
        } catch (err) {
            console.error('Unable to send message', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#101F38]">Support Tickets</h1>
                    <p className="text-sm text-[#5B6472]">Manage and respond to user support tickets</p>
                </div>
                <div className="text-sm font-semibold text-[#5B6472]">Sign Out</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2] shadow-sm">
                    <p className="text-xs text-[#5B6472]">Total Tickets</p>
                    <p className="text-3xl font-black text-[#101F38] mt-2">{totalTickets}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2] shadow-sm">
                    <p className="text-xs text-[#5B6472]">Open</p>
                    <p className="text-3xl font-black text-[#101F38] mt-2">{openTickets}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2] shadow-sm">
                    <p className="text-xs text-[#5B6472]">In Progress</p>
                    <p className="text-3xl font-black text-[#101F38] mt-2">{inProgressTickets}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2] shadow-sm">
                    <p className="text-xs text-[#5B6472]">Resolved</p>
                    <p className="text-3xl font-black text-[#101F38] mt-2">{resolvedTickets}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 mb-6">
                <h2 className="text-base font-bold text-[#101F38] mb-4">Filters</h2>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_220px] gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tickets..."
                        className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusOption)}
                        className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as PriorityOption)}
                        className="rounded-2xl border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white"
                    >
                        {PRIORITY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38]">All Tickets</h2>
                        <p className="text-xs text-[#5B6472]">Manage and respond to user support tickets</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-24 text-center text-sm text-[#8A8F98]">Loading tickets...</div>
                ) : filteredRows.length === 0 ? (
                    <div className="py-24 text-center text-sm text-[#8A8F98]">
                        <div className="mb-3 text-2xl">💬</div>
                        No tickets found
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredRows.map((ticket) => (
                            <button
                                key={ticket.id}
                                type="button"
                                onClick={() => setSelectedCaseId(ticket.id)}
                                className={`w-full rounded-3xl border px-5 py-5 text-left transition-colors ${selectedCaseId === ticket.id ? 'border-[#E3755D] bg-[#FEF3EC]' : 'border-[#ECE9E2] bg-white hover:bg-[#F7F5F0]'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-[#101F38]">{ticket.title}</p>
                                        <p className="text-xs text-[#5B6472] mt-1">{ticket.email}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-semibold text-[#1D4ED8]">{ticket.status}</span>
                                        <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[10px] font-semibold text-[#A16207]">{ticket.priority}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[#8A8F98]">
                                    <p>{ticket.lastMessage}</p>
                                    <p>{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6">
                <h2 className="text-lg font-bold text-[#101F38] mb-4">Conversation</h2>
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
                    <div className="rounded-3xl border border-[#ECE9E2] bg-[#FBF5F0] p-4">
                        <p className="text-sm font-bold text-[#101F38] mb-3">Conversations</p>
                        <div className="space-y-2">
                            {cases.map((app) => (
                                <button
                                    key={app.id}
                                    type="button"
                                    onClick={() => setSelectedCaseId(app.id)}
                                    className={`w-full rounded-2xl px-3 py-3 text-left transition-colors ${selectedCaseId === app.id ? 'bg-[#EDE5D8] border-[#E3755D]' : 'bg-white border border-[#ECE9E2] hover:bg-[#F7F5F0]'}`}
                                >
                                    <p className="text-sm font-semibold text-[#101F38]">{app.user?.email || `Case #${app.id}`}</p>
                                    <p className="text-xs text-[#64748b] mt-1">{app.title || 'Assigned case'}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-[#ECE9E2] bg-white p-4 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[240px]">
                            {isLoadingMessages ? (
                                <p className="text-sm text-[#8A8F98]">Loading conversation...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-sm text-[#8A8F98]">No messages in this conversation yet.</p>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id} className="rounded-3xl border border-[#ECE9E2] bg-[#F7F5F0] p-4">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${message.is_admin ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#FEF3C7] text-[#B45309]'}`}>
                                                {message.is_admin ? 'Manager' : 'Client'}
                                            </span>
                                            <span className="text-[10px] text-[#8A8F98]">
                                                {new Date(message.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#101F38]">{message.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={messageDraft}
                                onChange={(e) => setMessageDraft(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-3 text-sm text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageDraft.trim() || isSending || !selectedCase}
                                className="rounded-full bg-[#E3755D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#D1644C] disabled:opacity-50"
                            >
                                {isSending ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
