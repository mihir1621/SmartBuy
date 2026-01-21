import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook that redirects unauthenticated users to the login page.
 * It preserves the current URL in the `redirect` query param so the user can be
 * sent back after a successful login.
 */
export default function useRequireAuth() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // wait for auth state to resolve
        if (!user) {
            const returnTo = router.asPath || '/';
            router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
        }
    }, [user, loading, router]);
}
