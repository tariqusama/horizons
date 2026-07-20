"use client";

import React, { useState, useEffect } from 'react';
import { getServices, Service } from '../../../../lib/api/services';
import { getRevenueData, RevenueData } from '../../../../lib/api/revenue';

const Icon = {
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    plus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    more: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>,
    dollar: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    layers: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    trend: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    refresh: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
};

// Fetched from API now



const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ServicePricingPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [svcData, revData] = await Promise.all([getServices(), getRevenueData()]);
            setServices(svcData);
            setRevenueData(revData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const stats = [
        { label: "Total Revenue", value: revenueData ? money(revenueData.stats.total_revenue) : "$0.00", note: "This month", icon: Icon.dollar },
        { label: "Active Services", value: services.length.toString(), note: "Available to customers", icon: Icon.layers },
        { label: "Subscriptions", value: revenueData ? revenueData.stats.active_subscriptions.toString() : "0", note: "Active purchases", icon: Icon.trend },
    ];

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Service & Pricing</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Manage immigration services, pricing tiers, and service catalog.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-[#ECE9E2] hover:border-[#101F38] text-[#101F38] px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm w-fit" onClick={() => window.location.reload()}>
                    <Icon.refresh width={14} height={14} />
                    Refresh
                </button>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-5 flex items-start justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-2">{s.label}</p>
                            <p className="text-[26px] font-black text-[#101F38] tracking-tight leading-none">{s.value}</p>
                            <p className="text-xs font-semibold text-[#8A8F98] mt-2">{s.note}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#F5F4F1] text-[#5B6472] flex items-center justify-center shrink-0">
                            <s.icon width={16} height={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Catalog */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-lg font-bold text-[#101F38]">Service Catalog</h2>
                    <p className="text-[#5B6472] text-xs font-medium mt-1">Manage services and pricing tiers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {services.map((svc) => {
                    const revenueForService = revenueData?.by_service.find(r => r.service === svc.name)?.revenue || 0;
                    return (
                        <div key={svc.id} className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 flex flex-col">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <span
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#E4E9F2] text-[#101F38]"
                                >
                                    {svc.tier}
                                </span>
                            </div>

                            <h3 className="font-bold text-[#101F38] text-base leading-snug mb-1">{svc.name}</h3>
                            <p className="text-[#5B6472] text-xs font-medium mb-5">{svc.description}</p>

                            <div className="grid grid-cols-1 gap-2 mb-5">
                                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#101F38" }}>
                                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider mb-1">Price</p>
                                    <p className="text-sm font-black text-white">{money(Number(svc.price))}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-[#ECE9E2] mt-auto">
                                <div>
                                    <p className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Revenue</p>
                                    <p className="text-sm font-black text-[#2F8A5F]">{money(revenueForService)}</p>
                                </div>
                                <button className="ml-auto text-[#B7B4AA] hover:text-[#101F38] transition-colors p-1">
                                    <Icon.more width={16} height={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}