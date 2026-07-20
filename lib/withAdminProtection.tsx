'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function withAdminProtection<P extends object>(
    Component: React.ComponentType<P>
) {
    return function AdminProtectedComponent(props: P) {
        const router = useRouter();
        const { user, isLoading } = useAuth();

        useEffect(() => {
            if (!isLoading && (!user || !['admin', 'manager'].includes(user.role))) {
                router.push('/login');
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3755D] mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
            );
        }

        if (!user || !['admin', 'manager'].includes(user.role)) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-[#E3755D] text-white rounded-lg font-semibold hover:bg-[#D3654D]"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
}
