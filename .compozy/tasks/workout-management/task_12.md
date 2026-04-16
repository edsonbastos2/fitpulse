---
status: pending
title: Testes unitários de composables, store e utilitários
type: test
complexity: high
dependencies:
  - task_02
  - task_03
  - task_04
  - task_05
---

# Task 12: Testes unitários de composables, store e utilitários

## Overview
Write comprehensive unit tests for all pure logic modules: insight rules (utils/insightRules.ts), workout templates (utils/workoutTemplates.ts), countdown timer composable (composables/useCountdownTimer.ts), Pinia session store (stores/session.ts), and insights composable (composables/useInsights.ts). These tests validate the core business logic independently of UI rendering.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- All test files MUST use Vitest as test runner
- Supabase client MUST be mocked (mock useSupabaseClient and useSupabaseUser)
- Pinia store tests MUST use createTestingPinia
- Each module MUST achieve >=80% test coverage
- All edge cases from TechSpec Testing Approach table MUST be covered
- Tests MUST be deterministic (no flaky timing-dependent tests)
- Timer composable tests MUST use fake timers (vi.useFakeTimers)
</requirements>

## Subtasks
- [ ] 12.1 Write vitest config for the project (if not already configured)
- [ ] 12.2 Write tests for utils/insightRules.ts (all 5 rules, mock context)
- [ ] 12.3 Write tests for utils/workoutTemplates.ts (structure validation)
- [ ] 12.4 Write tests for composables/useCountdownTimer.ts (with fake timers)
- [ ] 12.5 Write tests for stores/session.ts (all actions and getters with mocked Supabase)
- [ ] 12.6 Write tests for composables/useInsights.ts (evaluateSession with mock data)
- [ ] 12.7 Run full test suite and verify all passing with >=80% coverage

## Implementation Details

### Relevant Files
- `utils/insightRules.ts` — Test file: utils/insightRules.test.ts (task_02)
- `utils/workoutTemplates.ts` — Test file: utils/workoutTemplates.test.ts (task_02)
- `composables/useCountdownTimer.ts` — Test file: composables/useCountdownTimer.test.ts (task_04)
- `stores/session.ts` — Test file: stores/session.test.ts (task_03)
- `composables/useInsights.ts` — Test file: composables/useInsights.test.ts (task_05)
- `composables/useWorkouts.ts` — May need additional mocking
- `vitest.config.ts` or `nuxt.config.ts` vitest section — Test configuration

### Dependent Files
- All task test files reference these as the source of truth
- CI pipeline will run `pnpm vitest run` for validation

### Related ADRs
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- Test files for all 5 modules listed above
- Vitest configuration (if not already present)
- All tests passing with >=80% coverage **(REQUIRED)**
- Integration test for full session lifecycle (start → log → complete) **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] insightRules: all 5 rules return correct results for mock contexts (see task_02)
  - [ ] workoutTemplates: all 3 templates valid, exercise IDs documented (see task_02)
  - [ ] useCountdownTimer: start/tick/pause/resume/skip/complete with fake timers (see task_04)
  - [ ] stores/session: all actions and getters with mocked Supabase (see task_03)
  - [ ] useInsights: evaluateSession returns correct insight for mock contexts (see task_05)
- Integration tests:
  - [ ] Full session lifecycle with mocked Supabase: start → 3 logs → complete → verify state transitions
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80% for all 5 modules
- No flaky tests (deterministic execution)
- Supabase mocking works correctly
- Pinia testing setup works with store actions
