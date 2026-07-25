'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { setAuthToken, initCsrf } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    phone?: string;
    profile_picture?: string | null;
    profile_picture_url?: string | null;
    email_notifications?: boolean;
    sms_alerts?: boolean;
    marketing_emails?: boolean;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any, skipRedirect?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isIdle: boolean;
    idleTime: number;
    resetIdleTimer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isIdle, setIsIdle] = useState(false);
    const [idleTime, setIdleTime] = useState(60);
    const router = useRouter();

    const resetIdleTimer = () => {
        setIsIdle(false);
        setIdleTime(60);
    };

    // Activity tracker
    useEffect(() => {
        if (!user || isIdle) return; // Don't track if already idle or not logged in

        let timeoutId: NodeJS.Timeout;

        const handleActivity = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsIdle(true), 15 * 60 * 1000);
        };

        handleActivity(); // Set initial timeout

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [user, isIdle]);

    // Countdown timer
    useEffect(() => {
        if (!isIdle) return;

        const intervalId = setInterval(() => {
            setIdleTime((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    logout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isIdle]);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/user');
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (data: any) => {
        await initCsrf();
        const res = await api.post('/login', data);
        const user = res.data.user ?? res.data;
        if (res.data.token) {
            setAuthToken(res.data.token);
        }
        setUser(user);
        redirectBasedOnRole(user.role);
    };

    const register = async (data: any, skipRedirect = false) => {
        await initCsrf();
        const res = await api.post('/register', data);
        const user = res.data.user ?? res.data;
        if (res.data.token) {
            setAuthToken(res.data.token);
        }
        setUser(user);
        if (!skipRedirect) {
            redirectBasedOnRole(user.role);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed on server:', error);
        } finally {
            setAuthToken(null);
            setUser(null);
            router.push('/login');
        }
    };

    const redirectBasedOnRole = (role: string) => {
        const lowerRole = role.toLowerCase();
        if (lowerRole.includes('admin')) router.push('/admin');
        else if (lowerRole.includes('manager')) router.push('/manager');
        else router.push('/dashboard');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth, isIdle, idleTime, resetIdleTimer }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
