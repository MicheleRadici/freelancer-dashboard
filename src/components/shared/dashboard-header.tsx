import { ModeToggle } from '@/components/shared/mode-toggle';

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="md:hidden">
        {/* Mobile menu button would go here */}
      </div>
      <div className="flex-1 md:pl-0" />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/30 flex items-center justify-center text-sm">
            U
          </div>
          <span className="hidden md:inline">User</span>
        </div>
      </div>
    </header>
  );
}
