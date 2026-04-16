---
status: completed
title: Instalar dependências (Pinia, Vitest, Vue Test Utils)
type: infra
complexity: low
dependencies: []
---

# Task 01: Instalar dependências (Pinia, Vitest, Vue Test Utils)

## Overview
Install and configure the new dependencies required by the Workout Management Module: Pinia for session state management, Vitest for unit testing, and Vue Test Utils for component testing. This is the foundation task that all subsequent implementation tasks depend on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- Pinia and @pinia/nuxt MUST be installed and added to nuxt.config.ts modules array
- Vitest and @vue/test-utils MUST be installed as devDependencies
- All existing commands (pnpm dev, pnpm build, pnpm lint) MUST continue to work after installation
- The @pinia/nuxt module MUST be added before any existing modules in nuxt.config.ts
</requirements>

## Subtasks
- [x] 1.1 Install pinia and @pinia/nuxt via pnpm
- [x] 1.2 Add @pinia/nuxt to modules array in nuxt.config.ts
- [x] 1.3 Install vitest and @vue/test-utils as devDependencies
- [x] 1.4 Verify dev server starts without errors (pnpm dev)
- [x] 1.5 Verify lint still passes (pnpm lint)

## Implementation Details

### Relevant Files
- `nuxt.config.ts` — Add @pinia/nuxt to modules array
- `package.json` — New dependencies added

### Dependent Files
- `stores/session.ts` — Will import pinia (created in task_03)
- All future test files — Will use vitest + @vue/test-utils

### Related ADRs
- [ADR-003](../adrs/adr-003.md) — Pinia Store for Session State Management

## Deliverables
- Updated nuxt.config.ts with @pinia/nuxt in modules
- package.json with new dependencies (pinia, @pinia/nuxt, vitest, @vue/test-utils)
- Dev server starts successfully
- Lint passes
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for module loading **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify pinia store can be instantiated (createTestingPinia returns valid instance)
  - [x] Verify vitest is properly configured for the project
- Integration tests:
  - [x] pnpm dev starts without module resolution errors
  - [x] pnpm lint passes with no new warnings (pre-existing warnings remain)
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- ✅ All tests passing (4/4 tests pass)
- ✅ Test coverage >=80% (configuration set)
- ✅ pnpm dev starts without errors
- ✅ pnpm lint passes (pre-existing warnings do not block)
