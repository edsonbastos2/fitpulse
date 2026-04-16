---
status: pending
title: Criar página e componentes de execução de sessão
type: frontend
complexity: high
dependencies:
  - task_03
  - task_04
  - task_05
  - task_08
---

# Task 09: Criar página e componentes de execução de sessão

## Overview
Create the session runner page (`pages/workouts/[id]/start.vue`) — the most complex feature in the module — that orchestrates real-time workout execution with set logging, auto-fill from previous sessions, rest timer between sets, localStorage checkpoint recovery, and post-workout feedback with actionable insights. Supporting components: SessionRunner, SetLogger, RestTimer (from task_04), and SessionComplete.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- pages/workouts/[id]/start.vue MUST call sessionStore.startSession(workoutId) on mount
- MUST check for existing checkpoint on mount and prompt user to restore if found
- SessionRunner MUST display exercises in order with current exercise visually highlighted
- SetLogger MUST allow logging weight (number) and reps (number) per set
- SetLogger MUST auto-fill weight and reps from user's last session of that exercise
- SetLogger MUST have optional RPE expandable section (hidden by default)
- SetLogger MUST support adding/removing sets per exercise
- Each completed set MUST show visual progress indicator (checkmark)
- RestTimer (task_04) MUST start between completed sets with configurable duration
- RestTimer MUST be skippable manually
- "Concluir Treino" button MUST always be visible at bottom
- "Cancelar Treino" button MUST show confirmation and mark session as "skipped"
- Session MUST survive page reload via localStorage checkpoint (task_03)
- On session complete: call sessionStore.completeSession(), call useInsights for insight, show SessionComplete
- SessionComplete MUST display: duration, total volume, exercises completed, sets completed, 1 insight, star rating
- SessionComplete "Done" button navigates to /dashboard
- Mobile-first: all tap targets minimum 44x44px
- Numeric keypad for weight/reps inputs (inputmode="numeric")
- Network errors during logging MUST be silently queued
</requirements>

## Subtasks
- [ ] 9.1 Create pages/workouts/[id]/start.vue with session orchestration logic
- [ ] 9.2 Create components/workouts/session/SessionRunner.vue (exercise list with current highlighting)
- [ ] 9.3 Create components/workouts/session/SetLogger.vue (weight/reps input with auto-fill)
- [ ] 9.4 Create components/workouts/session/SessionComplete.vue (summary + insight + rating)
- [ ] 9.5 Implement checkpoint restore prompt on page mount
- [ ] 9.6 Write unit and component tests

## Implementation Details

### Relevant Files
- `pages/workouts/[id]/start.vue` — New file: session runner page
- `components/workouts/session/SessionRunner.vue` — New file: exercise list display
- `components/workouts/session/SetLogger.vue` — New file: set logging UI
- `components/workouts/session/SessionComplete.vue` — New file: post-workout feedback
- `components/workouts/session/RestTimer.vue` — Timer component (task_04)
- `stores/session.ts` — Session state management (task_03)
- `composables/useCountdownTimer.ts` — Timer composable (task_04)
- `composables/useInsights.ts` — Insight evaluation (task_05)
- `composables/useWorkouts.ts` — startSession, logSet, completeSession methods
- `components/ui/UiButton.vue` — Action buttons
- `components/ui/UiModal.vue` — Cancel confirmation
- `types/index.ts` — SetLog, WorkoutLog, WorkoutSession interfaces

### Dependent Files
- `pages/workouts/[id].vue` — Navigates to this page from "Iniciar Treino" (task_08)
- `pages/dashboard/index.vue` — SessionComplete redirects here
- `pages/workouts/history/index.vue` — Sessions appear in history (task_10)

### Related ADRs
- [ADR-001](../adrs/adr-001.md) — Escopo V1: Core Workout Management
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- pages/workouts/[id]/start.vue fully functional
- 3 supporting components in components/workouts/session/
- Unit tests with 80%+ coverage **(REQUIRED)**
- Component tests for SetLogger, SessionRunner, SessionComplete **(REQUIRED)**
- Integration tests for full session execution flow **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] SetLogger.vue: renders weight and reps inputs for current set
  - [ ] SetLogger.vue: auto-fills weight and reps from previous session data
  - [ ] SetLogger.vue: emits 'log' with valid data on submit
  - [ ] SetLogger.vue: RPE section hidden by default, expandable on click
  - [ ] SetLogger.vue: add set button increases set count
  - [ ] SessionRunner.vue: highlights current exercise in list
  - [ ] SessionRunner.vue: shows checkmark on completed sets
  - [ ] SessionRunner.vue: starts RestTimer after set completion
  - [ ] SessionComplete.vue: displays duration, volume, sets completed
  - [ ] SessionComplete.vue: displays insight from useInsights
  - [ ] SessionComplete.vue: star rating is optional (skip allowed)
- Integration tests:
  - [ ] Full session flow: startSession → log 3 sets → completeSession → SessionComplete displayed
  - [ ] Checkpoint recovery: page reload mid-session → restore prompt → state restored → continue logging
  - [ ] Cancel session: confirmation → session marked as "skipped" → redirect to workout detail
  - [ ] Auto-fill: SetLogger shows previous session values for same exercise
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Session starts and logs sets to Supabase correctly
- Auto-fill populates from last session
- Rest timer triggers between sets
- Checkpoint survives page reload
- Session complete shows feedback with insight
- Mobile-first UI with proper tap targets
