import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-8">Freelancer Dashboard</h1>
        <p className="mb-8 text-lg">
          Manage your freelance business all in one place
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
