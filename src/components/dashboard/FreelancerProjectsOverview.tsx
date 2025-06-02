"use client";

import { useEffect, useState } from "react";
import { getFreelancerProjects } from "@/lib/firebase/projects";
import { useAuth } from "@/hooks/useAuth";

export default function FreelancerProjectsOverview() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.uid && profile.role === "freelancer") {
      getFreelancerProjects(profile.uid).then((data) => {
        setProjects(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return <div className="p-8 text-center">Loading projects...</div>;
  }

  if (!projects.length) {
    return <div className="p-8 text-center">No projects found.</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="bg-card rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
          <p className="text-sm mb-1">Client: {project.clientName}</p>
          <p className="text-sm mb-1">Budget: ${project.budget}</p>
          <p className="text-sm mb-1">Status: <span className="capitalize">{project.status}</span></p>
          <p className="text-xs text-muted-foreground">Created: {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString() : "–"}</p>
        </div>
      ))}
    </div>
  );
}
