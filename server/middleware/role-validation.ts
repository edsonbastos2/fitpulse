import type { H3Event } from 'h3'
import type { Role } from '~/utils/role-constants'
import { ROLES } from '~/utils/role-constants'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

/**
 * Server Middleware: Validação de Roles em API Routes
 *
 * Camada de proteção backend (defense-in-depth). Valida que o usuário
 * autenticado possui o role necessário para acessar endpoints protegidos.
 *
 * Executa em TODA request do servidor, mas só intercepta rotas mapeadas.
 */

// Mapeamento: prefixo de rota → roles necessários
const ROLE_PROTECTED_ROUTES: Record<string, Role[]> = {
  '/api/students': [ROLES.PERSONAL_TRAINER, ROLES.SUPERADMIN],
  '/api/admin': [ROLES.SUPERADMIN],
}

/**
 * Encontra o primeiro prefixo protegido que a URL começa
 */
function findMatchingRoute(url: string): { prefix: string; requiredRoles: Role[] } | null {
  for (const [prefix, requiredRoles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
    if (url.startsWith(prefix)) {
      return { prefix, requiredRoles: requiredRoles as Role[] }
    }
  }
  return null
}

/**
 * Busca os roles do usuário no banco de dados
 */
async function getUserRoles(supabase: Awaited<ReturnType<typeof serverSupabaseClient>>, userId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(slug)')
    .eq('user_id', userId)

  if (error) {
    console.error('[role-validation] DB error:', error.message)
    return []
  }

  return (data ?? []).map((r: { roles: { slug: Role } }) => r.roles.slug)
}

/**
 * Log de auditoria para tentativas de acesso negado
 */
function logDeniedAccess(
  event: H3Event,
  userId: string,
  userRoles: Role[],
  requiredRoles: Role[]
) {
  const url = getRequestURL(event)
  const method = getMethod(event)

  console.warn(
    `[role-validation] ACCESS DENIED — user: ${userId}, ` +
      `route: ${method} ${url.pathname}, ` +
      `user_roles: [${userRoles.join(', ')}], ` +
      `required_roles: [${requiredRoles.join(', ')}]`
  )
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // Ignorar rotas que não começam com /api/
  if (!path.startsWith('/api/')) {
    return
  }

  // Verificar se a rota exige validação de role
  const matchedRoute = findMatchingRoute(path)
  if (!matchedRoute) {
    // Rota não protegida — permitir passagem sem verificação
    return
  }

  const { requiredRoles } = matchedRoute

  // Extrair usuário autenticado via serverSupabaseUser
  let user
  try {
    user = await serverSupabaseUser(event)
  } catch {
    // Usuário não autenticado — 401 antes de checar role
    console.warn(
      `[role-validation] UNAUTHORIZED — route: ${path}, reason: no authenticated user`
    )
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Você precisa estar autenticado para acessar este recurso.',
    })
  }

  if (!user) {
    console.warn(
      `[role-validation] UNAUTHORIZED — route: ${path}, reason: user is null`
    )
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Você precisa estar autenticado para acessar este recurso.',
    })
  }

  // Buscar roles do usuário no banco
  const client = await serverSupabaseClient(event)
  const userRoles = await getUserRoles(client, user.id)

  // Verificar se o usuário possui pelo menos um dos roles necessários
  const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))

  if (!hasRequiredRole) {
    // Log de auditoria
    logDeniedAccess(event, user.id, userRoles, requiredRoles)

    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: `Acesso negado. É necessário um dos seguintes perfis: ${requiredRoles.join(', ')}.`,
      data: {
        user_id: user.id,
        user_roles: userRoles,
        required_roles: requiredRoles,
      },
    })
  }

  // Usuário tem role necessário — armazenar no contexto para handlers downstream
  event.context.userRoles = userRoles
})
