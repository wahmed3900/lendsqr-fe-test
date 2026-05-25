import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../mockApi'

const PAGE_SIZE = 10

const SORT_FIELDS = [
  { key: 'name', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'organization', label: 'Organization' },
  { key: 'country', label: 'Country' },
  { key: 'status', label: 'Status' }
]

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      const response = await fetchUsers({
        search,
        status,
        page: currentPage,
        limit: PAGE_SIZE,
        sortBy,
        sortDirection
      })

      setUsers(response.users)
      setTotal(response.total)
      setLoading(false)
    }

    loadUsers()
  }, [search, status, currentPage, sortBy, sortDirection])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, status, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)))
  }

  const toggleSort = (field) => {
    if (field === sortBy) {
      setSortDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(field)
    setSortDirection('asc')
  }

  const sortLabel = (field) => {
    if (field !== sortBy) {
      return ''
    }

    return sortDirection === 'asc' ? ' ▲' : ' ▼'
  }

  return (
    <div className="page">
      <div className="users-card">
        <div className="section-title">
          <div>
            <h2>User directory</h2>
            <p>Search across 500 mock records and open individual customer details.</p>
          </div>
          <div>
            <strong>{total}</strong> records shown
          </div>
        </div>

        <div className="filters">
          <input
            className="search-input"
            type="search"
            placeholder="Search by name, email, or organization"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select className="search-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <p className="loading">Loading users…</p>
        ) : total === 0 ? (
          <div className="placeholder">
            No users match your current search and filter.
          </div>
        ) : (
          <>
            <div className="user-table">
              <table>
                <thead>
                  <tr>
                    {SORT_FIELDS.map((field) => (
                      <th key={field.key}>
                        <button type="button" className="sort-button" onClick={() => toggleSort(field.key)}>
                          {field.label}
                          <span>{sortLabel(field.key)}</span>
                        </button>
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="user-row">
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.organization}</td>
                      <td>{user.country}</td>
                      <td>
                        <span className={`status-pill ${user.status === 'Active' ? 'status-active' : user.status === 'Pending' ? 'status-pending' : 'status-inactive'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/users/${user.id}`} className="user-action">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <div className="pagination-summary">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
              </div>

              <div className="pagination-controls">
                <button
                  className="btn btn-ghost"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="btn btn-ghost"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UsersPage
