---
status: pending
title: Criar páginas e componentes de histórico de sessões
type: frontend
complexity: medium
dependencies:
  - task_05
  - task_09
---

# Task 10: Criar páginas e componentes de histórico de sessões

## Overview
Create the session history pages (`pages/workouts/history/index.vue` and `pages/workouts/history/[sessionId].vue`) with supporting components (SessionList, SessionListItem, SessionDetail, InsightCard) that display a chronological list of completed workout sessions with key metrics and the ability to view individual session details including all logged sets.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- pages/workouts/history/index.vue MUST list completed sessions ordered by started_at DESC
- Each list item MUST show: date, workout name, duration, total volume, exercise count, completion badge
- MUST show empty state with message "Complete your first workout to see history here"
- Tap on session item MUST navigate to /workouts/history/[sessionId] for detail view
- SessionDetail MUST show all logged sets per exercise (exercise name, set number, weight, reps, RPE if set)
- InsightCard MUST display the actionable insight generated for that session (use useInsights)
- MUST filter by workout name and date range
- Loading skeleton MUST display while data loads
- MUST use design system classes (.card, .badge, .text-gradient)
- Data sourced from useWorkouts (sessions list with joined workout_logs)
</requirements>

## Subtasks
- [ ] 10.1 Create pages/workouts/history/index.vue with session list
- [ ] 10.2 Create pages/workouts/history/[sessionId].vue with session detail
- [ ] 10.3 Create components/workouts/history/SessionList.vue
- [ ] 10.4 Create components/workouts/history/SessionListItem.vue
- [ ] 10.5 Create components/workouts/history/SessionDetail.vue
- [ ] 10.6 Create components/workouts/history/InsightCard.vue
- [ ] 10.7 Write unit and component tests

## Implementation Details

### Relevant Files
- `pages/workouts/history/index.vue` — New file: session history list page
- `pages/workouts/history/[sessionId].vue` — New file: session detail page
- `components/workouts/history/SessionList.vue` — New file: list container
- `components/workouts/history/SessionListItem.vue` — New file: single session item
- `components/workouts/history/SessionDetail.vue` — New file: full session detail
- `components/workouts/history/InsightCard.vue` — New file: insight display
- `composables/useWorkouts.ts` — Session data fetching (may need fetchSessionWithLogs method)
- `composables/useInsights.ts` — Insight evaluation (task_05)
- `types/index.ts` — WorkoutSession, WorkoutLog interfaces

### Dependent Files
- `pages/workouts/[id]/start.vue` — Creates sessions that appear here (task_09)
- `pages/dashboard/index.vue` — Recent activity section uses similar data (task_11)

### Related ADRs
- [ADR-001](../adrs/adr-001.md) — Escopo V1: Core Workout Management
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- pages/workouts/history/index.vue with session list
- pages/workouts/history/[sessionId].vue with session detail
- 4 supporting components in components/workouts/history/
- Unit tests with 80%+ coverage **(REQUIRED)**
- Component tests for list and detail views **(REQUIRED)**
- Integration tests for history page with real session data **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] SessionList.vue: renders list of SessionListItem components
  - [ ] SessionListItem.vue: displays date, workout name, duration, volume, exercise count
  - [ ] SessionDetail.vue: renders all logged sets per exercise
  - [ ] InsightCard.vue: displays insight text with styling
  - [ ] Empty state: displays message when no sessions exist
- Integration tests:
  - [ ] History page: loads sessions from Supabase, renders list items
  - [ ] Detail page: navigates from list item, shows full session data
  - [ ] InsightCard: displays insight from useInsights for that session
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- History page loads and displays sessions correctly
- Session detail shows all logged sets
- InsightCard displays actionable insight
- Empty state shown when no sessions exist
