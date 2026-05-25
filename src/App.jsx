import { BrowserRouter, Navigate, Route, Routes, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import UsersPage from './pages/Users'
import UserDetailsPage from './pages/UserDetails'

const AUTH_KEY = 'lendsqr-auth'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_KEY))

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const TopBar = () => {
  const location = useLocation()

  const tabs = useMemo(() => [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' }
  ], [])

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    window.location.href = '/login'
  }

  const currentPath = location.pathname

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-badge">L</div>
        <div className="brand-copy">
          <h1>Lendsqr</h1>
          <p>Frontend Assessment</p>
        </div>
      </div>

      <div className="topbar-actions">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `nav-link ${isActive || currentPath.startsWith(tab.to) ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
        <button className="btn btn-secondary" onClick={logout}>Logout</button>
      </div>
    </header>
  )
}

const AppLayout = ({ children }) => {
  const location = useLocation()
  const showTopBar = location.pathname !== '/login'

  return (
    <div className="app-shell">
      {showTopBar ? <TopBar /> : null}
      {children}
    </div>
  )
}

const App = () => {
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user: 'Demo User', loggedInAt: new Date().toISOString() }))
    }
  }, [])

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
