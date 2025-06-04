import Link from 'next/link';

export default function ChooseRolePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6" style={{ background: '#23272f' }}>
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up As</h1>
        <div className="flex flex-row gap-6">
          <Link href="/auth/register/client" className="block p-6 rounded-lg border border-primary bg-background hover:bg-primary/10 text-center text-lg font-semibold transition">
            Client
          </Link>
          <Link href="/auth/register/freelancer" className="block p-6 rounded-lg border border-primary bg-background hover:bg-primary/10 text-center text-lg font-semibold transition">
            Freelancer
          </Link>
        </div>
      </div>
    </main>
  );
}
