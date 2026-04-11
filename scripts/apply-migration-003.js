/**
 * Script para aplicar a migration 003_roles_and_permissions.sql
 * via conexão direta PostgreSQL com o banco Supabase.
 *
 * Uso: node --env-file=.env scripts/apply-migration-003.js
 */

import postgres from 'postgres'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERRO: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  console.error('Execute: node --env-file=.env scripts/apply-migration-003.js')
  process.exit(1)
}

// Converter URL HTTPS para PostgreSQL connection string
// https://basvoadgfiuzsqjjhcdr.supabase.co → postgresql://postgres.<ref>.<project>:<password>@<host>:5432/postgres
const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
if (!projectRef) {
  console.error('ERRO: Não foi possível extrair o project_ref da URL.')
  process.exit(1)
}

// Supabase usa formato: postgresql://postgres.{ref}.{project}:{password}@{host}:5432/postgres
// A password é a service_role key decodificada? Não — é a database password.
// Na verdade, via Supabase podemos usar o pooler URL:
// postgresql://postgres.[project-ref]:[service-role-key]@aws-0-[region].pooler.supabase.com:6543/postgres

// Abordagem alternativa: usar HTTP SQL endpoint do Supabase
// Supabase não expõe SQL direto via HTTP facilmente.
// Vamos tentar com o pooler URL padrão.

const dbUrl = `postgresql://postgres.${projectRef}:${serviceRoleKey}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

console.log('🔗 Conectando ao Supabase PostgreSQL...')
console.log('📄 Project ref:', projectRef)

const sql = postgres(dbUrl, { max: 1 })

async function main() {
  try {
    // Testar conexão
    const testResult = await sql`SELECT 1 as connected`
    console.log('✅ Conexão estabelecida:', testResult[0])

    // Verificar se migration já foi aplicada
    console.log('\n🔍 Verificando se tabela "roles" existe...')
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'roles'
      ) as exists
    `
    
    if (tableCheck[0].exists) {
      console.log('✅ Tabela "roles" já existe. Verificando integridade...')
      
      const roles = await sql`SELECT slug, name FROM public.roles ORDER BY slug`
      console.log('📋 Roles encontrados:', roles.length)
      roles.forEach(r => console.log(`   - ${r.slug}: ${r.name}`))

      const userRoles = await sql`SELECT COUNT(*) FROM public.user_roles`
      console.log('👤 User roles:', userRoles[0].count)

      const perms = await sql`SELECT COUNT(*) FROM public.role_permissions`
      console.log('🔑 Permissões:', perms[0].count)

      const trainerStudents = await sql`SELECT COUNT(*) FROM public.trainer_students`
      console.log('🤝 Trainer-student bonds:', trainerStudents[0].count)

      console.log('\n🎉 Migration já aplicada e verificada!')
      await sql.end()
      return
    }

    // Ler e executar SQL
    const sqlPath = resolve(__dirname, '..', 'supabase', 'migrations', '003_roles_and_permissions.sql')
    const migrationSql = readFileSync(sqlPath, 'utf-8')
    
    console.log('\n📄 Migration SQL lida:', sqlPath)
    console.log('📏 Tamanho:', migrationSql.length, 'bytes')
    console.log('\n⚙️  Aplicando migration...')

    // Executar o SQL inteiro (statements múltiplos)
    await sql.unsafe(migrationSql)

    console.log('✅ Migration aplicada com sucesso!')

    // Verificar
    console.log('\n🔍 Verificando migration...')
    
    const roles = await sql`SELECT slug, name FROM public.roles ORDER BY slug`
    console.log('📋 Roles encontrados:', roles.length)
    roles.forEach(r => console.log(`   - ${r.slug}: ${r.name}`))

    const userRoles = await sql`SELECT COUNT(*) as count FROM public.user_roles`
    console.log('👤 User roles criados:', userRoles[0].count)

    const perms = await sql`SELECT COUNT(*) as count FROM public.role_permissions`
    console.log('🔑 Permissões criadas:', perms[0].count)

    const rlsEnabled = await sql`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('roles', 'user_roles', 'role_permissions', 'trainer_students', 'user_profiles')
      ORDER BY tablename
    `
    console.log('\n🔒 RLS Status:')
    rlsEnabled.forEach(t => console.log(`   - ${t.tablename}: RLS=${t.rowsecurity}`))

    console.log('\n🎉 Migration 003 aplicada e verificada com sucesso!')

  } catch (err) {
    console.error('\n❌ Erro ao aplicar migration:', err.message)
    if (err.message.includes('password') || err.message.includes('authentication')) {
      console.error('\n💡 Dica: A conexão direta pode exigir a database password correta.')
      console.error('   Alternativa: executar SQL manualmente no Supabase Dashboard SQL Editor:')
      console.error('   https://supabase.com/dashboard/project/' + projectRef + '/sql/new')
    }
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
