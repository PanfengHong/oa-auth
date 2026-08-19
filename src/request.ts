import type { AuthConfig, User } from './types'

let config: AuthConfig = {
  mode: 'real',
  baseURL: '',
  loginPath: '/api/auth/login',
  registerPath: '/api/auth/register',
  refreshPath: '/api/auth/refresh',
  logoutPath: '/api/auth/logout',
  userInfoPath: '/api/user/info',
  storageKey: 'oa_auth_storage',
}

interface StoredToken {
  token: string
  refreshToken: string
  expiresAt: number
  user?: User | null
}

function getStorage(): StoredToken | null {
  try {
    const raw = localStorage.getItem(config.storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setStorage(data: StoredToken | null): void {
  if (data) {
    localStorage.setItem(config.storageKey, JSON.stringify(data))
  } else {
    localStorage.removeItem(config.storageKey)
  }
}

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function onRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(callback: (token: string) => void): void {
  refreshSubscribers.push(callback)
}

async function interceptor(
  url: string,
  options: RequestInit & { skipAuth?: boolean },
): Promise<Response> {
  const stored = getStorage()

  if (!options.skipAuth && stored?.token) {
    const now = Date.now()
    if (stored.expiresAt - now < 5 * 60 * 1000 && stored.refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshRes = await rawFetch(config.refreshPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: stored.refreshToken }),
            skipAuth: true,
          })
          if (!refreshRes.ok) {
            throw new Error('Refresh failed')
          }
          const data = (await refreshRes.json()) as {
            token: { accessToken: string; refreshToken: string; expiresIn: number }
          }
          const newToken = data.token.accessToken
          setStorage({
            token: newToken,
            refreshToken: data.token.refreshToken,
            expiresAt: Date.now() + data.token.expiresIn * 1000,
          })
          onRefreshed(newToken)
        } catch {
          setStorage(null)
          onRefreshed('')
          throw new Error('Token expired')
        } finally {
          isRefreshing = false
        }
      }
      const token = await new Promise<string>((resolve) => {
        if (!isRefreshing) {
          resolve(getStorage()?.token ?? '')
        } else {
          addRefreshSubscriber(resolve)
        }
      })
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    } else {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${stored.token}`,
      }
    }
  }

  return fetch(config.baseURL + url, options)
}

async function rawFetch(
  url: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<Response> {
  const { skipAuth, ...rest } = options as { skipAuth?: boolean } & RequestInit

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  }

  const mergedOptions: RequestInit = { ...rest, headers }

  if (!skipAuth) {
    return interceptor(url, mergedOptions as RequestInit & { skipAuth?: boolean })
  }

  return fetch(config.baseURL + url, mergedOptions)
}

export const request = {
  get<T = unknown>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const query = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : ''
    return rawFetch(url + query).then((r) => r.json() as Promise<T>)
  },

  post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return rawFetch(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }).then((r) => r.json() as Promise<T>)
  },

  put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return rawFetch(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }).then((r) => r.json() as Promise<T>)
  },

  delete<T = unknown>(url: string): Promise<T> {
    return rawFetch(url, { method: 'DELETE' }).then((r) => r.json() as Promise<T>)
  },
}

export function configureAuth(cfg: Partial<AuthConfig>): void {
  config = { ...config, ...cfg }
}

export function getAuthConfig(): AuthConfig {
  return config
}

export const tokenManager = {
  get(): StoredToken | null {
    return getStorage()
  },
  set(data: StoredToken): void {
    setStorage(data)
  },
  clear(): void {
    setStorage(null)
  },
  isExpired(): boolean {
    const stored = getStorage()
    if (!stored) return true
    return stored.expiresAt <= Date.now()
  },
}