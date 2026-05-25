import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../mockApi'

const DashboardPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      const data = await fetchUsers()
      setUsers(data)
      setLoading(false)
    }

    loadUsers()
  }, [])

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((user) => user.status === 'Active').length
    const pending = users.filter((user) => user.status === 'Pending').length
    const highRisk = users.filter((user) => user.riskLevel === 'High').length

    return [
      { label: 'Total users', value: total },
      { label: 'Active users', value: active },
      { label: 'Pending review', value: pending },
      { label: 'High risk', value: highRisk }
    ]
  }, [users])

  const recentUsers = users.slice(0, 5)

  return (
    <div className="page">
      <div className="hero-grid">
        <div className="dashboard-card">
          <div className="section-title">
            <div>
              <h2>Welcome to your dashboard</h2>
              <p>Browse the latest user activity and keep your portfolio moving.</p>
            </div>
            <Link to="/users" className="btn btn-ghost">View all users</Link>
          </div>

          <div className="metrics-list">
            <div className="metric-pill">📊 500 records loaded from mock API</div>
            <div className="metric-pill">📱 Mobile responsive layout</div>
            <div className="metric-pill">💾 User details cached in localStorage</div>
            <div className="metric-pill">🔍 Search, filter, and drill-down</div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick snapshot</h2>
          <p className="auth-subtitle">A short summary of your current user base.</p>
          <div className="metrics-list">
            <div className="metric-pill">Total balance: ${users.reduce((total, user) => total + user.accountBalance, 0).toLocaleString()}</div>
            <div className="metric-pill">Outstanding loans: ${users.reduce((total, user) => total + user.loanBalance, 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{loading ? '...' : stat.value}</strong>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="users-card">
        <div className="section-title">
          <div>
            <h2>Recent users</h2>
            <p>Browse a sample of the latest records currently in the dataset.</p>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading users…</p>
        ) : (
          <div className="user-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.organization}</td>
                    <td>
                      <span className={`status-pill ${user.status === 'Active' ? 'status-active' : user.status === 'Pending' ? 'status-pending' : 'status-inactive'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/users/${user.id}`} className="user-action">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
