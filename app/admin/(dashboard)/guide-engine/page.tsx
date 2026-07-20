"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { getServices, Service } from '../../../../lib/api/services';

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

function RefreshButton() {
    return (
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-4 py-2 hover:bg-[#F7F5F0] transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
        </button>
    );
}

function GuideEngineTab({ services }: { services: Service[] }) {
    const [autoSync, setAutoSync] = useState(false);

    const fieldChangeItems = services.slice(0, 4).map((service) => ({
        title: `Update intake questions for ${service.name}`,
        detail: `Sync changes to ${service.tier} service requirements`,
    }));

    const questionItems = services.slice(0, 3).map((service) => ({
        title: `Has the client provided all documents for ${service.name}?`,
        detail: `Confirm supporting evidence for ${service.tier.toLowerCase()} service`,
    }));

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
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#E3755D] rounded-full px-4 py-2 hover:bg-[#D1644C] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7Z" />
                        </svg>
                        Run analysis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: 'Form editions',
                        value: services.length,
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
                        value: services.length,
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
                        value: services.length,
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
                        value: services.length,
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        <h3 className="text-sm font-bold text-[#101F38]">Recent field changes</h3>
                    </div>
                    <p className="text-xs text-[#5B6472] font-medium mb-4">Latest detected changes in service intake requirements</p>
                    {fieldChangeItems.length > 0 ? (
                        <div className="space-y-3">
                            {fieldChangeItems.map((item, index) => (
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <h3 className="text-sm font-bold text-[#101F38]">Auto-generated questions</h3>
                    </div>
                    <p className="text-xs text-[#5B6472] font-medium mb-4">Questions automatically created from service data</p>
                    {questionItems.length > 0 ? (
                        <div className="space-y-3">
                            {questionItems.map((item, index) => (
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" />
                    </svg>
                    <h3 className="text-sm font-bold text-[#101F38]">Recent form editions</h3>
                </div>
                <p className="text-xs text-[#5B6472] font-medium mb-4">Latest form editions processed by the system</p>
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
            </div>
        </div>
    );
}

function FormsTrackerTab({ services }: { services: Service[] }) {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS forms tracker</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Comprehensive tracking for all Horizon Pathways forms</p>
                </div>
                <RefreshButton />
            </div>

            {services.length === 0 ? (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-8 text-center text-sm text-[#5B6472]">No form data available.</div>
            ) : (
                <div className="rounded-2xl border border-[#ECE9E2] overflow-hidden bg-white">
                    <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-[#F7F5F0] text-xs font-semibold text-[#5B6472]">
                        <span>Form</span>
                        <span>Description</span>
                        <span>Fee</span>
                        <span>Processing</span>
                        <span>Edition</span>
                        <span>Links</span>
                    </div>
                    {services.map((service) => (
                        <div key={service.id} className="grid grid-cols-6 gap-4 px-5 py-4 border-t border-[#ECE9E2] text-sm text-[#3B4251]">
                            <span className="font-semibold">{service.name}</span>
                            <span className="text-[#5B6472]">{service.description || 'Standard form guidance'}</span>
                            <span className="font-bold">${service.price.toFixed(2)}</span>
                            <span>{service.tier}</span>
                            <span>{service.tier}</span>
                            <span className="text-[#E3755D] font-semibold">View</span>
                        </div>
                    ))}
                </div>
            )}

            <InfoBanner>
                Always verify current information on the official USCIS website before filing. Processing times and fees are subject to change.
            </InfoBanner>
        </div>
    );
}

function FeesTab({ services }: { services: Service[] }) {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS filing fees</h2>
                    <p className="text-sm text-[#5B6472] font-medium">Current fees for Horizon Pathways services</p>
                </div>
                <RefreshButton />
            </div>

            {services.length === 0 ? (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-8 text-center text-sm text-[#5B6472]">No fee data available.</div>
            ) : (
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5 space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="rounded-2xl border border-[#ECE9E2] p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-[#101F38]">{service.name}</p>
                                <p className="text-xs text-[#5B6472]">{service.description || 'USCIS filing fee details'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#101F38]">${service.price.toFixed(2)}</p>
                                <p className="text-[10px] uppercase tracking-wider text-[#8A8F98]">{service.tier}</p>
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

const STATES = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];
const FORM_TYPES = ['I-485', 'I-130', 'N-400', 'I-751'];
const LOCKBOX_ADDRESSES: Record<string, string> = {
    California: 'USCIS Dallas Lockbox, P.O. Box 660867, Dallas, TX 75266',
    Texas: 'USCIS Dallas Lockbox, P.O. Box 660867, Dallas, TX 75266',
    'New York': 'USCIS Phoenix Lockbox, P.O. Box 21281, Phoenix, AZ 85036',
    Florida: 'USCIS Phoenix Lockbox, P.O. Box 21281, Phoenix, AZ 85036',
    Illinois: 'USCIS Chicago Lockbox, 131 South Dearborn St, Chicago, IL 60603',
};

function LockboxTab() {
    const [state, setState] = useState('');
    const [formType, setFormType] = useState('');
    const address = state ? LOCKBOX_ADDRESSES[state] ?? 'USCIS lockbox address not available for selected state.' : null;

    return (
        <div>
            <h2 className="text-xl font-black text-[#101F38] tracking-tight mb-1">USCIS lockbox address finder</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-6">Select your state and form type to find the correct mailing address</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#101F38] mb-2">State / territory</label>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-2.5 text-sm text-[#5B6472] font-medium focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30"
                    >
                        <option value="" disabled>Select your state</option>
                        {STATES.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#101F38] mb-2">Form type</label>
                    <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-2.5 text-sm text-[#5B6472] font-medium focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30"
                    >
                        <option value="" disabled>Select form type</option>
                        {FORM_TYPES.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                {state && formType ? (
                    <>
                        <p className="text-[10px] uppercase tracking-wider text-[#8A8F98] mb-2">Selected lockbox</p>
                        <h3 className="text-lg font-bold text-[#101F38] mb-2">{formType} / {state}</h3>
                        <p className="text-sm text-[#5B6472] mb-4">{address}</p>
                        <p className="text-xs text-[#5B6472]">Use this address only when filing the selected form from the chosen state. Verify the final mailing instructions on the official USCIS website before sending.</p>
                    </>
                ) : (
                    <p className="text-sm text-[#5B6472]">Select a state and a form type to reveal the USCIS lockbox mailing address.</p>
                )}
            </div>

            <InfoBanner>
                This guide is for planning purposes only. Always confirm lockbox addresses directly with USCIS before mailing documents.
            </InfoBanner>
        </div>
    );
}

export default function AdminGuideEnginePage() {
    const [activeTab, setActiveTab] = useState<PanelTab>('Guide Engine');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const s = await getServices();
                setServices(s);
            } catch (err: any) {
                console.error('Failed to load services for guide engine', err);
                setError(err?.message || 'Failed to load service data.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const statCards = [
        {
            label: 'Active guides',
            value: services.length,
            sub: 'USCIS guides available',
            iconBg: '#E6F1FB',
            iconColor: '#185FA5',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
                </svg>
            ),
        },
        {
            label: 'Forms tracked',
            value: services.length,
            sub: 'USCIS forms monitored',
            iconBg: '#EAF3DE',
            iconColor: '#3B6D11',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                </svg>
            ),
        },
        {
            label: 'Fee updates',
            value: services.length,
            sub: 'Current filing fees',
            iconBg: '#EEEDFE',
            iconColor: '#534AB7',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
        },
        {
            label: 'Locations',
            value: new Set(services.map((svc) => svc.tier)).size,
            sub: 'Filing lockboxes',
            iconBg: '#FAEEDA',
            iconColor: '#BA7517',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
        },
    ];

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="mb-8">
                <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Guide Engine</h1>
                <p className="text-[#5B6472] font-medium text-sm mb-6">Manage forms, fee schedules, lockbox information, and workflow guidance for immigration filings.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-sm font-semibold text-[#101F38]">{stat.label}</span>
                                <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                                    {stat.icon}
                                </span>
                            </div>
                            <p className="text-3xl font-black mb-1 tracking-tight text-[#101F38]">{stat.value}</p>
                            <p className="text-xs text-[#5B6472] font-medium">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#ECE9E2]">
                    <span className="w-10 h-10 rounded-xl bg-[#FBEAE4] text-[#E3755D] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
                        </svg>
                    </span>
                    <div>
                        <h2 className="text-base font-bold text-[#101F38]">USCIS guide engine</h2>
                        <p className="text-xs text-[#5B6472] font-medium">Access comprehensive USCIS forms, fees, and processing information for administrative oversight</p>
                    </div>
                </div>

                <div className="px-6 pt-5">
                    <div className="flex items-center gap-1 rounded-full border border-[#ECE9E2] bg-[#F7F5F0] p-1 mb-6 w-full overflow-x-auto">
                        {PANEL_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-[#101F38] shadow-sm' : 'text-[#5B6472] hover:text-[#101F38]'}`}
                            >
                                {TAB_ICONS[tab]}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {loading ? (
                        <div className="rounded-2xl border border-[#ECE9E2] bg-white p-8 text-center text-[#5B6472]">Loading services…</div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
                    ) : (
                        <>
                            {activeTab === 'Guide Engine' && <GuideEngineTab services={services} />}
                            {activeTab === 'Forms Tracker' && <FormsTrackerTab services={services} />}
                            {activeTab === 'Fees' && <FeesTab services={services} />}
                            {activeTab === 'Lockbox' && <LockboxTab />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
