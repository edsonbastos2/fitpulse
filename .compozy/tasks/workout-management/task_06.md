---
status: completed
title: Criar páginas e componentes de listagem de treinos
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 06: Criar páginas e componentes de listagem de treinos

## Overview
Create the workout list page (`pages/workouts/index.vue`) with search, filter, and sort functionality, along with supporting components (WorkoutList, WorkoutListItem, WorkoutEmptyState). This page displays all user workouts and templates, and serves as the entry point for workout management navigation.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- pages/workouts/index.vue MUST list all user workouts ordered by created_at DESC
- MUST support search by workout name (client-side filter)
- MUST support filter by type (strength/cardio/hiit/flexibility/mixed) and difficulty
- MUST support sort by name, last_used, created_date
- MUST display empty state with CTA to create first workout or choose template when user has no workouts
- Each list item MUST show: name, type badge (UiBadge), exercise count, estimated duration, last used date
- Templates and user workouts displayed in same list; templates marked with badge
- MUST use existing WorkoutCard component where applicable
- MUST use design system classes (.card, .btn-primary, .badge-*)
- MUST use useWorkouts.fetchWorkouts() to load data
- Loading skeleton MUST be shown while data loads
</requirements>

## Subtasks
- [x] 6.1 Create pages/workouts/index.vue with search, filter, sort
- [x] 6.2 Create components/workouts/list/WorkoutList.vue (renders list of WorkoutListItem)
- [x] 6.3 Create components/workouts/list/WorkoutListItem.vue (single workout display)
- [x] 6.4 Create components/workouts/list/WorkoutEmptyState.vue (empty state with CTA)
- [x] 6.5 Write unit tests for list components and page

## Implementation Details

### Relevant Files
- `pages/workouts/index.vue` — New file: workout list page
- `components/workouts/list/WorkoutList.vue` — New file: list container
- `components/workouts/list/WorkoutListItem.vue` — New file: single item display
- `components/workouts/list/WorkoutEmptyState.vue` — New file: empty state
- `composables/useWorkouts.ts` — Existing composable for data fetching
- `types/index.ts` — Workout, WorkoutExercise interfaces

### Dependent Files
- `components/layout/AppLayout.vue` — "Treinos" nav links to this page (existing)
- `pages/workouts/create.vue` — Navigated to from empty state CTA (task_07)
- `pages/workouts/[id].vue` — Navigated to when clicking a list item (task_08)

### Related ADRs
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- pages/workouts/index.vue fully functional
- 3 supporting components in components/workouts/list/
- Unit tests with 80%+ coverage for components **(REQUIRED)**
- Component tests for search/filter/sort behavior **(REQUIRED)**
- Integration tests for full list page with mock Supabase data **(REQUIRED)**

## Tests
- Unit tests:
  - [x] WorkoutList.vue: renders list of WorkoutListItem components from workouts array
  - [x] WorkoutListItem.vue: displays workout name, type badge, exercise count, duration
  - [x] WorkoutEmptyState.vue: displays CTA button with correct text
  - [x] Search filter: correctly filters workouts by name (case-insensitive)
  - [x] Type filter: correctly filters by selected type
  - [x] Sort by name: sorts alphabetically ascending
  - [x] Sort by created_date: sorts newest first
- Integration tests:
  - [x] Full list page: loads workouts from useWorkouts, renders list items
  - [x] Empty state: shows CTA when useWorkouts returns empty array
  - [x] Loading skeleton: displays while isLoading=true
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- List renders with correct data from Supabase
- Search, filter, and sort work correctly
- Empty state displays when no workouts exist
- Loading skeleton shown during data fetch

## Results
- **Testes**: 158 passed (10 test files)
- **Arquivos criados**:
  - `pages/workouts/index.vue` — Página de listagem com search, filter, sort, skeleton loading
  - `components/workouts/list/WorkoutList.vue` — Container de lista
  - `components/workouts/list/WorkoutListItem.vue` — Item individual com badges, meta info
  - `components/workouts/list/WorkoutEmptyState.vue` — Estado vazio com CTAs
  - `tests/components/workouts/list/WorkoutListComponents.test.ts` — 20 testes (componentes + lógica filter/sort)
