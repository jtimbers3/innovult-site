# Oscar Night Couples MVP

A polished MVP web app for couples/friend groups to predict Academy Awards winners, score ballots, and track standings over multiple years.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth credentials auth

## Setup
1. `cp .env.example .env` and update values.
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run prisma:seed`
5. `npm run dev`

## MVP Route Map
- `/` landing
- `/signup`, `/login`
- `/dashboard`
- `/teams`
- `/groups`
- `/ballot/[year]`
- `/scores`
- `/history`
- `/standings`
- `/trivia`
- `/admin`

## Architecture Summary
- `src/app` contains pages + API routes.
- `src/lib` contains database, auth, and scoring business logic.
- `src/lib/scoring/engine.ts` keeps server-validated scoring modular.
- `prisma/schema.prisma` defines configurable categories/nominees per awards year.

## UI Components (v1)
- `SiteNav` top navigation
- Card-based stat widgets (dashboard)
- Group/team creation forms
- Ballot category cards
- Leaderboard/history/standings cards
- Admin winner-entry + score-recalc controls

## Seed Data
`prisma/seed.ts` includes 2025 ceremony sample data (categories, nominees, trivia).

## Future Enhancements
- real-time score updates via websockets/Pusher
- richer ballot pick UI with confidence ranking drag/drop
- per-group custom scoring presets
- private share links and event-night animations
- optional trivia leaderboard by group/year
