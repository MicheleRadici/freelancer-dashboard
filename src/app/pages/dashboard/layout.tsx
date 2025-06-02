import DashboardSidebar from '@/components/shared/dashboard-sidebar';
import DashboardHeader from '@/components/shared/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
