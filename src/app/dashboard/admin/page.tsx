import ProtectedRoute from "@/components/shared/protected-route";
import { RequireRole } from "@/components/auth/RequireRole";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <RequireRole allowedRoles={["admin"]}>
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="mb-4">View all users, create and assign projects.</p>
          <div className="flex gap-4">
            <Link href="/admin/users" className="btn btn-primary">Manage Users</Link>
            <Link href="/admin/create-project" className="btn btn-primary">Create Project</Link>
          </div>
        </div>
      </RequireRole>
    </ProtectedRoute>
  );
}
