"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authReady } = useAuth();
  const router = useRouter();

  // Debug: log isAuthenticated, isLoading, authReady
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'authReady:', authReady);

  useEffect(() => {
    if (authReady && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, authReady]);

  // Show loading state while checking authentication
  if (!authReady || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
