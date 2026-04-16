# TechSpec: Workout Management Module

## Executive Summary

This specification covers the technical design for the FitPulse Workout Management Module — the product's core feature. The implementation adds 6 new pages, ~20 new Vue components, 1 Pinia store, 3 new composables, and a test suite. The architecture leverages existing FitPulse infrastructure: `useWorkouts` composable (9 methods, already implemented), `useExercises` composable, Supabase schema (no new migrations), and the established design system (Tailwind + custom utility classes).

The primary technical trade-off is introducing **Pinia** as a new dependency for session state management. While this adds ~5KB to the bundle and requires module configuration, it provides structured, testable state management that composables alone cannot match for the complex session runner scenario. The alternative — scattered `useState()` calls — was rejected for maintainability reasons.

Secondary trade-off: the **feature-based directory structure** (`components/workouts/create/`, `components/workouts/session/`, etc.) adds more files than a flat-page approach but enables component reusability and testable isolation required by the Vitest + Vue Test Utils testing strategy.

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nuxt App (app.vue)                       │
├─────────────────────────────────────────────────────────────────┤
│  Layout: authenticated.vue (wraps all /workouts/* pages)        │
├─────────────────────────────────────────────────────────────────┤
│  pages/workouts/                  components/workouts/           │
│  ├── index.vue ────────────────►  ├── list/                     │
│  │   (Workout List)              │   ├── WorkoutList.vue         │
│  │                               │   ├── WorkoutListItem.vue     │
│  ├── create.vue ───────────────► │   └── WorkoutEmptyState.vue   │
│  │   (Template + Form)           ├── create/                     │
│  │                               │   ├── TemplateSelector.vue    │
│  ├── [id].vue ─────────────────► │   │   ├── WorkoutForm.vue      │
│  │   (Workout Detail)            │   │   └── ExercisePicker.vue   │
│  │                               ├── detail/                     │
│  ├── [id]/start.vue ───────────► │   │   └── WorkoutActions.vue   │
│  │   (Session Runner)            ├── session/                    │
│  │                               │   ├── SessionRunner.vue       │
│  ├── history/index.vue ────────► │   │   ├── SetLogger.vue        │
│  │   (Session History)           │   │   ├── RestTimer.vue        │
│  │                               │   │   └── SessionComplete.vue  │
│  └── history/[sessionId].vue ──► └── history/                    │
│      (Session Detail)                ├── SessionList.vue         │
│                                      ├── SessionListItem.vue      │
│                                      ├── SessionDetail.vue        │
│                                      └── InsightCard.vue          │
├─────────────────────────────────────────────────────────────────┤
│  Composables                      Pinia Store                   │
│  ├── useWorkouts (existing)       ┌─────────────────────┐        │
│  ├── useExercises (existing)      │ stores/session.ts   │        │
│  ├── useSessionRunner (new)  ◄───►│ SessionState        │        │
│  ├── useCountdownTimer (new)      │ SessionActions       │        │
│  └── useInsights (new)            │ SessionGetters       │        │
│                                   └─────────────────────┘        │
│  Utils                          Components (reused)              │
│  ├── insightRules.ts (new)        ├── ui/UiButton.vue            │
│  └── workoutTemplates.ts (new)    ├── ui/UiInput.vue             │
│                                     ├── ui/UiBadge.vue            │
│                                     ├── ui/WorkoutCard.vue        │
│                                     ├── catalog/ExerciseSearchBar │
│                                     └── catalog/ExerciseCardCompact│
├─────────────────────────────────────────────────────────────────┤
│  Existing Dashboard (modified)                                  │
│  pages/dashboard/index.vue ── Replace all mock data with real   │
│  stats sourced from useWorkouts composable.                     │
├─────────────────────────────────────────────────────────────────┤
│  External: Supabase (REST + Realtime)                           │
│  Tables: workouts, workout_exercises, workout_sessions,         │
│  workout_logs, exercises, muscle_groups, equipment               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Workout Creation**: User interacts with `TemplateSelector.vue` or `WorkoutForm.vue` → form data validated → `useWorkouts.createWorkout()` → Supabase INSERT → redirect to workout detail.
2. **Session Execution**: User navigates to `/workouts/[id]/start` → `stores/session.ts` loads workout data via `useWorkouts.fetchWorkout()` → `SessionRunner.vue` renders exercises → user logs sets → `sessionStore.logSet()` writes to Supabase + localStorage checkpoint → timer triggers via `useCountdownTimer` → session completes → `useInsights.evaluateSession()` generates insight → `SessionComplete.vue` displays feedback.
3. **Dashboard Integration**: `pages/dashboard/index.vue` calls `useWorkouts.fetchWorkouts()` + `useWorkouts.sessions` → computes real stats → replaces hardcoded reactive values.

## Implementation Design

### Core Interfaces

**Pinia Session Store**

```typescript
// stores/session.ts
import { defineStore } from 'pinia'
import type { Workout, WorkoutExercise, WorkoutLog, WorkoutSession } from '~/types'

export interface SetLog {
  setNumber: number
  weight: number | null
  reps: number | null
  rpe: number | null
  completed: boolean
  loggedAt: string
}

export interface ExerciseSessionState {
  exerciseId: string
  exerciseName: string
  sets: SetLog[]
  restPeriod: number // seconds
}

export interface SessionCheckpoint {
  sessionId: string
  workoutId: string
  exercises: ExerciseSessionState[]
  activeExerciseIndex: number
  startedAt: string
  savedAt: string
}

export interface TimerState {
  remaining: number
  isRunning: boolean
  totalDuration: number
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    currentSession: null as WorkoutSession | null,
    workout: null as Workout | null,
    exercises: [] as ExerciseSessionState[],
    activeExerciseIndex: 0,
    timer: { remaining: 0, isRunning: false, totalDuration: 60 } as TimerState,
    checkpoint: null as SessionCheckpoint | null,
  }),
  getters: {
    totalVolume: (state) => { /* computed from exercises */ },
    completedSets: (state) => { /* count completed sets */ },
    sessionDuration: (state) => { /* Date.now() - startedAt */ },
  },
  actions: {
    async startSession(workoutId: string) { /* load workout, create session, init exercises */ },
    async logSet(exerciseIndex: number, setLog: SetLog) { /* write to Supabase + update local */ },
    async completeSession(rating?: number) { /* update session status, clear checkpoint */ },
    async restoreCheckpoint(): Promise<boolean> { /* load from localStorage, return true if found */ },
    saveCheckpoint(): void { /* serialize state to localStorage */ },
    startTimer(duration: number): void { /* set timer state */ },
    generateInsight(): string | null { /* delegate to useInsights */ },
  },
})
```

**Countdown Timer Composable**

```typescript
// composables/useCountdownTimer.ts
export interface UseTimerOptions {
  onComplete?: () => void
  onTick?: (remaining: number) => void
  audioEnabled?: boolean
}

export interface UseTimerReturn {
  remaining: Ref<number>
  isRunning: Ref<boolean>
  total: Ref<number>
  start: (duration: number) => void
  pause: () => void
  resume: () => void
  skip: () => void
  progress: ComputedRef<number> // 0-100
}

export const useCountdownTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
  // Web Audio API beep on complete
  // 1-second tick interval
  // Reactive state
}
```

**Insight Rules Utility**

```typescript
// utils/insightRules.ts
import type { WorkoutSession, WorkoutLog } from '~/types'

export interface InsightRule {
  id: string
  priority: number // lower = higher priority
  evaluate: (context: InsightContext) => string | null
}

export interface InsightContext {
  currentSession: WorkoutSession
  logs: WorkoutLog[]
  recentSessions: WorkoutSession[]
  weeklyFrequency: Record<string, number> // muscle group -> count
}

export const insightRules: InsightRule[] = [
  { id: 'pr', priority: 1, evaluate: (ctx) => { /* check for new PR */ } },
  { id: 'volume', priority: 2, evaluate: (ctx) => { /* compare volume */ } },
  { id: 'frequency', priority: 3, evaluate: (ctx) => { /* muscle group frequency */ } },
  { id: 'duration', priority: 4, evaluate: (ctx) => { /* actual vs estimated */ } },
  { id: 'streak', priority: 5, evaluate: (ctx) => { /* consecutive days */ } },
]
```

### Data Models

No new database tables or migrations are required. The existing Supabase schema covers all V1 needs:

| Table | Used For | Existing? |
|-------|----------|-----------|
| `workouts` | Workout CRUD, templates | Yes |
| `workout_exercises` | Exercise ordering in workouts | Yes (column: `order_index`) |
| `workout_sessions` | Session tracking (in_progress/completed/skipped) | Yes |
| `workout_logs` | Individual set logs (weight, reps, RPE) | Yes |
| `exercises` | Exercise catalog (via join) | Yes |
| `muscle_groups` | Insight context (muscle frequency) | Yes |
| `user_profiles` | First-workout flag for onboarding | Yes (new column `has_completed_first_workout BOOLEAN DEFAULT false`) |

**New column required:** `user_profiles.has_completed_first_workout` (boolean, default false) — used by ADR-002 onboarding logic to determine whether to show template selection or direct to builder.

**TypeScript type extension:** Add `has_completed_first_workout?: boolean` to `UserProfile` in `types/index.ts`.

**LocalStorage schema (client-side checkpoint):**

```typescript
// Key: 'fitpulse:session:checkpoint'
interface LocalStorageCheckpoint {
  sessionId: string
  workoutId: string
  exercises: ExerciseSessionState[]
  activeExerciseIndex: number
  startedAt: string
  savedAt: string // ISO timestamp
}
```

### API Surface (Supabase Queries)

All API interactions use the existing `useWorkouts` composable. New query patterns required:

| Purpose | Table | Query | Used By |
|---------|-------|-------|---------|
| Fetch user workouts | `workouts` | `SELECT * WHERE user_id = ? ORDER BY created_at DESC` | WorkoutList, Dashboard |
| Fetch workout with exercises | `workouts` + `workout_exercises` | `SELECT *, workout_exercises(*, exercises(*)) WHERE id = ?` | WorkoutDetail, SessionRunner |
| Create workout + exercises | `workouts` + `workout_exercises` | `INSERT` workout, then `INSERT` exercises with `order_index` | WorkoutForm |
| Start session | `workout_sessions` | `INSERT { user_id, workout_id, status: 'in_progress', started_at }` | SessionRunner |
| Log set | `workout_logs` | `INSERT { session_id, workout_exercise_id, set_number, weight, reps, rpe, completed, logged_at }` | SetLogger |
| Complete session | `workout_sessions` | `UPDATE SET status='completed', completed_at, rating WHERE id = ?` | SessionComplete |
| Fetch last session for exercise | `workout_sessions` + `workout_logs` | `SELECT logs WHERE exercise_id = ? AND user_id = ? ORDER BY started_at DESC LIMIT 1` | SetLogger (auto-fill) |
| Fetch session history | `workout_sessions` | `SELECT * WHERE user_id = ? ORDER BY started_at DESC` | SessionList |
| Fetch recent sessions for insights | `workout_sessions` + `workout_logs` | `SELECT * WHERE user_id = ? AND status='completed' ORDER BY started_at DESC LIMIT 10` | useInsights |
| Check first workout flag | `user_profiles` | `SELECT has_completed_first_workout WHERE user_id = ?` | TemplateSelector (onboarding) |
| Mark first workout complete | `user_profiles` | `UPDATE SET has_completed_first_workout = true WHERE user_id = ?` | SessionComplete |

## Integration Points

| External System | Integration | Auth | Error Handling |
|----------------|-------------|------|----------------|
| **Supabase** | REST API via `@nuxtjs/supabase` module | Supabase anon key (public) | Try/catch in composable methods; error returned as `{ data: null, error: message }` |
| **localStorage** | Session checkpoint persistence | Browser storage API | Graceful degradation — if unavailable, session continues in memory only |
| **Web Audio API** | Timer completion sound | No permission needed for user-initiated audio | Fallback to visual-only cue if AudioContext fails |
| **PWA Service Worker** | Exercise catalog cache for offline viewing | Workbox NetworkFirst strategy | If offline, show cached exercises; queue logs for sync |

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `pages/dashboard/index.vue` | Modified | Replace all hardcoded reactive values with real data from `useWorkouts`. Low risk — changes are data source swap, not logic rewrite. | Update stats computation, todayWorkout, recentActivity, weeklyGoal to use real Supabase data. |
| `nuxt.config.ts` | Modified | Add `@pinia/nuxt` to modules array. Zero risk — additive change. | Add module, test dev server startup. |
| `package.json` | Modified | Add `pinia`, `@pinia/nuxt`, `vitest`, `@vue/test-utils` as dependencies. Low risk. | Install, verify no version conflicts. |
| `types/index.ts` | Modified | Add `has_completed_first_workout` to `UserProfile`. Zero risk — optional field. | Add field to interface. |
| `composables/useWorkouts.ts` | Modified | May need `fetchRecentSessions()` method for insights. Low risk — additive. | Add method if not sufficient for insight context. |
| `middleware/auth.ts` | No change | `/workouts/*` already protected. | None. |
| `components/layout/AppLayout.vue` | No change | "Treinos" nav item already configured. | None. |
| `pages/workouts/*` | New | 6 new page files. | Create per Nuxt file-based routing. |
| `components/workouts/*` | New | ~20 new components across 5 subdirectories. | Create per feature grouping. |
| `stores/session.ts` | New | Pinia session store. | Create with full state/actions/getters. |
| `composables/useSessionRunner.ts` | New | Orchestrates session flow. | Create as thin layer over Pinia store + UI logic. |
| `composables/useCountdownTimer.ts` | New | Timer composable. | Create with Web Audio API integration. |
| `composables/useInsights.ts` | New | Insight evaluation composable. | Create with Supabase data fetching. |
| `utils/insightRules.ts` | New | Pure rule functions. | Create 5 rules with InsightContext interface. |
| `utils/workoutTemplates.ts` | New | 3 system templates with exercise lists. | Create with pt-BR content. |

## Testing Approach

### Unit Tests

**Strategy:** Vitest + Vue Test Utils. Test composables, stores, and utility functions in isolation. Component tests render with shallow mounting.

| Target | Test File | Key Scenarios |
|--------|-----------|---------------|
| `utils/insightRules.ts` | `utils/insightRules.test.ts` | Each rule returns correct insight or null given mock InsightContext; priority ordering |
| `utils/workoutTemplates.ts` | `utils/workoutTemplates.test.ts` | 3 templates have valid structure; all exercises reference valid exercise IDs |
| `composables/useCountdownTimer.ts` | `composables/useCountdownTimer.test.ts` | Timer starts, pauses, resumes, completes; onTick called every second; onComplete called at zero |
| `stores/session.ts` | `stores/session.test.ts` | Session start initializes exercises; logSet updates state; checkpoint save/restore round-trips; session summary computes correctly |
| `composables/useInsights.ts` | `composables/useInsights.test.ts` | evaluateSession returns highest-priority matching rule; returns null when no rules match |
| `components/workouts/session/RestTimer.vue` | `components/workouts/session/RestTimer.test.ts` | Timer displays countdown; skip button emits event; complete triggers visual cue |
| `components/workouts/session/SetLogger.vue` | `components/workouts/session/SetLogger.test.ts` | Input validation (numeric only); auto-fill populates fields; submit emits log data |

**Mock requirements:** Supabase client (mock `useSupabaseClient`), user (mock `useSupabaseUser`), Pinia store (use `createTestingPinia`).

### Integration Tests

| Integration | Test | Data Required |
|-------------|------|---------------|
| `useWorkouts.createWorkout` + Supabase | Create workout with 3 exercises; verify both tables written | Test user with valid session |
| Session flow: start → log → complete | Full session lifecycle; verify session status transitions | Test workout with exercises |
| Dashboard stats computation | Verify stats match expected values given known session data | Seeded test sessions and logs |

**Environment:** Run against Supabase local development instance or test project. Use `SUPABASE_URL` and `SUPABASE_ANON_KEY` from CI secrets.

## Development Sequencing

### Build Order

1. **Install dependencies** — `pnpm add pinia @pinia/nuxt vitest @vue/test-utils`; add `@pinia/nuxt` to `nuxt.config.ts` modules. No dependencies.
2. **Extend types and create utilities** — Add `has_completed_first_workout` to `UserProfile`; create `utils/insightRules.ts` (5 rules), `utils/workoutTemplates.ts` (3 templates in pt-BR). Depends on step 1 (types available).
3. **Create Pinia session store** — `stores/session.ts` with state, actions, getters. Depends on step 1 (Pinia installed) and step 2 (types available).
4. **Create timer composable and component** — `composables/useCountdownTimer.ts` + `components/workouts/session/RestTimer.vue`. No dependencies on other workout files; depends on step 1.
5. **Create insights composable** — `composables/useInsights.ts` that delegates to `utils/insightRules.ts` and fetches history via `useWorkouts`. Depends on step 2 (rules) and existing `useWorkouts`.
6. **Create workout list pages and components** — `pages/workouts/index.vue`, `components/workouts/list/` (WorkoutList, WorkoutListItem, WorkoutEmptyState). Depends on existing `useWorkouts`.
7. **Create workout creation pages and components** — `pages/workouts/create.vue`, `components/workouts/create/` (TemplateSelector, WorkoutForm, ExercisePicker). Depends on step 5 (templates utility) and step 6 (list pages exist for navigation).
8. **Create workout detail page** — `pages/workouts/[id].vue`, `components/workouts/detail/` (WorkoutActions). Depends on step 6 (list) and existing `useWorkouts.fetchWorkout()`.
9. **Create session runner page and components** — `pages/workouts/[id]/start.vue`, `components/workouts/session/` (SessionRunner, SetLogger, SessionComplete). Depends on steps 3 (store), 4 (timer), 5 (insights), 8 (detail page navigation).
10. **Create session history pages and components** — `pages/workouts/history/index.vue`, `pages/workouts/history/[sessionId].vue`, `components/workouts/history/` (SessionList, SessionListItem, SessionDetail, InsightCard). Depends on step 9 (session data exists) and step 5 (insights).
11. **Update dashboard** — Replace mock data in `pages/dashboard/index.vue` with real stats from `useWorkouts`. Depends on step 10 (sessions exist to display).
12. **Write tests** — Unit tests for utilities, composables, store, and components. Depends on all implementation steps.

### Technical Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Pinia + @pinia/nuxt | Not installed | Must install before step 3 |
| Vitest + @vue/test-utils | Not installed | Must install before step 12 |
| `user_profiles.has_completed_first_workout` column | Not created | Must run Supabase migration before step 7 (onboarding) |
| `useWorkouts` composable | Already implemented | No action needed |
| `useExercises` composable | Already implemented | No action needed |
| Supabase schema | Already exists | No new migrations except `has_completed_first_workout` |

## Monitoring and Observability

### Key Metrics (client-side, log to console in dev; analytics in prod)

| Metric | How | Target |
|--------|-----|--------|
| Workout creation success rate | Count `createWorkout` successes vs failures | > 95% |
| Session completion rate | Count `completeSession` vs `startSession` calls | > 70% |
| Average logging time | Client-side timing from set input focus to log submission | < 30s |
| Checkpoint restore rate | Count `restoreCheckpoint` returns `true` | Track for UX validation |
| Supabase error rate | Count errors from `useWorkouts` composable | < 1% |

### Log Events

| Event | Level | Fields |
|-------|-------|--------|
| `workout.created` | Info | workout_id, template_used, exercise_count |
| `session.started` | Info | session_id, workout_id, started_at |
| `session.completed` | Info | session_id, duration, volume, set_count, rating |
| `session.cancelled` | Info | session_id, reason |
| `checkpoint.saved` | Debug | session_id, saved_at |
| `checkpoint.restored` | Info | session_id, time_since_save |
| `insight.generated` | Debug | insight_rule_id, session_id |
| `supabase.error` | Error | operation, table, error_message |

### Alerting Thresholds (post-launch)

- Supabase error rate > 5% over 1 hour → investigate RLS policies
- Session completion rate < 50% over 1 week → UX issue in session runner
- Average logging time > 45s → simplify logging UI

## Technical Considerations

### Key Decisions

**Decision 1: Pinia over composable-only state management**

- **Rationale:** Session state is complex (exercises, sets, timer, checkpoint, summary). Pinia provides structured actions, getters, and DevTools. `useState()` alone would scatter state across 8+ refs with unclear ownership.
- **Trade-offs:** New dependency (~5KB); slight learning curve. Gains: testability, structure, debuggability.
- **Alternatives rejected:** Composable-only (rejected for maintainability), useState in page (rejected for separation of concerns).

**Decision 2: Feature-based directory structure**

- **Rationale:** Module is large (6 pages, ~20 components). Flat structure would create navigation chaos. Feature grouping (`components/workouts/session/`, etc.) keeps related files together.
- **Trade-offs:** More directories to navigate; requires discipline. Gains: discoverability, testability, scalability.
- **Alternatives rejected:** Flat pages only (rejected for module size), feature directory with all artifacts (rejected for Nuxt convention conflict).

**Decision 3: Web Audio API for timer sound (no external dependency)**

- **Rationale:** Timer needs an audio cue but adding an audio library is overkill. Web Audio API is built into all modern browsers and requires no dependency.
- **Trade-offs:** Requires minimal code to generate beep tone; may not work in all PWA contexts (iOS Safari background). Gains: zero dependencies, no network requests.
- **Alternatives rejected:** `<audio>` element with .mp3 file (requires asset), third-party timer library (unnecessary dependency).

**Decision 4: localStorage for session checkpoint (no server-side draft)**

- **Rationale:** Session must survive page reload (gym context: accidental navigation, browser crash). localStorage is immediate, requires no server round-trip, and is free.
- **Trade-offs:** Data lost if user clears browser storage or switches devices. Gains: instant save, no server load, simple implementation.
- **Alternatives rejected:** Server-side draft session (adds latency, server cost), no checkpoint (data loss risk too high).

### Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Pinia + Supabase integration** — `useSupabaseClient()` may not work inside Pinia stores in SSR context | Medium | High | Use `useSupabaseClient()` inside store actions (not state init); page components guard against SSR with `import.meta.client` checks |
| **iOS Safari PWA audio** — Web Audio API may be blocked in backgrounded PWA | High | Medium | Timer uses visual cue as primary feedback; audio is supplementary. Test on real device before launch. |
| **localStorage quota exceeded** — Unlikely for single checkpoint but possible if user has many stored keys | Low | Low | Wrap checkpoint save in try/catch; fail silently if storage full |
| **`order_index` vs `order` type mismatch** — `WorkoutExercise` type uses `order` but DB column is `order_index` | Medium | Medium | Already noted in QWEN.md; `useWorkouts.createWorkout` correctly uses `order_index` in INSERT. Ensure all new code uses `order_index` for DB queries. |
| **Template exercises not in catalog** — Pre-built templates reference exercise IDs that may not exist in current Supabase `exercises` table | Medium | High | Verify exercise IDs against actual catalog before shipping; seed missing exercises if needed. |

## Architecture Decision Records

- [ADR-001](adrs/adr-001.md) — Escopo V1: Core Workout Management (creation, execution, history + basic templates + actionable feedback)
- [ADR-002](adrs/adr-002.md) — Guided First Workout onboarding approach for beginner activation
- [ADR-003](adrs/adr-003.md) — Pinia Store for session state management (vs composable-only or useState)
- [ADR-004](adrs/adr-004.md) — Feature-based directory structure for workout module organization
