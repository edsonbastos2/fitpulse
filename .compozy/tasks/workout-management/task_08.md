---
status: pending
title: Criar página de detalhe de treino
type: frontend
complexity: low
dependencies:
  - task_06
---

# Task 08: Criar página de detalhe de treino

## Overview
Create the workout detail page (`pages/workouts/[id].vue`) that displays a single workout's exercises with sets, reps, rest periods, and provides actions to start a session, edit the workout, or delete it. This page is the hub between workout creation and session execution.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- pages/workouts/[id].vue MUST fetch workout data via useWorkouts.fetchWorkout(id)
- MUST display workout name, description, type badge, difficulty, estimated duration
- MUST list all exercises in order with: exercise name, sets, reps (if set), rest period, notes (if present)
- "Iniciar Treino" button MUST be prominent and navigate to /workouts/[id]/start
- Edit button MUST navigate to workout edit page (reuse WorkoutForm component)
- Delete button MUST show confirmation modal (use UiModal) before calling useWorkouts.deleteWorkout()
- After delete, redirect to /workouts list page
- Template workouts MUST show "Template" badge
- Loading skeleton MUST display while data loads
- MUST use design system classes (.card, .btn-primary, .btn-ghost, .badge)
</requirements>

## Subtasks
- [ ] 8.1 Create pages/workouts/[id].vue with workout detail display
- [ ] 8.2 Create components/workouts/detail/WorkoutActions.vue (start/edit/delete buttons)
- [ ] 8.3 Write unit and component tests

## Implementation Details

### Relevant Files
- `pages/workouts/[id].vue` — New file: workout detail page
- `components/workouts/detail/WorkoutActions.vue` — New file: action buttons
- `composables/useWorkouts.ts` — fetchWorkout, deleteWorkout methods
- `components/ui/UiModal.vue` — For delete confirmation
- `components/ui/UiBadge.vue` — For type/status badges
- `types/index.ts` — Workout, WorkoutExercise interfaces

### Dependent Files
- `pages/workouts/index.vue` — Links to this page when clicking a list item (task_06)
- `pages/workouts/[id]/start.vue` — Navigated to from "Iniciar Treino" button (task_09)
- `pages/workouts/create.vue` — May navigate here after saving new workout (task_07)

### Related ADRs
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- pages/workouts/[id].vue fully functional
- components/workouts/detail/WorkoutActions.vue
- Unit tests with 80%+ coverage for components **(REQUIRED)**
- Integration tests for detail page data loading and actions **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] WorkoutActions.vue: emits 'start' event when "Iniciar Treino" clicked
  - [ ] WorkoutActions.vue: emits 'edit' event when edit button clicked
  - [ ] WorkoutActions.vue: shows confirmation modal before delete
  - [ ] WorkoutActions.vue: emits 'delete' event after confirmation
- Integration tests:
  - [ ] Detail page: fetches workout via useWorkouts.fetchWorkout(id) with correct ID
  - [ ] Detail page: renders exercises in correct order with sets/reps/rest
  - [ ] Detail page: "Iniciar Treino" navigates to /workouts/[id]/start
  - [ ] Detail page: delete shows modal, calls useWorkouts.deleteWorkout(), redirects to /workouts
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Workout detail displays correctly from Supabase
- Exercise list renders in order
- Start session button navigates correctly
- Delete workflow works with confirmation
