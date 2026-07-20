'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/api/profile';

export default function ManagerProfilePage() {
    const { user, checkAuth } = useAuth();
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setProfilePicturePreview(user?.profile_picture_url || null);
    }, [user]);

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        setProfilePicturePreview(URL.createObjectURL(file));
        setUploading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('profile_picture', file);
            await updateProfile(formData);
            await checkAuth();
            setMessage('Profile picture updated successfully.');
        } catch (error) {
            console.error('Failed to upload profile picture', error);
            setMessage('Unable to update profile picture. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#111827]">My Profile</h1>
                    <p className="text-sm text-[#6B7280] mt-2">Manage your profile details and access settings for your manager account.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/manager/profile/edit" className="inline-flex items-center justify-center rounded-full bg-[#E3755D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C8634D]">
                        Edit Profile
                    </Link>
                    <Link href="/manager" className="text-sm font-semibold text-[#6B7280] hover:text-[#111827]">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-full bg-[#E3755D]/10 overflow-hidden flex items-center justify-center text-[#E3755D] font-black text-4xl">
                            {profilePicturePreview ? (
                                <img src={profilePicturePreview} alt={user?.name || 'Manager image'} className="h-full w-full object-cover" />
                            ) : (
                                user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'MG'
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-[#ECE9E2] shadow-md hover:shadow-lg transition-shadow hover:bg-[#F7F5F0] cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePictureChange}
                                disabled={uploading}
                            />
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                        </label>
                    </div>
                    <p className="text-xs text-[#8A8F98] mb-3">Upload a new profile picture directly from this page.</p>
                    {message && <p className="text-xs font-semibold text-[#185FA5] mb-2">{message}</p>}
                    <h2 className="text-lg font-bold text-[#101F38]">{user?.name || 'Manager User'}</h2>
                    <p className="text-sm text-[#8A8F98] mt-1">{user?.email || 'Not provided'}</p>
                    <div className="inline-flex items-center space-x-1.5 bg-[#D0E5FF] text-[#185FA5] px-3 py-1 rounded-full text-xs font-bold border border-[#A8D5FF] mt-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"></div>
                        <span>Manager Account</span>
                    </div>

                    <Link
                        href="/manager/profile/edit"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E3755D]/30 bg-[#FFF4EF] px-4 py-2.5 text-sm font-bold text-[#E3755D] transition hover:border-[#E3755D] hover:bg-[#FDECE2]"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        Edit Profile
                    </Link>

                    <div className="w-full space-y-4 mt-6 pt-6 border-t border-[#ECE9E2] text-left">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#8A8F98]">Role</p>
                            <p className="text-sm text-[#101F38] mt-1 font-semibold">{user?.role || 'Manager'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#8A8F98]">Member Since</p>
                            <p className="text-sm text-[#101F38] mt-1 font-semibold">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-[#111827] mb-4">Account Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-3xl border border-[#E5E7EB] p-5 bg-[#FAFAFB]">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Assigned Cases</p>
                            <p className="mt-3 text-3xl font-black text-[#111827]">-</p>
                        </div>
                        <div className="rounded-3xl border border-[#E5E7EB] p-5 bg-[#FAFAFB]">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Notifications</p>
                            <p className="mt-3 text-3xl font-black text-[#111827]">-</p>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-[#6B7280]">
                        <p>
                            This page is your manager profile hub. You can update your account details and preferences from the edit profile option.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
