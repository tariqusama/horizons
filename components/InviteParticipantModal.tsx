import React, { useState } from 'react';
import api from '@/lib/api';

interface InviteParticipantModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: number;
    applicationTitle: string;
    applicationSlug?: string;
}

export default function InviteParticipantModal({ isOpen, onClose, applicationId, applicationTitle, applicationSlug }: InviteParticipantModalProps) {
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(inviteLink).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = inviteLink;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            document.body.prepend(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error(error);
            } finally {
                textArea.remove();
            }
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            // Set default role based on slug when modal opens
            if (applicationSlug === 'i-751') setRole('Spouse');
            else setRole('Beneficiary');
        }
    }, [isOpen, applicationSlug]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInviteLink('');
        
        try {
            const res = await api.post(`/applications/${applicationId}/invites`, {
                email,
                role: role.toLowerCase().replace(' ', '_'),
            });
            setInviteLink(res.data.link);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate invite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Invite Participant</h2>
                    <p className="text-sm text-slate-500 mt-1">Invite someone to collaborate on {applicationTitle}. They will only see sections assigned to their role.</p>
                </div>

                {!inviteLink ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Participant Role</label>
                            <select 
                                value={role} 
                                onChange={e => setRole(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-violet-500 focus:ring-violet-500 bg-slate-50"
                                required
                            >
                                {['i-130', 'i-129f', 'i-485'].includes(applicationSlug || '') && (
                                    <option value="Beneficiary">Beneficiary</option>
                                )}
                                {applicationSlug === 'i-485' && (
                                    <>
                                        <option value="Joint Sponsor">Joint Sponsor</option>
                                        <option value="Household Member">Household Member</option>
                                    </>
                                )}
                                {applicationSlug === 'i-751' && (
                                    <option value="Spouse">Spouse</option>
                                )}
                                {/* Fallback if no matching slug */}
                                {!['i-130', 'i-129f', 'i-485', 'i-751'].includes(applicationSlug || '') && (
                                    <option value="Participant">Participant</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Participant Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-violet-500 focus:ring-violet-500 bg-slate-50"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Generating Link...' : 'Generate Invite Link'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Invite Created Successfully!
                            </h4>
                            <p className="text-sm text-emerald-600 mt-1">Copy the link below and send it to your {role}.</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Secure Invite Link</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={inviteLink}
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-600 text-sm focus:outline-none"
                                />
                                <button 
                                    onClick={handleCopy}
                                    type="button"
                                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
