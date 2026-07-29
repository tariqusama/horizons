"use client";

import React, { useState, useEffect } from 'react';
import { globalSearch, SearchResults } from '../../../../lib/api/search';
const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    client: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    case: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    ticket: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8a2 2 0 0 0 0-4V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2" /></svg>
};

// Search results fetched from API

export default function GlobalSearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({ users: [], cases: [], tickets: [] });
    const [filter, setFilter] = useState<'All' | 'User' | 'Case' | 'Ticket'>('All');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults({ users: [], cases: [], tickets: [] });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (q: string) => {
        try {
            const data = await globalSearch(q);
            setResults(data);
        } catch (err) {
            console.error('Search failed', err);
        }
    };

    const formattedResults = [
        ...results.users.map(u => ({ filterGroup: 'User', type: u.role || 'User', icon: Icon.client, color: '#D6497A', bg: '#FBE1E6', title: u.name, subtitle: u.email, meta: `Role: ${u.role}` })),
        ...results.cases.map(c => ({ filterGroup: 'Case', type: 'Case', icon: Icon.case, color: '#2F8A5F', bg: '#DDF3E4', title: `${c.title || 'Case #' + c.id} (${c.user?.name || 'Unknown'})`, subtitle: c.package_name || c.subtitle || '', meta: `Status: ${c.status}` })),
        ...results.tickets.map(t => ({ filterGroup: 'Ticket', type: 'Ticket', icon: Icon.ticket, color: '#B98A0A', bg: '#FBEFD1', title: `${t.ticket_id}: ${t.subject}`, subtitle: `Submitted by: ${t.user?.name || 'Unknown'}`, meta: `Priority: ${t.priority} • Status: ${t.status}` })),
    ];

    const displayResults = filter === 'All' ? formattedResults : formattedResults.filter(r => r.filterGroup === filter);

    return (
        <div className="max-w-[1000px] mx-auto w-full">
            <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-8">Global Search</h1>

            <div className="relative mb-8">
                <Icon.search width={24} height={24} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[#101F38] w-5 h-5 md:w-6 md:h-6" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users, cases, tickets..."
                    className="w-full pl-12 md:pl-16 pr-6 sm:pr-28 py-4 md:py-5 rounded-2xl border-2 border-[#101F38] bg-white text-base md:text-xl font-bold text-[#101F38] placeholder-[#B7B4AA] outline-none shadow-sm text-ellipsis"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
                    <span className="text-xs font-bold text-[#B7B4AA] bg-[#F5F4F1] px-2 py-1 rounded">Ctrl</span>
                    <span className="text-xs font-bold text-[#B7B4AA] bg-[#F5F4F1] px-2 py-1 rounded">K</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
                <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-[#101F38] text-white border-transparent' : 'border border-[#ECE9E2] bg-white text-[#5B6472] hover:bg-[#F5F4F1] hover:text-[#101F38]'}`}>All Results ({formattedResults.length})</button>
                <button onClick={() => setFilter('User')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'User' ? 'bg-[#101F38] text-white border-transparent' : 'border border-[#ECE9E2] bg-white text-[#5B6472] hover:bg-[#F5F4F1] hover:text-[#101F38]'}`}>Users ({results.users.length})</button>
                <button onClick={() => setFilter('Case')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'Case' ? 'bg-[#101F38] text-white border-transparent' : 'border border-[#ECE9E2] bg-white text-[#5B6472] hover:bg-[#F5F4F1] hover:text-[#101F38]'}`}>Cases ({results.cases.length})</button>
                <button onClick={() => setFilter('Ticket')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'Ticket' ? 'bg-[#101F38] text-white border-transparent' : 'border border-[#ECE9E2] bg-white text-[#5B6472] hover:bg-[#F5F4F1] hover:text-[#101F38]'}`}>Tickets ({results.tickets.length})</button>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-[#ECE9E2] bg-[#F9F8F6]">
                    <span className="text-sm font-bold text-[#5B6472]">Showing results for <span className="text-[#101F38]">"{query}"</span></span>
                </div>
                <div className="divide-y divide-[#ECE9E2]">
                    {displayResults.map((result, i) => (
                        <div key={i} className="p-4 md:p-6 hover:bg-[#F9F8F6] transition-colors flex items-start gap-3 md:gap-4 cursor-pointer group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: result.bg, color: result.color }}>
                                <result.icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: result.bg, color: result.color }}>{result.type}</span>
                                    <span className="text-xs font-semibold text-[#8A8F98] capitalize">{result.meta}</span>
                                </div>
                                <h3 className="font-bold text-[#101F38] text-base md:text-lg mb-1 group-hover:text-orange-500 transition-colors truncate">{result.title}</h3>
                                <p className="text-[#5B6472] text-xs md:text-sm truncate">{result.subtitle}</p>
                            </div>
                            <div className="shrink-0 text-right self-center hidden sm:block">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B7B4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 group-hover:stroke-[#E3755D]">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
