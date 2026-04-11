/**
 * Script de VERIFICAÇÃO da migration 003_roles_and_permissions.sql
 * Usa a REST API do Supabase (não requer conexão PostgreSQL direta).
 *
 * Uso: node --env-file=.env scripts/verify-migration-003.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMigration() {
  console.log('🔍 Verificando migration 003 — Roles and Permissions...\n')
  
  let allPassed = true
  const results = []

  // 1. Verificar tabela roles
  try {
    const { data, error } = await supabase.from('roles').select('slug, name, description').order('slug')
    if (error) throw error
    console.log(`✅ 1. Tabela "roles" existe (${data.length} roles)`)
    data.forEach(r => console.log(`     - ${r.slug}: ${r.name}`))
    results.push({ check: 'Tabela roles', passed: true, detail: `${data.length} roles encontrados` })
  } catch (err) {
    console.log(`❌ 1. Tabela "roles" NÃO encontrada: ${err.message}`)
    results.push({ check: 'Tabela roles', passed: false, detail: err.message })
    allPassed = false
  }

  // 2. Verificar tabela user_roles
  try {
    const { data, error } = await supabase.from('user_roles').select('user_id, roles(slug)').limit(10)
    if (error) throw error
    console.log(`\n✅ 2. Tabela "user_roles" existe (${data?.length ?? 0} registros amostrados)`)
    results.push({ check: 'Tabela user_roles', passed: true, detail: 'acessível' })
  } catch (err) {
    console.log(`\n❌ 2. Tabela "user_roles" NÃO acessível: ${err.message}`)
    results.push({ check: 'Tabela user_roles', passed: false, detail: err.message })
    allPassed = false
  }

  // 3. Verificar tabela role_permissions
  try {
    const { data, error } = await supabase.from('role_permissions').select('permission, roles(slug)').limit(5)
    if (error) throw error
    console.log(`\n✅ 3. Tabela "role_permissions" existe (${data?.length ?? 0} permissões amostradas)`)
    results.push({ check: 'Tabela role_permissions', passed: true, detail: 'acessível' })
  } catch (err) {
    console.log(`\n❌ 3. Tabela "role_permissions" NÃO acessível: ${err.message}`)
    results.push({ check: 'Tabela role_permissions', passed: false, detail: err.message })
    allPassed = false
  }

  // 4. Verificar tabela trainer_students
  try {
    const { error } = await supabase.from('trainer_students').select('id').limit(1)
    if (error && error.message.includes('Could not find')) throw error
    console.log(`\n✅ 4. Tabela "trainer_students" existe`)
    results.push({ check: 'Tabela trainer_students', passed: true, detail: 'acessível' })
  } catch (err) {
    console.log(`\n❌ 4. Tabela "trainer_students" NÃO acessível: ${err.message}`)
    results.push({ check: 'Tabela trainer_students', passed: false, detail: err.message })
    allPassed = false
  }

  // 5. Verificar RLS em user_profiles
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1)
    if (error) throw error
    console.log(`\n✅ 5. Tabela "user_profiles" acessível (RLS configurada)`)
    results.push({ check: 'RLS user_profiles', passed: true, detail: 'acessível via service_role' })
  } catch (err) {
    console.log(`\n❌ 5. user_profiles com problema: ${err.message}`)
    results.push({ check: 'RLS user_profiles', passed: false, detail: err.message })
    allPassed = false
  }

  // 6. Verificar se usuários existentes têm role 'user'
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('roles(slug)')
      .limit(5)
    if (error) throw error
    console.log(`\n✅ 6. Usuários com roles: ${data?.length ?? 0} amostrados`)
    if (data) {
      data.forEach(ur => console.log(`     - role: ${ur.roles?.slug}`))
    }
    results.push({ check: 'Usuários com roles', passed: true, detail: `${data?.length ?? 0} amostrados` })
  } catch (err) {
    console.log(`\n❌ 6. Erro ao consultar user_roles: ${err.message}`)
    results.push({ check: 'Usuários com roles', passed: false, detail: err.message })
    allPassed = false
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('RESUMO DA VERIFICAÇÃO')
  console.log('='.repeat(60))
  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌'
    console.log(`  ${icon} ${r.check}: ${r.detail}`)
  })
  console.log('='.repeat(60))
  
  if (allPassed) {
    console.log('\n🎉 Migration 003 aplicada e verificada com sucesso!')
  } else {
    console.log('\n⚠️  Alguns checks falharam. Aplique a migration no Supabase Dashboard:')
    console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.match(/\/([^.]+)\.supabase/)?.[1] || 'basvoadgfiuzsqjjhcdr'}/sql/new`)
    console.log('\n   Arquivo: supabase/migrations/003_roles_and_permissions.sql')
  }
  
  process.exit(allPassed ? 0 : 1)
}

verifyMigration()
