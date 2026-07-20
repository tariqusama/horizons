'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
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
            const res = await api.get('/api/user');
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

    const csrf = () => api.get('/sanctum/csrf-cookie');

    const login = async (data: any) => {
        await csrf();
        const res = await api.post('/api/login', data);
        setUser(res.data);
        redirectBasedOnRole(res.data.role);
    };

    const register = async (data: any, skipRedirect = false) => {
        await csrf();
        const res = await api.post('/api/register', data);
        setUser(res.data);
        if (!skipRedirect) {
            redirectBasedOnRole(res.data.role);
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout failed on server:', error);
        } finally {
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
