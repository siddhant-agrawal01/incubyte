'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import { toast } from 'sonner';

interface UseAuthRedirectOptions {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
}


export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
    const { requireAuth, requireAdmin, redirectTo } = options;
    const { user, isAdmin, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (requireAuth && !user) {
            router.push(redirectTo || '/login');
            return;
        }

        if (requireAdmin && user && !isAdmin) {
            router.push('/dashboard');
            toast.error('Admin access required');
        }
    }, [user, isAdmin, loading, router, requireAuth, requireAdmin, redirectTo]);

    return { user, isAdmin, logout, loading };
}
