import { Metadata } from 'next';
import FreelancerProjectsOverview from '@/components/dashboard/FreelancerProjectsOverview';

export const metadata: Metadata = {
  title: 'Dashboard - Freelancer Dashboard',
  description: 'Manage your freelance business',
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <FreelancerProjectsOverview />
    </main>
  );
}
