"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NewClientPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        alt_phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        status: 'active',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error when typing
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await api.post('/admin/clients', formData);
            router.push('/admin/clients');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error('Failed to create client', error);
                alert('An error occurred while creating the client.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputClass = (fieldName: string) => {
        const baseClass = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 font-medium text-gray-900 transition-colors";
        if (errors[fieldName]) {
            return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
        }
        return `${baseClass} border-gray-200 focus:ring-orange-500/20 focus:border-orange-500`;
    };

    const renderError = (fieldName: string) => {
        if (!errors[fieldName]) return null;
        return <p className="text-sm text-red-500 mt-1">{errors[fieldName][0]}</p>;
    };

    return (
        <div className="max-w-[1000px] mx-auto w-full pb-12">
            {/* Back Button */}
            <Link href="/admin/clients" className="flex items-center text-orange-500 font-bold text-sm mb-8 hover:text-orange-600 transition-colors group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Clients
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Add New Client</h1>
                <p className="text-gray-500 mt-2 font-medium">Fill in the client profile below. All fields marked with * are required.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="Maria"
                                        className={getInputClass('first_name')}
                                    />
                                    {renderError('first_name')}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Rodriguez"
                                        className={getInputClass('last_name')}
                                    />
                                    {renderError('last_name')}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="maria@example.com"
                                    className={getInputClass('email')}
                                />
                                {renderError('email')}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (415) 555-0198"
                                        className={getInputClass('phone')}
                                    />
                                    {renderError('phone')}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Alternative Phone</label>
                                    <input
                                        type="tel"
                                        name="alt_phone"
                                        value={formData.alt_phone}
                                        onChange={handleChange}
                                        placeholder="+1 (415) 555-0199"
                                        className={getInputClass('alt_phone')}
                                    />
                                    {renderError('alt_phone')}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Address Information</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="123 Main Street"
                                    className={getInputClass('street')}
                                />
                                {renderError('street')}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="San Francisco"
                                        className={getInputClass('city')}
                                    />
                                    {renderError('city')}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="California"
                                        className={getInputClass('state')}
                                    />
                                    {renderError('state')}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        placeholder="94102"
                                        className={getInputClass('zip')}
                                    />
                                    {renderError('zip')}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="United States"
                                        className={getInputClass('country')}
                                    />
                                    {renderError('country')}
                                </div>
                            </div>
                        </div>

                        {/* Client Status */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Client Status</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-3">Account Status *</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange} className="w-4 h-4 accent-[#E3755D]" />
                                        <span className="text-sm font-medium text-gray-700">Active - Client account is active</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange} className="w-4 h-4 accent-[#E3755D]" />
                                        <span className="text-sm font-medium text-gray-700">Inactive - Pause client account</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="status" value="new" checked={formData.status === 'new'} onChange={handleChange} className="w-4 h-4 accent-[#E3755D]" />
                                        <span className="text-sm font-medium text-gray-700">New - First time client</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Internal Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Add any internal notes or special handling instructions..."
                                    className={getInputClass('notes')}
                                />
                                {renderError('notes')}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between items-center gap-4">
                            <Link href="/admin/clients" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : 'Add Client'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Tips
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Verify email address is correct for communications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Include alternative contact when available</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Use complete address information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Set appropriate status for account management</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
