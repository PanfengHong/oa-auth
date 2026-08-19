export type {
  User,
  Role,
  Permission,
  LoginForm,
  RegisterForm,
  TokenPair,
  LoginResponse,
  AuthConfig,
  AuthState,
  OaModuleMenuItem,
  OaModuleDefinition,
} from './types'

export { configureAuth, getAuthConfig, tokenManager, request } from './request'

export { login as loginApi, register as registerApi, logout as logoutApi, fetchUserInfo, listUsers, updateUserRoles, deleteUser as deleteUserApi } from './api'

export { useAuthStore } from './store'

export { useAuth } from './useAuth'
export type { UseAuthReturn } from './useAuth'

export { usePermission } from './usePermission'
export type { UsePermissionReturn } from './usePermission'

export { AuthGuard } from './AuthGuard'
export type { AuthGuardProps } from './AuthGuard'

export { PermissionGuard } from './PermissionGuard'
export type { PermissionGuardProps } from './PermissionGuard'

export { AuthProvider, authPublicRoutes, authProtectedRoutes, authModule } from './module'
export type { OaModuleMenuItem as ModuleMenuItem, OaModuleDefinition as ModuleDefinition } from './module'

export { ALL_PERMISSIONS, ALL_ROLES, ROLE_PERMISSION_MAP, getPermissionsByRoles, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions'

export { LoginPage } from './pages/LoginPage'
export { RegisterPage } from './pages/RegisterPage'
export { ForbiddenPage } from './pages/ForbiddenPage'
export { UserManagementPage } from './pages/UserManagementPage'

export { filterMenuByPermission, useSideMenuItems } from './menuFilter'
export type { PermissionedMenuItem } from './menuFilter'