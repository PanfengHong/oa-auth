import { usePermission } from './usePermission'

export interface PermissionedMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  path?: string
  permission?: string
  children?: PermissionedMenuItem[]
  [key: string]: unknown
}

export function filterMenuByPermission<T extends PermissionedMenuItem>(items: T[]): T[] {
  const { hasPermission } = usePermission()

  return items.reduce<T[]>((acc, item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return acc
    }

    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuByPermission(item.children)
      if (filteredChildren.length === 0 && item.permission === undefined) {
        return acc
      }
      acc.push({ ...item, children: filteredChildren } as T)
    } else {
      acc.push(item)
    }

    return acc
  }, [])
}

export function useSideMenuItems() {
  const { permissions } = usePermission()

  const check = (perm?: string) => {
    if (!perm) return true
    return permissions.includes(perm)
  }

  return { check }
}