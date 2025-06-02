"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function ClientNewProjectPage() {
  const { profile } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const newProject = {
        ...form,
        status: "pending",
        createdAt: new Date().toISOString(),
        budget: Number(form.budget),
        clientId: profile?.uid,
        clientName: profile?.name,
        freelancerId: "",
      };
      await addDoc(collection(db, "projects"), newProject);
      setSuccess("Project submitted successfully");
      setForm({ title: "", description: "", budget: "" });
    } catch (err: any) {
      setError("Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <Label>Project Title</Label>
      <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

      <Label>Description</Label>
      <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

      <Label>Budget</Label>
      <Input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required />

      <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Project"}</Button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
