# Workout Management Module

## Overview

A complete workout management module for FitPulse that enables users to create, organize, and execute personalized training sessions. It solves the product's core gap: users can currently browse exercises but cannot create or log workouts, making the app practically useless. The V1 ambition is focused — workout creation (free-form + 3 starter templates), session execution with simplified logging, and session history with actionable feedback. This transforms FitPulse from an exercise catalog into a practical workout tool.

## Problem

FitPulse currently has a dashboard with a "Novo Treino" button that links to `/workouts/create` — a route that returns 404. The backend infrastructure (Supabase schema, TypeScript types, composables) is 80% complete, but the frontend UI is entirely missing. Users who sign up expecting to manage their workouts hit a dead end, increasing churn risk from day one.

The existing exercise catalog (fully implemented with 16 components, search, filters, and pagination) is a great foundation but lacks the connective tissue that turns individual exercises into structured, repeatable training programs. Without this module, FitPulse cannot fulfill its core promise: helping users train effectively.

### Market Data

- Fitness app market: **$3.5B (2025)**, growing at **21.38% CAGR** (IMARC Group)
- Health and fitness app revenue reached **~$6B in 2025**, up 17.7% year-over-year (Business of Apps)
- **40% of users abandon** workout apps due to logging complexity (WifiTalents)
- **75% of retained users** log workouts 2+ times per week; Mondays are peak usage days
- Top apps (Hevy, Strong) win on **logging simplicity**, not feature breadth — Hevy's free tier includes unlimited workouts, full exercise library, and templates
- Sleep tracking is the fastest-growing feature in health/fitness apps (25% of apps now include mental health modules)

## Core Features

| #   | Feature | Priority | Description |
| --- | ------- | -------- | ----------- |
| F1  | Workout Creation & Management | Critical | Users create custom workouts by selecting exercises from the catalog and configuring sets, reps, and rest periods. Three starter templates (Full Body, Push/Pull/Legs, Upper/Lower) reduce onboarding friction. Templates are system-provided and non-customizable in V1. |
| F2  | Workout Session Execution | Critical | Mobile-first session runner with real-time set logging (weight, reps). Auto-fills fields from the user's last session of the same exercise. Built-in configurable rest timer between sets (default 60s). Session state persists in localStorage to survive page reload. |
| F3  | Session History with Actionable Insights | High | Chronological list of completed sessions showing date, workout name, duration, total volume, and exercise count. Post-workout feedback screen displays summary stats and at least 1 actionable insight (e.g., "You trained chest 3x this week — consider 48h rest"). User taps to rate session (1-5 stars). |
| F4  | Stats Update & Dashboard Integration | High | Replaces mock data on dashboard with real stats: weekly workout count, streak, total volume, total sessions. Updates user profile stats after each completed session. |
| F5  | Workout List & Detail Pages | High | Index page listing all user workouts with search/filter. Detail page showing exercises, sets, and option to start a session or edit/delete. |

## Integration with Existing Features

| Integration Point | How |
| ----------------- | --- |
| **Dashboard** | Replace mock stat cards with real data from `useWorkouts`. "Novo Treino" button → `/workouts/create`. "Today's Workout" section shows real scheduled workout or recommendation. |
| **Exercise Catalog** | Workout creation reuses `ExerciseSearchBar`, `ExerciseFilterChips`, and `ExerciseCardCompact` for exercise selection within workout form. |
| **Sidebar Nav** | `/workouts` route already linked in `AppLayout.vue` — just needs pages to be created. |
| **Auth Middleware** | All `/workouts/*` routes already protected by `middleware/auth.ts`. |
| **Design System** | All UI uses existing tokens: `.card`, `.btn-primary`, `.badge`, `.stat-card`, gradients, animations. |
| **Supabase Schema** | `workouts`, `workout_exercises`, `workout_sessions`, `workout_logs` tables ready — no migration needed. RLS policies in place. |
| **Composables** | `useWorkouts.ts` (CRUD, sessions, logs), `useExercises.ts` (catalog), `useToast.ts` (notifications), `useAuth.ts` (profile stats update). |

## KPIs

| KPI | Target | How to Measure |
| --- | ------- | -------------- |
| Workout Creation Rate | 60% of new users create ≥1 workout within 7 days of signup | % of users with created_at ≤ 7 days ago AND ≥1 workout record |
| Session Completion Rate | 70% of started sessions are completed | COUNT(status='completed') / COUNT(status IN ('completed','skipped','cancelled')) |
| Weekly Active Loggers | 40% of MAUs log 2+ sessions per week | % of users with ≥2 completed sessions in a rolling 7-day window |
| Average Logging Time | < 30 seconds per set logged | Median time from set input focus to log submission (sampled via client-side timing) |
| Template Adoption | 35% of new users start with a template | % of workouts created with is_template=true AND user_id ≠ null on first workout |

## Feature Assessment

| Criteria | Question | Score |
| -------- | -------- | ----- |
| **Impact** | How much more valuable does this make the product? | Must Do |
| **Reach** | What % of users would this affect? | Must Do |
| **Frequency** | How often would users encounter this value? | Must Do |
| **Differentiation** | Does this set us apart or just match competitors? | Strong |
| **Defensibility** | Is this easy to copy or does it compound over time? | Strong |
| **Feasibility** | Can we actually build this? | Strong |

Leverage type: **Strategic Bet**

## Council Insights

- **Recommended approach:** Focus on speed of logging and clarity of feedback. The backend is ready — the risk is entirely in UI/UX. Mobile-first design with large tap targets, auto-fill, and minimal typing is non-negotiable. Include 3 basic templates (non-customizable) to reduce onboarding friction. Add 1 actionable insight per session as a differentiator.
- **Key trade-offs:** Templates in V1 (yes, but basic and non-customizable); offline support deferred to V2 (use localStorage as temporary safety net); RPE optional and hidden by default to reduce friction; progress charts deferred to V2 (need data first).
- **Risks identified:** Logging UI must be < 30s/set or users abandon (40% churn risk). Session state must survive page reload (mitigation: localStorage checkpoint). Rest timer notification in backgrounded PWA needs testing.
- **Stretch goal (V2+):** AI-driven auto-regulation (adjusting load based on RPE trends), progress charts, scheduled workouts with reminders, superset/circuit support, social sharing.

## Out of Scope (V1)

- **Scheduled workouts with reminders** — Schema exists but adds notification infrastructure and cron-like scheduling complexity. Defer to V2.
- **Progress charts & analytics** — No data to visualize yet; build the audience first. Defer to V2.
- **Social sharing (workouts, achievements)** — Requires share infrastructure, OAuth tokens, and external API integration. Defer to V3.
- **Full offline mode** — Service worker caching + local DB sync is complex and requires conflict resolution. Defer to V2.
- **Custom template creation/editing** — Scope creep; V1 templates are system-provided only (3 presets). Defer to V2.
- **RPE-based auto-progression** — Needs 4+ weeks of user data to be accurate. Defer to V3.
- **Superset/circuit support** — Advanced feature; basic linear workouts are sufficient for V1. Defer to V2.

## Architecture Decision Records

- [ADR-001](adrs/adr-001.md) — Escopo V1: Core Workout Management (creation, execution, history + basic templates + actionable feedback)

## Open Questions

1. **Rest timer notification:** Should the rest timer trigger a browser notification when the app is backgrounded? (PWA capability — needs testing on iOS Safari and Android Chrome)
2. **Template localization:** Should the 3 starter templates have descriptions in Portuguese (pt-BR) since the app targets Brazilian users?
3. **Insight engine scope:** How many unique insight rules should V1 support? (Recommendation: 5-7 rules minimum for variety)
4. **Data cleanup:** Are there any existing workout records in the Supabase database from testing that need cleanup before launch?
5. **Insight rule examples:** What specific insight rules should V1 ship with? (e.g., muscle group frequency, volume spikes, PR celebrations, rest day reminders)
