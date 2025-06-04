// Freelancer interface
export interface Freelancer {
  uid: string;
  name: string;
  surname: string;
  email: string;
  bio?: string;
  resumeUrl?: string;
  hourlyRate?: number;
  skills: string[];
  categories: string[];
  availability: {
    days: string[];
    hoursPerWeek: number;
    timezone: string;
  };
  preferredWorkingHours: {
    start: string;
    end: string;
  };
  balance: number;
  rating: number;
  totalProjects: number;
  completedProjects: number;
  createdAt: string;
}

// Client interface
export interface Client {
  uid: string;
  name: string;
  surname: string;
  email: string;
  companyName?: string;
  website?: string;
  contactPhone?: string;
  balance: number;
  rolesNeeded: string[];
  createdAt: string;
}
