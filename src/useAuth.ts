import { useAuthStore } from './store'
import type { LoginForm, RegisterForm, User } from './types'
import { hasPermission } from './permissions'

export interface UseAuthReturn {
  loading: boolean
  initialized: boolean
  user: User | null
  token: string | null
  permissions: string[]
  isAuthenticated: boolean
  login: (params: LoginForm) => Promise<void>
  logout: () => Promise<void>
  register: (params: RegisterForm) => Promise<void>
  hydrate: () => void
  clearAuth: () => void
  listUsers: () => Promise<User[]>
  updateUserRoles: (userId: string, roles: string[]) => Promise<User>
  deleteUser: (userId: string) => Promise<void>
  hasPermission: (userPermissions: string[], required: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (role: string) => boolean
}

export function useAuth(): UseAuthReturn {
  const {
    loading,
    initialized,
    user,
    token,
    permissions,
    login,
    logout,
    register,
    hydrate,
    clearAuth,
    listUsers,
    updateUserRoles,
    deleteUser,
  } = useAuthStore()

  const isAuthenticated = !!token

  return {
    loading,
    initialized,
    user,
    token,
    permissions,
    isAuthenticated,
    login,
    logout,
    register,
    hydrate,
    clearAuth,
    listUsers,
    updateUserRoles,
    deleteUser,
    hasPermission: (userPermissions: string[], required: string) => hasPermission(userPermissions, required),
    hasAnyPermission: (perms: string[]) =>
      perms.length === 0 || perms.some((p) => permissions.includes(p)),
    hasAllPermissions: (perms: string[]) =>
      perms.length === 0 || perms.every((p) => permissions.includes(p)),
    hasRole: (role: string) => !!(user && user.roles.includes(role)),
  }
}