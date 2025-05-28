import Layout from "@/components/layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to your Dashboard</h1>
        <p className="text-lg text-gray-600 mb-6">Overview coming soon...</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-blue-800">Latest Projects</h2>
            <p className="text-sm text-gray-600 mt-1">No projects yet</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-green-800">Upcoming Payments</h2>
            <p className="text-sm text-gray-600 mt-1">No payments scheduled</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-purple-800">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">No recent activity</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
