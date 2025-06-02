"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Define the validation schema with zod
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    surname: z.string().min(2, { message: "Surname must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.enum(["freelancer", "client"], { required_error: "Role is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Infer TypeScript type from the schema
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useAuth();

  // Initialize form with validation schema
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Combine name and surname for displayName
      const displayName = `${data.name} ${data.surname}`.trim();
      const result = await registerUser(displayName, data.email, data.password, data.role);
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="surname">Surname</Label>
        <Input
          id="surname"
          type="text"
          placeholder="Your Surname"
          {...form.register("surname")}
        />
        {form.formState.errors.surname && (
          <p className="text-sm text-destructive">
            {form.formState.errors.surname.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="freelancer"
              {...form.register("role")}
            />
            Freelancer
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="client"
              {...form.register("role")}
            />
            Client
          </label>
        </div>
        {form.formState.errors.role && (
          <p className="text-sm text-destructive">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive text-center">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
}
