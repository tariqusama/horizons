'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { setAuthToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    phone?: string;
    profile_picture?: string | null;
    profile_picture_url?: string | null;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any, skipRedirect?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
            if (!token) {
                throw new Error('No auth token');
            }
            setAuthToken(token);
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
        const res = await api.post('/login', data);
        const token = res.data.token ?? res.data.access_token ?? null;
        if (!token) {
            throw new Error('No auth token received');
        }
        setAuthToken(token);
        const user = res.data.user ?? res.data;
        setUser(user);
        redirectBasedOnRole(user.role);
    };

    const register = async (data: any, skipRedirect = false) => {
        const res = await api.post('/register', data);
        const token = res.data.token ?? res.data.access_token ?? null;
        if (!token) {
            throw new Error('No auth token received');
        }
        setAuthToken(token);
        const user = res.data.user ?? res.data;
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
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
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
