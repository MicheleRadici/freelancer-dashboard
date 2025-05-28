import { Metadata } from 'next';
import RegisterForm from '@/components/forms/register-form';

export const metadata: Metadata = {
  title: 'Register - Freelancer Dashboard',
  description: 'Create a new freelancer dashboard account',
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
