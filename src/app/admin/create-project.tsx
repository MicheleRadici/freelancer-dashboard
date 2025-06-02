"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateProjectPage() {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    freelancerId: "",
    clientName: "Jeremiah Client", // static for now
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const results = querySnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.role === "freelancer");
      setFreelancers(results);
    };
    fetchFreelancers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const newProject = {
        ...form,
        status: "pending",
        createdAt: new Date(),
        budget: Number(form.budget),
      };
      await addDoc(collection(db, "projects"), newProject);
      setSuccess("Project created successfully");
      setForm({
        title: "",
        description: "",
        budget: "",
        freelancerId: "",
        clientName: "Jeremiah Client",
      });
    } catch (err: any) {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 p-4 max-w-xl" onSubmit={handleSubmit}>
      <Label>Project Title</Label>
      <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

      <Label>Description</Label>
      <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

      <Label>Budget</Label>
      <Input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required />

      <Label>Assign to Freelancer</Label>
      <select
        className="border p-2 rounded w-full"
        value={form.freelancerId}
        onChange={e => setForm({ ...form, freelancerId: e.target.value })}
        required
      >
        <option value="">Select</option>
        {freelancers.map(f => (
          <option key={f.uid} value={f.uid}>
            {f.name}
          </option>
        ))}
      </select>

      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Project"}</Button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
