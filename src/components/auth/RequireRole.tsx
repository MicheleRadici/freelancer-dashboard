"use client";

import { useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export type Role = "admin" | "freelancer" | "client";

interface RequireRoleProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { profile, isAuthenticated, isLoading, authReady } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Debug: log profile and isAuthenticated
  console.log("[RequireRole] profile:", profile, "isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "authReady:", authReady);

  useEffect(() => {
    if (authReady && isAuthenticated && profile && !allowedRoles.includes(profile.role as Role)) {
      router.replace("/unauthorized");
    }
  }, [profile, isAuthenticated, isLoading, allowedRoles, router, authReady]);

  if (!authReady || isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return allowedRoles.includes(profile.role as Role) ? <>{children}</> : null;
}
