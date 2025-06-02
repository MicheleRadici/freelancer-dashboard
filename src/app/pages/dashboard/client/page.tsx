"use client";
import { RequireRole } from "@/components/auth/RequireRole";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function Page() {
  return (
    <RequireRole allowedRoles={["client"]}>
      <ClientDashboard />
    </RequireRole>
  );
}
