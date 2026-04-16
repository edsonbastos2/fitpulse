---
status: pending
title: Integrar dashboard com dados reais
type: frontend
complexity: medium
dependencies:
  - task_10
---

# Task 11: Integrar dashboard com dados reais

## Overview
Replace all hardcoded mock data in `pages/dashboard/index.vue` with real workout statistics sourced from the `useWorkouts` composable. This includes stat cards (weekly count, streak, total volume, total sessions), "Today's Workout" section, weekly goal progress bar, and recent activity list. This is the final user-facing integration that validates the entire module.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- Stat cards MUST compute real data: weekly_workouts (count of completed sessions this week), current_streak (consecutive days with workouts), total_volume (sum of weight×reps across all sessions), total_sessions (count of completed sessions)
- "Today's Workout" section MUST show: scheduled workout if exists, else most recently used workout, else recommended template (in priority order)
- Weekly goal progress bar MUST show percentage of weekly workouts vs goal (default 5)
- Recent activity list MUST show last 3 completed sessions with date, workout name, brief stats
- ALL hardcoded reactive values MUST be removed (weeklyWorkouts, currentStreak, totalVolume, totalWorkouts, todayWorkout, weeklyGoal, recentActivity)
- Data MUST be sourced from useWorkouts composable
- Loading states MUST show skeleton while data loads
- Error states MUST show user-friendly message
</requirements>

## Subtasks
- [ ] 11.1 Remove all hardcoded mock data from pages/dashboard/index.vue
- [ ] 11.2 Compute weekly_workouts count from useWorkouts.sessions
- [ ] 11.3 Compute current_streak (consecutive days with completed sessions)
- [ ] 11.4 Compute total_volume from all session logs
- [ ] 11.5 Compute total_sessions count
- [ ] 11.6 Implement "Today's Workout" logic (scheduled > recent > recommended)
- [ ] 11.7 Implement weekly goal progress bar
- [ ] 11.8 Replace recent activity with real session data
- [ ] 11.9 Write tests for stats computation

## Implementation Details

### Relevant Files
- `pages/dashboard/index.vue` — Existing file: replace mock data with real stats
- `composables/useWorkouts.ts` — Data source for sessions and workouts
- `components/ui/StatCard.vue` — Stat card display component
- `types/index.ts` — WorkoutSession, WorkoutLog, UserProgress interfaces

### Dependent Files
- All pages in workout module — Feed data that appears here
- `pages/workouts/[id]/start.vue` — Completes sessions that update dashboard stats

### Related ADRs
- [ADR-001](../adrs/adr-001.md) — Escopo V1: Core Workout Management

## Deliverables
- pages/dashboard/index.vue with all real data (zero hardcoded values)
- Stats computation logic (can be inline or extracted to composable)
- Unit tests with 80%+ coverage for stats computation **(REQUIRED)**
- Integration tests for dashboard with seeded session data **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] weeklyWorkouts count: correctly counts sessions completed in current week
  - [ ] currentStreak: computes consecutive days with workouts correctly
  - [ ] currentStreak: returns 0 when no recent workouts
  - [ ] totalVolume: sums weight×reps across all completed sessions
  - [ ] totalSessions: counts all completed sessions
  - [ ] Today's Workout: returns most recent workout when no scheduled
  - [ ] Today's Workout: returns recommended template when no history
  - [ ] Weekly goal progress: calculates percentage correctly (e.g., 3/5 = 60%)
- Integration tests:
  - [ ] Full dashboard: loads with seeded data, all stat cards show correct values
  - [ ] Recent activity: shows last 3 completed sessions in correct order
  - [ ] Zero hardcoded values: grep confirms no reactive mock data remains
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Zero hardcoded values in dashboard page
- Stat cards display correct real data
- Today's Workout logic works correctly
- Weekly goal progress accurate
- Recent activity shows actual sessions
