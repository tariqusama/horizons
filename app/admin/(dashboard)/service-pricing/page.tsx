"use client";

import React, { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService, Service, ServicePackage } from '../../../../lib/api/services';
import { getRevenueData, RevenueData } from '../../../../lib/api/revenue';

const Icon = {
    dollar: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    package: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path></svg>,
    trendingUp: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>,
    refresh: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>,
    plus: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    edit: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
    trash: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
};

const money = (val: any) => {
    if (typeof val === 'string' && val.startsWith('$')) return val;
    const n = parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

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
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [price, setPrice] = useState(0);
    const [processingTime, setProcessingTime] = useState('');
    const [saving, setSaving] = useState(false);
    
    // Package States
    const [packages, setPackages] = useState<ServicePackage[]>([
        { name: 'Basic Plan', price: 0, order_index: 0, features: [] },
        { name: 'Advanced Plan', price: 0, order_index: 1, features: [] },
        { name: 'Premium Plan', price: 0, order_index: 2, features: [] },
    ]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (service) {
            setTitle(service.title);
            setSubtitle(service.subtitle || '');
            let p = 0;
            if (service.starting_price) {
                p = parseFloat(String(service.starting_price).replace(/[^0-9.]/g, '')) || 0;
            }
            setPrice(p);
            setProcessingTime(service.processing_time || '');
            
            if (service.packages && service.packages.length > 0) {
                // Ensure we have exactly 3 packages for UI simplicity, mapping by index
                const newPackages = [...packages];
                service.packages.forEach((pkg, idx) => {
                    if (idx < 3) {
                        newPackages[idx] = {
                            id: pkg.id,
                            name: pkg.name || newPackages[idx].name,
                            price: typeof pkg.price === 'string' ? parseFloat(String(pkg.price).replace(/[^0-9.]/g, '')) || 0 : pkg.price,
                            order_index: pkg.order_index,
                            features: pkg.features || []
                        };
                    }
                });
                setPackages(newPackages);
            }
        } else {
            setTitle('');
            setSubtitle('');
            setPrice(0);
            setProcessingTime('');
            setPackages([
                { name: 'Basic Plan', price: 0, order_index: 0, features: [] },
                { name: 'Advanced Plan', price: 0, order_index: 1, features: [] },
                { name: 'Premium Plan', price: 0, order_index: 2, features: [] },
            ]);
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({ title, subtitle, starting_price: price, processing_time: processingTime, order_index: 0, is_popular: false, packages });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const updatePackage = (idx: number, field: string, value: any) => {
        const newPkgs = [...packages];
        newPkgs[idx] = { ...newPkgs[idx], [field]: value };
        setPackages(newPkgs);
    };

    const handleFeaturesChange = (idx: number, value: string) => {
        const features = value.split('\n').filter(line => line.trim() !== '');
        updatePackage(idx, 'features', features);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold text-slate-900">{service ? 'Edit Service' : 'Add Service'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
                    <div className="p-6 overflow-y-auto space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 text-sm border-b pb-2">General Details</h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-900 mb-1">Service Title</label>
                                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Green Card Renewal" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-900 mb-1">Subtitle / Description</label>
                                <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Brief description" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-900 mb-1">Starting Price ($)</label>
                                    <input required type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-900 mb-1">Processing Time</label>
                                    <input value={processingTime} onChange={e => setProcessingTime(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 12-18 Months" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 text-sm border-b pb-2">Pricing Packages</h3>
                            
                            <div className="flex border-b border-slate-200">
                                {packages.map((pkg, idx) => (
                                    <button 
                                        key={idx} type="button"
                                        onClick={() => setActiveTab(idx)}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === idx ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {pkg.name || `Package ${idx + 1}`}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-900 mb-1">Package Name</label>
                                        <input required value={packages[activeTab].name} onChange={e => updatePackage(activeTab, 'name', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Basic Plan" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-900 mb-1">Package Price ($)</label>
                                        <input required type="number" step="0.01" value={packages[activeTab].price} onChange={e => updatePackage(activeTab, 'price', parseFloat(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-900 mb-1">Features (One per line)</label>
                                    <textarea 
                                        rows={5}
                                        value={(packages[activeTab].features || []).join('\n')} 
                                        onChange={e => handleFeaturesChange(activeTab, e.target.value)} 
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" 
                                        placeholder="Complete form preparation...&#10;Dedicated case manager..."
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        {activeTab === 0 && "These map to 'All Plans Include'"}
                                        {activeTab === 1 && "These map to 'Advanced Plan Adds'"}
                                        {activeTab === 2 && "These map to 'Premium Plan Exclusive Benefits'"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-200 flex justify-end gap-3 shrink-0 bg-slate-50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ServicePricingPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [revData, svcData] = await Promise.all([
                getRevenueData().catch(() => null),
                getServices()
            ]);

            if (revData) setRevenueData(revData);
            setServices(svcData || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveService = async (data: Partial<Service>) => {
        if (editingService) {
            await updateService(editingService.id, data);
        } else {
            await createService(data);
        }
        await loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this service?")) {
            await deleteService(id);
            await loadData();
        }
    };

    const totalStats = {
        totalRevenue: revenueData?.stats.total_revenue || 0,
        activeServices: services.length || 0,
        totalSales: 0 // Mocked for now, if you have sales tracking add it here
    };

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2 bg-slate-50">
            {/* Page Header */}
            <div className="mb-6 px-1 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Service & Pricing</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage immigration services, pricing tiers, and service catalog</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Title with Refresh */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Overview</h2>
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
                </div>

                {/* Service Catalog Section */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Service Catalog</h3>
                                <p className="text-sm text-slate-600 mt-1">Manage services and pricing tiers</p>
                            </div>
                            <button
                                onClick={() => { setEditingService(null); setIsModalOpen(true); }}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                            >
                                <Icon.plus className="h-4 w-4" />
                                Add Service
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {!loading && services.length > 0 ? (
                                services.map((service, idx) => (
                                    <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold tracking-tight text-lg text-slate-900">{service.title || 'Untitled Service'}</h3>
                                                {service.processing_time && (
                                                    <div className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 bg-white capitalize">
                                                        {service.processing_time}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">{service.subtitle}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs font-semibold text-slate-500">Price</p>
                                                <p className="text-xl font-bold text-slate-900">{money(service.starting_price)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                                                <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Icon.edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Icon.trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    {loading ? 'Loading services...' : 'No services found. Add one to get started.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
                service={editingService}
            />
        </main>
    );
}