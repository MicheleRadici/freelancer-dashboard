import { useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export type Role = "admin" | "freelancer" | "client";

interface RequireRoleProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { profile, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    if (!allowedRoles.includes(profile.role as Role)) {
      router.replace("/unauthorized");
    }
  }, [profile, isAuthenticated, allowedRoles, router]);

  if (!isAuthenticated || !profile) return null;
  return allowedRoles.includes(profile.role as Role) ? <>{children}</> : null;
}
