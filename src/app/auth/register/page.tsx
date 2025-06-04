import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Register - WorkForge',
  description: 'Create a new WorkForge account',
};

export default function RegisterPage() {
  redirect('/auth/register/choose-role');
  return null;
}
