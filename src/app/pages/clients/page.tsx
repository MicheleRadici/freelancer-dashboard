"use client";

import { RequireRole } from "@/components/auth/RequireRole";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Briefcase, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import DashboardHeader from "@/components/shared/dashboard-header";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";

interface Client {
  name: string;
  surname?: string;
  email: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  clientName: string;
  status: string;
}

export default function FreelancerClientsPage() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "client"))
        );
        setClients(clientsSnap.docs.map((doc) => doc.data() as Client));

        const projectsSnap = await getDocs(
          query(collection(db, "projects"), where("freelancerId", "in", [null, ""]))
        );
        setProjects(projectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project)));
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Claim project handler
  const handleClaimProject = async (projectId: string) => {
    if (!profile?.uid) return;
    try {
      await updateDoc(doc(db, "projects", projectId), { freelancerId: profile.uid });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      alert("Failed to claim project. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin w-8 h-8 text-primary mb-2" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <RequireRole allowedRoles={["freelancer"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <main className="flex-1 max-w-6xl mx-auto p-6 space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Available Projects</h1>
              </div>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <div key={proj.id} className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col gap-2 transition-colors hover:border-primary">
                      <h2 className="font-semibold text-lg text-primary-foreground dark:text-primary mb-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> {proj.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Budget: <span className="font-medium text-foreground">${proj.budget}</span></span>
                        <span>Status: <span className="capitalize font-medium text-foreground">{proj.status}</span></span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <UserPlus className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs">Client: <span className="font-medium text-foreground">{proj.clientName}</span></span>
                      </div>
                      <Button size="sm" className="mt-3 w-full" variant="outline" onClick={() => handleClaimProject(proj.id)}>
                        Claim Project
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-muted-foreground text-center py-8">No available projects</div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 mt-8">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Clients</h2>
              </div>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {clients.length > 0 ? (
                  clients.map((client, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col gap-1 transition-colors hover:border-primary">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{client.name} {client.surname}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{client.email}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-muted-foreground text-center py-8">No clients found</div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </RequireRole>
  );
}
