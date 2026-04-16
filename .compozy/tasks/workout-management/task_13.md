---
status: pending
title: Testes de componentes Vue
type: test
complexity: medium
dependencies:
  - task_07
  - task_09
---

# Task 13: Testes de componentes Vue

## Overview
Write Vue component tests using Vue Test Utils for the key interactive components: TemplateSelector, WorkoutForm, ExercisePicker, SetLogger, RestTimer, and SessionComplete. These tests validate component rendering, event emission, user interaction simulation, and integration with composables/stores.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- All component tests MUST use @vue/test-utils with shallow mounting where appropriate
- Pinia store MUST be mocked with createTestingPinia
- Composables MUST be mocked (useWorkouts, useInsights, useCountdownTimer)
- Each component MUST achieve >=80% test coverage
- User interactions (click, input, submit) MUST be simulated with trigger()
- Emitted events MUST be verified with emitted() assertions
- Mobile-first rendering constraints MUST be validated (min 44x44px tap targets via CSS class checks)
</requirements>

## Subtasks
- [ ] 13.1 Configure Vue Test Utils with Vitest
- [ ] 13.2 Write tests for TemplateSelector.vue (template selection, skip)
- [ ] 13.3 Write tests for WorkoutForm.vue (validation, save)
- [ ] 13.4 Write tests for ExercisePicker.vue (search, add, reorder)
- [ ] 13.5 Write tests for SetLogger.vue (input, auto-fill, submit)
- [ ] 13.6 Write tests for RestTimer.vue (countdown display, skip, complete)
- [ ] 13.7 Write tests for SessionComplete.vue (summary, insight, rating)
- [ ] 13.8 Run full component test suite and verify all passing

## Implementation Details

### Relevant Files
- `components/workouts/create/TemplateSelector.vue` — Test: components/workouts/create/TemplateSelector.test.ts (task_07)
- `components/workouts/create/WorkoutForm.vue` — Test: components/workouts/create/WorkoutForm.test.ts (task_07)
- `components/workouts/create/ExercisePicker.vue` — Test: components/workouts/create/ExercisePicker.test.ts (task_07)
- `components/workouts/session/SetLogger.vue` — Test: components/workouts/session/SetLogger.test.ts (task_09)
- `components/workouts/session/RestTimer.vue` — Test: components/workouts/session/RestTimer.test.ts (task_04)
- `components/workouts/session/SessionComplete.vue` — Test: components/workouts/session/SessionComplete.test.ts (task_09)

### Dependent Files
- All component source files — Tests reference these as source
- Vitest config — Must support .vue file imports

### Related ADRs
- [ADR-002](../adrs/adr-002.md) — Guided First Workout Onboarding Approach
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- 6 component test files (one per component listed above)
- Vue Test Utils configuration
- All tests passing with >=80% coverage **(REQUIRED)**
- Integration tests for component interactions **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] TemplateSelector: renders 3 template cards, emits select on click, skip button works
  - [ ] WorkoutForm: validates required fields, emits save with valid data, shows errors
  - [ ] ExercisePicker: searches exercises, adds to list, reorders with up/down
  - [ ] SetLogger: renders inputs, auto-fills from previous session, emits log on submit
  - [ ] RestTimer: displays countdown, emits skip, emits complete at 0
  - [ ] SessionComplete: displays stats, shows insight, handles optional rating, navigates on done
- Integration tests:
  - [ ] TemplateSelector + WorkoutForm: selecting template pre-fills form
  - [ ] SetLogger + RestTimer: logging set starts timer, skip cancels
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80% for all 6 components
- Component events correctly emitted
- User interactions correctly simulated
- Mobile-first constraints validated
