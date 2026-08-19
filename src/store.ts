import { create } from 'zustand'
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  listUsers as listUsersApi,
  updateUserRoles as updateUserRolesApi,
  deleteUser as deleteUserApi,
} from './api'
import { tokenManager, getAuthConfig } from './request'
import type { AuthState, LoginForm, RegisterForm, User } from './types'
import { mockAuthApi } from './mock'
import { ALL_ROLES } from './permissions'

type AuthStore = AuthState & {
  login: (params: LoginForm) => Promise<void>
  logout: () => Promise<void>
  register: (params: RegisterForm) => Promise<void>
  hydrate: () => void
  clearAuth: () => void
  loadUserInfo: () => Promise<void>
  listUsers: () => Promise<User[]>
  updateUserRoles: (userId: string, roles: string[]) => Promise<User>
  deleteUser: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  token: null,
  refreshToken: null,
  expiresAt: 0,
  user: null,
  permissions: [],
  loading: false,
  initialized: false,

  hydrate: () => {
    const cfg = getAuthConfig()
    if (cfg.mode === 'mock') {
      const mockUser = mockAuthApi.getCurrentUser()
      if (mockUser) {
        set({
          token: 'mock_token',
          refreshToken: 'mock_refresh',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          user: mockUser,
          permissions: mockUser.permissions,
        })
      }
      set({ initialized: true })
      return
    }

    const stored = tokenManager.get()
    if (stored) {
      set({
        token: stored.token,
        refreshToken: stored.refreshToken,
        expiresAt: stored.expiresAt,
        user: stored.user,
        permissions: stored.user?.permissions || [],
      })
    }
    set({ initialized: true })
  },

  clearAuth: () => {
    tokenManager.clear()
    set({
      token: null,
      refreshToken: null,
      expiresAt: 0,
      user: null,
      permissions: [],
    })
  },

  login: async (params) => {
    set({ loading: true })
    try {
      const res = await loginApi(params)
      const { accessToken, refreshToken: rt, expiresIn } = res.token
      const expiresAt = Date.now() + expiresIn * 1000
      const cfg = getAuthConfig()

      // 如果权限未返回，从本地静态表补全（开发环境备用）
      const _permissions = res.user.permissions || ALL_ROLES.find(r => r.key === res.user.role.key)?.permissions || [];

      if (cfg.mode === 'real') {
        tokenManager.set({
          token: accessToken,
          refreshToken: rt,
          expiresAt,
          user: res.user,
        })
      }
      
      console.log('user', res.user)
      set({
        token: accessToken,
        refreshToken: rt,
        expiresAt,
        user: res.user,
        permissions: _permissions,
        loading: false,
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      await logoutApi()
    } catch {
      // ignore
    }
    get().clearAuth()
    set({ loading: false })
  },

  register: async (params) => {
    set({ loading: true })
    try {
      await registerApi(params)
      set({ loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  loadUserInfo: async () => {
    // reserved for future real API mode
  },

  listUsers: async () => {
    return listUsersApi()
  },

  updateUserRoles: async (userId, roles) => {
    const updated = await updateUserRolesApi(userId, roles)
    const currentUser = get().user
    if (currentUser && currentUser.id === userId) {
      set({
        user: updated,
        permissions: updated.permissions,
      })
    }
    return updated
  },

  deleteUser: async (userId) => {
    await deleteUserApi(userId)
  },
}))