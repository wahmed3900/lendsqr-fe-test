import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('demo@lendsqr.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    localStorage.setItem('lendsqr-auth', JSON.stringify({ email, loggedInAt: new Date().toISOString() }))
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-badge">L</div>
          <div>
            <h2>Welcome back</h2>
            <p className="auth-subtitle">Use the demo credentials to access the dashboard.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary" type="submit">Login</button>
        </form>

        {error ? <div className="error-strip">{error}</div> : null}

        <div className="auth-tip">
          <strong>Demo account:</strong> demo@lendsqr.com / password123
        </div>
      </div>
    </div>
  )
}

export default LoginPage
