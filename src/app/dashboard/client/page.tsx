"use client";

import ProtectedRoute from "@/components/shared/protected-route";
import { RequireRole } from "@/components/auth/RequireRole";
import ClientProjects from "@/components/dashboard/ClientProjects";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ClientDashboardPage() {
  const { profile, isAuthenticated, isLoading } = useAuth();
  // Debug: confirm page render
  console.log("[ClientDashboardPage] rendered", { profile, isAuthenticated, isLoading });
  return (
    <ProtectedRoute>
      <RequireRole allowedRoles={["client"]}>
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Client Dashboard</h1>
          <p className="mb-4">Submit new projects and view their progress.</p>
          <Link href="/client/new-project" className="btn btn-primary mb-4">Submit New Project</Link>
          <ClientProjects />
        </div>
      </RequireRole>
    </ProtectedRoute>
  );
}
