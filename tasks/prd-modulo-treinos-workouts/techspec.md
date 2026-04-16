# Tech Spec - Módulo de Treinos (Workouts)

## Resumo Executivo

O módulo de treinos será implementado usando a arquitetura existente do FitPulse: Nuxt 3 pages + composables + Supabase client-side. As tabelas `workouts`, `workout_exercises`, `workout_sessions` e `workout_logs` já existem no Supabase, então o foco é criar a camada de UI e composable `useWorkouts` para CRUD e sessão ativa. A sessão ativa usará `useState` do Nuxt para persistência temporária durante a execução, com salvamento incremental no Supabase. Não há necessidade de API server — tudo via Supabase client.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Status | Responsabilidade |
|------------|--------|-----------------|
| `composables/useWorkouts.ts` | **Novo** | CRUD de treinos, sessions, logs + templates |
| `pages/workouts/index.vue` | **Novo** | Lista de treinos do usuário com busca e filtros |
| `pages/workouts/create.vue` | **Novo** | Formulário de criação de treino (com templates) |
| `pages/workouts/[id]/edit.vue` | **Novo** | Edição de treino existente |
| `pages/workouts/[id]/start.vue` | **Novo** | Sessão de treino ativa (timer, logging) |
| `pages/workouts/[id].vue` | **Novo** | Detalhes do treino (exercícios, histórico de sessões) |
| `pages/sessions/index.vue` | **Novo** | Histórico de sessões |
| `pages/sessions/[id].vue` | **Novo** | Detalhes de sessão passada |
| `components/workout/WorkoutCard.vue` | **Novo** | Card de treino para listagem |
| `components/workout/WorkoutExerciseRow.vue` | **Novo** | Linha de exercício no formulário de edição |
| `components/workout/ExerciseSelector.vue` | **Novo** | Modal/seletor para buscar e adicionar exercícios |
| `components/workout/SessionTimer.vue` | **Novo** | Timer de descanso durante sessão |
| `components/workout/SetLogger.vue` | **Novo** | Logging de set (peso, reps, RPE) |
| `components/workout/SessionSummary.vue` | **Novo** | Resumo pós-treino |
| `composables/useExercises.ts` | **Existente** | Reutilizar fetchExercises para seleção |

### Fluxo de Dados

```
User → Workout Pages → useWorkouts Composable → Supabase Client → DB
                                                ↓
                                          useState (session temp)
                                                ↓
                                          Real-time logging
```

## Design de Implementação

### Interfaces Principais

```typescript
// composable/useWorkouts.ts
export const useWorkouts = () => {
  // CRUD
  const fetchWorkouts: (filters?: WorkoutFilters) => Promise<Workout[]>
  const createWorkout: (data: WorkoutForm) => Promise<Workout>
  const updateWorkout: (id: string, data: WorkoutForm) => Promise<Workout>
  const deleteWorkout: (id: string) => Promise<void>
  const fetchWorkoutDetail: (id: string) => Promise<WorkoutWithExercises>

  // Sessions
  const startSession: (workoutId: string) => Promise<WorkoutSession>
  const logSet: (sessionId: string, exerciseId: string, setData: SetLog) => Promise<void>
  const completeSession: (sessionId: string) => Promise<WorkoutSession>
  const skipSession: (sessionId: string) => Promise<void>

  // Sessions history
  const fetchSessions: (filters?: SessionFilters) => Promise<WorkoutSession[]>
  const fetchSessionDetail: (sessionId: string) => Promise<WorkoutSessionWithLogs>

  // Templates
  const fetchTemplates: () => Promise<WorkoutTemplate[]>
}
```

### Modelos de Dados

As tabelas já existem no Supabase. Tipos já definidos em `types/index.ts`:

| Tabela | Campos principais |
|--------|------------------|
| `workouts` | id, user_id, name, description, type, difficulty, estimated_duration, is_template, is_recommended |
| `workout_exercises` | id, workout_id, exercise_id, order, sets, reps, duration, rest_period, notes, rpe |
| `workout_sessions` | id, user_id, workout_id, started_at, completed_at, status, notes, rating |
| `workout_logs` | id, session_id, workout_exercise_id, set_number, weight, reps, duration, rpe, completed, notes, logged_at |

**Tipos adicionais necessários em `types/index.ts`:**

```typescript
export interface WorkoutForm {
  name: string
  description?: string
  type: Workout['type']
  exercises: WorkoutExerciseForm[]
}

export interface WorkoutExerciseForm {
  exercise_id: string
  order: number
  sets: number
  reps?: number
  duration?: number
  rest_period: number
  notes?: string
  rpe?: number
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExerciseDetail[]
}

export interface WorkoutExerciseDetail extends WorkoutExercise {
  exercise: Exercise
}

export interface SetLog {
  set_number: number
  weight?: number
  reps?: number
  rpe?: number
  completed: boolean
}

export interface WorkoutSessionWithLogs extends WorkoutSession {
  workout: Workout
  logs: WorkoutLog[]
}

export interface WorkoutFilters {
  search?: string
  type?: Workout['type']
}

export interface SessionFilters {
  workout_id?: string
  status?: WorkoutSession['status']
  from?: string
  to?: string
}
```

### Endpoints de API

**Sem API server necessária.** Todas as operações via Supabase client-side:

| Operação | Método Supabase | Tabela |
|----------|-----------------|--------|
| Listar treinos | `select().eq('user_id', userId)` | workouts |
| Criar treino | `insert()` + `insert()` bulk | workouts + workout_exercises |
| Editar treino | `update()` + `upsert()` | workouts + workout_exercises |
| Deletar treino | `delete()` cascade | workouts |
| Iniciar sessão | `insert()` | workout_sessions |
| Log set | `insert()` ou `upsert()` | workout_logs |
| Completar sessão | `update()` | workout_sessions |
| Histórico | `select().order('started_at')` | workout_sessions |

## Pontos de Integração

- **Supabase Auth:** `useSupabaseUser()` para obter user_id em todas as queries
- **useExercises:** Reutilizar `fetchExercisesPaginated` para o ExerciseSelector
- **useToast:** Feedback visual em ações (criar, salvar, deletar, completar)
- **Dashboard:** Integrar stats reais (weeklyWorkouts, currentStreak, totalVolume, totalWorkouts)

## Abordagem de Testes

### Testes de Unidade

| Componente | Cenários |
|------------|----------|
| `useWorkouts` | CRUD completo; Validação de formulário; Cálculo de volume |
| `WorkoutCard` | Renderiza dados corretamente; Link navega para detalhes |
| `ExerciseSelector` | Busca exercícios; Seleciona/desseleciona; Limite máximo |
| `SetLogger` | Registra set; Valida peso/reps; Marca como completo |
| `SessionTimer` | Inicia/pausa/reseta; Anuncia tempo restante |

### Testes de Integração

- **Criar treino:** Formulário → submit → DB → lista atualiza
- **Sessão ativa:** Iniciar → log sets → completar → histórico atualiza
- **Editar treino:** Detalhes → editar → salvar → detalhes atualiza
- **Dashboard stats:** Sessões completadas → stats atualizam

### Testes de E2E (Playwright)

1. **Criar treino do zero:** Dashboard → Novo Treino → Form → Adicionar 3 exercícios → Salvar → Ver na lista
2. **Criar treino de template:** Novo Treino → Selecionar template → Personalizar → Salvar
3. **Executar sessão completa:** Lista → Iniciar → Log 2 sets → Completar → Ver resumo
4. **Editar treino:** Lista → Editar → Adicionar/remover exercício → Salvar → Ver alterações
5. **Deletar treino:** Lista → Deletar → Confirmar → Não aparece na lista
6. **Histórico de sessões:** Sessões → Filtrar por treino → Ver detalhes

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`useWorkouts` composable** — Base de toda a lógica (CRUD, sessions, logs)
2. **`WorkoutCard` + `pages/workouts/index.vue`** — Listagem (depende de useWorkouts.fetchWorkouts)
3. **`ExerciseSelector` + `pages/workouts/create.vue`** — Criação com templates
4. **`pages/workouts/[id].vue`** — Detalhes do treino
5. **`pages/workouts/[id]/edit.vue`** — Edição (reusa formulário de criação)
6. **`SetLogger` + `SessionTimer` + `pages/workouts/[id]/start.vue`** — Sessão ativa
7. **`SessionSummary` + `pages/sessions/index.vue`** — Histórico
8. **Integração com Dashboard** — Stats reais
9. **Testes E2E + Validação mobile**

### Dependências Técnicas

- **Nenhuma dependência externa nova.** Supabase client já instalado.
- **`@vueuse/core`** já instalado para `useInterval` (timer) e `useDebounce` (busca)

## Monitoramento e Observabilidade

- **Logs:** `console.error` em falhas de Supabase (padrão existente)
- **Toast feedback:** Sucesso/erro em todas as ações do usuário
- **Performance:** Monitorar tempo de resposta de queries Supabase (devtools)

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Alternativa Rejeitada |
|---------|--------------|----------------------|
| Supabase client-side | Simplicidade, já usado no projeto | API server (overkill para CRUD simples) |
| `useState` para sessão ativa | Persistência durante navegação, sem servidor | localStorage (perde ao trocar aba) |
| Logging incremental | Dados salvos imediatamente, sem perda | Salvar tudo ao final (risco de perda) |
| Templates como treinos is_template | Reutiliza mesma tabela, sem duplicação | Tabela separada para templates |
| Drag & drop nativo HTML5 | Sem dependência externa | vue-draggable (dependência extra) |

### Riscos Conhecidos

| Risco | Mitigação |
|-------|-----------|
| Sessão ativa perde dados se app fecha | Logging incremental salva a cada set |
| Timer inativo em background no mobile | Usar `useInterval` do VueUse com visibility check |
| Many-to-many workout_exercises complexo | Bulk insert/upsert com transaction |
| Mobile: logging lento durante treino | Inputs otimizados (auto-focus, step buttons) |
| Cascade delete de treino não remove sessions | RLS policy: sessions referenciam workout_id, manter histórico |

### Conformidade com Skills Padrões

- **supabase-postgres-best-practices:** Bulk inserts, RLS policies, índices em foreign keys
- **ui-ux-pro-max:** Touch targets 44x44px, contraste alto para uso em academia, feedback visual imediato
- **web-design-guidelines:** Acessibilidade de forms, labels, aria-live no timer

### Arquivos Relevantes e Dependentes

| Arquivo | Tipo | Ação |
|---------|------|------|
| `composables/useWorkouts.ts` | Novo | Criar |
| `types/index.ts` | Existente | Adicionar tipos de WorkoutForm, SetLog, etc. |
| `pages/workouts/index.vue` | Novo | Criar |
| `pages/workouts/create.vue` | Novo | Criar |
| `pages/workouts/[id].vue` | Novo | Criar |
| `pages/workouts/[id]/edit.vue` | Novo | Criar |
| `pages/workouts/[id]/start.vue` | Novo | Criar |
| `pages/sessions/index.vue` | Novo | Criar |
| `pages/sessions/[id].vue` | Novo | Criar |
| `components/workout/WorkoutCard.vue` | Novo | Criar |
| `components/workout/WorkoutExerciseRow.vue` | Novo | Criar |
| `components/workout/ExerciseSelector.vue` | Novo | Criar |
| `components/workout/SessionTimer.vue` | Novo | Criar |
| `components/workout/SetLogger.vue` | Novo | Criar |
| `components/workout/SessionSummary.vue` | Novo | Criar |
| `pages/dashboard/index.vue` | Existente | Modificar (stats reais) |
| `composables/useExercises.ts` | Existente | Reutilizar |
