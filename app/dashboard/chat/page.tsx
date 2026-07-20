'use client';
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import styles from './chat.module.css';

interface Message {
    id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
}

export default function DashboardChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = () => {
        api.get('/messages')
            .then(res => setMessages(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchMessages();
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
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const res = await api.post('/messages', { message: newMessage });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
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
                    <h1 className={styles.headerTitle}>Live Chat Support</h1>
                    <p className={styles.headerSubtitle}>Typically replies in under 5 minutes</p>
                </div>
            </div>

            <div className={styles.chatWindow}>
                {isLoading ? (
                    <div className={styles.loader}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className={styles.loader}>No messages yet. Say hello to your case manager!</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`${styles.messageRow} ${msg.is_admin ? styles.messageRowAdmin : styles.messageRowUser}`}>
                            <div>
                                <div className={`${styles.messageBubble} ${msg.is_admin ? styles.messageBubbleAdmin : styles.messageBubbleUser}`}>
                                    {msg.message}
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
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className={styles.inputField}
                        disabled={isSending}
                    />
                    <button type="submit" className={styles.sendButton} disabled={!newMessage.trim() || isSending}>
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
