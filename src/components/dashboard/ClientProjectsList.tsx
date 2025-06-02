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
          <li
            key={project.id}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm bg-white dark:bg-[#18181b] transition-colors"
          >
            <div className="font-semibold text-black dark:text-white mb-1">{project.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{project.description}</div>
            <div className="text-sm flex items-center gap-1 text-amber-700 dark:text-amber-400 mb-1">
              <span role="img" aria-label="budget">💰</span> Budget: ${project.budget}
            </div>
            <div className="text-sm flex items-center gap-1 text-pink-700 dark:text-pink-400">
              <span role="img" aria-label="status">📌</span> Status: {project.status}
            </div>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400">No projects found.</li>
        )}
      </ul>
    </div>
  );
}
