"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "@/lib/firebase/projects";
import { fetchAllUsers } from "@/lib/firebase/users";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewProjectForm({ clientName, uid }: { clientName: string; uid: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freelancers, setFreelancers] = useState<{ id: string; name: string }[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAllUsers().then(users => {
      setFreelancers(
        users
          .filter((u: any) => u.role === "freelancer" && u.name)
          .map((u: any) => ({ id: u.id, name: u.name }))
      );
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addProject({
        title,
        description,
        budget: parseFloat(budget),
        clientId: uid,
        clientName,
        status: "pending",
        freelancerId: selectedFreelancer,
      });
      router.push("/dashboard/client");
    } catch (err: any) {
      setError("Failed to submit project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto bg-card p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-2">Submit a New Project</h2>
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Project title"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          placeholder="Describe your project"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Budget (USD)</label>
        <Input
          type="number"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          required
          min={0}
          placeholder="e.g. 1000"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Assign to Freelancer (optional)</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedFreelancer}
          onChange={e => setSelectedFreelancer(e.target.value)}
        >
          <option value="">Unassigned</option>
          {freelancers.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Submitting..." : "Submit Project"}
      </Button>
    </form>
  );
}