import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Freelancer Dashboard',
  description: 'Manage your freelance business',
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Projects</h2>
          <p>Manage your ongoing and upcoming projects here.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Clients</h2>
          <p>Keep track of your client information and communications.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Invoices</h2>
          <p>Create and monitor payment status for your work.</p>
        </div>
      </div>
    </main>
  );
}
