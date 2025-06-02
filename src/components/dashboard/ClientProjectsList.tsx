"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ClientProjectsList({ uid }: { uid: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), where("clientId", "==", uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, [uid]);

  if (loading) {
    return <div className="p-4 text-center">Loading your projects...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium">Your Projects</h2>
      <ul className="space-y-2 mt-2">
        {projects.map((project) => (
          <li key={project.id} className="border p-3 rounded-md shadow-sm bg-gray-50">
            <div className="font-semibold">{project.title}</div>
            <div className="text-sm text-gray-600">{project.description}</div>
            <div className="text-sm mt-1">💰 Budget: ${project.budget}</div>
            <div className="text-sm">📌 Status: {project.status}</div>
          </li>
        ))}
        {projects.length === 0 && <li className="text-gray-500">No projects found.</li>}
      </ul>
    </div>
  );
}
