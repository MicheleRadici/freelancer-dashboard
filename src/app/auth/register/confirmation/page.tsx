"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegistrationConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  const email = searchParams.get('email') || 'your email';
  const userType = searchParams.get('type') || 'user';

  // Debug logging
  useEffect(() => {
    console.log('🔵 Confirmation page loaded with params:', {
      email: searchParams.get('email'),
      type: searchParams.get('type'),
      allParams: Object.fromEntries(searchParams.entries())
    });
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(timer);
          // Use setTimeout to avoid state update during render
          setTimeout(() => router.push('/'), 0);
          return 0;
        }
        return newCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground">
            Registration Successful!
          </h1>

          {/* Message */}
          <div className="space-y-2 text-muted-foreground">
            <p>
              Thank you for registering as a <span className="font-semibold text-foreground">{userType}</span> with WorkForge!
            </p>
            <p>
              We've sent a verification email to{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </p>
            <p className="text-sm">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            <h3 className="font-semibold mb-2">What's next?</h3>
            <ul className="text-left space-y-1">
              <li>• Check your email for the verification link</li>
              <li>• Complete your profile after verification</li>
              <li>• Start {userType === 'freelancer' ? 'finding projects' : 'posting projects'}!</li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="text-sm text-muted-foreground">
            Redirecting to home page in {countdown} second{countdown !== 1 ? 's' : ''}...
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleGoToHome}
            className="w-full"
            variant="outline"
          >
            Go to Home Page Now
          </Button>
        </div>
      </div>
    </div>
  );
}
