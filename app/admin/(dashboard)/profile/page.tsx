'use client';
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, Profile } from '../../../../lib/api/profile';

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone || '');
            setProfilePicturePreview(data.profile_picture_url || null);
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        if (password && password !== passwordConfirmation) {
            setMessage('Passwords do not match');
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            if (profilePictureFile) {
                formData.append('profile_picture', profilePictureFile);
            }
            if (password) {
                formData.append('password', password);
                formData.append('password_confirmation', passwordConfirmation);
            }

            const result = await updateProfile(formData);
            if (result.user) {
                setProfile(result.user);
                setProfilePicturePreview(result.user.profile_picture_url || profilePicturePreview);
            }
            setMessage('Profile updated successfully');
            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            console.error('Failed to update profile', err);
            setMessage('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-[900px] mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">My Profile</h1>
                <p className="text-[#5B6472] font-medium text-sm">Update your personal information, password, and profile picture.</p>
            </div>

            {message && (
                <div className="mb-6 p-4 rounded-xl bg-[#EAF0FB] text-[#3A6FC4] font-semibold text-sm">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 text-center">
                    <div className="mx-auto mb-4 h-28 w-28 rounded-full overflow-hidden bg-[#F3F4F6] flex items-center justify-center text-3xl font-bold text-[#1F2937]">
                        {profilePicturePreview ? (
                            <img src={profilePicturePreview} alt={profile?.name || 'Profile picture'} className="h-full w-full object-cover object-center block rounded-full" />
                        ) : (
                            profile?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'AD'
                        )}
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-[#111827]">{profile?.name || 'Admin User'}</p>
                        <p className="text-sm text-[#6B7280]">{profile?.email}</p>
                    </div>
                    <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-[#ECE9E2] px-4 py-2 text-sm font-semibold text-[#1F2937] hover:bg-[#F8FAFC] transition-colors">
                        Change Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                    </label>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            />
                        </div>

                        <div className="pt-4 border-t border-[#ECE9E2]">
                            <h3 className="text-sm font-bold text-[#101F38] mb-4">Change Password</h3>
                            <p className="text-xs text-[#8A8F98] mb-4">Leave blank if you do not want to change your password.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#5B6472] mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 rounded-full bg-[#101F38] text-white font-bold text-sm hover:bg-[#2A3F61] transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
