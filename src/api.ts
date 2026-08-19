import { getAuthConfig, request } from './request'
import type { LoginForm, LoginResponse, RegisterForm, User } from './types'
import { mockAuthApi } from './mock'

export async function login(params: LoginForm): Promise<LoginResponse> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    const user = await mockAuthApi.login(params)
    return {
      token: {
        accessToken: `mock_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
        expiresIn: 60 * 60 * 24,
      },
      user,
    }
  }
  return request.post<LoginResponse>(cfg.loginPath, params)
}

export async function register(params: RegisterForm): Promise<{ success: boolean }> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    return mockAuthApi.register(params)
  }
  return request.post<{ success: boolean }>(cfg.registerPath, params)
}

export async function logout(): Promise<void> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    return mockAuthApi.logout()
  }
  try {
    await request.post(cfg.logoutPath)
  } catch {
    // ignore
  }
}

export async function refreshToken(
  refreshTokenValue: string,
): Promise<{ token: { accessToken: string; refreshToken: string; expiresIn: number } }> {
  const cfg = getAuthConfig()
  return request.post<{ token: { accessToken: string; refreshToken: string; expiresIn: number } }>(
    cfg.refreshPath,
    { refreshToken: refreshTokenValue },
  )
}

export async function fetchUserInfo(): Promise<{
  user: User
  permissions: string[]
}> {
  const cfg = getAuthConfig()
  return request.get<{ user: User; permissions: string[] }>(cfg.userInfoPath)
}

export async function listUsers(): Promise<User[]> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    return mockAuthApi.listUsers()
  }
  return request.get<User[]>('/api/admin/users')
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<User> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    return mockAuthApi.updateUserRoles(userId, roles)
  }
  return request.put<User>(`/api/admin/users/${userId}/roles`, { roles })
}

export async function deleteUser(userId: string): Promise<void> {
  const cfg = getAuthConfig()
  if (cfg.mode === 'mock') {
    return mockAuthApi.deleteUser(userId)
  }
  return request.delete(`/api/admin/users/${userId}`)
}