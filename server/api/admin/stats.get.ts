/**
 * Handler de teste: Stats do admin
 * Protegido por role-validation middleware (superadmin apenas)
 */
export default defineEventHandler(() => ({
  ok: true,
  message: 'Stats do admin acessados com sucesso',
  data: {
    total_users: 0,
    total_pts: 0,
    total_revenue: 0,
  },
}))
