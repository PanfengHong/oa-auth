import { Navigate } from 'react-router-dom'
import { usePermission } from './usePermission'

export interface PermissionGuardProps {
  permission?: string | string[]
  role?: string | string[]
  mode?: 'any' | 'all'
  fallbackPath?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  role,
  mode = 'all',
  fallbackPath = '/',
  fallback,
  children,
}: PermissionGuardProps) {
  const { hasAnyPermission, hasAllPermissions, hasRole } = usePermission()

  let passed = true

  if (permission) {
    const codes = Array.isArray(permission) ? permission : [permission]
    if (mode === 'any') {
      if (!hasAnyPermission(codes)) passed = false
    } else {
      if (!hasAllPermissions(codes)) passed = false
    }
  }

  if (role && passed) {
    const roles = Array.isArray(role) ? role : [role]
    if (!roles.every((r) => hasRole(r))) {
      passed = false
    }
  }

  if (!passed) {
    if (fallback) return <>{fallback}</>
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}