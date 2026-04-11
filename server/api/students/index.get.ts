/**
 * Handler de teste: Lista de alunos
 * Protegido por role-validation middleware (personal_trainer, superadmin)
 */
export default defineEventHandler(() => ({
  ok: true,
  message: 'Lista de alunos acessada com sucesso',
  data: [],
}))
