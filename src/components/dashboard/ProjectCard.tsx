import React from "react";
import { Briefcase, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  budget: number;
  clientName: string;
  status: string;
  createdAt?: any;
  children?: React.ReactNode;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  budget,
  clientName,
  status,
  createdAt,
  children,
  className = "",
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        // Card base
        "bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-2 transition-colors hover:border-primary",
        className
      )}
    >
      <h2 className="font-semibold text-lg text-black dark:text-primary mb-1 flex items-center gap-2">
        <Briefcase className="w-4 h-4" /> {title}
      </h2>
      <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>
          Budget: <span className="font-medium text-foreground">${budget}</span>
        </span>
        <span>
          Status: <span className="capitalize font-medium text-foreground">{status}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <UserPlus className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs">
          Client: <span className="font-medium text-foreground">{clientName}</span>
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-2">
        Created: {createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : "–"}
      </span>
      {children}
    </div>
  );
}