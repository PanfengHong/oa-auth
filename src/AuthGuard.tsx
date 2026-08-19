import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store'

export interface AuthGuardProps {
  loginPath?: string
  loading?: React.ReactNode
  children?: React.ReactNode
}

export function AuthGuard({
  loginPath = '/login',
  loading,
  children,
}: AuthGuardProps) {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const token = useAuthStore((s) => s.token)
  const initialized = useAuthStore((s) => s.initialized)
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    if (!initialized) {
      hydrate()
    }
    setReady(true)
  }, [initialized, hydrate])

  if (!ready || !initialized) {
    return <>{loading ?? null}</>
  }

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${loginPath}?redirect=${redirectUrl}`} replace />
  }

  return children ? <>{children}</> : null
}