"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfile, updateProfile, Profile } from '../../../../lib/api/profile';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
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
    <div className="w-full max-w-[1000px] mx-auto pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard/profile" className="text-[#E3755D] hover:underline font-bold text-sm mb-2 inline-block">
            &larr; Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-[#1B3A64] mb-2">Edit Profile Settings</h1>
          <p className="text-gray-500 font-medium text-[15px]">
            Manage your personal information, security preferences, and profile picture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#F3F4F6] overflow-hidden flex items-center justify-center text-3xl font-bold text-[#1F2937] mb-4 relative">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt={profile?.name || 'Profile picture'} className="h-full w-full object-cover" />
              ) : (
                profile?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'AD'
              )}
              <label className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-white rounded-full p-2 border border-gray-200 cursor-pointer shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M12 15V3" />
                </svg>
              </label>
            </div>
            <h3 className="font-bold text-[#1B3A64] text-lg">{profile?.name || 'Account User'}</h3>
            <p className="text-gray-500 text-sm font-medium mb-4">{profile?.email || 'No email provided'}</p>
            <div className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Profile Picture</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <h2 className="text-xl font-black text-[#1B3A64] mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
          {message && (
            <div className="mb-6 rounded-2xl bg-[#EAF0FB] p-4 text-sm font-semibold text-[#3A6FC4]">
              {message}
            </div>
          )}
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

            <div className="pt-6 flex justify-end gap-3">
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
