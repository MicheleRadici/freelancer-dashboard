import { Metadata } from 'next';
import LoginForm from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Login - Freelancer Dashboard',
  description: 'Login to your freelancer dashboard',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
