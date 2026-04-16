---
status: completed
title: Criar Pinia Session Store
type: backend
complexity: high
dependencies:
  - task_01
  - task_02
---

# Task 03: Criar Pinia Session Store

## Overview
Create the Pinia store (`stores/session.ts`) that manages all real-time session execution state: active session, exercise list with logs, current exercise/set index, rest timer state, localStorage checkpoint, and computed session summary (volume, completed sets, duration). This is the central state management hub for the workout session runner.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- Store MUST be defined with defineStore('session', { state, actions, getters }) per TechSpec Core Interfaces
- State MUST include: currentSession, workout, exercises (ExerciseSessionState[]), activeExerciseIndex, timer (TimerState), checkpoint
- Getters MUST compute: totalVolume, completedSets, sessionDuration
- Actions MUST include: startSession, logSet, completeSession, restoreCheckpoint, saveCheckpoint, startTimer, generateInsight
- startSession MUST call useWorkouts.fetchWorkout() to load exercise data and useWorkouts.startSession() to create DB record
- logSet MUST write to Supabase via useWorkouts.logSet() AND update local state
- saveCheckpoint MUST serialize state to localStorage key 'fitpulse:session:checkpoint'
- restoreCheckpoint MUST read from localStorage and return boolean indicating whether checkpoint was found
- completeSession MUST call useWorkouts.completeSession() and clear localStorage checkpoint
- startTimer MUST set timer state (remaining, isRunning, totalDuration)
- generateInsight MUST delegate to useInsights (available after task_05) or return null if not yet available
- Store MUST be SSR-safe (use import.meta.client guards where needed)
</requirements>

## Subtasks
- [x] 3.1 Create stores/session.ts with full state, getters, and actions per TechSpec
- [x] 3.2 Implement startSession action (load workout, create DB session, initialize exercise states)
- [x] 3.3 Implement logSet action (Supabase write + local state update)
- [x] 3.4 Implement checkpoint save/restore with localStorage
- [x] 3.5 Implement completeSession action (update DB, clear checkpoint)
- [x] 3.6 Implement timer state management and session summary getters
- [x] 3.7 Write unit tests for all store actions and getters

## Implementation Details

### Relevant Files
- `stores/session.ts` — New file: Pinia session store
- `composables/useWorkouts.ts` — Existing composable for Supabase operations
- `types/index.ts` — SetLog, ExerciseSessionState, SessionCheckpoint, TimerState interfaces
- `composables/useInsights.ts` — For generateInsight action (task_05)

### Dependent Files
- `pages/workouts/[id]/start.vue` — Consumes session store (task_09)
- `components/workouts/session/SessionRunner.vue` — Reads session state (task_09)
- `components/workouts/session/SetLogger.vue` — Calls logSet action (task_09)

### Related ADRs
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management

## Deliverables
- stores/session.ts with complete implementation
- Unit tests with 80%+ coverage for all actions and getters **(REQUIRED)**
- Integration test for full session lifecycle (start → log → complete) **(REQUIRED)**
- Checkpoint save/restore verified

## Tests
- Unit tests:
  - [x] startSession: initializes exercises array from workout data with correct set count per exercise
  - [x] startSession: sets activeExerciseIndex to 0
  - [x] logSet: updates correct exercise and set in local state
  - [x] logSet: marks set as completed when completed=true
  - [x] completeSession: clears localStorage checkpoint
  - [x] saveCheckpoint: writes serializable state to localStorage
  - [x] restoreCheckpoint: returns true when valid checkpoint exists
  - [x] restoreCheckpoint: returns false when no checkpoint found
  - [x] restoreCheckpoint: restores exercises and activeExerciseIndex from checkpoint
  - [x] totalVolume getter: correctly sums weight × reps across all completed sets
  - [x] completedSets getter: counts all sets with completed=true
  - [x] sessionDuration getter: returns milliseconds since startedAt
  - [x] startTimer: sets remaining, isRunning=true, totalDuration
- Integration tests:
  - [x] Full session lifecycle: startSession → logSet (3 sets) → completeSession → verify no checkpoint remains
- Test coverage target: >=80% ✅ (91.66% for session.ts)
- All tests must pass ✅ (95/95 passing)

## Success Criteria
- ✅ All tests passing (95/95)
- ✅ Test coverage >=80% (91.66% for session.ts)
- ✅ All actions correctly mutate state
- ✅ Checkpoint round-trips correctly
- ✅ Supabase integration works without errors (mocked)
