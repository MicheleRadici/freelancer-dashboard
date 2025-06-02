"use client";
import { useAuth } from "@/hooks/useAuth";
import NewProjectForm from "@/components/dashboard/NewProjectForm";

export default function NewProjectPage() {
  const { profile } = useAuth();
  if (!profile) return null;
  return (
    <div className="max-w-2xl mx-auto p-4">
      <NewProjectForm clientName={profile.name} uid={profile.uid} />
    </div>
  );
}
