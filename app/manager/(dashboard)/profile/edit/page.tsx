'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/api/profile';

export default function ManagerEditProfilePage() {
    const { user, checkAuth } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) return;
        const parts = user.name?.split(' ') || [];
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setProfilePicturePreview(user.profile_picture_url || null);
    }, [user]);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setSaving(true);

        try {
            const name = `${firstName || ''} ${lastName || ''}`.trim();
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            if (profilePictureFile) {
                formData.append('profile_picture', profilePictureFile);
            }

            await updateProfile(formData);
            await checkAuth();
            setMessage('Profile updated successfully.');
        } catch (err) {
            console.error('Failed to update manager profile', err);
            setMessage('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto pb-24 pt-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link href="/manager/profile" className="text-[#E3755D] hover:underline font-bold text-sm mb-2 inline-block">
                        &larr; Back to Profile
                    </Link>
                    <h1 className="text-3xl font-black text-[#101F38] mb-2">Edit Profile Settings</h1>
                    <p className="text-[#8A8F98] font-medium text-[15px]">
                        Update your manager profile information and account preferences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ECE9E2] text-center flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#101F38] to-[#2563EB] text-white flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden relative">
                            {profilePicturePreview ? (
                                <img
                                    src={profilePicturePreview}
                                    alt={user?.name || 'Manager avatar'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>{user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'MG'}</span>
                            )}
                            <label className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-white rounded-full p-2 border border-[#ECE9E2] cursor-pointer shadow-sm">
                                <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#101F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <path d="M7 10l5 5 5-5" />
                                    <path d="M12 15V3" />
                                </svg>
                            </label>
                        </div>
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#ECE9E2] px-4 py-2 text-sm font-semibold text-[#101F38] hover:bg-[#F8FAFC] transition-colors">
                            Change Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                        </label>
                        <h3 className="font-bold text-[#101F38] text-lg mt-4">{user?.name || 'Manager User'}</h3>
                        <p className="text-[#8A8F98] text-sm font-medium mb-4">{user?.email || 'No email provided'}</p>
                        <div className="inline-flex items-center space-x-1.5 bg-[#D0E5FF] text-[#185FA5] px-3 py-1 rounded-full text-xs font-bold border border-[#A8D5FF]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"></div>
                            <span>Manager Account</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#ECE9E2]">
                        <h2 className="text-xl font-black text-[#101F38] mb-6 border-b border-[#ECE9E2] pb-4">Personal Information</h2>
                        {message && (
                            <div className="mb-6 rounded-2xl bg-[#EAF0FB] p-4 text-sm font-semibold text-[#3A6FC4]">
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#101F38]">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-[#F7F5F0] border border-[#ECE9E2] text-[#101F38] font-bold text-[15px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 focus:border-[#E3755D] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#101F38]">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-[#F7F5F0] border border-[#ECE9E2] text-[#101F38] font-bold text-[15px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 focus:border-[#E3755D] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#101F38]">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#F7F5F0] border border-[#ECE9E2] text-[#101F38] font-bold text-[15px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 focus:border-[#E3755D] transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#101F38]">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-[#F7F5F0] border border-[#ECE9E2] text-[#101F38] font-bold text-[15px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 focus:border-[#E3755D] transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#101F38]">Role</label>
                                <input
                                    type="text"
                                    value={user?.role || 'Manager'}
                                    readOnly
                                    className="w-full bg-[#F7F5F0] border border-[#ECE9E2] text-[#8A8F98] text-[15px] rounded-2xl px-4 py-3"
                                />
                            </div>

                            <div className="pt-6 border-t border-[#ECE9E2] flex flex-col sm:flex-row sm:justify-end gap-3">
                                <Link href="/manager/profile" className="px-6 py-3 text-[#5B6472] font-bold text-sm hover:text-[#101F38] transition-colors text-center rounded-2xl border border-[#ECE9E2]">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#E3755D] hover:bg-[#C8634D] disabled:cursor-not-allowed disabled:opacity-60 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-colors shadow-sm"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
