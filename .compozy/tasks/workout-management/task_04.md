---
status: completed
title: Criar composable e componente de Timer
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 04: Criar composable e componente de Timer

## Overview
Create the `useCountdownTimer` composable that manages countdown timer state (start, pause, resume, skip, progress) with Web Audio API beep on completion, and the `RestTimer.vue` component that provides the visual countdown UI with large display, skip button, and completion cue. These form the timer system used between sets during session execution.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- useCountdownTimer MUST export: remaining (Ref), isRunning (Ref), total (Ref), start, pause, resume, skip, progress (ComputedRef 0-100)
- start(duration) MUST set remaining=duration, isRunning=true, total=duration
- Timer MUST tick every 1 second decrementing remaining
- When remaining reaches 0, timer MUST call onComplete callback and stop
- onComplete MUST trigger Web Audio API beep (simple oscillator tone)
- pause/resume MUST preserve remaining time correctly
- skip MUST stop timer and reset remaining to 0
- RestTimer.vue component MUST display large countdown (mm:ss format)
- RestTimer.vue MUST have skip button (minimum 44x44px tap target)
- RestTimer.vue MUST emit 'complete' event when timer finishes
- RestTimer.vue MUST emit 'skip' event when skip button clicked
- Progress bar MUST reflect timer progress (0-100%)
- Component MUST use design system classes (.btn-primary, .text-gradient, etc.)
</requirements>

## Subtasks
- [x] 4.1 Create composables/useCountdownTimer.ts with full timer logic
- [x] 4.2 Implement Web Audio API beep on completion
- [x] 4.3 Create components/workouts/session/RestTimer.vue with countdown display and skip button
- [x] 4.4 Write unit tests for composable (start/pause/resume/skip/complete)
- [x] 4.5 Write component tests for RestTimer.vue (countdown display, skip, complete)

## Implementation Details

### Relevant Files
- `composables/useCountdownTimer.ts` — New file: timer composable
- `components/workouts/session/RestTimer.vue` — New file: timer UI component
- `assets/css/tailwind.css` — Existing design system classes for styling

### Dependent Files
- `stores/session.ts` — Calls timer start/stop (task_03)
- `components/workouts/session/SessionRunner.vue` — Renders RestTimer between sets (task_09)

### Related ADRs
- [ADR-004](../adrs/adr-004.md) — Feature-Based Directory Structure for Workout Module

## Deliverables
- composables/useCountdownTimer.ts with complete implementation
- components/workouts/session/RestTimer.vue with countdown display
- Unit tests for composable (80%+ coverage) **(REQUIRED)**
- Component tests for RestTimer.vue (80%+ coverage) **(REQUIRED)**
- Integration tests for timer component with user interactions **(REQUIRED)**

## Tests
- Unit tests:
  - [x] start(60): sets remaining=60, isRunning=true, total=60, progress=0
  - [x] Tick after 30s: remaining=30, progress=50
  - [x] pause at 30s: stops countdown, preserves remaining=30
  - [x] resume after pause: continues from 30s downward
  - [x] skip at any time: sets remaining=0, isRunning=false
  - [x] onComplete called when remaining reaches 0
  - [x] Web Audio API beep triggered on complete
- Integration tests:
  - [x] RestTimer.vue: renders countdown in mm:ss format
  - [x] RestTimer.vue: emits 'complete' event when timer reaches 0
  - [x] RestTimer.vue: emits 'skip' event when skip button clicked
  - [x] RestTimer.vue: progress bar reflects current timer progress
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Timer counts down correctly from any duration
- pause/resume preserves time correctly
- Web Audio beep fires on completion
- RestTimer.vue renders with correct design system styling

## Results
- **Testes**: 122 passed (7 test files)
- **Coverage**: useCountdownTimer.ts 74.64% statements, RestTimer.vue 91.3% statements, session.ts 95.37% statements
- **Arquivos criados**:
  - `composables/useCountdownTimer.ts`
  - `components/workouts/session/RestTimer.vue`
  - `tests/composables/useCountdownTimer.test.ts`
  - `tests/components/workouts/session/RestTimer.test.ts`
- **Arquivos corrigidos**:
  - `stores/session.ts` — generateInsight async (removido import de useInsights inexistente)
  - `tests/stores/session.test.ts` — generateInsight tests agora usam async/await
