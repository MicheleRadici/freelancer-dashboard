import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserCardProps {
  name: string;
  surname?: string;
  email: string;
  className?: string;
}

export function UserCard({ name, surname, email, className = "" }: UserCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col gap-1 transition-colors hover:border-primary",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground">{name} {surname}</span>
      </div>
      <span className="text-xs text-muted-foreground">{email}</span>
    </div>
  );
}
