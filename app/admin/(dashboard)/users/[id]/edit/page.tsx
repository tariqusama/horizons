"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { getUser, updateUserProfile } from '../../../../../../lib/api/users';
import { User } from '../../../../../../lib/api/users';

export default function AdminEditUserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = Number(params?.id);
    const { user: authUser } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) return;

        const loadUser = async () => {
            try {
                const data = await getUser(userId);
                setUser(data);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone || '');
                setCountry(data.country || '');
                setProfilePicturePreview(data.profile_picture_url || null);
                setRole(data.role || '');
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [userId]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        if (password && password !== passwordConfirmation) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('country', country);
            if (password) {
                formData.append('password', password);
                formData.append('password_confirmation', passwordConfirmation);
            }
            if (role) {
                formData.append('role', role);
            }
            if (profilePictureFile) {
                formData.append('profile_picture', profilePictureFile);
            }

            await updateUserProfile(userId, formData);
            setMessage('User profile updated successfully.');
            router.back();
        } catch (error) {
            console.error('Failed to update user profile:', error);
            setMessage('Unable to save user profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading user profile...</div>;
    }

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'US';

    const roleOptions = (() => {
        // If backend provides an array of assignable roles on the auth user, use it.
        const authAssignable: string[] | undefined = (authUser as any)?.assignable_roles;
        if (Array.isArray(authAssignable) && authAssignable.length > 0) {
            // ensure the edited user's current role appears first
            const list = [...authAssignable];
            if (user?.role && !list.includes(user.role)) list.unshift(user.role);
            else if (user?.role) {
                // move user's role to front
                const idx = list.indexOf(user.role);
                if (idx > 0) {
                    list.splice(idx, 1);
                    list.unshift(user.role);
                }
            }
            return list;
        }

        // Fallback: show the user's role first, then the admin's role if different
        const list: string[] = [];
        if (user?.role) list.push(user.role);
        if (authUser?.role && !list.includes(authUser.role)) list.push(authUser.role);
        return list;
    })();

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
    };

    return (
        <div className="max-w-[900px] mx-auto pb-24 pt-8">
            <div className="mb-8">
                <button onClick={() => router.back()} className="text-[#E3755D] hover:underline font-bold text-sm mb-2 inline-block">
                    &larr; Back to users
                </button>
                <h1 className="text-3xl font-black text-[#111827] mb-2">Edit User Profile</h1>
                <p className="text-gray-500 text-sm font-medium">Update the user account details, role, and profile picture.</p>
            </div>

            {message && (
                <div className="mb-6 rounded-2xl bg-[#EAF0FB] p-4 text-sm font-semibold text-[#3A6FC4]">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl border border-[#ECE9E2] shadow-sm p-6 text-center">
                    <div className="mx-auto mb-4 h-28 w-28 rounded-full overflow-hidden bg-[#F8FAFB] flex items-center justify-center text-3xl font-bold text-[#1B3A64]">
                        {profilePicturePreview ? (
                            <img
                                src={profilePicturePreview}
                                alt={user?.name || 'User avatar'}
                                className="h-full w-full object-cover object-center"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <p className="text-xl font-black text-[#111827] mb-1">{user?.name}</p>
                    <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                    <div className="inline-flex items-center gap-3 rounded-full bg-[#EAF0FB] px-4 py-2 text-sm font-semibold text-[#1B3A64] border border-[#D7E7F4]">
                        <span>Role</span>
                        <span className="rounded-full bg-white px-3 py-1 text-[#1B3A64] border border-[#D7E7F4]">{user?.role}</span>
                    </div>
                    <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1F2937] hover:bg-[#F8FAFC] transition-colors">
                        {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                    </label>
                </div>

                <div className="lg:col-span-2 bg-white rounded-3xl border border-[#ECE9E2] shadow-sm p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Country</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                >
                                    {roleOptions.length > 0 ? (
                                        roleOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={role}>{role || 'No roles available'}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Joined</label>
                                <input
                                    type="text"
                                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                                    readOnly
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#6B7280] outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#ECE9E2] space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1B3A64] mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full rounded-2xl border border-[#ECE9E2] bg-[#F8FAFB] px-4 py-3 text-sm font-medium text-[#111827] outline-none focus:border-[#E3755D] focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-2xl bg-[#E3755D] px-6 py-3 text-sm font-bold text-white hover:bg-[#C8634D] transition disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
