"use client";

import { useAuth } from '@/hooks/useAuth';

export default function DashboardSidebar() {
  const { profile } = useAuth();
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    ...(profile?.role === 'admin' ? [
      { label: 'Admin', path: '/dashboard/admin' },
      { label: 'Manage Users', path: '/admin/users' },
      { label: 'Create Project', path: '/admin/create-project' },
    ] : []),
    ...(profile?.role === 'freelancer' ? [
      { label: 'Freelancer', path: '/dashboard/freelancer' },
      { label: 'Clients', path: '/dashboard/clients' },
    ] : []),
    ...(profile?.role === 'client' ? [
      { label: 'Client', path: '/dashboard/client' },
      { label: 'Submit Project', path: '/dashboard/client/new-project' },
    ] : []),
  ];

  return (
    <div className="hidden md:flex w-64 flex-col bg-card border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Freelancer Dashboard</h2>
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
