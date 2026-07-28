"use client";

import React, { useState, useEffect } from 'react';
import { getServices, Service } from '../../../../lib/api/services';
import { getRevenueData, RevenueData } from '../../../../lib/api/revenue';

const Icon = {
    dollar: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    package: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path></svg>,
    trendingUp: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>,
    refresh: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>,
};



const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Type definitions for pricing tiers
interface ServiceTier {
    name: string;
    price: number;
}

interface ServiceData {
    name: string;
    description: string;
    category: string;
    tiers: ServiceTier[];
    sales: number;
    revenue: number;
}

export default function ServicePricingPage() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [revData] = await Promise.all([getRevenueData()]);

            const staticServices: ServiceData[] = [
                {
                    name: "Marriage Green Card inside the U.S. – Concurrent Filing",
                    category: "adjustment",
                    description: "I-130 and I-485 concurrent filing for marriage-based green card",
                    tiers: [
                        { name: "Basic", price: 629.99 },
                        { name: "Advanced", price: 949.99 },
                        { name: "Premium", price: 1249.99 }
                    ],
                    sales: 6,
                    revenue: 2490.00
                },
                {
                    name: "Parent Adjustment of Status inside the U.S. – Concurrent Filing",
                    category: "adjustment",
                    description: "I-130 and I-485 concurrent filing for parent adjustment",
                    tiers: [
                        { name: "Basic", price: 599.99 },
                        { name: "Advanced", price: 949.99 },
                        { name: "Premium", price: 1249.99 }
                    ],
                    sales: 3,
                    revenue: 1347.00
                },
                {
                    name: "Child Adjustment of Status inside the U.S. – Concurrent Filing",
                    category: "adjustment",
                    description: "I-130 and I-485 concurrent filing for child adjustment",
                    tiers: [
                        { name: "Basic", price: 599.99 },
                        { name: "Advanced", price: 949.99 },
                        { name: "Premium", price: 1249.99 }
                    ],
                    sales: 4,
                    revenue: 1796.00
                },
                {
                    name: "Petition for a Spouse outside the U.S. – USCIS Petition only",
                    category: "petition",
                    description: "I-130 petition for spouse outside the United States",
                    tiers: [
                        { name: "Basic", price: 549.99 },
                        { name: "Advanced", price: 789.99 },
                        { name: "Premium", price: 999.99 }
                    ],
                    sales: 8,
                    revenue: 2552.00
                },
                {
                    name: "Petition for a Child outside the U.S. – USCIS Petition only",
                    category: "petition",
                    description: "I-130 petition for child outside the United States",
                    tiers: [
                        { name: "Basic", price: 549.99 },
                        { name: "Advanced", price: 789.99 },
                        { name: "Premium", price: 999.99 }
                    ],
                    sales: 5,
                    revenue: 1595.00
                },
                {
                    name: "Petition for a Parent outside the U.S. – USCIS Petition only",
                    category: "petition",
                    description: "I-130 petition for parent outside the United States",
                    tiers: [
                        { name: "Basic", price: 549.99 },
                        { name: "Advanced", price: 789.99 },
                        { name: "Premium", price: 999.99 }
                    ],
                    sales: 2,
                    revenue: 799.00
                },
                {
                    name: "Petition for a Sibling outside the U.S. – USCIS Petition only",
                    category: "petition",
                    description: "I-130 petition for sibling outside the United States",
                    tiers: [
                        { name: "Basic", price: 549.99 },
                        { name: "Advanced", price: 789.99 },
                        { name: "Premium", price: 999.99 }
                    ],
                    sales: 1,
                    revenue: 399.50
                },
                {
                    name: "K-1 Fiancé Visa – USCIS Petition only",
                    category: "petition",
                    description: "I-129F petition for K-1 fiancé visa",
                    tiers: [
                        { name: "Basic", price: 549.99 },
                        { name: "Advanced", price: 849.99 },
                        { name: "Premium", price: 1049.99 }
                    ],
                    sales: 6,
                    revenue: 2694.00
                },
                {
                    name: "Petition to Remove Conditions on Conditional Residence – Joint Filing",
                    category: "renewal",
                    description: "I-751 petition to remove conditions (joint filing)",
                    tiers: [
                        { name: "Basic", price: 399.99 },
                        { name: "Advanced", price: 499.99 },
                        { name: "Premium", price: 699.99 }
                    ],
                    sales: 1,
                    revenue: 420.00
                },
                {
                    name: "Renew or Replace Permanent Resident Card (Green Card Renewal / I-90)",
                    category: "renewal",
                    description: "I-90 application to renew or replace green card",
                    tiers: [
                        { name: "Basic", price: 349.99 },
                        { name: "Advanced", price: 449.99 },
                        { name: "Premium", price: 599.99 }
                    ],
                    sales: 7,
                    revenue: 1743.00
                },
                {
                    name: "DACA Renewal (Deferred Action for Childhood Arrivals)",
                    category: "other",
                    description: "I-821D DACA renewal application",
                    tiers: [
                        { name: "Basic", price: 299.99 },
                        { name: "Advanced", price: 399.99 },
                        { name: "Premium", price: 539.99 }
                    ],
                    sales: 1,
                    revenue: 250.00
                },
                {
                    name: "Application for U.S. Citizenship (Naturalization / N-400)",
                    category: "other",
                    description: "N-400 application for naturalization",
                    tiers: [
                        { name: "Basic", price: 349.99 },
                        { name: "Advanced", price: 449.99 },
                        { name: "Premium", price: 649.99 }
                    ],
                    sales: 2,
                    revenue: 550.00
                }
            ];

            setServices(staticServices);
            setRevenueData(revData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalStats = {
        totalRevenue: revenueData?.stats.total_revenue || 16635.50,
        activeServices: services.length || 12,
        totalSales: services.reduce((sum, svc) => sum + svc.sales, 0) || 46
    };

    const addOnServices = [
        {
            title: "Expedited Form Preparation (Rush 48 hrs)",
            description: "Priority preparation of the full application packet within 48 business hours after all documents are received.",
            price: 199.99,
            sales: 12,
            revenue: 2388.00
        },
        {
            title: "Document Translation – Extra Pages",
            description: "Translation of non-English pages exceeding what's included in your plan.",
            price: 30.00,
            sales: 8,
            revenue: 240.00
        },
        {
            title: "Certified Copy & E-Notary Service",
            description: "Certified copies and notarization for affidavits, letters, or supporting evidence.",
            price: 39.99,
            sales: 15,
            revenue: 584.85
        },
        {
            title: "Priority Printing & Overnight Shipping (U.S. only)",
            description: "Same-day printing and overnight delivery of the complete application packet.",
            price: 69.99,
            sales: 6,
            revenue: 414.00
        }
    ];

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2 bg-slate-50">
            {/* Page Header */}
            <div className="mb-6 px-1">
                <h1 className="text-2xl font-bold text-slate-900">Service & Pricing</h1>
                <p className="text-sm text-slate-600 mt-1">Manage immigration services, pricing tiers, and service catalog</p>
            </div>

            <div className="space-y-6">
                {/* Title with Refresh */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Service & Pricing</h2>
                    <button
                        onClick={loadData}
                        className="text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-2"
                    >
                        <Icon.refresh className="h-4 w-4 inline" />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Total Revenue Card */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <h3 className="tracking-tight text-sm font-semibold text-slate-600">Total Revenue</h3>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Icon.dollar className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="pt-0">
                            <div className="text-3xl font-bold text-slate-900">{money(totalStats.totalRevenue)}</div>
                            <p className="text-xs text-slate-500 mt-2">From all services</p>
                        </div>
                    </div>

                    {/* Active Services Card */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <h3 className="tracking-tight text-sm font-semibold text-slate-600">Active Services</h3>
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Icon.package className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="pt-0">
                            <div className="text-3xl font-bold text-slate-900">{totalStats.activeServices}</div>
                            <p className="text-xs text-slate-500 mt-2">Available to customers</p>
                        </div>
                    </div>

                    {/* Total Sales Card */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <h3 className="tracking-tight text-sm font-semibold text-slate-600">Total Sales</h3>
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                <Icon.trendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="pt-0">
                            <div className="text-3xl font-bold text-slate-900">{totalStats.totalSales}</div>
                            <p className="text-xs text-slate-500 mt-2">Completed purchases</p>
                        </div>
                    </div>
                </div>

                {/* Service Catalog Section */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Service Catalog</h3>
                                <p className="text-sm text-slate-600 mt-1">Manage services and pricing tiers</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {!loading && services.length > 0 ? (
                                services.map((service, idx) => (
                                    <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="flex flex-col space-y-1.5 p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold tracking-tight text-lg text-slate-900">{service.name}</h3>
                                                        <div className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 bg-white capitalize">
                                                            {service.category}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-1 mb-4">{service.description}</p>

                                                    <div className="space-y-4">
                                                        {/* Pricing Tiers */}
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 mb-3">Pricing Tiers:</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                {service.tiers.map((tier, tierIdx) => (
                                                                    <div key={tierIdx} className="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                                                                        <p className="text-xs font-semibold text-slate-600 mb-1">{tier.name}</p>
                                                                        <p className="text-lg font-bold text-slate-900">{money(tier.price)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Performance Metrics */}
                                                        <div className="pt-2 border-t border-slate-200">
                                                            <p className="text-sm font-semibold text-slate-900 mb-3">Performance Metrics:</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                                    <p className="text-xs font-semibold text-slate-600 mb-1">Sales</p>
                                                                    <p className="text-lg font-bold text-blue-700">{service.sales}</p>
                                                                </div>
                                                                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                                                                    <p className="text-xs font-semibold text-slate-600 mb-1">Revenue</p>
                                                                    <p className="text-lg font-bold text-green-700">{money(service.revenue)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add-on Services Section */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900">Add-on Services</h3>
                        <p className="text-sm text-slate-600">Additional services that can be purchased alongside main immigration services</p>
                    </div>

                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {addOnServices.map((addon, idx) => (
                                <div key={idx} className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{addon.title}</h4>
                                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{addon.description}</p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-xs font-semibold text-slate-700 mb-2">Pricing</p>
                                            <div className="text-center p-2.5 bg-blue-50 border border-blue-100 rounded">
                                                <p className="text-xs text-slate-600">Price</p>
                                                <p className="text-lg font-bold text-blue-700">{money(addon.price)}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-slate-700 mb-2">Performance</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div className="text-center p-2.5 bg-purple-50 border border-purple-100 rounded">
                                                    <p className="text-xs text-slate-600">Sales</p>
                                                    <p className="text-sm font-bold text-purple-700">{addon.sales}</p>
                                                </div>
                                                <div className="text-center p-2.5 bg-green-50 border border-green-100 rounded">
                                                    <p className="text-xs text-slate-600">Revenue</p>
                                                    <p className="text-sm font-bold text-green-700">{money(addon.revenue)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}