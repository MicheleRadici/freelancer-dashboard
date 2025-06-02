import { Metadata } from 'next';
import LoginForm from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Login - WorkForge',
  description: 'Login to your WorkForge account',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to WorkForge</h1>
        <LoginForm />
      </div>
    </main>
  );
}
