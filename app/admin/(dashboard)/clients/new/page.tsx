import React from 'react';
import Link from 'next/link';

export default function NewClientPage() {
    return (
        <div className="max-w-[1000px] mx-auto w-full pb-12">
            {/* Back Button */}
            <Link href="/admin/clients" className="flex items-center text-[#E3755D] font-bold text-sm mb-8 hover:text-[#C8634D] transition-colors group">
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
                    <form className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Maria"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Rodriguez"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="maria@example.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 (415) 555-0198"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Alternative Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (415) 555-0199"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
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
                                    required
                                    placeholder="123 Main Street"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">City *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="San Francisco"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">State *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="California"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="94102"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Country *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="United States"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
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
                                        <input type="radio" name="status" value="active" defaultChecked className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Active - Client account is active</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="status" value="inactive" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Inactive - Pause client account</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="status" value="new" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">New - First time client</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Internal Notes</label>
                                <textarea
                                    rows={4}
                                    placeholder="Add any internal notes or special handling instructions..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between items-center gap-4">
                            <Link href="/admin/clients" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg">
                                Add Client
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E3755D]">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Tips
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Verify email address is correct for communications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Include alternative contact when available</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Use complete address information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Set appropriate status for account management</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
