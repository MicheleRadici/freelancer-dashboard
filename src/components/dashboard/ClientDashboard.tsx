"use client";

import { useAuth } from "@/hooks/useAuth";
import ClientProjectsList from "./ClientProjectsList";
import Link from "next/link";

export default function ClientDashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {profile.name}!</h1>
      <Link href="/dashboard/client/new-project" className="inline-block">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors">
          + New Project
        </button>
      </Link>
      <ClientProjectsList uid={profile.uid} />
    </div>
  );
}
