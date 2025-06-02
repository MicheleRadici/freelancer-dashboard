"use client";

import { useAuth } from '@/hooks/useAuth';

export default function DashboardSidebar() {
  const { profile } = useAuth();
  let navItems: { label: string; path: string }[] = [];
  if (profile?.role === 'admin') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard/admin' },
      { label: 'Manage Users', path: '/admin/users' },
      { label: 'Create Project', path: '/admin/create-project' },
    ];
  } else if (profile?.role === 'freelancer') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard/freelancer' },
      { label: 'Clients', path: '/freelancer/clients' },
    ];
  } else if (profile?.role === 'client') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard/client' },
      { label: 'Submit Project', path: '/dashboard/client/new-project' },
    ];
  }

  let dashboardTitle = "WorkForge";
  if (profile?.role === "admin") dashboardTitle = "Admin Dashboard";
  else if (profile?.role === "client") dashboardTitle = "Client Dashboard";
  else if (profile?.role === "freelancer") dashboardTitle = "Freelancer Dashboard";

  return (
    <div className="hidden md:flex w-64 flex-col bg-card border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{dashboardTitle}</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
