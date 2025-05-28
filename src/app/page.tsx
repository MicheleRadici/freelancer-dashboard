"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, don't show content (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-8">Freelancer Dashboard</h1>
        <p className="mb-8 text-lg">
          Manage your freelance business all in one place
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
