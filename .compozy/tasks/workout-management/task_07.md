---
status: pending
title: Criar páginas e componentes de criação de treinos
type: frontend
complexity: high
dependencies:
  - task_02
  - task_06
---

# Task 07: Criar páginas e componentes de criação de treinos

## Overview
Create the workout creation page (`pages/workouts/create.vue`) implementing the guided onboarding flow: template selection screen with 3 pt-BR templates for beginners, plus "Criar do zero" option for experienced users. Supporting components include TemplateSelector, WorkoutForm, and ExercisePicker. This implements ADR-002's Guided First Workout approach.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- Page MUST show template selection screen on first visit (check has_completed_first_workout from user profile)
- If user has completed first workout, show direct workout form (skip template selection)
- TemplateSelector MUST display 3 cards from workoutTemplates.ts: Full Body, Push/Pull/Legs, Upper/Lower
- Each template card MUST show: name (pt-BR), description (pt-BR), muscle groups, duration, exercise count
- "Criar do zero" button MUST be visible at all times
- "Pular tour" link MUST skip template selection and go directly to blank form
- WorkoutForm MUST have fields: name, description (optional), type, difficulty, estimated_duration
- ExercisePicker MUST allow searching exercises via existing ExerciseSearchBar component
- Per exercise: sets (number), reps (number, optional), rest_period (seconds), notes (optional)
- Form validation: name required, type required, difficulty required, at least 1 exercise required
- Save MUST call useWorkouts.createWorkout() and redirect to workout detail page
- Template selection MUST mark has_completed_first_workout=true after first save
- Exercise ordering via manual up/down buttons (not drag-and-drop for V1 simplicity)
</requirements>

## Subtasks
- [ ] 7.1 Create pages/workouts/create.vue with onboarding flow logic
- [ ] 7.2 Create components/workouts/create/TemplateSelector.vue with 3 template cards
- [ ] 7.3 Create components/workouts/create/WorkoutForm.vue with validation and save
- [ ] 7.4 Create components/workouts/create/ExercisePicker.vue with exercise search and config
- [ ] 7.5 Write unit and component tests

## Implementation Details

### Relevant Files
- `pages/workouts/create.vue` — New file: workout creation page with onboarding logic
- `components/workouts/create/TemplateSelector.vue` — New file: template selection UI
- `components/workouts/create/WorkoutForm.vue` — New file: workout form with validation
- `components/workouts/create/ExercisePicker.vue` — New file: exercise search and configuration
- `utils/workoutTemplates.ts` — Template data (task_02)
- `composables/useWorkouts.ts` — createWorkout method
- `composables/useExercises.ts` — fetchExercisesPaginated for exercise picker
- `components/catalog/ExerciseSearchBar.vue` — Reused search component
- `components/catalog/ExerciseCardCompact.vue` — Reused exercise display
- `types/index.ts` — WorkoutForm, UserProfile interfaces

### Dependent Files
- `pages/auth/register.vue` — Redirects here after profile setup
- `pages/dashboard/index.vue` — "Novo Treino" button links here (existing)
- `pages/workouts/[id].vue` — Redirected to after saving workout (task_08)

### Related ADRs
- [ADR-002](../adrs/adr-002.md) — Guided First Workout Onboarding Approach
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- pages/workouts/create.vue with onboarding flow
- 3 supporting components in components/workouts/create/
- Unit tests with 80%+ coverage **(REQUIRED)**
- Component tests for form validation and template selection **(REQUIRED)**
- Integration tests for full creation flow **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] TemplateSelector.vue: renders 3 template cards from workoutTemplates.ts
  - [ ] TemplateSelector.vue: emits 'select' event when template card clicked
  - [ ] WorkoutForm.vue: validates required fields (name, type, difficulty, exercises)
  - [ ] WorkoutForm.vue: emits 'save' with valid WorkoutForm data
  - [ ] WorkoutForm.vue: shows error messages for invalid fields
  - [ ] ExercisePicker.vue: searches exercises via ExerciseSearchBar
  - [ ] ExercisePicker.vue: adds selected exercise to list
  - [ ] ExercisePicker.vue: configures sets/reps/rest for each exercise
  - [ ] ExercisePicker.vue: reorders exercises with up/down buttons
- Integration tests:
  - [ ] First visit: shows template selection screen
  - [ ] Returning visit: shows direct workout form
  - [ ] Template selected: pre-fills WorkoutForm with template exercises
  - [ ] Create from template: saves workout + exercises to Supabase, redirects to detail page
  - [ ] Create from blank: saves workout + exercises to Supabase, redirects to detail page
  - [ ] "Pular tour": skips template selection, shows blank form
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Template selection pre-fills form correctly
- Form validation prevents invalid submissions
- Create saves workout and exercises to Supabase
- Redirect to workout detail page works
- Onboarding flow respects has_completed_first_workout flag
