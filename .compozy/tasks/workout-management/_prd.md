# Workout Management Module

## Overview

The Workout Management Module is the core feature of FitPulse — it transforms the app from an exercise catalog into a practical workout tool. It solves the product's primary gap: users can currently browse exercises but cannot create, execute, or log workouts. After registration, users are redirected to non-existent routes, and the dashboard's "Novo Treino" button returns 404.

The module targets **beginners** in fitness — users with limited gym experience who need guidance to start. It enables them to create workouts (from scratch or 3 pre-built templates in pt-BR), execute sessions with simple logging (weight, reps, rest timer), and receive actionable post-workout feedback. The V1 experience is mobile-first, optimized for use during gym sessions.

## Goals

1. **Activate 60% of new users** to create and complete their first workout within 7 days of signup
2. **Achieve 70% session completion rate** (started sessions that are completed, not cancelled)
3. **Keep average logging time under 30 seconds per set** to prevent complexity-driven churn
4. **Drive 35% of new users** to start with a pre-built template (vs. blank workout)
5. **Replace all mock data** on the dashboard with real workout statistics within the MVP scope

## User Stories

### Primary Persona: Beginner Gym-Goer (18-34, Brazil)

| # | User Story | Priority |
|---|-----------|----------|
| US1 | As a beginner, I want to choose a ready-made workout in my language so that I don't have to figure out what exercises to do | Critical |
| US2 | As a beginner, I want clear instructions during my workout so that I perform exercises correctly | Critical |
| US3 | As a beginner, I want to log my sets simply (weight + reps) so that I can track progress without complexity | Critical |
| US4 | As a beginner, I want a timer telling me when to start the next set so that I rest the right amount | Critical |
| US5 | As a beginner, I want to see what I accomplished after finishing so that I feel motivated to continue | High |
| US6 | As a beginner, I want my past workouts listed so that I can see my consistency | High |
| US7 | As a beginner, I want to create a custom workout when I'm ready so that I can personalize my routine | High |

### Secondary Persona: Returning User (has experience, wants speed)

| # | User Story | Priority |
|---|-----------|----------|
| US8 | As an experienced user, I want to skip the tour and create a blank workout directly so that I don't waste time | Medium |
| US9 | As an experienced user, I want my last session's weights pre-filled so that I log faster | High |
| US10 | As an experienced user, I want to optionally rate my session (1-5) so that I can track how I felt | Medium |

### Edge Cases

| # | Scenario | Handling |
|---|----------|----------|
| EC1 | User closes browser mid-session | Session state saved in localStorage; recovery prompt on return |
| EC2 | User has no exercises in their workout | Prevent session start; show "add exercises first" prompt |
| EC3 | User cancels an active session | Session marked as "skipped"; no logs saved; user can restart |
| EC4 | User is on a slow/no internet connection (gym basement) | PWA caches exercise catalog; logging works offline; syncs when online (V2) |

## Core Features

### F1: Guided Workout Creation (Critical)

Users create workouts by selecting exercises from the existing catalog. After registration or clicking "Novo Treino," users see a template choice screen with 3 pre-built options in pt-BR. They can choose a template (pre-fills the workout form) or create from scratch.

**Functional requirements:**
- Template selection screen with 3 cards: Full Body (3x/week), Push/Pull/Legs (6x/week), Upper/Lower (4x/week)
- Each template card shows: name, description in pt-BR, muscle groups targeted, estimated duration, exercise count
- Templates are system-provided, non-customizable in V1
- Blank workout option available for experienced users (skip tour)
- Workout form fields: name, description (optional), type (strength/cardio/hiit/flexibility/mixed), difficulty (beginner/intermediate/advanced), estimated duration
- Exercise selector with search (reuses existing `ExerciseSearchBar`), filters (muscle group, equipment), and compact card display
- Per exercise configuration: sets (number), reps (number, optional), rest period (seconds), notes (optional)
- Save, edit, and delete workouts
- Exercise ordering via drag-and-drop or manual reordering buttons

### F2: Workout Session Execution (Critical)

Users run a workout session with real-time set logging. The interface is mobile-first with large tap targets, minimal typing, and auto-populated fields from the user's last session of the same exercise.

**Functional requirements:**
- Start session from workout detail page or dashboard
- Display exercises in order with current exercise highlighted
- Per set logging: weight (number), reps (number), RPE (1-10, optional, hidden behind expandable section)
- Auto-fill weight and reps from the user's last completed session of that exercise
- Add/remove sets per exercise (default = configured sets from workout)
- Mark individual sets as completed; visual progress indicator (e.g., checkmark, strikethrough)
- Built-in rest timer between completed sets (configurable per exercise, default 60s)
- Timer displays countdown with visual/audio cue when complete
- Skip rest timer manually
- Complete session button always accessible at bottom
- Cancel session option with confirmation dialog (marks as "skipped")
- Session survives page reload via localStorage checkpoint

### F3: Post-Workout Feedback & Actionable Insights (High)

After completing a session, users see a summary screen with stats and at least one actionable insight.

**Functional requirements:**
- Summary stats: total duration, total volume (weight × reps across all sets), exercises completed, sets completed
- 1 actionable insight selected from 5 rules (see Insight Rules below)
- 1-5 star rating option (optional, skip allowed)
- "Done" button returns to dashboard
- Dashboard stats updated immediately after completion

**Insight Rules (V1):**
1. **Muscle group frequency:** "You trained {muscle} {N}x this week — consider 48h rest between sessions."
2. **Volume comparison:** "You lifted {N}% more volume than last time — great progress!"
3. **Duration vs estimate:** "Your workout took {N}min ({N}min over estimate) — consider adjusting rest times."
4. **New PR celebration:** "New personal record: {exercise} — {weight}kg for {reps} reps! 🎉"
5. **Consistency streak:** "You've worked out {N} days in a row — keep it up!"

### F4: Workout List & Detail Pages (High)

Index page listing all user workouts with search/filter. Detail page showing exercises, sets, and options to start a session, edit, or delete.

**Functional requirements:**
- Workout list with search by name
- Filter by type (strength/cardio/hiit/flexibility/mixed), difficulty
- Sort by name, last used, created date
- Empty state with CTA to create first workout or choose template
- Each workout item shows: name, type badge, exercise count, estimated duration, last used date
- Detail page: full exercise list with sets/reps/rest, "Start Workout" button (prominent), edit/delete options
- Templates and user-created workouts displayed in the same list (templates marked with badge)

### F5: Session History (High)

Chronological list of completed workout sessions with key metrics.

**Functional requirements:**
- Session list sorted by date (newest first)
- Each session item shows: date, workout name, duration, total volume, exercise count, completion badge
- Tap to view session detail: all logged sets per exercise
- Filter by workout, date range
- Empty state for users with no sessions ("Complete your first workout to see history here")

### F6: Dashboard Integration (High)

Replace all mock data on the dashboard with real workout statistics.

**Functional requirements:**
- Stat cards: weekly workout count (vs. goal of 5), current streak (consecutive days with workouts), total volume (all-time), total sessions (all-time)
- "Today's Workout" section: shows a scheduled workout if exists, otherwise shows the user's most recently used workout, otherwise shows a recommended template
- Weekly goal progress bar with percentage
- Recent activity list: last 3 completed sessions with date, workout name, brief stats
- All data sourced from `useWorkouts` composable (no hardcoded values)

## User Experience

### User Journey

**First-time user (beginner):**
1. Registers at `/auth/register` → redirected to `/profile/setup` (brief: name, fitness goal, experience level)
2. Redirected to `/workouts/create` → sees template selection screen with brief intro tour ("Choose how to start: a ready-made plan or build your own")
3. Selects a template (e.g., "Full Body") → workout form pre-filled with exercises, sets, reps
4. Reviews and saves workout → redirected to workout detail page
5. Taps "Iniciar Treino" → enters session execution screen
6. Logs first set (weight auto-filled from template defaults) → completes set → rest timer starts
7. Timer ends → logs next set → continues through all exercises
8. Completes session → sees feedback screen with stats + insight → rates session → returns to dashboard

**Returning user (regular):**
1. Opens app → dashboard shows real stats, today's workout suggestion, recent activity
2. Taps "Novo Treino" → template selection screen → taps "Criar do zero" (skip templates)
3. Creates custom workout → saves → starts session
4. Logs sets (auto-filled from last session) → completes → sees feedback → back to dashboard

**Quick session (experienced):**
1. Opens app → goes to "Meus Treinos" → selects existing workout → taps "Iniciar"
2. Logs sets quickly (all auto-filled) → completes → done

### UI/UX Considerations

- **Mobile-first:** All primary interactions (logging, timer, navigation) must work with one hand on a phone held at arm's length (gym context)
- **Tap targets:** Minimum 44x44px for all buttons used during session execution
- **Minimal typing:** Weight/reps use numeric keypad; no text input during session
- **Visual hierarchy:** Current exercise and current set are visually prominent; completed sets are dimmed with checkmark
- **Timer visibility:** Rest timer is large, centered, with countdown animation; audio/vibration cue at zero
- **Error states:** Network errors during logging are silently queued (localStorage) and retried
- **Accessibility:** Color contrast meets WCAG AA; timer has visual + audio feedback for hearing/vision impaired users
- **Loading states:** Skeleton screens for workout list, exercise catalog search, and session history

### Onboarding

- Tour at `/workouts/create` is a single screen with 3 template cards and a "Criar do zero" button
- Brief intro text: "Comece com um plano pronto ou crie o seu"
- Templates displayed as selectable cards with descriptions in pt-BR
- "Pular tour" link visible at all times → goes directly to blank workout form
- Tour shown only on first visit; returning users see direct workout creation

## High-Level Technical Constraints

| Constraint | Description |
|-----------|-------------|
| **Existing Supabase schema** | `workouts`, `workout_exercises`, `workout_sessions`, `workout_logs` tables already defined with RLS policies — no new migrations required for V1 |
| **Existing composables** | `useWorkouts` (9 methods), `useExercises` (paginated catalog), `useToast` (notifications) already implemented |
| **Existing UI components** | 17 UI components + 16 catalog components available; `WorkoutCard` already exists |
| **PWA capability** | App is a PWA — service worker must cache exercise catalog for offline viewing; session logging persistence via localStorage |
| **Auth protection** | All `/workouts/*` routes protected by existing `middleware/auth.ts` |
| **Type safety** | TypeScript interfaces `Workout`, `WorkoutExercise`, `WorkoutSession`, `WorkoutLog`, `WorkoutForm` already defined in `types/index.ts` |
| **Performance target** | Session logging interaction < 300ms response time (user taps "complete set" → visual confirmation) |
| **Data privacy** | All workout data is user-scoped via RLS (`user_id` column); no shared workouts in V1 |

## Non-Goals (Out of Scope)

- **Scheduled workouts with reminders** — `scheduled_workouts` table exists but notification infrastructure is deferred to V2
- **Progress charts & analytics** — Need accumulated data first; V2
- **Social sharing (workouts, achievements)** — Requires share infrastructure and external API integration; V3
- **Full offline mode** — Service worker caching + local DB sync with conflict resolution; V2
- **Custom template creation/editing** — V1 templates are system-provided only (3 presets); V2
- **RPE-based auto-progression** — Requires 4+ weeks of user data; V3
- **Superset/circuit support** — Basic linear workouts only in V1; V2
- **Profile setup page** (`/profile/setup`) — Required for onboarding flow but is a separate effort; tracked as dependency
- **Wearable integration** (heart rate, step count) — Not in V1 scope; future consideration

## Phased Rollout Plan

### MVP (Phase 1) — Core Workout Management

**Included:**
- F1: Guided Workout Creation (3 templates in pt-BR + blank option)
- F2: Workout Session Execution (logging with auto-fill + rest timer)
- F3: Post-Workout Feedback (5 insight rules + optional rating)
- F4: Workout List & Detail Pages
- F5: Session History (list + detail view)
- F6: Dashboard Integration (replace all mock data)

**Success criteria to proceed to Phase 2:**
- 60% of new users complete ≥1 workout within 7 days
- 70% of started sessions are completed (not cancelled)
- Average logging time < 30 seconds per set
- Zero critical UX bugs reported (e.g., lost session data, broken timer)

### Phase 2 — Enhancement & Retention

**Planned:**
- Progress charts (volume over time, PR tracking)
- Scheduled workouts with push notification reminders
- Custom template creation and editing
- Superset/circuit support
- Full offline mode with sync conflict resolution

**Success criteria to proceed to Phase 3:**
- 40% of MAUs log 2+ sessions per week
- 25% of users adopt scheduled workouts
- Session completion rate maintained at ≥70%

### Phase 3 — Differentiation

**Planned:**
- RPE-based auto-progression (load recommendations based on trends)
- Social sharing (share workout summaries, follow other users)
- Wearable integration (heart rate monitoring during sessions)
- Workout marketplace (share/sell template programs)

**Long-term success criteria:**
- 50% of MAUs are weekly active loggers
- User-generated content (shared workouts) grows 10% month-over-month
- NPS score > 40

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Workout Creation Rate | 60% of new users within 7 days | % of users (signup date ≤ 7 days ago) with ≥1 workout record |
| Session Completion Rate | 70% | COUNT(status='completed') / COUNT(status IN ('completed','skipped')) |
| Weekly Active Loggers | 40% of MAUs | % of users with ≥2 completed sessions in rolling 7-day window |
| Average Logging Time | < 30s per set | Median time from set input focus to set completion (client-side timing) |
| Template Adoption | 35% of new users | % of first workouts created from templates vs. blank |
| Dashboard Data Accuracy | 100% of stat cards show real data | Zero hardcoded values remaining in dashboard page |

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Onboarding tour is too long** → users abandon before first workout | High | Tour must be < 30 seconds; "Pular" button always visible; single screen (no multi-step wizard) |
| **Logging is too slow** (> 30s/set) → 40% churn risk as per market data | High | Auto-fill from last session; numeric keypad only; minimal UI chrome during session; test with real users |
| **Templates don't match user goals** (e.g., user wants cardio, only strength templates) | Medium | Clear template descriptions show applicability; blank option always available; expand to 5+ templates in V2 |
| **Competitors (Hevy, Strong) already offer superior logging** → users switch | Medium | Differentiate with actionable insights and pt-BR localization; Hevy/Strong are English-first |
| **Users lose session data on page reload** → trust broken, churn | High | localStorage checkpoint saves session state every 10 seconds; restore prompt on return |
| **Profile setup (`/profile/setup`) not built** → onboarding flow broken | Medium | `/profile/setup` is a dependency; must be built before MVP launch or onboarding redirect changed |

## Architecture Decision Records

- [ADR-001](adrs/adr-001.md) — Escopo V1: Core Workout Management (creation, execution, history + basic templates + actionable feedback)
- [ADR-002](adrs/adr-002.md) — Guided First Workout onboarding approach for beginner activation

## Open Questions

1. **Profile setup dependency:** Is `/profile/setup` being built as a separate PRD? If not, the onboarding redirect from `/auth/register` needs to change to `/workouts/create`.
2. **Audio for rest timer:** Should the timer audio cue use the Web Audio API (no dependencies) or a simple `<audio>` element? Does the PWA need permission for audio on iOS Safari?
3. **Insight rule priority:** When multiple insight rules apply to a single session, which rule takes priority? (Recommendation: PR celebration > volume improvement > muscle frequency > duration > streak)
4. **Template exercise selection:** Should the 3 templates use exercises that exist in the current Supabase `exercises` table, or should we seed specific exercises? (Need to verify exercise catalog coverage.)
5. **Weekly goal default:** The dashboard currently shows a weekly goal of 5 workouts. Should this be configurable per user in V1, or a fixed default? (Recommendation: fixed default of 5, configurable in V2.)
6. **Data cleanup:** Are there any test/mock workout records in the Supabase database that need to be cleared before launch?
