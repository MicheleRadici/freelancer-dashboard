"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Client } from '../types';
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const clientSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  website: z.string().url().optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  budgetMin: z.coerce.number().min(0, { message: "Min budget required" }),
  budgetMax: z.coerce.number().min(0, { message: "Max budget required" }),
  rolesNeeded: z.array(z.string()).min(1, { message: "Select at least one role" }),
  name: z.string().min(1, { message: "First name is required" }),
  surname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const ROLES = ["Designer", "Developer", "Marketer", "Other"];

export default function ClientRegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: "",
      website: "",
      contactPhone: "",
      budgetMin: 0,
      budgetMax: 0,
      rolesNeeded: [],
      name: "",
      surname: "",
      email: "",
    },
  });

  async function onSubmit(data: ClientFormValues) {
    setLoading(true);
    setError("");
    try {
      if (!user?.id) throw new Error("Not authenticated");
      const client: Omit<Client, 'createdAt' | 'uid'> = {
        companyName: data.companyName,
        website: data.website || undefined,
        contactPhone: data.contactPhone || undefined,
        budgetRange: { min: data.budgetMin, max: data.budgetMax },
        rolesNeeded: data.rolesNeeded,
        name: data.name,
        surname: data.surname,
        email: data.email,
      };
      await addDoc(collection(db, "clients"), {
        ...client,
        uid: user.id,
        createdAt: serverTimestamp(),
      });
      router.replace("/auth/login");
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Client Registration</h2>
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <Label htmlFor="name">First Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2 w-1/2">
          <Label htmlFor="surname">Last Name</Label>
          <Input id="surname" {...form.register("surname")} />
          {form.formState.errors.surname && (
            <p className="text-sm text-destructive">{form.formState.errors.surname.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="companyName" {...form.register("companyName")} />
        {form.formState.errors.companyName && (
          <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="website" {...form.register("website")} />
        {form.formState.errors.website && (
          <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="contactPhone" {...form.register("contactPhone")} />
        {form.formState.errors.contactPhone && (
          <p className="text-sm text-destructive">{form.formState.errors.contactPhone.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <Label htmlFor="budgetMin">Budget Min.</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="budgetMin" type="number" {...form.register("budgetMin", { valueAsNumber: true })} className="pl-7" />
          </div>
          {form.formState.errors.budgetMin && (
            <p className="text-sm text-destructive">{form.formState.errors.budgetMin.message}</p>
          )}
        </div>
        <div className="space-y-2 w-1/2">
          <Label htmlFor="budgetMax">Budget Max.</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="budgetMax" type="number" {...form.register("budgetMax", { valueAsNumber: true })} className="pl-7" />
          </div>
          {form.formState.errors.budgetMax && (
            <p className="text-sm text-destructive">{form.formState.errors.budgetMax.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Roles Needed</Label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(role => (
            <label key={role} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={role}
                {...form.register("rolesNeeded")}
                className="accent-primary"
              />
              {role}
            </label>
          ))}
        </div>
        {form.formState.errors.rolesNeeded && (
          <p className="text-sm text-destructive">{form.formState.errors.rolesNeeded.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register as Client"}
        </Button>
      </div>
    </form>
  );
}
