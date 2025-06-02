"use client";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "@/lib/firebase/users";
import RoleSelector from "./RoleSelector";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers().then(users => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-md shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{user.name || "–"}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                <RoleSelector user={user} />
              </td>
              <td className="p-4">
                {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
