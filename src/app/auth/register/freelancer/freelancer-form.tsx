"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Freelancer } from '../types';
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const freelancerSchema = z.object({
  bio: z.string().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  hourlyRate: z.coerce.number().optional(),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill" }),
  categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
  days: z.array(z.string()).min(1, { message: "Select at least one day" }),
  hoursPerWeek: z.coerce.number().min(1, { message: "Hours per week required" }),
  timezone: z.string().min(1, { message: "Timezone required" }),
  preferredStart: z.string().min(1, { message: "Start time required" }),
  preferredEnd: z.string().min(1, { message: "End time required" }),
  name: z.string().min(1, { message: "First name is required" }),
  surname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type FreelancerFormValues = z.infer<typeof freelancerSchema>;

const CATEGORIES = ["Design", "Development", "Writing", "Marketing", "Other"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function FreelancerRegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<FreelancerFormValues>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      bio: "",
      resumeUrl: "",
      hourlyRate: undefined,
      skills: [],
      categories: [],
      days: [],
      hoursPerWeek: 1,
      timezone: "",
      preferredStart: "",
      preferredEnd: "",
      name: "",
      surname: "",
      email: "",
    },
  });

  async function onSubmit(data: FreelancerFormValues) {
    setLoading(true);
    setError("");
    try {
      if (!user?.id) throw new Error("Not authenticated");
      const freelancer: Omit<Freelancer, 'createdAt' | 'uid' | 'rating' | 'totalProjects' | 'completedProjects'> = {
        bio: data.bio || undefined,
        resumeUrl: data.resumeUrl || undefined,
        hourlyRate: typeof data.hourlyRate === 'number' && !isNaN(data.hourlyRate) ? data.hourlyRate : 0,
        skills: data.skills,
        categories: data.categories,
        availability: {
          days: data.days,
          hoursPerWeek: data.hoursPerWeek,
          timezone: data.timezone,
        },
        preferredWorkingHours: {
          start: data.preferredStart,
          end: data.preferredEnd,
        },
        name: data.name,
        surname: data.surname,
        email: data.email,
      };
      await addDoc(collection(db, "freelancers"), {
        ...freelancer,
        uid: user.id,
        rating: 0,
        totalProjects: 0,
        completedProjects: 0,
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Freelancer Registration</h2>
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
        <Label htmlFor="bio">Bio <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Textarea id="bio" {...form.register("bio")} />
        {form.formState.errors.bio && (
          <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume URL <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="resumeUrl" {...form.register("resumeUrl")} />
        {form.formState.errors.resumeUrl && (
          <p className="text-sm text-destructive">{form.formState.errors.resumeUrl.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate ($) <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="hourlyRate" type="number" {...form.register("hourlyRate", { valueAsNumber: true })} />
        {form.formState.errors.hourlyRate && (
          <p className="text-sm text-destructive">{form.formState.errors.hourlyRate.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const checked = form.watch("categories").includes(cat);
            return (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("categories");
                    if (e.target.checked) {
                      form.setValue("categories", [...prev, cat]);
                    } else {
                      form.setValue("categories", prev.filter((c: string) => c !== cat));
                      // Remove related skills if category is unchecked
                      const newSkills = form.getValues("skills").filter((skill: string) => {
                        if (cat === "Development") {
                          return !["Front-end","Back-end","Full-stack","Mobile","DevOps","QA / Testing","Game Development","Embedded","AI / ML","Other"].includes(skill);
                        }
                        if (cat === "Design") {
                          return !["UI Design","UX Design","Graphic Design","Web Design","Product Design","Branding","Animation","Illustration","Other"].includes(skill);
                        }
                        if (cat === "Writing") {
                          return !["Copywriting","Technical Writing","Content Writing","Editing","Proofreading","SEO Writing","Other"].includes(skill);
                        }
                        if (cat === "Marketing") {
                          return !["Digital Marketing","SEO","Content Marketing","Social Media","Email Marketing","PPC / SEM","Affiliate Marketing","Market Research","Other"].includes(skill);
                        }
                        if (cat === "Other") {
                          return !["Other"].includes(skill);
                        }
                        return true;
                      });
                      form.setValue("skills", newSkills);
                    }
                  }}
                  className="accent-primary"
                />
                {cat}
              </label>
            );
          })}
        </div>
        {form.formState.errors.categories && (
          <p className="text-sm text-destructive">{form.formState.errors.categories.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        {form.watch("categories").length === 0 && (
          <p className="text-xs text-muted-foreground">Select at least one category to choose skills.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {form.watch("categories").includes("Development") && [
            "Front-end",
            "Back-end",
            "Full-stack",
            "Mobile",
            "DevOps",
            "QA / Testing",
            "Game Development",
            "Embedded",
            "AI / ML",
            "Other"
          ].map(skill => {
            const checked = form.watch("skills").includes(skill);
            return (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("skills");
                    if (e.target.checked) {
                      form.setValue("skills", [...prev, skill]);
                    } else {
                      form.setValue("skills", prev.filter((s: string) => s !== skill));
                    }
                  }}
                  className="accent-primary"
                />
                {skill}
              </label>
            );
          })}
          {form.watch("categories").includes("Design") && [
            "UI Design",
            "UX Design",
            "Graphic Design",
            "Web Design",
            "Product Design",
            "Branding",
            "Animation",
            "Illustration",
            "Other"
          ].map(skill => {
            const checked = form.watch("skills").includes(skill);
            return (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("skills");
                    if (e.target.checked) {
                      form.setValue("skills", [...prev, skill]);
                    } else {
                      form.setValue("skills", prev.filter((s: string) => s !== skill));
                    }
                  }}
                  className="accent-primary"
                />
                {skill}
              </label>
            );
          })}
          {form.watch("categories").includes("Writing") && [
            "Copywriting",
            "Technical Writing",
            "Content Writing",
            "Editing",
            "Proofreading",
            "SEO Writing",
            "Other"
          ].map(skill => {
            const checked = form.watch("skills").includes(skill);
            return (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("skills");
                    if (e.target.checked) {
                      form.setValue("skills", [...prev, skill]);
                    } else {
                      form.setValue("skills", prev.filter((s: string) => s !== skill));
                    }
                  }}
                  className="accent-primary"
                />
                {skill}
              </label>
            );
          })}
          {form.watch("categories").includes("Marketing") && [
            "Digital Marketing",
            "SEO",
            "Content Marketing",
            "Social Media",
            "Email Marketing",
            "PPC / SEM",
            "Affiliate Marketing",
            "Market Research",
            "Other"
          ].map(skill => {
            const checked = form.watch("skills").includes(skill);
            return (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("skills");
                    if (e.target.checked) {
                      form.setValue("skills", [...prev, skill]);
                    } else {
                      form.setValue("skills", prev.filter((s: string) => s !== skill));
                    }
                  }}
                  className="accent-primary"
                />
                {skill}
              </label>
            );
          })}
          {form.watch("categories").includes("Other") && [
            "Other"
          ].map(skill => {
            const checked = form.watch("skills").includes(skill);
            return (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill}
                  checked={checked}
                  onChange={e => {
                    const prev = form.getValues("skills");
                    if (e.target.checked) {
                      form.setValue("skills", [...prev, skill]);
                    } else {
                      form.setValue("skills", prev.filter((s: string) => s !== skill));
                    }
                  }}
                  className="accent-primary"
                />
                {skill}
              </label>
            );
          })}
        </div>
        {form.formState.errors.skills && (
          <p className="text-sm text-destructive">{form.formState.errors.skills.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Availability Days</Label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => (
            <label key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={day}
                {...form.register("days")}
                className="accent-primary"
              />
              {day}
            </label>
          ))}
        </div>
        {form.formState.errors.days && (
          <p className="text-sm text-destructive">{form.formState.errors.days.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <Label htmlFor="hoursPerWeek">Hours per Week</Label>
          <Input id="hoursPerWeek" type="number" {...form.register("hoursPerWeek", { valueAsNumber: true })} />
          {form.formState.errors.hoursPerWeek && (
            <p className="text-sm text-destructive">{form.formState.errors.hoursPerWeek.message}</p>
          )}
        </div>
        <div className="space-y-2 w-1/2">
          <Label htmlFor="timezone">Timezone</Label>
          <select id="timezone" {...form.register("timezone")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">Select timezone</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Rome">Europe/Rome</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
            <option value="UTC">UTC</option>
          </select>
          {form.formState.errors.timezone && (
            <p className="text-sm text-destructive">{form.formState.errors.timezone.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <Label htmlFor="preferredStart">Preferred Working Hours Start</Label>
          <Input id="preferredStart" type="time" {...form.register("preferredStart")} />
          {form.formState.errors.preferredStart && (
            <p className="text-sm text-destructive">{form.formState.errors.preferredStart?.message}</p>
          )}
        </div>
        <div className="space-y-2 w-1/2">
          <Label htmlFor="preferredEnd">Preferred Working Hours End</Label>
          <Input id="preferredEnd" type="time" {...form.register("preferredEnd")} />
          {form.formState.errors.preferredEnd && (
            <p className="text-sm text-destructive">{form.formState.errors.preferredEnd?.message}</p>
          )}
        </div>
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
