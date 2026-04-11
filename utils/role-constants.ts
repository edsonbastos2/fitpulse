// ==========================================
// Roles
// ==========================================

export const ROLES = {
  SUPERADMIN: 'superadmin',
  USER: 'user',
  PERSONAL_TRAINER: 'personal_trainer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// ==========================================
// Permissions
// ==========================================

export const PERMISSIONS = {
  // Acesso ao dashboard pessoal
  VIEW_OWN_WORKOUTS: 'view_own_workouts',
  VIEW_OWN_PROGRESS: 'view_own_progress',
  // Acesso ao dashboard de PT
  VIEW_STUDENTS: 'view_students',
  CREATE_WORKOUTS_FOR_OTHERS: 'create_workouts_for_others',
  VIEW_STUDENT_PROGRESS: 'view_student_progress',
  // Acesso admin
  VIEW_ALL_DATA: 'view_all_data',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  // Upgrade
  REQUEST_UPGRADE: 'request_upgrade',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// ==========================================
// Role → Permissions mapping
// ==========================================

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPERADMIN]: Object.values(PERMISSIONS),
  [ROLES.USER]: [
    PERMISSIONS.VIEW_OWN_WORKOUTS,
    PERMISSIONS.VIEW_OWN_PROGRESS,
    PERMISSIONS.REQUEST_UPGRADE,
  ],
  [ROLES.PERSONAL_TRAINER]: [
    PERMISSIONS.VIEW_OWN_WORKOUTS,
    PERMISSIONS.VIEW_OWN_PROGRESS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.CREATE_WORKOUTS_FOR_OTHERS,
    PERMISSIONS.VIEW_STUDENT_PROGRESS,
    PERMISSIONS.REQUEST_UPGRADE,
  ],
}
