-- ============================================================
-- Migration 003: Roles and Permissions (SaaS Multi-Profile)
-- ============================================================
-- Descrição:
--   Cria sistema de roles (papéis) e permissões para o modelo SaaS.
--   - Tabela roles: catálogo de papéis disponíveis
--   - Tabela user_roles: associação M:N usuário-role
--   - Tabela role_permissions: permissões por role
--   - Tabela trainer_students: vínculo PT-aluno
--   - RLS policies para isolamento de dados
--   - Migração automática de usuários existentes para role 'user'
-- ============================================================

-- ============================================================
-- 1. Tabela de catálogo de roles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. Tabela associativa user_roles (M:N)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role_id)
);

-- Índice para consultas eficientes por user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Índice para consultas por role_id (ex: "todos os PTs")
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- ============================================================
-- 3. Tabela de permissões por role
-- ============================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  UNIQUE(role_id, permission)
);

-- ============================================================
-- 4. Tabela de vínculo PT-Aluno
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trainer_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(trainer_id, student_id),
  CHECK (trainer_id != student_id)
);

-- Índice para "alunos do PT X"
CREATE INDEX IF NOT EXISTS idx_trainer_students_trainer ON public.trainer_students(trainer_id);

-- Índice para "PTs do aluno X"
CREATE INDEX IF NOT EXISTS idx_trainer_students_student ON public.trainer_students(student_id);

-- ============================================================
-- 5. Dados iniciais — Roles
-- ============================================================
INSERT INTO public.roles (slug, name, description) VALUES
  ('user', 'Usuário Final', 'Acesso ao app PWA para treinos pessoais'),
  ('personal_trainer', 'Personal Trainer', 'Acesso ao dashboard web para gestão de alunos'),
  ('superadmin', 'Administrador', 'Acesso completo à plataforma')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 6. Dados iniciais — Permissões por role
-- ============================================================

-- Permissões do role 'user'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'),
  ('view_own_progress'),
  ('request_upgrade')
) AS perms(perm)
WHERE slug = 'user'
ON CONFLICT DO NOTHING;

-- Permissões do role 'personal_trainer'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'),
  ('view_own_progress'),
  ('view_students'),
  ('create_workouts_for_others'),
  ('view_student_progress'),
  ('request_upgrade')
) AS perms(perm)
WHERE slug = 'personal_trainer'
ON CONFLICT DO NOTHING;

-- Permissões do role 'superadmin'
INSERT INTO public.role_permissions (role_id, permission)
SELECT id, perm FROM public.roles, (VALUES
  ('view_own_workouts'),
  ('view_own_progress'),
  ('view_students'),
  ('create_workouts_for_others'),
  ('view_student_progress'),
  ('request_upgrade'),
  ('view_all_data'),
  ('manage_content'),
  ('manage_subscriptions')
) AS perms(perm)
WHERE slug = 'superadmin'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. Migração de usuários existentes → role 'user'
-- ============================================================
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE r.slug = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = au.id
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. RLS Policies — user_roles
-- ============================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: usuário vê seus próprios roles
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- Política de INSERT: apenas superadmin ou o próprio usuário
DROP POLICY IF EXISTS user_roles_insert ON public.user_roles;
CREATE POLICY user_roles_insert ON public.user_roles
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- Política de UPDATE: apenas superadmin ou o próprio usuário
DROP POLICY IF EXISTS user_roles_update ON public.user_roles;
CREATE POLICY user_roles_update ON public.user_roles
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- Política de DELETE: apenas superadmin ou o próprio usuário
DROP POLICY IF EXISTS user_roles_delete ON public.user_roles;
CREATE POLICY user_roles_delete ON public.user_roles
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- ============================================================
-- 9. RLS Policies — roles (catálogo)
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Todos podem ler o catálogo de roles
DROP POLICY IF EXISTS roles_select_all ON public.roles;
CREATE POLICY roles_select_all ON public.roles
  FOR SELECT USING (true);

-- ============================================================
-- 10. RLS Policies — role_permissions
-- ============================================================
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Todos podem ler permissões (necessário para UI condicional)
DROP POLICY IF EXISTS role_permissions_select_all ON public.role_permissions;
CREATE POLICY role_permissions_select_all ON public.role_permissions
  FOR SELECT USING (true);

-- ============================================================
-- 11. RLS Policies — trainer_students
-- ============================================================
ALTER TABLE public.trainer_students ENABLE ROW LEVEL SECURITY;

-- SELECT: PT vê seus alunos; aluno vê seus PTs; superadmin vê todos
DROP POLICY IF EXISTS trainer_students_select ON public.trainer_students;
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

-- INSERT: PT pode adicionar alunos; superadmin também
DROP POLICY IF EXISTS trainer_students_insert ON public.trainer_students;
CREATE POLICY trainer_students_insert ON public.trainer_students
  FOR INSERT WITH CHECK (
    auth.uid() = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- UPDATE: PT pode gerenciar vínculos; superadmin também
DROP POLICY IF EXISTS trainer_students_update ON public.trainer_students;
CREATE POLICY trainer_students_update ON public.trainer_students
  FOR UPDATE USING (
    auth.uid() = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- DELETE: PT pode remover alunos; superadmin também
DROP POLICY IF EXISTS trainer_students_delete ON public.trainer_students;
CREATE POLICY trainer_students_delete ON public.trainer_students
  FOR DELETE USING (
    auth.uid() = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.slug = 'superadmin'
    )
  );

-- ============================================================
-- 12. RLS Policies estendidas — user_profiles
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: usuário vê o próprio; PT vê de seus alunos; superadmin vê todos
DROP POLICY IF EXISTS user_profiles_select_own ON public.user_profiles;
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

-- INSERT: usuário cria o próprio perfil
DROP POLICY IF EXISTS user_profiles_insert_own ON public.user_profiles;
CREATE POLICY user_profiles_insert_own ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: usuário atualiza o próprio perfil
DROP POLICY IF EXISTS user_profiles_update_own ON public.user_profiles;
CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: usuário deleta o próprio perfil (raro, mas necessário)
DROP POLICY IF EXISTS user_profiles_delete_own ON public.user_profiles;
CREATE POLICY user_profiles_delete_own ON public.user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 13. RLS Policies — tabelas existentes (workouts, etc.)
-- ============================================================
-- Nota: As tabelas existentes já devem ter RLS configurado pelo
-- schema inicial. Se não tiverem, ativar aqui:
-- ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.scheduled_workouts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Verificação pós-migração (comentado — rodar manualmente)
-- ============================================================
-- SELECT r.slug, COUNT(ur.user_id) as user_count
-- FROM public.roles r
-- LEFT JOIN public.user_roles ur ON ur.role_id = r.id
-- GROUP BY r.slug
-- ORDER BY r.slug;
