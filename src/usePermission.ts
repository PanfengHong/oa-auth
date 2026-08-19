import { useAuthStore } from './store'

export interface UsePermissionReturn {
  permissions: string[]
  hasPermission: (code: string) => boolean
  hasAnyPermission: (codes: string[]) => boolean
  hasAllPermissions: (codes: string[]) => boolean
  hasRole: (role: string) => boolean
  hasAllRoles: (roles: string[]) => boolean
}

export function usePermission(): UsePermissionReturn {
  const user = useAuthStore((s) => s.user)
  const permissions = useAuthStore((s) => s.permissions)

  const hasPermission = (code: string): boolean => {
    if (!code) return true
    return permissions.includes('*') || permissions.includes(code)
  }

  const hasAnyPermission = (codes: string[]): boolean => {
    if (!codes || codes.length === 0) return true
    return codes.some((code) => permissions.includes('*') ||permissions.includes(code))
  }

  const hasAllPermissions = (codes: string[]): boolean => {
    if (!codes || codes.length === 0) return true
    return codes.every((code) => permissions.includes('*') ||permissions.includes(code))
  }

  const hasRole = (role: string): boolean => {
    if (!role || !user) return false
    return user.roles.includes(role)
  }

  const hasAllRoles = (roles: string[]): boolean => {
    if (!roles || roles.length === 0) return true
    if (!user) return false
    return roles.every((r) => user.roles.includes(r))
  }

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAllRoles,
  }
}