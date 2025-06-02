"use client";
import { useState } from "react";
import { updateUserRole } from "@/lib/firebase/users";
// import { toast } from "sonner"; // Uncomment if using a toast lib
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";

export default function RoleSelector({ user }: { user: any }) {
  const [role, setRole] = useState(user.role);
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === user.id;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    try {
      await updateUserRole(user.id, newRole);
      // toast.success(`Updated ${user.email}'s role to ${newRole}`);
    } catch (err) {
      // toast.error("Failed to update role");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        className="border px-2 py-1 rounded"
        disabled={isSelf}
      >
        <option value="admin">Admin</option>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      {isSelf && (
        <Lock className="w-4 h-4 text-muted-foreground">
          <title>You cannot change your own role</title>
        </Lock>
      )}
    </div>
  );
}
