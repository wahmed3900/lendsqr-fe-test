import { describe, expect, it } from 'vitest'
import { fetchUsers } from './mockApi'

describe('fetchUsers', () => {
  it('returns paginated results and preserves the full filtered total', async () => {
    const result = await fetchUsers({ page: 2, limit: 3 })

    expect(result.total).toBe(500)
    expect(result.users).toHaveLength(3)
    expect(result.users[0].id).not.toBe(result.users[1].id)
    expect(result.users[0].id).not.toBe(result.users[2].id)
  })

  it('sorts the paginated response by the requested field and direction', async () => {
    const result = await fetchUsers({
      page: 1,
      limit: 10,
      sortBy: 'accountBalance',
      sortDirection: 'desc'
    })

    for (let index = 1; index < result.users.length; index += 1) {
      expect(result.users[index - 1].accountBalance).toBeGreaterThanOrEqual(result.users[index].accountBalance)
    }
  })
})
