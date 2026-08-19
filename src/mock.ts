import type { LoginForm, RegisterForm, User } from './types'
import { getPermissionsByRoles } from './permissions'

const STORAGE_KEY = 'oa_mock_users'
const CURRENT_USER_KEY = 'oa_mock_current_user'

function loadUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function saveCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

function loadCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function createInitialUsers(): User[] {
  const users: User[] = [
    {
      id: '1',
      username: 'admin',
      displayName: '系统管理员',
      email: 'admin@zdy.com',
      role: { key: 'admin', name: '系统管理员', description: '负责管理系统', permissions: ['*'] },
      roles: ['admin'],
      permissions: getPermissionsByRoles(['admin']),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'manager',
      displayName: '部门经理',
      email: 'manager@zdy.com',
      role: { key: 'manager', name: '部门经理', description: '负责管理部门下的员工', permissions: [] },
      roles: ['manager'],
      permissions: getPermissionsByRoles(['manager']),
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'employee',
      displayName: '普通员工',
      email: 'employee@zdy.com',
      role: { key: 'employee', name: '普通员工', description: '只能查看和操作自己的数据', permissions: [] },
      roles: ['employee'],
      permissions: getPermissionsByRoles(['employee']),
      createdAt: new Date().toISOString(),
    },
  ]
  saveUsers(users)
  return users
}

function ensureUsersLoaded(): User[] {
  const users = loadUsers()
  if (users.length === 0) {
    return createInitialUsers()
  }
  // 根据 roles 重新计算权限，保证 permissions.ts 新增权限后已持久化的用户也能同步
  let dirty = false
  for (const u of users) {
    const fresh = getPermissionsByRoles(u.roles)
    if (u.permissions.length !== fresh.length || fresh.some((p, i) => p !== u.permissions[i])) {
      u.permissions = fresh
      dirty = true
    }
  }
  if (dirty) saveUsers(users)
  return users
}

const MOCK_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  manager: 'manager123',
  employee: 'employee123',
}

export const mockAuthApi = {
  async login(form: LoginForm): Promise<User> {
    await new Promise((r) => setTimeout(r, 400))

    const users = ensureUsersLoaded()
    const user = users.find((u) => u.username === form.username)

    if (!user) {
      throw new Error('用户不存在')
    }

    const storedPassword = MOCK_PASSWORDS[form.username]
    if (!storedPassword || storedPassword !== form.password) {
      throw new Error('密码错误')
    }

    saveCurrentUser(user)
    return user
  },

  async register(form: RegisterForm): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 400))

    const users = ensureUsersLoaded()

    if (form.password !== form.confirmPassword) {
      throw new Error('两次密码不一致')
    }

    if (users.some((u) => u.username === form.username)) {
      throw new Error('用户名已存在')
    }

    if (users.some((u) => u.email === form.email)) {
      throw new Error('邮箱已被注册')
    }

    const newUser: User = {
      id: String(users.length + 1),
      username: form.username,
      displayName: form.displayName,
      email: form.email,
      role: { key: 'viewer', name: '查看者', description: '只能查看系统数据', permissions: [] },
      roles: ['viewer'],
      permissions: getPermissionsByRoles(['viewer']),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)
    MOCK_PASSWORDS[form.username] = form.password
    saveCurrentUser(newUser)
    return { success: true }
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100))
    saveCurrentUser(null)
  },

  getCurrentUser(): User | null {
    const user = loadCurrentUser()
    if (user) {
      // 同步最新权限，避免 localStorage 中缓存的权限过期
      const fresh = getPermissionsByRoles(user.roles)
      if (
        user.permissions.length !== fresh.length ||
        fresh.some((p, i) => p !== user.permissions[i])
      ) {
        user.permissions = fresh
        saveCurrentUser(user)
      }
    }
    return user
  },

  async listUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 200))
    return ensureUsersLoaded()
  },

  async updateUserRoles(userId: string, roles: string[]): Promise<User> {
    await new Promise((r) => setTimeout(r, 200))

    const users = ensureUsersLoaded()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      throw new Error('用户不存在')
    }

    user.roles = roles
    user.permissions = getPermissionsByRoles(roles)
    saveUsers(users)

    const current = loadCurrentUser()
    if (current && current.id === userId) {
      saveCurrentUser(user)
    }

    return user
  },

  async deleteUser(userId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))

    const users = ensureUsersLoaded()
    const filtered = users.filter((u) => u.id !== userId)
    saveUsers(filtered)
  },
}