"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NewCasePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dob: '',
        case_type: '',
        filing_date: '',
        description: ''
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
            await api.post('/admin/cases', formData);
            router.push('/admin/cases');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error('Failed to create case', error);
                alert('An error occurred while creating the case.');
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
            <Link href="/admin/cases" className="flex items-center text-orange-500 font-bold text-sm mb-8 hover:text-orange-600 transition-colors group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Cases
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Create New Case</h1>
                <p className="text-gray-500 mt-2 font-medium">Enter client and case details below. All fields marked with * are required.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Client Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Client Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="John"
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
                                        placeholder="Smith"
                                        className={getInputClass('last_name')}
                                    />
                                    {renderError('last_name')}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john.smith@example.com"
                                        className={getInputClass('email')}
                                    />
                                    {renderError('email')}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className={getInputClass('phone')}
                                    />
                                    {renderError('phone')}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={getInputClass('dob')}
                                />
                                {renderError('dob')}
                            </div>
                        </div>

                        {/* Case Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Case Information</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Case Type *</label>
                                <select 
                                    name="case_type"
                                    value={formData.case_type}
                                    onChange={handleChange}
                                    className={getInputClass('case_type')}
                                >
                                    <option value="">Select a case type...</option>
                                    <option value="i-130">I-130 (Immediate Relative)</option>
                                    <option value="i-485">I-485 (Adjustment of Status)</option>
                                    <option value="i-765">I-765 (Work Authorization)</option>
                                    <option value="i-131">I-131 (Advance Parole)</option>
                                    <option value="eb-1">EB-1 (Employment-Based)</option>
                                    <option value="eb-2">EB-2 (Employment-Based)</option>
                                    <option value="h1b">H1B (Work Visa)</option>
                                    <option value="green-card">Green Card Application</option>
                                    <option value="naturalization">Naturalization</option>
                                </select>
                                {renderError('case_type')}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Filing Date *</label>
                                <input
                                    type="date"
                                    name="filing_date"
                                    value={formData.filing_date}
                                    onChange={handleChange}
                                    className={getInputClass('filing_date')}
                                />
                                {renderError('filing_date')}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Case Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Add any additional notes or details about this case..."
                                    className={getInputClass('description')}
                                />
                                {renderError('description')}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between items-center gap-4">
                            <Link href="/admin/cases" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg disabled:opacity-50">
                                {isSubmitting ? 'Creating...' : 'Create Case'}
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
                                <span>Use the exact legal name as it appears in official documents</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Ensure the filing date matches the USCIS receipt</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Contact information must be current for notifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold mt-0.5">•</span>
                                <span>Add case description for internal reference</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
