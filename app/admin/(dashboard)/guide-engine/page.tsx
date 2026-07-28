"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { getServices, createService, updateService, deleteService, Service } from '../../../../lib/api/services';
import api from '../../../../lib/api';

const PANEL_TABS = ['Guide Engine', 'Forms Tracker', 'Fees', 'Lockbox'] as const;
type PanelTab = (typeof PANEL_TABS)[number];

const TAB_ICONS: Record<PanelTab, ReactNode> = {
    'Guide Engine': (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
        </svg>
    ),
    'Forms Tracker': (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
        </svg>
    ),
    Fees: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    Lockbox: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
};

function EmptyStatePanel({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="rounded-2xl bg-[#F7F5F0] py-14 px-6 flex flex-col items-center justify-center text-center">
            <span className="text-[#B4B2A9] mb-4">{icon}</span>
            <p className="text-sm font-bold text-[#101F38] mb-1">{title}</p>
            <p className="text-xs text-[#5B6472] font-medium">{subtitle}</p>
        </div>
    );
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-[#F0C4C4] bg-[#FCEBEB] px-4 py-3 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm font-medium text-[#A32D2D]">{message}</span>
        </div>
    );
}

function InfoBanner({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-start gap-2 rounded-xl border border-[#B5D4F4] bg-[#E6F1FB] px-4 py-3 mt-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span className="text-sm font-medium text-[#0C447C]">{children}</span>
        </div>
    );
}

function RefreshButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-4 py-2 hover:bg-[#F7F5F0] transition-colors shrink-0"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
        </button>
    );
}


function ServiceModal({
    isOpen,
    onClose,
    onSave,
    service = null
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Service>) => Promise<void>;
    service?: Service | null;
}) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [tier, setTier] = React.useState('Standard');
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (service) {
            setName(service.name);
            setDescription(service.description || '');
            setPrice(service.price);
            setTier(service.tier);
        } else {
            setName('');
            setDescription('');
            setPrice(0);
            setTier('Standard');
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({ name, description, price, tier });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#ECE9E2] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#101F38]">{service ? 'Edit Item' : 'Add Item'}</h2>
                    <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#101F38] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#101F38] mb-1">Name</label>
                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" placeholder="e.g. I-485 Form" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#101F38] mb-1">Description</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" placeholder="Brief description" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#101F38] mb-1">Fee ($)</label>
                            <input required type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#101F38] mb-1">Tier / Info</label>
                            <input required value={tier} onChange={e => setTier(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" placeholder="Standard" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#5B6472] hover:bg-[#F7F5F0] rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface LockboxRule {
    id: number;
    state: string;
    formType: string;
    address: string;
}

function LockboxModal({
    isOpen,
    onClose,
    onSave,
    rule = null
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<LockboxRule>) => void;
    rule?: LockboxRule | null;
}) {
    const [state, setState] = React.useState('');
    const [formType, setFormType] = React.useState('');
    const [address, setAddress] = React.useState('');

    React.useEffect(() => {
        if (rule) {
            setState(rule.state);
            setFormType(rule.formType);
            setAddress(rule.address);
        } else {
            setState('');
            setFormType('');
            setAddress('');
        }
    }, [rule, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ state, formType, address });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#ECE9E2] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#101F38]">{rule ? 'Edit Lockbox Rule' : 'Add Lockbox Rule'}</h2>
                    <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#101F38] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#101F38] mb-1">State</label>
                            <input required value={state} onChange={e => setState(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" placeholder="e.g. California" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#101F38] mb-1">Form Type</label>
                            <input required value={formType} onChange={e => setFormType(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" placeholder="e.g. I-485" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#101F38] mb-1">Mailing Address</label>
                        <textarea required value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 min-h-[80px]" placeholder="Full Lockbox Address" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#5B6472] hover:bg-[#F7F5F0] rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg">
                            Save Rule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


function GuideEngineTab({ services }: { services: Service[] }) {
    const [autoSync, setAutoSync] = useState(false);
    const [stats, setStats] = useState<any>({ formEditions: [], fieldChanges: [], questions: [] });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/guide-engine/stats');
            setStats(response.data);
        } catch (e) {
            console.error('Failed to fetch guide engine stats', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRunAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            await fetch('/api/admin/guide-engine/analyze', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            await fetchStats();
        } catch (e) {
            console.error('Failed to run analysis', e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fieldChangeItems = stats.fieldChanges || [];
    const questionItems = stats.questions || [];
    const formEditionItems = stats.formEditions || [];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">Guide engine</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Automatically sync form changes and generate intake fields</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setAutoSync((v) => !v)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-4 py-2 hover:bg-[#F7F5F0] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                        </svg>
                        Auto-sync {autoSync ? 'on' : 'off'}
                    </button>
                    <button
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 rounded-full px-4 py-2 hover:bg-[#D1644C] transition-colors disabled:opacity-50"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7Z" />
                        </svg>
                        {isAnalyzing ? 'Analyzing...' : 'Run analysis'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: 'Form editions',
                        value: formEditionItems.length,
                        iconBg: '#E6F1FB',
                        iconColor: '#185FA5',
                        icon: (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                                <path d="M14 2v6h6" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Field changes',
                        value: fieldChangeItems.length,
                        iconBg: '#FAEEDA',
                        iconColor: '#BA7517',
                        icon: (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Generated questions',
                        value: questionItems.length,
                        iconBg: '#EAF3DE',
                        iconColor: '#3B6D11',
                        icon: (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Approved',
                        value: 0,
                        iconBg: '#EEEDFE',
                        iconColor: '#534AB7',
                        icon: (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        ),
                    },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-xs font-semibold text-[#5B6472]">{stat.label}</span>
                            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                                {stat.icon}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-[#101F38]">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        <h3 className="text-sm font-bold text-[#101F38]">Recent field changes</h3>
                    </div>
                    <p className="text-xs text-[#5B6472] font-medium mb-4">Latest detected changes in service intake requirements</p>
                    {fieldChangeItems.length > 0 ? (
                        <div className="space-y-3">
                            {fieldChangeItems.map((item: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-[#ECE9E2] bg-[#FAFAFA] p-4">
                                    <p className="font-bold text-[#101F38]">{item.title}</p>
                                    <p className="text-xs text-[#5B6472] mt-1">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyStatePanel
                            icon={
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10" />
                                    <polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                            }
                            title="No field changes detected yet"
                            subtitle="Run analysis to detect form changes"
                        />
                    )}
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <h3 className="text-sm font-bold text-[#101F38]">Auto-generated questions</h3>
                    </div>
                    <p className="text-xs text-[#5B6472] font-medium mb-4">Questions automatically created from service data</p>
                    {questionItems.length > 0 ? (
                        <div className="space-y-3">
                            {questionItems.map((item: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-[#ECE9E2] bg-[#FAFAFA] p-4">
                                    <p className="font-bold text-[#101F38]">{item.title}</p>
                                    <p className="text-xs text-[#5B6472] mt-1">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyStatePanel
                            icon={
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19`" y2="12" />
                                </svg>
                            }
                            title="No auto-generated questions yet"
                            subtitle="Questions will appear after form analysis"
                        />
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                <div className="flex items-center gap-2 mb-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" />
                    </svg>
                    <h3 className="text-sm font-bold text-[#101F38]">Recent form editions</h3>
                </div>
                <p className="text-xs text-[#5B6472] font-medium mb-4">Latest form editions processed by the system</p>
                {formEditionItems.length > 0 ? (
                    <div className="space-y-3">
                        {formEditionItems.map((item: any, index: number) => (
                            <div key={index} className="rounded-2xl border border-[#ECE9E2] bg-[#FAFAFA] p-4">
                                <p className="font-bold text-[#101F38]">{item.title}</p>
                                <p className="text-xs text-[#5B6472] mt-1">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyStatePanel
                        icon={
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                                <path d="M14 2v6h6" />
                            </svg>
                        }
                        title="No form editions found"
                        subtitle="Form editions will appear after processing"
                    />
                )}
            </div>
        </div>
    );
}

function FormsTrackerTab({ services, onRefresh, onEdit, onDelete, onAdd }: { services: Service[], onRefresh: () => void, onEdit: (s: Service) => void, onDelete: (id: number) => void, onAdd: () => void }) {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS forms tracker</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Comprehensive tracking and management for all Horizon Pathways forms</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onAdd} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 rounded-full px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-colors shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Form
                    </button>
                    <RefreshButton onClick={onRefresh} />
                </div>
            </div>

            {services.length === 0 ? (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-8 text-center text-sm text-[#5B6472]">No form data available.</div>
            ) : (
                <div className="rounded-2xl border border-[#ECE9E2] overflow-x-auto bg-white">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_120px] gap-4 px-5 py-3 bg-[#F7F5F0] text-xs font-semibold text-[#5B6472]">
                        <span>Form</span>
                        <span>Description</span>
                        <span>Fee</span>
                        <span>Processing</span>
                        <span>Edition</span>
                        <span className="text-right">Actions</span>
                    </div>
                    {services.map((service) => (
                        <div key={service.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_120px] gap-4 px-5 py-4 border-t border-[#ECE9E2] text-sm text-[#3B4251] items-center">
                            <span className="font-bold text-[#101F38]">{service.name}</span>
                            <span className="text-[#5B6472] truncate">{service.description || 'Standard form guidance'}</span>
                            <span className="font-bold">${Number(service.price).toFixed(2)}</span>
                            <span>{service.tier}</span>
                            <span>{service.tier}</span>
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => onEdit(service)} className="text-[#5B6472] hover:text-orange-500 transition-colors p-1" title="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </button>
                                <button onClick={() => { if (window.confirm('Delete this form?')) onDelete(service.id); }} className="text-[#5B6472] hover:text-red-500 transition-colors p-1" title="Delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            )}

            <InfoBanner>
                Always verify current information on the official USCIS website before filing. Processing times and fees are subject to change.
            </InfoBanner>
        </div>
    );
}

function FeesTab({ services, onRefresh, onEdit, onDelete, onAdd }: { services: Service[], onRefresh: () => void, onEdit: (s: Service) => void, onDelete: (id: number) => void, onAdd: () => void }) {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS filing fees</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Manage and track current fees for Horizon Pathways services</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onAdd} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 rounded-full px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-colors shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Fee
                    </button>
                    <RefreshButton onClick={onRefresh} />
                </div>
            </div>

            {services.length === 0 ? (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-8 text-center text-sm text-[#5B6472]">No fee data available.</div>
            ) : (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5 space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="rounded-2xl border border-[#ECE9E2] hover:border-orange-500/30 transition-colors p-4 flex items-center justify-between gap-4 group">
                            <div>
                                <p className="text-sm font-bold text-[#101F38]">{service.name}</p>
                                <p className="text-xs text-[#5B6472]">{service.description || 'USCIS filing fee details'}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-black text-[#101F38]">${Number(service.price).toFixed(2)}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-[#8A8F98]">{service.tier}</p>
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(service)} className="text-[#5B6472] hover:text-orange-500 transition-colors" title="Edit">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    </button>
                                    <button onClick={() => { if (window.confirm('Delete this fee entry?')) onDelete(service.id); }} className="text-[#5B6472] hover:text-red-500 transition-colors" title="Delete">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <InfoBanner>
                All fees are in USD. Always verify current fees on the official USCIS website before filing.
            </InfoBanner>
        </div>
    );
}

const INITIAL_LOCKBOX_RULES: LockboxRule[] = [
    { id: 1, state: 'California', formType: 'All', address: 'USCIS Dallas Lockbox, P.O. Box 660867, Dallas, TX 75266' },
    { id: 2, state: 'Texas', formType: 'All', address: 'USCIS Dallas Lockbox, P.O. Box 660867, Dallas, TX 75266' },
    { id: 3, state: 'New York', formType: 'All', address: 'USCIS Phoenix Lockbox, P.O. Box 21281, Phoenix, AZ 85036' },
    { id: 4, state: 'Florida', formType: 'All', address: 'USCIS Phoenix Lockbox, P.O. Box 21281, Phoenix, AZ 85036' },
    { id: 5, state: 'Illinois', formType: 'All', address: 'USCIS Chicago Lockbox, 131 South Dearborn St, Chicago, IL 60603' },
];

function LockboxTab() {
    const [rules, setRules] = useState<LockboxRule[]>(INITIAL_LOCKBOX_RULES);
    const [stateFilter, setStateFilter] = useState('');
    const [formFilter, setFormFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<LockboxRule | null>(null);

    const states = Array.from(new Set(rules.map(r => r.state))).sort();
    const forms = Array.from(new Set(rules.map(r => r.formType))).sort();

    // Find matching rule for finder
    const matchingRule = rules.find(r => r.state === stateFilter && (r.formType === formFilter || r.formType === 'All' || formFilter === 'All'));

    const handleSaveRule = (data: Partial<LockboxRule>) => {
        if (editingRule) {
            setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...data } as LockboxRule : r));
        } else {
            setRules([...rules, { ...data, id: Date.now() } as LockboxRule]);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this lockbox rule?')) {
            setRules(rules.filter(r => r.id !== id));
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS lockbox address manager</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Configure and manage lockbox routing rules</p>
                </div>
                <button onClick={() => { setEditingRule(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 rounded-full px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-colors shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Rule
                </button>
            </div>

            {/* Finder Tool */}
            <div className="bg-[#F7F5F0] rounded-2xl p-5 mb-8 border border-[#ECE9E2]">
                <h3 className="text-sm font-bold text-[#101F38] mb-3">Test Routing Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
                        >
                            <option value="">Select state...</option>
                            {states.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={formFilter}
                            onChange={(e) => setFormFilter(e.target.value)}
                            className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
                        >
                            <option value="">Select form type...</option>
                            {forms.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                </div>
                {stateFilter && formFilter && (
                    <div className="bg-white rounded-xl p-4 border border-[#ECE9E2]">
                        {matchingRule ? (
                            <>
                                <p className="text-[10px] uppercase tracking-wider text-orange-500 font-bold mb-1">Matched Rule ID: {matchingRule.id}</p>
                                <p className="text-sm text-[#101F38] font-medium">{matchingRule.address}</p>
                            </>
                        ) : (
                            <p className="text-sm text-red-500 font-medium">No matching lockbox rule found for this combination.</p>
                        )}
                    </div>
                )}
            </div>

            <h3 className="text-sm font-bold text-[#101F38] mb-3">All Active Rules</h3>
            <div className="rounded-2xl border border-[#ECE9E2] overflow-x-auto bg-white mb-6">
                <div className="min-w-[800px]">
                <div className="grid grid-cols-[1fr_1fr_3fr_100px] gap-4 px-5 py-3 bg-[#F7F5F0] text-xs font-semibold text-[#5B6472]">
                    <span>State</span>
                    <span>Form Type</span>
                    <span>Address</span>
                    <span className="text-right">Actions</span>
                </div>
                {rules.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[#5B6472]">No lockbox rules configured.</div>
                ) : (
                    rules.map((rule) => (
                        <div key={rule.id} className="grid grid-cols-[1fr_1fr_3fr_100px] gap-4 px-5 py-4 border-t border-[#ECE9E2] text-sm text-[#3B4251] items-center">
                            <span className="font-bold">{rule.state}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 w-fit">{rule.formType}</span>
                            <span className="truncate">{rule.address}</span>
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditingRule(rule); setIsModalOpen(true); }} className="text-[#5B6472] hover:text-orange-500 transition-colors p-1" title="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(rule.id)} className="text-[#5B6472] hover:text-red-500 transition-colors p-1" title="Delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
                </div>
            </div>

            <InfoBanner>
                Lockbox rules map specific states and forms to mailing addresses. Use "All" in Form Type as a fallback for a state.
            </InfoBanner>

            <LockboxModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRule}
                rule={editingRule}
            />
        </div>
    );
}

export default function AdminGuideEnginePage() {
    const [activeTab, setActiveTab] = useState<PanelTab>('Guide Engine');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const s = await getServices();
            setServices(s);
            setError('');
        } catch (err: any) {
            console.error('Failed to load services for guide engine', err);
            setError(err?.message || 'Failed to load service data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSaveService = async (data: Partial<Service>) => {
        if (editingService) {
            await updateService(editingService.id, data);
        } else {
            await createService(data);
        }
        await load();
    };

    const handleDeleteService = async (id: number) => {
        try {
            await deleteService(id);
            await load();
        } catch (err) {
            console.error(err);
            alert("Failed to delete service.");
        }
    };

    const openAddService = () => {
        setEditingService(null);
        setIsServiceModalOpen(true);
    };

    const openEditService = (s: Service) => {
        setEditingService(s);
        setIsServiceModalOpen(true);
    };

    // Calculate dynamic stats
    const activeGuidesCount = services.length;
    const formsTrackedCount = services.length;
    const feeUpdatesCount = services.length;
    const locationsCount = new Set(services.map(s => s.tier)).size;

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="mb-6 px-1">
                <h1 className="text-2xl font-bold text-slate-900">Guide Engine</h1>
            </div>

            {loading && <div className="text-center py-10 text-slate-500">Loading services...</div>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}

            {!loading && !error && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Stat Card 1 */}
                        <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-white to-cyan-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 animate-fade-in hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">Active Guides</h3>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{activeGuidesCount}</div>
                                <p className="text-xs text-slate-500 mt-1">USCIS guides available</p>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-white to-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 animate-fade-in hover:scale-[1.02]" style={{ animationDelay: '100ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">Forms Tracked</h3>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative">
                                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{formsTrackedCount}</div>
                                <p className="text-xs text-slate-500 mt-1">USCIS forms monitored</p>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 via-white to-pink-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 animate-fade-in hover:scale-[1.02]" style={{ animationDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">Fee Updates</h3>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-purple-500"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{feeUpdatesCount}</div>
                                <p className="text-xs text-slate-500 mt-1">Current filing fees</p>
                            </div>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 via-white to-amber-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 animate-fade-in hover:scale-[1.02]" style={{ animationDelay: '300ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">Locations</h3>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-orange-500"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative">
                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{locationsCount}</div>
                                <p className="text-xs text-slate-500 mt-1">Filing lockboxes</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="rounded-lg bg-white text-slate-900 border-0 bg-gradient-to-br from-white via-white to-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-200/50 bg-gradient-to-r from-orange-500/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-500"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold tracking-tight text-2xl">USCIS Guide Engine</h3>
                                    <p className="text-sm text-slate-500 mt-1">Access comprehensive USCIS forms, fees, and processing information for administrative oversight</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-6">
                            <div className="w-full">
                                {/* Tab List */}
                                <div className="items-center justify-center text-slate-500 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl h-auto mb-6">
                                    {PANEL_TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium rounded-lg transition-all py-3 ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="mt-6">
                                    {activeTab === 'Guide Engine' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Guide Engine</h1>
                                                    <p className="text-base text-slate-500">Automatically sync form changes and generate intake fields</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 py-2 flex items-center gap-2 h-11 px-6 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                        Auto-Sync Off
                                                    </button>
                                                    <button className="rounded-md text-sm font-medium bg-gradient-to-b from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 py-2 flex items-center gap-2 h-11 px-6 transition-colors shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                                                        Run Analysis
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {/* Sub stat 1 */}
                                                <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-slate-500">Form Editions</p>
                                                                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">0</p>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Sub stat 2 */}
                                                <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-slate-500">Field Changes</p>
                                                                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">0</p>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-500"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Sub stat 3 */}
                                                <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-slate-500">Generated Questions</p>
                                                                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0</p>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Sub stat 4 */}
                                                <div className="rounded-lg bg-white text-slate-900 relative overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-slate-500">Approved</p>
                                                                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">0</p>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-purple-500"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Field Changes */}
                                                <div className="rounded-lg bg-white text-slate-900 border border-slate-100 shadow-sm">
                                                    <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                                        <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-orange-500"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                                                            Recent Field Changes
                                                        </h3>
                                                        <p className="text-slate-500 text-sm">Latest detected changes in form fields</p>
                                                    </div>
                                                    <div className="p-6 pt-0">
                                                        <div className="space-y-3">
                                                            <div className="text-center py-12 rounded-xl bg-slate-50">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto mb-3 text-slate-300"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                                                                <p className="text-slate-500 font-medium">No field changes detected yet</p>
                                                                <p className="text-sm text-slate-400 mt-1">Run analysis to detect form changes</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Auto Questions */}
                                                <div className="rounded-lg bg-white text-slate-900 border border-slate-100 shadow-sm">
                                                    <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                                        <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-orange-500"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                                            Auto-Generated Questions
                                                        </h3>
                                                        <p className="text-slate-500 text-sm">Questions automatically created from form changes</p>
                                                    </div>
                                                    <div className="p-6 pt-0">
                                                        <div className="space-y-3">
                                                            <div className="text-center py-12 rounded-xl bg-slate-50">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto mb-3 text-slate-300"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                                                <p className="text-slate-500 font-medium">No auto-generated questions yet</p>
                                                                <p className="text-sm text-slate-400 mt-1">Questions will appear after form analysis</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Editions */}
                                            <div className="rounded-lg bg-white text-slate-900 border border-slate-100 shadow-sm">
                                                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                                    <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-orange-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                                        Recent Form Editions
                                                    </h3>
                                                    <p className="text-slate-500 text-sm">Latest form editions processed by the system</p>
                                                </div>
                                                <div className="p-6 pt-0">
                                                    <div className="space-y-3">
                                                        <div className="text-center py-12 rounded-xl bg-slate-50">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto mb-3 text-slate-300"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                                            <p className="text-slate-500 font-medium">No form editions found</p>
                                                            <p className="text-sm text-slate-400 mt-1">Form editions will appear after processing</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'Forms Tracker' && <FormsTrackerTab services={services} onRefresh={load} onEdit={openEditService} onDelete={handleDeleteService} onAdd={openAddService} />}
                                    {activeTab === 'Fees' && <FeesTab services={services} onRefresh={load} onEdit={openEditService} onDelete={handleDeleteService} onAdd={openAddService} />}
                                    {activeTab === 'Lockbox' && <LockboxTab />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                onSave={handleSaveService}
                service={editingService}
            />
        </main>
    );
}