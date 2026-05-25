import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUserById } from '../mockApi'
import { loadStoredUserDetails, saveStoredUserDetails } from '../userStorage'

const UserDetailsPage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNotes, setSelectedNotes] = useState('')

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true)
        const cached = loadStoredUserDetails(id)
        if (cached) {
          setUser(cached)
          setSelectedNotes(cached.notes || '')
        }

        const fresh = await fetchUserById(id)
        const stored = saveStoredUserDetails(id, fresh)
        setUser(stored)
        setSelectedNotes(stored.notes || '')
        setError('')
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [id])

  const handleSaveNotes = () => {
    if (!user) return

    const updated = saveStoredUserDetails(id, {
      ...user,
      notes: selectedNotes
    })

    setUser(updated)
  }

  const storageSummary = useMemo(() => {
    if (!user) return 'No cached details yet.'
    return `${user.name}'s details are stored locally and refreshed on every visit.`
  }, [user])

  if (loading) {
    return (
      <div className="page">
        <div className="details-card">
          <p className="loading">Loading customer details…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="details-card">
          <p className="error-strip">{error}</p>
          <Link to="/users" className="btn btn-ghost">Back to users</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="details-card">
        <div className="details-header">
          <div>
            <p className="details-meta">Customer profile</p>
            <h2>{user.name}</h2>
            <p className="details-meta">{user.email} • {user.organization}</p>
          </div>
          <Link to="/users" className="btn btn-ghost">Back to users</Link>
        </div>

        <div className="details-layout">
          <div>
            <div className="profile-grid">
              <div className="detail-item">
                <span>Phone</span>
                <strong>{user.phone}</strong>
              </div>
              <div className="detail-item">
                <span>Status</span>
                <strong>{user.status}</strong>
              </div>
              <div className="detail-item">
                <span>Country</span>
                <strong>{user.country}</strong>
              </div>
              <div className="detail-item">
                <span>Risk level</span>
                <strong>{user.riskLevel}</strong>
              </div>
              <div className="detail-item">
                <span>Account balance</span>
                <strong>${user.accountBalance.toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>Loan balance</span>
                <strong>${user.loanBalance.toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>Repayment rate</span>
                <strong>{user.repayment}%</strong>
              </div>
              <div className="detail-item">
                <span>KYC</span>
                <strong>{user.kyc}</strong>
              </div>
            </div>

            <div className="detail-item" style={{ marginTop: '0.75rem' }}>
              <span>Address</span>
              <strong>{user.address}</strong>
            </div>
          </div>

          <div>
            <div className="storage-card">
              <h3>Local storage cache</h3>
              <p>{storageSummary}</p>
              <p>Last synced: {user.storedAt ? new Date(user.storedAt).toLocaleString() : 'just now'}</p>
            </div>

            <div className="detail-item" style={{ marginTop: '0.75rem' }}>
              <span>Notes</span>
              <textarea
                value={selectedNotes}
                onChange={(event) => setSelectedNotes(event.target.value)}
                rows={8}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }}
              />
              <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={handleSaveNotes}>Save notes</button>
            </div>

            <div className="detail-item" style={{ marginTop: '0.75rem' }}>
              <span>Activity snapshot</span>
              <div className="list-row">
                <span>Company</span>
                <strong>{user.company}</strong>
              </div>
              <div className="list-row">
                <span>Employment</span>
                <strong>{user.employment}</strong>
              </div>
              <div className="list-row">
                <span>Last active</span>
                <strong>{user.lastActive}</strong>
              </div>
              <div className="list-row">
                <span>Created</span>
                <strong>{user.createdAt}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsPage
