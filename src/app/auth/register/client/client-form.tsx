"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Client } from '../types';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  isValidString, 
  commonValidationSchemas,
  ROLES,
  handleFormError,
  registerWithAuth
} from "@/lib/form-utils";

const clientSchema = z.object({
  companyName: commonValidationSchemas.optionalString,
  website: commonValidationSchemas.optionalUrl,
  contactPhone: commonValidationSchemas.optionalString,
  rolesNeeded: commonValidationSchemas.stringArray.min(1, { message: "Select at least one role" }),
  name: commonValidationSchemas.name,
  surname: commonValidationSchemas.surname,
  email: commonValidationSchemas.email,
  password: commonValidationSchemas.password,
  confirmPassword: commonValidationSchemas.confirmPassword,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: "",
      website: "",
      contactPhone: "",
      rolesNeeded: [],
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });  async function onSubmit(data: ClientFormValues) {
    setLoading(true);
    setError("");
    try {
      const client: Omit<Client, 'createdAt' | 'uid' | 'balance'> = {
        companyName: isValidString(data.companyName),
        website: isValidString(data.website),
        contactPhone: isValidString(data.contactPhone),
        rolesNeeded: data.rolesNeeded,
        name: data.name,
        surname: data.surname,
        email: data.email,
      };
      
      // Register with authentication and save profile
      const userId = await registerWithAuth(data.email, data.password, "clients", {
        ...client,
        balance: 0, // Initialize balance to 0
      });
      
      // Redirect to confirmation page with user details
      router.replace(`/pages/register-confirmation?email=${encodeURIComponent(data.email)}&type=client`);
    } catch (e: any) {
      setError(handleFormError(e));
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
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
      </div>      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2 w-1/2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
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
          <p className="text-sm text-destructive">{form.formState.errors.contactPhone.message}</p>        )}
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
