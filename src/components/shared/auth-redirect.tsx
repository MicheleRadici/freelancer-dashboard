"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthRedirect({ children, redirectTo = '/pages/dashboard' }: AuthRedirectProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && profile?.role) {
      if (profile.role === 'admin') {
        router.replace('/pages/dashboard/admin');
      } else if (profile.role === 'freelancer') {
        router.replace('/pages/dashboard/freelancer');
      } else if (profile.role === 'client') {
        router.replace('/pages/dashboard/client');
      }
    }
  }, [isAuthenticated, isLoading, profile, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
