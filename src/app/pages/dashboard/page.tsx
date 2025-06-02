import { Metadata } from 'next';
import FreelancerProjectsOverview from '@/components/dashboard/FreelancerProjectsOverview';

export const metadata: Metadata = {
  title: 'Freelancer Dashboard - WorkForge',
  description: 'Manage your freelance projects on WorkForge',
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Freelancer Dashboard</h1>
      <FreelancerProjectsOverview />
    </main>
  );
}
