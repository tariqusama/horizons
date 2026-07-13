"use client";

import React, { useState } from 'react';
import styles from './profile.module.css';

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

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
                            <div className={styles.avatarCircle}>SS</div>
                            <div className={styles.avatarActions}>
                                <button className={styles.btnChangePhoto}>Change Photo</button>
                                <p className={styles.avatarHint}>JPG, GIF or PNG. Max size of 2MB</p>
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name</label>
                                <input type="text" className={styles.input} defaultValue="Shehryar" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input type="text" className={styles.input} defaultValue="Shafique" />
                            </div>

                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Email Address</label>
                                <input type="text" className={`${styles.input} ${styles.inputReadonly}`} defaultValue="shehryarshafique04@gmail.com" readOnly />
                                <p className={styles.inputHint}>Contact support to change your email</p>
                            </div>

                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Phone Number</label>
                                <input type="text" className={styles.input} />
                            </div>
                        </div>

                        <button className={styles.btnSave}>Save Changes</button>
                    </>
                )}

                {activeTab === 'notifications' && (
                    <>
                        <h2 className={styles.cardTitle}>Notification Preferences</h2>
                        <p className={styles.cardSubtitle}>Manage how and when we contact you</p>

                        <div className={styles.formGroupFull} style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Email Notifications</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive updates about your application status via email.</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>SMS Alerts</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Get text messages for important account security events.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Marketing Emails</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive promotional offers and newsletters.</div>
                                </div>
                            </label>
                        </div>

                        <button className={styles.btnSave}>Save Preferences</button>
                    </>
                )}

                {activeTab === 'security' && (
                    <>
                        <h2 className={styles.cardTitle}>Security Settings</h2>
                        <p className={styles.cardSubtitle}>Update your password and secure your account</p>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroupFull}>
                                <label className={styles.label}>Current Password</label>
                                <input type="password" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>New Password</label>
                                <input type="password" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm New Password</label>
                                <input type="password" className={styles.input} />
                            </div>
                        </div>

                        <button className={styles.btnSave}>Update Password</button>

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
                                <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Data Collection</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow us to collect usage data to improve your experience.</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ea580c' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Third-party Sharing</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow sharing of non-identifiable data with trusted partners.</div>
                                </div>
                            </label>
                        </div>

                        <button className={styles.btnSave}>Save Privacy Settings</button>
                    </>
                )}
            </div>
        </div>
    );
}
