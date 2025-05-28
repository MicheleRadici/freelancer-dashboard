export default function DashboardSidebar() {
  return (
    <div className="hidden md:flex w-64 flex-col bg-card border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Freelancer Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/dashboard/projects"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="/dashboard/clients"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Clients
            </a>
          </li>
          <li>
            <a
              href="/dashboard/invoices"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Invoices
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
