const seedUsers = (count = 500) => {
  const statuses = ['Active', 'Inactive', 'Pending']
  const organizations = ['Lendsqr', 'Kash', 'Bankly', 'Paga', 'Savannah', 'Flux']
  const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Uganda']
  const products = ['Savings', 'Loan', 'Mortgage', 'Credit', 'Business']

  return Array.from({ length: count }, (_, index) => {
    const first = ['Amina', 'Chidi', 'Fatima', 'Musa', 'Tolu', 'Sofia', 'Adewale', 'Nadia', 'Kola', 'Hassan'][index % 10]
    const last = ['Johnson', 'Ade', 'Okafor', 'Bello', 'Eze', 'Sani', 'Parker', 'Mok', 'Akin', 'Lar'][(index * 3) % 10]
    const status = statuses[index % statuses.length]
    const org = organizations[index % organizations.length]
    const country = countries[index % countries.length]
    const product = products[index % products.length]
    const repayment = (35 + (index % 40)).toFixed(2)

    return {
      id: `${1000 + index}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@mail.com`,
      phone: `080${String(index + 1000000).slice(0, 7)}`,
      organization: org,
      status,
      country,
      product,
      accountBalance: 5000 + (index % 12) * 320,
      loanBalance: 1500 + (index % 15) * 120,
      repayment,
      createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
      lastActive: `${(index % 28) + 1}d ago`,
      address: `${index + 1} ${['Main', 'Market', 'Palm', 'Oak', 'Cedar'][index % 5]} Street`,
      company: `${org} ${['Holdings', 'Finance', 'Labs', 'Group'][index % 4]}`,
      employment: `${product} Specialist`,
      riskLevel: ['Low', 'Medium', 'High'][index % 3],
      notes: `Customer ${index + 1} interaction summary.`,
      kyc: index % 2 === 0 ? 'Verified' : 'Pending'
    }
  })
}

const USERS = seedUsers(500)

const sortUsers = (users, sortBy, sortDirection) => {
  if (!sortBy) {
    return users
  }

  const direction = sortDirection === 'desc' ? -1 : 1

  return [...users].sort((left, right) => {
    const leftValue = left[sortBy]
    const rightValue = right[sortBy]

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue.localeCompare(rightValue) * direction
    }

    return (leftValue - rightValue) * direction
  })
}

export const fetchUsers = async ({
  search = '',
  status = 'All',
  page,
  limit,
  sortBy = 'name',
  sortDirection = 'asc'
} = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const filtered = USERS.filter((user) => {
    const matchesSearch = [user.name, user.email, user.organization, user.phone]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus = status === 'All' || user.status === status

    return matchesSearch && matchesStatus
  })

  const sorted = sortUsers(filtered, sortBy, sortDirection)

  if (page === undefined || limit === undefined) {
    return sorted
  }

  const start = (page - 1) * limit

  return {
    users: sorted.slice(start, start + limit),
    total: sorted.length
  }
}

export const fetchUserById = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const user = USERS.find((entry) => entry.id === String(userId))

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export { USERS }
