const STORAGE_KEY = 'lendsqr-user-details'

export const loadStoredUserDetails = (userId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const items = JSON.parse(raw)
    return items[userId] || null
  } catch (error) {
    return null
  }
}

export const saveStoredUserDetails = (userId, details) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[userId] = {
      ...details,
      storedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data[userId]
  } catch (error) {
    return null
  }
}

export const getStoredSummary = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (error) {
    return {}
  }
}
