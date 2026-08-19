import type { RouteObject } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { AuthGuard } from './AuthGuard'
import { PermissionGuard } from './PermissionGuard'

export interface OaModuleMenuItem {
  key: string
  label: string
  path: string
}

export interface OaModuleDefinition {
  id: string
  name: string
  basePath: string
  routes: RouteObject[]
  menu: OaModuleMenuItem[]
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)
  const initialized = useAuthStore((s) => s.initialized)

  useEffect(() => {
    if (!initialized) {
      hydrate()
    }
  }, [initialized, hydrate])

  return <>{children}</>
}

export const authPublicRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: '403', element: <ForbiddenPage /> },
]

export const authProtectedRoutes: RouteObject[] = [
  {
    path: 'auth/users',
    element: (
      <AuthGuard>
        <PermissionGuard permission="user:manage" fallbackPath="/403">
          <UserManagementPage />
        </PermissionGuard>
      </AuthGuard>
    ),
  },
]

export const authModule: OaModuleDefinition = {
  id: 'oa-auth',
  name: '认证',
  basePath: '',
  menu: [
    { key: 'users', label: '用户管理', path: '/auth/users' },
  ],
  routes: [...authPublicRoutes, ...authProtectedRoutes],
}