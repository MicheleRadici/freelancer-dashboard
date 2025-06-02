import ProtectedRoute from "@/components/shared/protected-route";
import { RequireRole } from "@/components/auth/RequireRole";
import FreelancerProjectsOverview from "@/components/dashboard/FreelancerProjectsOverview";

export default function FreelancerDashboardPage() {
  return (
    <ProtectedRoute>
      <RequireRole allowedRoles={["freelancer"]}>
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Freelancer Dashboard</h1>
          <p className="mb-4">Projects assigned to you on WorkForge:</p>
          <FreelancerProjectsOverview />
        </div>
      </RequireRole>
    </ProtectedRoute>
  );
}
