# Tech Spec - Sistema de Roles e Permissões SaaS

## Resumo Executivo

A implementação do sistema de roles e permissões será construída sobre a infraestrutura existente do FitPulse (Supabase Auth + Nuxt 3), adicionando uma camada de controle de acesso baseada em papéis (RBAC) em três níveis: **banco de dados** (via Row Level Security policies do Supabase), **backend** (via server middleware Nuxt) e **frontend** (via extensão do middleware de rotas Nuxt). A abordagem em camadas garante segurança defense-in-depth: mesmo que uma camada falhe, as outras continuam protegendo os dados.

O schema será estendido com uma tabela `user_roles` (relação muitos-para-muitos entre usuários e roles) e uma tabela `role_permissions` (mapeamento de permissões por role). O middleware `auth.ts` será refatorado para `auth.ts` + `role-guard.ts`, separando autenticação de autorização. Um composable `useRoles` fornecerá verificação de permissões reativa nos componentes.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Responsabilidade | Status |
|------------|------|------------------|--------|
| Tabela `roles` | DB (Supabase) | Catálogo de roles disponíveis (`superadmin`, `user`, `personal_trainer`) | **Novo** |
| Tabela `user_roles` | DB (Supabase) | Associação entre usuários e roles (suporta múltiplos roles por usuário) | **Novo** |
| Tabela `role_permissions` | DB (Supabase) | Mapeamento de permissões por role e recurso | **Novo** |
| Tabela `trainer_students` | DB (Supabase) | Vínculo entre Personal Trainers e seus alunos | **Novo** |
| RLS Policies | DB (Supabase) | Row Level Security policies para isolamento de dados por role | **Novo** |
| Migration script | DB (Supabase) | Migração SQL para criar tabelas e atribuir role `user` a usuários existentes | **Novo** |
| `middleware/auth.ts` | Nuxt Middleware | Validação de autenticação (existente, será ajustado) | **Modificado** |
| `middleware/role-guard.ts` | Nuxt Middleware | Validação de roles em rotas protegidas | **Novo** |
| `server/middleware/role-validation.ts` | Server Middleware | Validação de roles em endpoints de API (server routes) | **Novo** |
| `composables/useRoles.ts` | Vue Composable | Verificação reativa de roles e permissões no frontend | **Novo** |
| `composables/useAuth.ts` | Vue Composable | Estendido para incluir fetch de roles no perfil | **Modificado** |
| `utils/role-constants.ts` | Utility | Constantes tipadas de roles e permissões | **Novo** |
| `pages/access-denied.vue` | Página | Página de acesso negado com CTA para upgrade | **Novo** |
| `components/layout/RoleSwitcher.vue` | Componente Vue | Permite alternar contexto quando usuário tem múltiplos roles | **Novo** |
| `types/index.ts` | TypeScript | Novas interfaces para roles e permissões | **Modificado** |

### Relacionamentos entre Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Nuxt 3)                     │
│                                                          │
│  ┌──────────────┐    ┌───────────────┐                  │
│  │ middleware/  │───▶│ middleware/   │  Validação em    │
│  │ auth.ts      │    │ role-guard.ts │  cadeia           │
│  └──────────────┘    └───────┬───────┘                  │
│                              │                           │
│  ┌──────────────┐    ┌───────▼───────┐                  │
│  │ composables/ │◀───│ composables/  │  Roles reativos  │
│  │ useAuth.ts   │    │ useRoles.ts   │                   │
│  └──────────────┘    └───────┬───────┘                  │
│                              │                           │
│  ┌──────────────┐    ┌───────▼───────┐                  │
│  │ pages/       │───▶│ components/   │  UI condicional  │
│  │ access-denied│    │ RoleSwitcher  │  por role         │
│  └──────────────┘    └───────────────┘                  │
└──────────────────────────┬──────────────────────────────┘
                           │
                    Supabase Client
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   BACKEND (Supabase)                      │
│                                                          │
│  ┌──────────────┐    ┌───────────────┐                  │
│  │ roles        │    │ user_roles    │  M:N Users-Roles │
│  │ (catalogo)   │    │ (associativa) │                   │
│  └──────┬───────┘    └───────┬───────┘                  │
│         │                    │                           │
│  ┌──────▼───────┐    ┌───────▼───────┐                  │
│  │ role_        │    │ trainer_      │  Vínculo PT-     │
│  │ permissions  │    │ students      │  Aluno            │
│  └──────────────┘    └───────────────┘                  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Row Level Security (RLS) Policies em todas as tabelas ││
│  │ — filtra dados por role e vínculos                    ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Autenticação** → Usuário faz login → `@nuxtjs/supabase` popula `useSupabaseUser()`
2. **Fetch de Roles** → `useAuth.fetchProfile()` é chamado → Busca perfil + roles via join `user_roles`
3. **Validação de Rota** → Navegação para `/dashboard` → `middleware/auth.ts` verifica auth → `middleware/role-guard.ts` verifica role necessário
4. **Acesso Negado** → Role insuficiente → Redirect para `/access-denied` com metadata da rota bloqueada
5. **Consulta de Dados** → Componente usa `useRoles.can('view_students')` → Composable verifica permissões → UI renderiza condicionalmente
6. **RLS no Banco** → Query no Supabase → RLS policy filtra linhas baseado em `auth.uid()` e join com `user_roles`

## Design de Implementação

### Interfaces Principais

```typescript
// utils/role-constants.ts
export const ROLES = {
  SUPERADMIN: 'superadmin',
  USER: 'user',
  PERSONAL_TRAINER: 'personal_trainer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

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

// Mapeamento role → permissões
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
```

```typescript
// composables/useRoles.ts
export const useRoles = () => {
  const user = useSupabaseUser()
  const roles = useState<Role[]>('user-roles', () => [])

  const hasRole = (role: Role): boolean => roles.value.includes(role)
  const hasAnyRole = (requiredRoles: Role[]): boolean =>
    requiredRoles.some((role) => roles.value.includes(role))
  const can = (permission: Permission): boolean => {
    return roles.value.some((role) =>
      ROLE_PERMISSIONS[role]?.includes(permission)
    )
  }
  const activeRole = useState<Role>('active-role', () => ROLES.USER)
  const setActiveRole = (role: Role) => {
    if (hasRole(role)) activeRole.value = role
  }

  return { roles, hasRole, hasAnyRole, can, activeRole, setActiveRole }
}
```

```typescript
// composables/useAuth.ts — extensões
export const useAuth = () => {
  // ... existente mantido, adicionar:

  const fetchRoles = async (): Promise<Role[]> => {
    if (!user.value) return []
    const { data } = await supabase
      .from('user_roles')
      .select('roles(slug)')
      .eq('user_id', user.value.id)
    return (data ?? []).map((r: any) => r.roles.slug as Role)
  }
}
```

### Modelos de Dados

```sql
-- Migration: 001_roles_and_permissions.sql

-- Tabela de catálogo de roles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,             -- 'superadmin', 'user', 'personal_trainer'
  name TEXT NOT NULL,                    -- Nome legível
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela associativa user_roles (um usuário pode ter múltiplos roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role_id)
);

-- Tabela de permissões por role
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,              -- 'view_students', 'manage_content', etc.
  UNIQUE(role_id, permission)
);

-- Tabela de vínculo PT-Aluno
CREATE TABLE IF NOT EXISTS public.trainer_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(trainer_id, student_id),
  CHECK (trainer_id != student_id)
);

-- Dados iniciais
INSERT INTO public.roles (slug, name, description) VALUES
  ('user', 'Usuário Final', 'Acesso ao app PWA para treinos pessoais'),
  ('personal_trainer', 'Personal Trainer', 'Acesso ao dashboard web para gestão de alunos'),
  ('superadmin', 'Administrador', 'Acesso completo à plataforma')
ON CONFLICT (slug) DO NOTHING;

-- Permissões do role 'user'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'), ('view_own_progress'), ('request_upgrade')
) AS perms(perm) WHERE slug = 'user'
ON CONFLICT DO NOTHING;

-- Permissões do role 'personal_trainer'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'), ('view_own_progress'),
  ('view_students'), ('create_workouts_for_others'),
  ('view_student_progress'), ('request_upgrade')
) AS perms(perm) WHERE slug = 'personal_trainer'
ON CONFLICT DO NOTHING;

-- Permissões do role 'superadmin'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'), ('view_own_progress'),
  ('view_students'), ('create_workouts_for_others'),
  ('view_student_progress'), ('request_upgrade'),
  ('view_all_data'), ('manage_content'), ('manage_subscriptions')
) AS perms(perm) WHERE slug = 'superadmin'
ON CONFLICT DO NOTHING;

-- Atribuir role 'user' a todos os usuários existentes
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id FROM auth.users au
CROSS JOIN public.roles r
WHERE r.slug = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = au.id
  )
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver seus próprios roles
CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Apenas superadmin ou o próprio usuário pode gerenciar roles
CREATE POLICY user_roles_manage ON public.user_roles
  FOR ALL USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_select_all ON public.roles
  FOR SELECT USING (true); -- Todos podem ver o catálogo de roles

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY role_permissions_select_all ON public.role_permissions
  FOR SELECT USING (true);

ALTER TABLE public.trainer_students ENABLE ROW LEVEL SECURITY;

-- PT pode ver seus alunos
CREATE POLICY trainer_students_select ON public.trainer_students
  FOR SELECT USING (
    auth.uid() = trainer_id
    OR auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- Apenas PT pode adicionar/remover alunos
CREATE POLICY trainer_students_manage ON public.trainer_students
  FOR ALL USING (
    auth.uid() = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );
```

### RLS Policies para Tabelas Existentes

```sql
-- Estender RLS nas tabelas existentes para isolamento por role

-- user_profiles: usuário vê o próprio; PT vê de seus alunos; superadmin vê todos
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profiles_select_own ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.trainer_students ts
      WHERE ts.trainer_id = auth.uid() AND ts.student_id = user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_profiles_insert_own ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### TypeScript Types

```typescript
// types/index.ts — Adicionar:
export interface Role {
  id: string
  slug: 'superadmin' | 'user' | 'personal_trainer'
  name: string
  description: string
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  granted_at: string
  granted_by: string | null
}

export interface RolePermission {
  id: string
  role_id: string
  permission: string
}

export interface TrainerStudent {
  id: string
  trainer_id: string
  student_id: string
  created_at: string
  created_by: string | null
}

// Estender UserProfile:
export interface UserProfile {
  // ... campos existentes
  roles?: Role[]
  active_role?: 'superadmin' | 'user' | 'personal_trainer'
}

// Estender RouteMeta (Nuxt)
declare module '#app' {
  interface PageMeta {
    requiredRoles?: ('superadmin' | 'user' | 'personal_trainer')[]
    requiredPermissions?: string[]
  }
}
```

### Middleware de Rotas

```typescript
// middleware/role-guard.ts
export default defineNuxtRouteMiddleware((to) => {
  const { hasAnyRole } = useRoles()

  // Rotas com requirement de role
  const requiredRoles = to.meta.requiredRoles as Role[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(requiredRoles)) {
      return navigateTo({
        path: '/access-denied',
        query: {
          required: requiredRoles.join(','),
          redirect: to.fullPath,
        },
      })
    }
  }
})
```

### Endpoints de API (Server Routes)

```typescript
// server/middleware/role-validation.ts
// Middleware que valida roles em server routes (Nuxt server handlers)
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Ignorar rotas que não requerem validação
  if (!url.pathname.startsWith('/api/')) return

  // Rotas que exig role específico
  const roleProtectedRoutes: Record<string, Role[]> = {
    '/api/students': ['personal_trainer', 'superadmin'],
    '/api/admin': ['superadmin'],
  }

  for (const [path, roles] of Object.entries(roleProtectedRoutes)) {
    if (url.pathname.startsWith(path)) {
      // Validar role do usuário (buscar via cookie/session do Supabase)
      const user = getHeader(event, 'x-supabase-user-id')
      if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

      const { data } = await useSupabaseClient()
        .from('user_roles')
        .select('roles(slug)')
        .eq('user_id', user)

      const userRoles = (data ?? []).map((r: any) => r.roles.slug)
      const hasRole = roles.some((r) => userRoles.includes(r))

      if (!hasRole) {
        throw createError({ statusCode: 403, message: 'Forbidden' })
      }
    }
  }
})
```

### Declaração de Rotas Protegidas

```typescript
// pages/dashboard/index.vue — Exemplo de uso
definePageMeta({
  middleware: ['auth', 'role-guard'],
  requiredRoles: ['user', 'personal_trainer', 'superadmin'],
})

// pages/admin/index.vue — Exemplo de rota superadmin-only
definePageMeta({
  middleware: ['auth', 'role-guard'],
  requiredRoles: ['superadmin'],
})
```

## Pontos de Integração

### Supabase (Existente)

- **Autenticação**: `@nuxtjs/supabase` — não requer mudanças, já fornece `useSupabaseUser()` e `useSupabaseClient()`
- **Database**: Supabase Postgres — novas tabelas e RLS policies via migração SQL
- **Conflict existente**: O módulo `@nuxtjs/supabase` já faz redirect automático. A estratégia é manter `exclude: ['/', '/auth/*', '/exercises/*']` e delegar a validação de roles ao `middleware/role-guard.ts`

### Sistemas Existentes Modificados

| Arquivo | Mudança |
|---------|---------|
| `middleware/auth.ts` | Remover validação de `protectedRoutes` — focar apenas em auth (verificar `!user.value`) |
| `composables/useAuth.ts` | Adicionar `fetchRoles()` e integrar com `useRoles` |
| `types/index.ts` | Adicionar interfaces `Role`, `UserRole`, `RolePermission`, `TrainerStudent` |
| `nuxt.config.ts` | Registrar novo middleware; sem mudanças na config do Supabase |

## Abordagem de Testes

### Testes Unidade

| O que testar | Como |
|--------------|------|
| `useRoles.hasRole()` | Mock `useState('user-roles')` com roles variados; verificar retorno booleano |
| `useRoles.can()` | Mock de roles e verificar match com `ROLE_PERMISSIONS` |
| `useRoles.setActiveRole()` | Verificar que só aceita roles que o usuário possui |
| `middleware/role-guard.ts` | Mock de rota com e sem `requiredRoles`; verificar redirect correto |
| `ROLE_PERMISSIONS` | Verificar que todas as roles têm permissões definidas e sem sobreposição indevida |

**Requisitos de Mock**: Mock do `useSupabaseUser()` para simular usuário autenticado/não-autenticado. Mock do `useState()` para roles.

**Cenários Críticos**:
- Usuário sem role tentando acessar rota protegida → redirect para `/access-denied`
- Usuário com role `user` tentando acessar rota de `personal_trainer` → redirect para `/access-denied`
- Usuário com múltiplos roles → `hasAnyRole` retorna true se qualquer um bater
- `activeRole` só pode ser setado para um role que o usuário possui

### Testes de Integração

| O que testar | Como |
|--------------|------|
| Migração SQL | Executar migration em banco de teste; verificar que tabelas existem, roles seedados, usuários existentes receberam role `user` |
| RLS Policies | Criar usuários de teste com roles diferentes; executar queries como cada role; verificar que resultados são filtrados corretamente |
| `trainer_students` | Testar que PT pode ver seus alunos mas não alunos de outros PTs |
| `user_profiles` RLS | Testar que usuário vê o próprio perfil; PT vê perfil de seus alunos; superadmin vê todos |

**Dados de Teste**:
- 1 superadmin, 2 PTs, 3 usuários finais
- Cada PT com 1-2 alunos vinculados
- Workouts e logs associados a cada usuário

### Testes E2E (Playwright)

| Cenário | Passos | Expectativa |
|---------|--------|-------------|
| Login de usuário normal | Login com email/senha | Redirect para `/dashboard`, role `user` ativo |
| Acesso negado | Usuário `user` tenta acessar `/admin` | Redirect para `/access-denied` com mensagem clara |
| Upgrade de role (simulado) | Adicionar role `personal_trainer` via Supabase | Dashboard de PT acessível, RoleSwitcher aparece |
| Role Switch | Usuário com `user` + `personal_trainer` clica para alternar | Interface muda de contexto (dados do aluno vs dados do PT) |
| Isolamento de dados | PT A faz login | Vê apenas seus alunos, não alunos do PT B |
| Migração de usuários existentes | Executar migration em base com usuários sem roles | Todos ganham role `user` automaticamente |

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Tipos e constantes** (`types/index.ts`, `utils/role-constants.ts`) — Base tipada que todos os outros componentes dependem. Sem isso, nada compila corretamente.

2. **Migration SQL** (`supabase/migrations/001_roles_and_permissions.sql`) — Schema do banco precisa existir antes de qualquer código. Incluir: tabelas, dados seed, RLS policies, migração de usuários existentes.

3. **Composable `useRoles`** (`composables/useRoles.ts`) — Lógica central de verificação de roles que será consumida por middleware, páginas e componentes.

4. **Extensão do `useAuth`** (`composables/useAuth.ts`) — Integrar fetch de roles com o perfil existente.

5. **Middleware `role-guard.ts`** — Validação de roles em rotas Nuxt. Depende de `useRoles` estar pronto.

6. **Ajuste do `middleware/auth.ts`** — Simplificar para cuidar apenas de auth (remover lógica de roles que ficará no `role-guard`).

7. **Página `access-denied.vue`** — Feedback visual para acessos negados. Pode ser feito em paralelo com o middleware.

8. **Componente `RoleSwitcher.vue`** — UI para alternância de contexto. Depende de `useRoles` estar pronto.

9. **Server middleware de validação** (`server/middleware/role-validation.ts`) — Proteção de endpoints API. Último porque depende de toda a estrutura de roles estar funcional.

10. **Integração e testes E2E** — Aplicar `definePageMeta` com `requiredRoles` nas páginas existentes e rodar testes E2E.

### Dependências Técnicas

- **Supabase CLI** para aplicar migrations localmente (`npx supabase db push`)
- **Acesso ao dashboard Supabase** para criar RLS policies e verificar dados
- **Playwright** já configurado no projeto (verificar se há config existente)
- **Nenhum serviço externo bloqueante** — tudo roda sobre infraestrutura existente

## Monitoramento e Observabilidade

### Métricas

- `role_access_denied_total` (counter, label: `role`, `route`) — número de tentativas de acesso negadas por role e rota
- `role_upgrade_total` (counter) — número de upgrades de role realizados
- `active_users_by_role` (gauge, label: `role`) — usuários ativos por role

### Logs

| Nível | Quando |
|-------|--------|
| `WARN` | Tentativa de acesso a rota sem role adequado (include: user_id, rota, role atual) |
| `INFO` | Role concedido a usuário (include: user_id, role, granted_by) |
| `ERROR` | Falha ao consultar `user_roles` ou RLS policy violada inesperadamente |

### Dashboards

- Painel no Supabase Dashboard (ou Grafana se configurado) mostrando: acessos negados nas últimas 24h, distribuição de usuários por role, upgrades realizados

## Considerações Técnicas

### Decisões Principais

**1. RLS no banco vs validação apenas no middleware**

- **Decisão**: Implementar ambos (defense-in-depth)
- **Justificativa**: Middleware protege o frontend, mas RLS protege contra acesso direto ao banco ou chamadas API bypassando o middleware
- **Trade-off**: Complexidade maior de manutenção (duas camadas para manter sincronizadas)
- **Alternativa rejeitada**: Apenas RLS — mais simples, mas dificulta feedback imediato ao usuário no frontend

**2. Tabela `user_roles` associativa vs coluna `role` em `user_profiles`**

- **Decisão**: Tabela associativa com suporte a múltiplos roles
- **Justificativa**: Um Personal Trainer também é um Usuário Final — precisa de ambos os roles. Design extensível para roles futuros
- **Trade-off**: Queries mais complexas (JOINs) vs flexibilidade
- **Alternativa rejeitada**: Coluna enum simples — limitaria a um role por usuário

**3. `role_permissions` no banco vs hardcoded no código**

- **Decisão**: Ambos — permissões no banco para auditabilidade; mapeamento `ROLE_PERMISSIONS` no código para performance e type safety
- **Justificativa**: Tabela no banco permite que superadmin gerencie permissões sem deploy; código garante type safety e performance no frontend
- **Trade-off**: Risco de divergência entre banco e código (mitigar com seed/migration sincronizados)

**4. Middleware em cadeia (`auth` → `role-guard`) vs middleware único**

- **Decisão**: Dois middlewares separados
- **Justificativa**: Separação de responsabilidades — `auth` cuida de "quem é você", `role-guard` cuida de "o que você pode fazer". Mais fácil de testar e manter
- **Alternativa rejeitada**: Middleware único — mais simples, mas mistura responsabilidades

### Riscos Conhecidos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Conflito entre `@nuxtjs/supabase` redirect e middleware manual | Usuários podem ser redirecionados antes da validação de role | Manter `exclude` no Supabase config e validar roles no middleware manual |
| Divergência entre `ROLE_PERMISSIONS` no código e `role_permissions` no banco | Permissões inconsistentes | Teste automatizado que compara código vs banco; CI check |
| RLS policies complexas afetando performance | Queries lentas em tabelas grandes | Indexar colunas de join (`user_id`, `role_id`, `trainer_id`); monitorar query plans |
| Migração de usuários existentes falhar parcialmente | Alguns usuários sem role | Script idempotente (ON CONFLICT DO NOTHING); verificar pós-migração com query de auditoria |
| Usuário com role `personal_trainer` mas sem assinatura ativa | Acesso premium sem pagamento | Pré-requisito de elegibilidade no RF-16 será validado por tabela `subscriptions` (PRD futuro) — por ora, confiar no processo manual de concessão |

### Áreas Precisando Pesquisa

- **Supabase RLS performance** em tabelas com muitos joins — testar com dataset de 10k+ usuários para validar meta de 50ms
- **Nuxt 3 middleware composables** — verificar se `useRoles()` é acessível dentro de `middleware/role-guard.ts` (composables rodam no contexto Nuxt, mas middleware pode ter limitações)

### Conformidade com Skills Padrões

Skills aplicáveis a esta Tech Spec:

- **`supabase-postgres-best-practices`** — RLS policies, indexação, design de schema, performance de queries
- **`ui-ux-pro-max`** — Design da página `access-denied`, componente `RoleSwitcher`, badges de perfil
- **`frontend-design`** — UI da página de acesso negado e role switcher com design consistente com o design system existente

### Arquivos Relevantes e Dependentes

| Arquivo | Ação | Dependências |
|---------|------|--------------|
| `types/index.ts` | Modificar | — |
| `utils/role-constants.ts` | Criar | `types/index.ts` |
| `composables/useRoles.ts` | Criar | `utils/role-constants.ts`, `@nuxtjs/supabase` |
| `composables/useAuth.ts` | Modificar | `composables/useRoles.ts` |
| `middleware/auth.ts` | Modificar | — |
| `middleware/role-guard.ts` | Criar | `composables/useRoles.ts` |
| `server/middleware/role-validation.ts` | Criar | `@nuxtjs/supabase`, `utils/role-constants.ts` |
| `pages/access-denied.vue` | Criar | `composables/useRoles.ts`, `composables/useAuth.ts` |
| `components/layout/RoleSwitcher.vue` | Criar | `composables/useRoles.ts` |
| `nuxt.config.ts` | Modificar (registrar middleware) | — |
| `supabase/migrations/001_roles_and_permissions.sql` | Criar | — |
