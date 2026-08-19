import type { RouteObject } from 'react-router-dom'

export interface User {
  id: string
  username: string
  displayName: string
  role: Role
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
}

export interface Role {
  key: string
  name: string
  description: string
  permissions: string[]
}

export interface Permission {
  key: string
  name: string
  description: string
  module: string
}

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  displayName: string
  email: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse {
  token: TokenPair
  user: User
}

export interface AuthConfig {
  mode: 'mock' | 'real'
  baseURL: string
  loginPath: string
  registerPath: string
  refreshPath: string
  logoutPath: string
  userInfoPath: string
  storageKey: string
}

export interface AuthState {
  token: string | null
  refreshToken: string | null
  expiresAt: number
  user: User | null
  permissions: string[]
  loading: boolean
  initialized: boolean
}

export interface OaModuleMenuItem {
  key: string
  label: string
  path: string
  permission?: string
}

export interface OaModuleDefinition {
  id: string
  name: string
  basePath: string
  routes: RouteObject[]
  menu: OaModuleMenuItem[]
}