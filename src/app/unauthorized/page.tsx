import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You do not have permission to view this page.',
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="mb-6">You do not have permission to view this page.</p>
        <a href="/dashboard" className="text-primary hover:underline">Go back to dashboard</a>
      </div>
    </main>
  );
}
