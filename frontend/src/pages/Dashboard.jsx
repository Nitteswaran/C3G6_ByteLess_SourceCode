const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2 text-primary-600">Active Routes</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-2 text-teal-600">Total Distance</h2>
          <p className="text-3xl font-bold">0 km</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-2 text-gray-600">Users Online</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to display</p>
      </div>
    </div>
  )
}

export default Dashboard

