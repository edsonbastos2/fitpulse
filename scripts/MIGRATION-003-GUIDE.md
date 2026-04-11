# Guia de Aplicação — Migration 003: Roles and Permissions

## Situação

O arquivo SQL da migration foi criado corretamente em:
**`supabase/migrations/003_roles_and_permissions.sql`**

Porém, **não foi possível aplicar automaticamente** neste ambiente porque:
- Supabase CLI não é suportado como módulo npm global no Windows
- Conexão PostgreSQL direta exige database password (não disponível no .env)
- API REST do Supabase não executa SQL arbitrário

## Como Aplicar (2 opções)

### Opção A — Supabase Dashboard (Recomendado, mais fácil)

1. Acesse o **SQL Editor** do Supabase:
   ```
   https://supabase.com/dashboard/project/basvoadgfiuzsqjjhcdr/sql/new
   ```

2. Abra o arquivo SQL local:
   ```
   supabase/migrations/003_roles_and_permissions.sql
   ```

3. Copie **todo o conteúdo** do arquivo

4. Cole no SQL Editor do Supabase

5. Clique em **Run** (ou pressione Ctrl+Enter)

6. Verifique no output:
   - ✅ "Success. No rows returned" (para CREATE TABLE)
   - ✅ "Success. 3 rows affected" (para INSERT de roles)
   - ✅ "Success. N rows affected" (para INSERT de permissões e user_roles)

7. Para verificar, rode este query:
   ```sql
   SELECT r.slug, r.name, COUNT(ur.user_id) as user_count
   FROM public.roles r
   LEFT JOIN public.user_roles ur ON ur.role_id = r.id
   GROUP BY r.slug, r.name
   ORDER BY r.slug;
   ```
   
   Esperado:
   ```
   slug               | name              | user_count
   -------------------|-------------------|------------
   personal_trainer   | Personal Trainer  | 0
   superadmin         | Administrador     | 0
   user               | Usuário Final     | N  (N = nº de usuários existentes)
   ```

### Opção B — Supabase CLI Local (se disponível)

```bash
# Se tiver o Supabase CLI instalado externamente (não via npm):
supabase db push --db-url "postgresql://..."
```

## Verificação Pós-Aplicação

Após aplicar a migration, rode:

```bash
node --env-file=.env scripts/verify-migration-003.js
```

Todos os 6 checks devem passar com ✅.

## O que a Migration Cria

| Objeto | Descrição |
|--------|-----------|
| `roles` | Catálogo: user, personal_trainer, superadmin |
| `user_roles` | Associação M:N usuário-role |
| `role_permissions` | Permissões por role |
| `trainer_students` | Vínculo PT-aluno |
| 9 indexes | Performance em consultas frequentes |
| 13 RLS policies | Isolamento de dados por role |
| Seed data | 3 roles + 14 permissões + migração de usuários existentes |

## Rollback (se necessário)

Se precisar reverter:

```sql
DROP TABLE IF EXISTS public.trainer_students CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
-- Reverter RLS de user_profiles (opcional)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
```
