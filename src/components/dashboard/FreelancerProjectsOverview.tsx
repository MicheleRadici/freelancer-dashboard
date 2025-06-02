"use client";

import { useEffect, useState } from "react";
import { getFreelancerProjects } from "@/lib/firebase/projects";
import { useAuth } from "@/hooks/useAuth";
import { ProjectCard } from "@/components/dashboard/ProjectCard";

export default function FreelancerProjectsOverview() {
  const { profile } = useAuth();
  console.log('[FreelancerProjectsOverview] profile:', profile);
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
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          budget={project.budget}
          clientName={project.clientName}
          status={project.status}
          createdAt={project.createdAt}
        />
      ))}
    </div>
  );
}
