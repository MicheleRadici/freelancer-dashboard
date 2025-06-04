import AuthRedirect from '@/components/shared/auth-redirect';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect>
      <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: '#23272f' }}>
        {children}
      </div>
    </AuthRedirect>
  );
}
