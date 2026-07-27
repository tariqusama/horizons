'use client';
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import styles from './chat.module.css';

interface Message {
    id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
    attachment_path?: string;
}

export default function DashboardChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasAssignedManager, setHasAssignedManager] = useState<boolean | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = () => {
        api.get('/messages')
            .then(res => setMessages(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    const fetchApplicationAssignment = () => {
        api.get('/applications')
            .then(res => {
                const latest = res.data?.[0];
                if (latest) {
                    const assigned = Boolean(latest.manager_id || latest.manager?.id);
                    setHasAssignedManager(assigned);
                } else {
                    setHasAssignedManager(false);
                }
            })
            .catch(err => {
                console.error('Failed to load application assignment', err);
                setHasAssignedManager(false);
            })
            .finally(() => setIsAppLoading(false));
    };

    useEffect(() => {
        fetchMessages();
        fetchApplicationAssignment();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || isSending) return;
        if (hasAssignedManager === false) return;

        setIsSending(true);
        try {
            let res;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('message', newMessage);
                formData.append('file', selectedFile);
                res = await api.post('/messages', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                res = await api.post('/messages', { message: newMessage });
            }
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            setSelectedFile(null);
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.headerTitle}>Case Manager Support</h1>
                    <p className={styles.headerSubtitle}>Typically replies within 24-48 hours</p>
                </div>
            </div>

            <div className={styles.chatWindow}>
                {isLoading || isAppLoading ? (
                    <div className={styles.loader}>Loading messages...</div>
                ) : hasAssignedManager === false ? (
                    <div className={styles.loader}>A case manager has not been assigned to this application yet. Please check back shortly.</div>
                ) : messages.length === 0 ? (
                    <div className={styles.loader}>No messages yet. Say hello to your case manager!</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`${styles.messageRow} ${msg.is_admin ? styles.messageRowAdmin : styles.messageRowUser}`}>
                            <div>
                                <div className={`${styles.messageBubble} ${msg.is_admin ? styles.messageBubbleAdmin : styles.messageBubbleUser}`}>
                                    {msg.message.split(/\[Attachment:\s*(.+?)\]/g).map((part, i) => {
                                        if (i % 2 === 0) {
                                            return part ? <span key={i} className="whitespace-pre-wrap">{part}</span> : null;
                                        } else {
                                            const filename = part;
                                            return (
                                                <a key={i} href={msg.attachment_path ? `${api.defaults.baseURL?.replace('/api', '')}/storage/${msg.attachment_path}` : '#'} target={msg.attachment_path ? "_blank" : "_self"} download={msg.attachment_path ? filename : undefined} onClick={(e) => { if(!msg.attachment_path) { e.preventDefault(); alert('Downloading ' + filename); } }} className="mt-1.5 flex items-center gap-2 rounded-lg p-2.5 text-sm font-medium transition-colors border max-w-full bg-white/10 hover:bg-white/20 border-white/20 text-current">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>
                                                    <span className="truncate">{filename}</span>
                                                </a>
                                            );
                                        }
                                    })}
                                </div>
                                <div className={styles.messageTime}>
                                    {msg.is_admin ? 'Case Manager' : 'You'} • {formatTime(msg.created_at)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <form onSubmit={handleSendMessage} className={styles.inputForm}>
                    <div className={styles.inputWrapper}>
                        <button
                            type="button"
                            onClick={() => document.getElementById('file-upload-user')?.click()}
                            className={styles.attachButton}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        </button>
                        <input 
                            type="file" 
                            id="file-upload-user" 
                            className="hidden" 
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setSelectedFile(e.target.files[0]);
                                    setNewMessage(prev => prev + (prev ? ' ' : '') + `[Attachment: ${e.target.files![0].name}] `);
                                }
                            }}
                        />
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className={styles.inputField}
                            disabled={isSending}
                        />
                    </div>
                    {selectedFile && (
                        <div className="absolute bottom-[calc(100%+10px)] left-0 bg-white border border-[#ECE9E2] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-[#101F38] shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>
                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                            <button type="button" onClick={() => {
                                setSelectedFile(null);
                                setNewMessage(prev => prev.replace(`[Attachment: ${selectedFile.name}] `, '').replace(`[Attachment: ${selectedFile.name}]`, ''));
                            }} className="ml-1 text-[#8A8F98] hover:text-[#E24B4A]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                    )}
                    <button type="submit" className={styles.sendButton} disabled={(!newMessage.trim() && !selectedFile) || isSending}>
                        <span>{isSending ? 'Sending...' : 'Send'}</span>
                        {!isSending && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
