---
status: completed
title: Estender tipos e criar utilitários
type: backend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Estender tipos e criar utilitários

## Overview
Extend the TypeScript type registry and create pure utility modules required by the workout module: add `has_completed_first_workout` to UserProfile, create `utils/insightRules.ts` with 5 rule functions, and create `utils/workoutTemplates.ts` with 3 pre-built templates in pt-BR. These are foundational types and pure functions used across multiple features.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- UserProfile MUST include `has_completed_first_workout?: boolean` field
- insightRules.ts MUST export 5 rule functions matching the InsightRule interface defined in the TechSpec Core Interfaces section
- Each insight rule MUST accept an InsightContext and return string | null
- Rules MUST have priority ordering: PR (1) > volume (2) > frequency (3) > duration (4) > streak (5)
- workoutTemplates.ts MUST export 3 templates: Full Body (3x/week), Push/Pull/Legs (6x/week), Upper/Lower (4x/week)
- All template content MUST be in pt-BR
- Each template MUST include name, description_pt, muscle groups, estimated duration, and exercise list with sets/reps/rest
- Template exercises SHOULD reference valid exercise IDs from the existing Supabase exercises table
</requirements>

## Subtasks
- [x] 2.1 Add `has_completed_first_workout` to UserProfile in types/index.ts
- [x] 2.2 Create utils/insightRules.ts with InsightRule interface, InsightContext interface, and 5 rule implementations
- [x] 2.3 Create utils/workoutTemplates.ts with 3 pre-built templates in pt-BR
- [x] 2.4 Write unit tests for all 5 insight rules with mock contexts
- [x] 2.5 Write unit tests for template validation

## Implementation Details

### Relevant Files
- `types/index.ts` — Add has_completed_first_workout to UserProfile interface
- `utils/insightRules.ts` — New file: rule definitions and implementations
- `utils/workoutTemplates.ts` — New file: system template definitions
- `composables/useWorkouts.ts` — May need fetchRecentSessions method (defer to task_05 if not needed here)

### Dependent Files
- `stores/session.ts` — Uses insight rules (task_03)
- `components/workouts/create/TemplateSelector.vue` — Uses workout templates (task_07)
- `composables/useInsights.ts` — Delegates to insight rules (task_05)

### Related ADRs
- [ADR-001](../adrs/adr-001.md) — Escopo V1: Core Workout Management
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management

## Deliverables
- types/index.ts updated with has_completed_first_workout field
- utils/insightRules.ts with 5 working rules
- utils/workoutTemplates.ts with 3 validated templates
- Unit tests for rules (80%+ coverage)
- Unit tests for template validation (80%+ coverage)
- Integration tests for rules with realistic context data **(REQUIRED)**

## Tests
- Unit tests:
  - [x] PR rule: returns PR message when weight × reps exceeds previous max for any exercise
  - [x] PR rule: returns null when no PR was achieved
  - [x] Volume rule: returns improvement message when current volume > last session volume by > 5%
  - [x] Volume rule: returns null when volume decreased
  - [x] Frequency rule: returns rest message when muscle group trained 3+ times in 7 days
  - [x] Duration rule: returns adjustment message when actual duration > estimated_duration + 15min
  - [x] Streak rule: returns encouragement when consecutive days >= 3
  - [x] Rules respect priority ordering (highest priority match wins)
  - [x] All 3 templates have valid structure with required fields
  - [x] Template exercise IDs reference exercises that exist (or document which ones need seeding)
- Integration tests:
  - [x] Full insight evaluation with realistic multi-session context returns exactly 1 insight
- Test coverage target: >=80% ✅ (90.75% achieved)
- All tests must pass ✅ (56/56 passing)

## Success Criteria
- ✅ All tests passing (56/56)
- ✅ Test coverage >=80% (90.75% achieved)
- ✅ All 5 rules return correct results for valid input
- ✅ All 3 templates have valid structure and pt-BR content
- ✅ Type check passes (no new TS errors - existing errors are pre-existing Supabase type issues)
