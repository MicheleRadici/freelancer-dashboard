import AuthRedirect from '@/components/shared/auth-redirect';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        {children}
      </div>
    </AuthRedirect>
  );
}
