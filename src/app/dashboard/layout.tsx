import DashboardSidebar from '@/components/shared/dashboard-sidebar';
import DashboardHeader from '@/components/shared/dashboard-header';
import ProtectedRoute from '@/components/shared/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
