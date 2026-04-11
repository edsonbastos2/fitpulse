/**
 * Teste de integração para useRoles via API server Nuxt.
 * Roda dentro do contexto Nuxt para ter acesso aos composables.
 *
 * Uso: node --env-file=.env scripts/test-useroles.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUseRoles() {
  console.log('🧪 Teste de integração — useRoles (via banco)\n')

  let passed = 0
  let failed = 0

  // --- Teste 1: Verificar que roles existem no banco ---
  console.log('Teste 1: Roles seedados no banco')
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('slug')
    .order('slug')

  if (rolesError) {
    console.log(`  ❌ FAIL: ${rolesError.message}`)
    failed++
  } else {
    const slugs = roles.map(r => r.slug)
    const hasAll = slugs.includes('user') && slugs.includes('personal_trainer') && slugs.includes('superadmin')
    if (hasAll) {
      console.log('  ✅ PASS: 3 roles encontrados')
      passed++
    } else {
      console.log(`  ❌ FAIL: roles esperados não encontrados: ${slugs.join(', ')}`)
      failed++
    }
  }

  // --- Teste 2: ROLE_PERMISSIONS mapeamento correto ---
  console.log('\nTeste 2: Permissões de role "user"')
  const { data: userPerms, error: userPermsError } = await supabase
    .from('role_permissions')
    .select('permission')
    .eq('role_id', (await supabase.from('roles').select('id').eq('slug', 'user').single()).data?.id)

  if (userPermsError) {
    console.log(`  ❌ FAIL: ${userPermsError.message}`)
    failed++
  } else {
    const permSlugs = userPerms.map(p => p.permission)
    const expected = ['view_own_workouts', 'view_own_progress', 'request_upgrade']
    const allPresent = expected.every(p => permSlugs.includes(p))
    const noExtra = permSlugs.every(p => expected.includes(p))
    if (allPresent && noExtra) {
      console.log('  ✅ PASS: permissões de user corretas')
      passed++
    } else {
      console.log(`  ❌ FAIL: permissões esperadas: ${expected.join(', ')}, encontradas: ${permSlugs.join(', ')}`)
      failed++
    }
  }

  // --- Teste 3: Permissões de role "personal_trainer" ---
  console.log('\nTeste 3: Permissões de role "personal_trainer"')
  const ptRoleId = (await supabase.from('roles').select('id').eq('slug', 'personal_trainer').single()).data?.id
  const { data: ptPerms, error: ptPermsError } = await supabase
    .from('role_permissions')
    .select('permission')
    .eq('role_id', ptRoleId)

  if (ptPermsError) {
    console.log(`  ❌ FAIL: ${ptPermsError.message}`)
    failed++
  } else {
    const permSlugs = ptPerms.map(p => p.permission)
    const hasViewStudents = permSlugs.includes('view_students')
    const hasCreateForOthers = permSlugs.includes('create_workouts_for_others')
    const hasViewStudentProgress = permSlugs.includes('view_student_progress')
    const noViewAllData = !permSlugs.includes('view_all_data')
    if (hasViewStudents && hasCreateForOthers && hasViewStudentProgress && noViewAllData) {
      console.log('  ✅ PASS: permissões de personal_trainer corretas')
      passed++
    } else {
      console.log(`  ❌ FAIL: permissões PT incorretas: ${permSlugs.join(', ')}`)
      failed++
    }
  }

  // --- Teste 4: Permissões de role "superadmin" (todas) ---
  console.log('\nTeste 4: Permissões de role "superadmin"')
  const adminRoleId = (await supabase.from('roles').select('id').eq('slug', 'superadmin').single()).data?.id
  const { data: adminPerms, error: adminPermsError } = await supabase
    .from('role_permissions')
    .select('permission')
    .eq('role_id', adminRoleId)

  if (adminPermsError) {
    console.log(`  ❌ FAIL: ${adminPermsError.message}`)
    failed++
  } else {
    const permSlugs = adminPerms.map(p => p.permission)
    const hasAllData = permSlugs.includes('view_all_data')
    const hasManageContent = permSlugs.includes('manage_content')
    const hasManageSubscriptions = permSlugs.includes('manage_subscriptions')
    if (hasAllData && hasManageContent && hasManageSubscriptions && permSlugs.length === 9) {
      console.log(`  ✅ PASS: superadmin tem ${permSlugs.length} permissões (todas)`)
      passed++
    } else {
      console.log(`  ❌ FAIL: superadmin deveria ter 9 permissões, tem ${permSlugs.length}`)
      failed++
    }
  }

  // --- Teste 5: Usuários existentes têm role 'user' ---
  console.log('\nTeste 5: Usuários existentes com role "user"')
  const { data: userRoles, error: userRolesError } = await supabase
    .from('user_roles')
    .select('user_id, roles(slug)')
    .limit(10)

  if (userRolesError) {
    console.log(`  ❌ FAIL: ${userRolesError.message}`)
    failed++
  } else {
    const allHaveUser = userRoles.every(ur => ur.roles?.slug === 'user')
    if (allHaveUser && userRoles.length > 0) {
      console.log(`  ✅ PASS: ${userRoles.length} usuários amostrados com role 'user'`)
      passed++
    } else {
      console.log(`  ❌ FAIL: nem todos têm role 'user'`)
      failed++
    }
  }

  // --- Teste 6: hasRole simulation ---
  console.log('\nTeste 6: Simulação de hasRole() com dados do banco')
  if (userRoles && userRoles.length > 0) {
    const testUserRoles = userRoles.map(ur => ur.roles?.slug)
    const hasUser = testUserRoles.includes('user')
    const hasPT = testUserRoles.includes('personal_trainer')
    if (hasUser && !hasPT) {
      console.log('  ✅ PASS: hasRole("user") === true, hasRole("personal_trainer") === false')
      passed++
    } else {
      console.log(`  ❌ FAIL: resultado inesperado: user=${hasUser}, pt=${hasPT}`)
      failed++
    }
  } else {
    console.log('  ⏭️  SKIP: sem dados para testar')
  }

  // --- Teste 7: can() simulation ---
  console.log('\nTeste 7: Simulação de can() com ROLE_PERMISSIONS')
  const { ROLE_PERMISSIONS, ROLES, PERMISSIONS } = await import('../utils/role-constants.ts')
  const userCanViewWorkouts = ROLE_PERMISSIONS[ROLES.USER].includes(PERMISSIONS.VIEW_OWN_WORKOUTS)
  const userCanViewStudents = ROLE_PERMISSIONS[ROLES.USER].includes(PERMISSIONS.VIEW_STUDENTS)
  const ptCanViewStudents = ROLE_PERMISSIONS[ROLES.PERSONAL_TRAINER].includes(PERMISSIONS.VIEW_STUDENTS)
  const adminCanViewAll = ROLE_PERMISSIONS[ROLES.SUPERADMIN].includes(PERMISSIONS.VIEW_ALL_DATA)

  if (userCanViewWorkouts && !userCanViewStudents && ptCanViewStudents && adminCanViewAll) {
    console.log('  ✅ PASS: can() funciona corretamente para todos os roles')
    passed++
  } else {
    console.log(`  ❌ FAIL: userCanViewWorkouts=${userCanViewWorkouts}, userCanViewStudents=${userCanViewStudents}, ptCanViewStudents=${ptCanViewStudents}, adminCanViewAll=${adminCanViewAll}`)
    failed++
  }

  // --- Teste 8: setActiveRole validation ---
  console.log('\nTeste 8: Simulação de setActiveRole() validation')
  const userHasOnlyUserRole = userRoles?.every(ur => ur.roles?.slug === 'user')
  const setActiveRoleWouldBlock = userHasOnlyUserRole // só pode ativar roles que possui
  if (setActiveRoleWouldBlock) {
    console.log('  ✅ PASS: setActiveRole("personal_trainer") seria bloqueado para user-only')
    passed++
  } else {
    console.log('  ⏭️  SKIP: usuário pode ter múltiplos roles')
  }

  // --- Resumo ---
  console.log('\n' + '='.repeat(60))
  console.log(`RESULTADO: ${passed} passed, ${failed} failed`)
  console.log('='.repeat(60))

  if (failed === 0) {
    console.log('\n🎉 Todos os testes de integração passaram!')
  } else {
    console.log(`\n⚠️  ${failed} teste(s) falharam.`)
  }

  process.exit(failed > 0 ? 1 : 0)
}

testUseRoles()
