import type { Permission, Role } from './types'

export const ALL_PERMISSIONS: Permission[] = [
  { key: 'dashboard:view', name: '查看工作台', description: '访问工作台页面', module: '工作台' },
  { key: 'approval:view', name: '查看审批', description: '访问审批中心', module: '审批' },
  { key: 'approval:manage', name: '管理审批', description: '审批和处理申请', module: '审批' },
  { key: 'org:view', name: '查看组织架构', description: '查看组织架构', module: '组织' },
  { key: 'org:manage', name: '管理组织架构', description: '编辑组织架构', module: '组织' },
  { key: 'attendance:view', name: '查看考勤', description: '查看考勤记录', module: '考勤' },
  { key: 'attendance:manage', name: '管理考勤', description: '管理考勤设置', module: '考勤' },
  { key: 'meeting:view', name: '查看会议', description: '查看会议列表', module: '会议' },
  { key: 'meeting:manage', name: '管理会议', description: '创建和管理会议', module: '会议' },
  { key: 'meeting:rooms', name: '管理会议室', description: '管理会议室资源', module: '会议' },
  { key: 'task:view', name: '查看任务', description: '查看任务看板', module: '任务' },
  { key: 'task:manage', name: '管理任务', description: '创建和分配任务', module: '任务' },
  { key: 'project:view', name: '查看项目', description: '查看项目列表', module: '项目' },
  { key: 'project:manage', name: '管理项目', description: '创建和管理项目', module: '项目' },
  { key: 'chat:view', name: '查看聊天', description: '查看聊天消息', module: '聊天' },
  { key: 'chat:manage', name: '管理聊天', description: '发送和管理消息', module: '聊天' },
  { key: 'designer:view', name: '查看表单设计', description: '查看流程表单设计', module: '表单设计' },
  { key: 'designer:manage', name: '管理表单设计', description: '创建和编辑流程表单', module: '表单设计' },
  { key: 'user:manage', name: '用户管理', description: '管理用户和权限', module: '系统' },
  { key: 'user:roles', name: '角色管理', description: '管理角色和权限分配', module: '系统' },
  { key: 'form:view', name: '查看表单', description: '查看流程表单', module: '表单设计' },
  { key: 'form:manage', name: '管理表单', description: '创建和编辑流程表单', module: '表单设计' },
]

export const ALL_ROLES: Role[] = [
  {
    key: 'admin',
    name: '系统管理员',
    description: '拥有所有权限',
    permissions: ALL_PERMISSIONS.map((p) => p.key),
  },
  {
    key: 'manager',
    name: '部门经理',
    description: '管理部门审批和项目',
    permissions: [
      'dashboard:view',
      'approval:view',
      'approval:manage',
      'org:view',
      'attendance:view',
      'attendance:manage',
      'meeting:view',
      'meeting:manage',
      'meeting:rooms',
      'task:view',
      'task:manage',
      'project:view',
      'project:manage',
      'chat:view',
      'chat:manage',
      'designer:view',
      'designer:manage',
    ],
  },
  {
    key: 'employee',
    name: '普通员工',
    description: '基本查看和个人任务',
    permissions: [
      'dashboard:view',
      'approval:view',
      'org:view',
      'attendance:view',
      'meeting:view',
      'task:view',
      'task:manage',
      'project:view',
      'chat:view',
    ],
  },
  {
    key: 'viewer',
    name: '访客',
    description: '只读权限',
    permissions: [
      'dashboard:view',
      'org:view',
    ],
  },
]

export const ROLE_PERMISSION_MAP: Record<string, string[]> = Object.fromEntries(
  ALL_ROLES.map((r) => [r.key, r.permissions]),
)

export function getPermissionsByRoles(roles: string[]): string[] {
  const perms = new Set<string>()
  for (const role of roles) {
    const rolePerms = ROLE_PERMISSION_MAP[role]
    if (rolePerms) {
      for (const p of rolePerms) perms.add(p)
    }
  }
  return [...perms]
}

export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes('*') || userPermissions.includes(required);
}

export function hasAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((p) => userPermissions.includes(p))
}

export function hasAllPermissions(userPermissions: string[], required: string[]): boolean {
  return required.every((p) => userPermissions.includes(p))
}