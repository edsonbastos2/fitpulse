---
status: completed
title: Criar composable de Insights
type: backend
complexity: medium
dependencies:
  - task_02
---

# Task 05: Criar composable de Insights

## Overview
Create the `useInsights` composable that evaluates a completed workout session against the 5 insight rules, fetching the user's recent session history from Supabase via `useWorkouts` and building the InsightContext needed by the pure rules in `utils/insightRules.ts`. Returns the highest-priority matching insight string.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- evaluateSession(sessionId) MUST fetch session data, recent sessions, and compute weekly muscle group frequency
- MUST fetch last 10 completed sessions for the current user via Supabase
- MUST build InsightContext with: currentSession, all logs for session, recentSessions, weeklyFrequency
- MUST run all 5 rules from insightRules.ts against the context
- MUST return the highest-priority matching rule's insight string (lowest priority number wins)
- MUST return null if no rules match
- MUST handle missing data gracefully (no recent sessions = only streak/volume rules may fail, others unaffected)
- fetchRecentSessions(user_id) MUST be added to useWorkouts if not already present, returning WorkoutSession[] with joined workout_logs
</requirements>

## Subtasks
- [x] 5.1 Add fetchRecentSessions method to composables/useWorkouts.ts
- [x] 5.2 Create composables/useInsights.ts with evaluateSession method
- [x] 5.3 Implement InsightContext builder (fetch session, logs, recent sessions, compute frequency)
- [x] 5.4 Implement rule evaluation with priority ordering
- [x] 5.5 Write unit tests for evaluateSession with mock data

## Implementation Details

### Relevant Files
- `composables/useInsights.ts` — New file: insight evaluation composable
- `composables/useWorkouts.ts` — Add fetchRecentSessions method
- `utils/insightRules.ts` — Pure rule functions (task_02)
- `types/index.ts` — InsightContext interface

### Dependent Files
- `stores/session.ts` — Calls generateInsight which delegates to useInsights (task_03)
- `components/workouts/session/SessionComplete.vue` — Displays insight result (task_09)
- `components/workouts/history/InsightCard.vue` — Displays insight in history (task_10)

### Related ADRs
- [ADR-001](../adrs/adr-001.md) — Escopo V1: Core Workout Management
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- composables/useInsights.ts with evaluateSession implementation
- useWorkouts updated with fetchRecentSessions method
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for insight evaluation with realistic Supabase data **(REQUIRED)**

## Tests
- Unit tests:
  - [x] evaluateSession with PR context: returns PR insight message
  - [x] evaluateSession with volume increase: returns volume improvement message
  - [x] evaluateSession with high frequency muscle: returns rest recommendation
  - [x] evaluateSession with duration overrun: returns duration adjustment message
  - [x] evaluateSession with 3+ consecutive days: returns streak encouragement
  - [x] evaluateSession with no recent sessions: returns null (no rules match)
  - [x] Priority ordering: when multiple rules match, highest priority (lowest number) wins
  - [x] fetchRecentSessions: returns sessions ordered by started_at DESC
- Integration tests:
  - [x] Full insight evaluation: mock Supabase responses with session + logs → returns correct insight
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- evaluateSession correctly builds context and returns matching insight
- Priority ordering works correctly
- Graceful handling of missing data

## Results
- **Testes**: 138 passed (9 test files)
- **Coverage**: insightRules.ts 97.46% statements, 100% lines; useInsights integration tests 10 tests
- **Arquivos criados**:
  - `composables/useInsights.ts` — evaluateSession, buildInsightContext, computeWeeklyMuscleFrequency, computeConsecutiveDays
  - `composables/useWorkouts.ts` — fetchRecentSessions method adicionado
  - `tests/composables/useInsights.integration.test.ts` — 10 testes de integração
  - `tests/composables/useWorkouts.fetchRecentSessions.test.ts` — 6 testes de lógica de dados
