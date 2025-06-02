"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FreelancerClientsContent() {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "client"))
        );
        setClients(clientsSnap.docs.map((doc) => doc.data()));

        // Fetch unassigned projects (freelancerId is null or empty string)
        const projectsSnap = await getDocs(
          query(
            collection(db, "projects"),
            where("freelancerId", "in", [null, ""])
          )
        );
        setProjects(projectsSnap.docs.map((doc) => doc.data()));
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Available Projects</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.length > 0 ? (
          projects.map((proj, idx) => (
            <div key={idx} className="bg-card rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg">{proj.title}</h2>
              <p>{proj.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Budget: ${proj.budget}
              </p>
              <span className="inline-block mt-2 bg-muted px-2 py-1 rounded text-xs">Client: {proj.clientName}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No available projects</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-8">Clients</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {clients.length > 0 ? (
          clients.map((client, idx) => (
            <div key={idx} className="bg-card rounded-lg shadow p-4">
              <h3 className="font-medium">
                {client.name} {client.surname}
              </h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No clients found</p>
        )}
      </div>
    </div>
  );
}
