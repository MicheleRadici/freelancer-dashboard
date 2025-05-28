import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">FreelancerDash</h1>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="flex items-center px-2 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md">
          <span>📊</span>
          <span className="ml-2">Dashboard</span>
        </Link>
        <Link href="/clients" className="flex items-center px-2 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md">
          <span>👥</span>
          <span className="ml-2">Clients</span>
        </Link>
        <Link href="/income" className="flex items-center px-2 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md">
          <span>💰</span>
          <span className="ml-2">Income</span>
        </Link>
      </nav>
    </aside>
  );
}
