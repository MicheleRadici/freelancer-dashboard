import { RequireRole } from "@/components/auth/RequireRole";
import UserTable from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>
        <UserTable />
      </div>
    </RequireRole>
  );
}
