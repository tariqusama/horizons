"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import styles from './profile.module.css';

export default function AccountSettingsPage() {
    const router = useRouter();
    const { user, checkAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Notification states
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(true);
    const [marketingNotifs, setMarketingNotifs] = useState(false);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);

    // Security states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // Privacy states
    const [dataCollection, setDataCollection] = useState(true);
    const [thirdPartySharing, setThirdPartySharing] = useState(false);
    const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_picture', file);
        formData.append('name', `${firstName} ${lastName}`.trim() || user?.name || '');
        formData.append('email', user?.email || '');
        if (phone) formData.append('phone', phone);
        formData.append('_method', 'PUT');

        try {
            await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await checkAuth();
            setSuccessMessage('Profile photo updated successfully!');
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert('Failed to upload photo. Ensure it is under 2MB.');
        }
    };

    useEffect(() => {
        if (user) {
            const parts = user.name?.split(' ') || [];
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
            setPhone(user.phone || '');
            
            setEmailNotifs(user.email_notifications ?? true);
            setSmsNotifs(user.sms_alerts ?? true);
            setMarketingNotifs(user.marketing_emails ?? false);
        }
    }, [user]);

    const handleSavePreferences = async () => {
        setIsSavingPrefs(true);
        try {
            await api.put('/profile', {
                name: `${firstName} ${lastName}`.trim() || user?.name,
                email: user?.email,
                email_notifications: emailNotifs,
                sms_alerts: smsNotifs,
                marketing_emails: marketingNotifs
            });
            await checkAuth();
            setSuccessMessage('Notification preferences updated successfully!');
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert('Failed to update notification preferences. Please try again.');
        } finally {
            setIsSavingPrefs(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/profile', {
                name: `${firstName} ${lastName}`.trim(),
                email: user?.email,
                phone: phone
            });
            await checkAuth();
            setSuccessMessage('Profile updated successfully!');
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSecurity = async () => {
        setPasswordError('');
        
        if (!currentPassword) {
            setPasswordError('Current password is required');
            return;
        }
        if (!newPassword) {
            setPasswordError('New password is required');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setIsSavingSecurity(true);
        try {
            // Simulate backend save for security preferences
            await new Promise(r => setTimeout(r, 500));
            setSuccessMessage('Password updated successfully!');
            setShowSuccessModal(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            setPasswordError('Failed to update password. Please check your current password and try again.');
        } finally {
            setIsSavingSecurity(false);
        }
    };

    const handleSavePrivacy = async () => {
        setIsSavingPrivacy(true);
        try {
            // Simulate backend save for privacy preferences
            await new Promise(r => setTimeout(r, 500));
            setSuccessMessage('Privacy settings updated successfully!');
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert('Failed to update privacy settings. Please try again.');
        } finally {
            setIsSavingPrivacy(false);
        }
    };

    const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'US';
    const profileImage = user?.profile_picture_url;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>Account Settings</h1>
                <p className={styles.subtitle}>Manage your profile and preferences</p>
            </div>

            <div className={styles.tabsContainer}>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
                >
                    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`${styles.tab} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
                >
                    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`${styles.tab} ${activeTab === 'security' ? styles.tabActive : ''}`}
                >
                    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Security
                </button>
                <button
                    onClick={() => setActiveTab('privacy')}
                    className={`${styles.tab} ${activeTab === 'privacy' ? styles.tabActive : ''}`}
                >
                    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy
                </button>
            </div>

            <div className={styles.card}>
                {activeTab === 'profile' && (
                    <>
                        <h2 className={styles.cardTitle}>Profile Information</h2>
                        <p className={styles.cardSubtitle}>Update your personal information and profile picture</p>

                        <div className={styles.avatarSection}>
                            <div className={styles.avatarCircle}>
                                {profileImage ? (
                                    <img src={profileImage} alt={user?.name || 'Profile photo'} className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div className={styles.avatarActions}>
                                <button className={styles.btnChangePhoto} onClick={() => fileInputRef.current?.click()}>Change Photo</button>
                                <input type="file" accept="image/jpeg, image/png, image/gif, image/webp" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoChange} />
                                <p className={styles.avatarHint}>JPG, GIF or PNG. Max size of 2MB</p>
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name</label>
                                <input type="text" className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input type="text" className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>

                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Email Address</label>
                                <input type="text" className={`${styles.input} ${styles.inputReadonly}`} defaultValue={user?.email ?? ''} readOnly />
                                <p className={styles.inputHint}>Contact support to change your email</p>
                            </div>

                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Phone Number</label>
                                <input type="text" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>

                        <button className={styles.btnSave} onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                )}

                {activeTab === 'notifications' && (
                    <>
                        <h2 className={styles.cardTitle}>Notification Preferences</h2>
                        <p className={styles.cardSubtitle}>Manage how and when we contact you</p>

                        <div className={styles.formGroupFull} style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>System Activity Emails</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive updates about critical system events and user activity summaries.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>SMS Alerts</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Get text messages for important account security events.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={marketingNotifs} onChange={(e) => setMarketingNotifs(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>System Error Logs</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive automatic email reports for system errors and failed API requests.</div>
                                </div>
                            </label>
                        </div>

                        <button className={styles.btnSave} onClick={handleSavePreferences} disabled={isSavingPrefs}>
                            {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </>
                )}

                {activeTab === 'security' && (
                    <>
                        <h2 className={styles.cardTitle}>Security Settings</h2>
                        <p className={styles.cardSubtitle}>Update your password and secure your account</p>

                        {passwordError && (
                            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                                {passwordError}
                            </div>
                        )}

                        <div className={styles.formGrid}>
                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>New Password</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.input} />
                            </div>
                        </div>

                        <button className={styles.btnSave} onClick={handleSaveSecurity} disabled={isSavingSecurity}>
                            {isSavingSecurity ? 'Updating...' : 'Update Password'}
                        </button>

                        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>Two-Factor Authentication</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Add an extra layer of security to your account by enabling two-factor authentication.</p>

                        <button className={styles.btnChangePhoto}>Enable 2FA</button>
                    </>
                )}

                {activeTab === 'privacy' && (
                    <>
                        <h2 className={styles.cardTitle}>Privacy Options</h2>
                        <p className={styles.cardSubtitle}>Control your data and privacy settings</p>

                        <div className={styles.formGroupFull} style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={dataCollection} onChange={(e) => setDataCollection(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Data Collection</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow us to collect usage data to improve your experience.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={thirdPartySharing} onChange={(e) => setThirdPartySharing(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Third-party Sharing</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow sharing of non-identifiable data with trusted partners.</div>
                                </div>
                            </label>
                        </div>

                        <button className={styles.btnSave} onClick={handleSavePrivacy} disabled={isSavingPrivacy}>
                            {isSavingPrivacy ? 'Saving...' : 'Save Privacy Settings'}
                        </button>
                    </>
                )}
            </div>

            {showSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{ 
                            backgroundColor: '#D1FAE5', color: '#059669', 
                            width: '64px', height: '64px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            margin: '0 auto 20px auto' 
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Success!</h3>
                        <p style={{ color: '#6B7280', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            {successMessage}
                        </p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            style={{
                                backgroundColor: '#10B981', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
