import React from 'react';
import Link from 'next/link';

export default function NewCasePage() {
    return (
        <div className="max-w-[1000px] mx-auto w-full pb-12">
            {/* Back Button */}
            <Link href="/admin/cases" className="flex items-center text-[#E3755D] font-bold text-sm mb-8 hover:text-[#C8634D] transition-colors group">
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
                    <form className="space-y-8">
                        {/* Client Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Client Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Smith"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john.smith@example.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Date of Birth *</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Case Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Case Information</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Case Type *</label>
                                <select required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900">
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
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Filing Date *</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Case Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Add any additional notes or details about this case..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between items-center gap-4">
                            <Link href="/admin/cases" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg">
                                Create Case
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
                                <span>Use the exact legal name as it appears in official documents</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Ensure the filing date matches the USCIS receipt</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Contact information must be current for notifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Add case description for internal reference</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
