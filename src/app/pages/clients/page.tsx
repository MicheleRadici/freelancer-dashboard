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
import { getFreelancerProjects } from "@/lib/firebase/projects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { UserCard } from "@/components/dashboard/UserCard";

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
  createdAt?: any;
}

export default function FreelancerClientsPage() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
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

        // Fetch projects assigned to this freelancer
        if (profile?.uid) {
          const assigned = await getFreelancerProjects(profile.uid);
          setAssignedProjects(assigned.map((proj: any) => ({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            budget: proj.budget,
            clientName: proj.clientName,
            status: proj.status,
            createdAt: proj.createdAt,
          })));
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile?.uid]);

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
      <div className="flex-start md:flex">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <div className="flex-1">
            <main className="max-w-6xl w-full p-6 space-y-10">
              {/* Assigned Projects Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold">Your Assigned Projects</h1>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {assignedProjects.length > 0 ? (
                    assignedProjects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        title={proj.title}
                        description={proj.description}
                        budget={proj.budget}
                        clientName={proj.clientName}
                        status={proj.status}
                        createdAt={proj.createdAt}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-muted-foreground text-left py-8">No assigned projects</div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold">Available Projects</h1>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {projects.length > 0 ? (
                    projects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        title={proj.title}
                        description={proj.description}
                        budget={proj.budget}
                        clientName={proj.clientName}
                        status={proj.status}
                        createdAt={proj.createdAt}
                      >
                        <Button size="sm" className="mt-3 w-full" variant="outline" onClick={() => handleClaimProject(proj.id)}>
                          Claim Project
                        </Button>
                      </ProjectCard>
                    ))
                  ) : (
                    <div className="col-span-full text-muted-foreground text-left py-8">No available projects</div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 mt-8">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Clients</h2>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-start">
                  {clients.length > 0 ? (
                    clients.map((client, idx) => (
                      <UserCard
                        key={idx}
                        name={client.name}
                        surname={client.surname}
                        email={client.email}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-muted-foreground text-left py-8">No clients found</div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
