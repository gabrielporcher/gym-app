This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Project

Personal gym training app: a single user creates training plans, logs sessions (sets, reps, kg), and gets daily/weekly/monthly dashboards of muscle volume. Offline-first; cloud sync comes later.

- Targets: **iOS and Android only**. Do not add web-specific code or `.web.tsx` variants.
- Languages: code identifiers, file names and commits in **English**; UI strings in **pt-BR**; OpenSpec artifacts in pt-BR.
- System design, domain glossary and architectural decisions: [`docs/architecture.md`](docs/architecture.md). Read it before planning or implementing any feature. Use its glossary terms in code (`WorkoutPlan`, `WorkoutDay`, `Session`, `Set`, `Exercise`, ...).
- Planned work follows OpenSpec (`openspec/`): proposal → specs → design → tasks → implement.

## Stack

- Expo Router (navigation), TypeScript (strict).
- Local database: `expo-sqlite` + Drizzle ORM (schema, migrations, typed queries).
- Remote backend (future): Supabase. Not used until the cloud-sync change.
- Styling: React Native `StyleSheet` + design tokens from `src/constants/theme.ts`. No styling libraries.
- Tests: `jest-expo`.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint, typecheck and tests before declaring any task done.

## Folder structure

```
src/
  app/                  Expo Router routes only. Screens are thin: compose components + hooks.
  components/
    ui/                 Primitives with no business logic: Text, Button, Card, ListItem, Input...
    <domain>/           Composite/functional components grouped by domain
                        (workout-plan/, session/, exercise/, dashboard/)
  domain/               Pure TypeScript business logic (volume math, next-workout suggestion...)
  db/                   Drizzle schema, migrations, client, catalog seed data
  repositories/         Data access per entity. The ONLY layer that talks to the db.
  hooks/                React hooks wiring screens to repositories and domain logic
  constants/            Design tokens (theme.ts) and app constants
  lib/                  Generic, domain-agnostic utilities
```

Dependency rules (an arrow means "may import"):

```
app --> components, hooks
components/<domain> --> components/ui, hooks, domain (types/pure functions)
components/ui --> constants only
hooks --> repositories, domain
repositories --> db, domain (types)
domain --> nothing from React, React Native, Expo or db
```

- Never query the database from screens, components or hooks directly — go through `repositories/`.
- Never put business rules in `src/app/` or `components/ui/`.
- File names: `kebab-case.tsx` / `kebab-case.ts`. Components: named exports in PascalCase. Hooks: `use-*.ts` exporting `useXxx`.
- Use the `@/` path alias for imports from `src/`.

## Components

Before creating a screen or component:

1. Check `components/ui/` and `components/<domain>/` for something that already does the job — reuse or extend it (new prop/variant) instead of duplicating.
2. If a piece of UI will appear in more than one place, or a screen file grows past what fits on one screen of reading, extract it into a component.
3. Decide where it belongs:
   - **`components/ui/`**: generic, visual, no knowledge of the domain, data comes only through props. Would make sense in any app.
   - **`components/<domain>/`**: knows domain concepts (e.g. `SetRow`, `WorkoutDayCard`, `MuscleVolumeChart`), may use hooks.
4. Keep components presentational where possible: data loading and mutations live in hooks; components receive data and callbacks.

## Styling and design tokens

- Never hardcode spacing, font sizes, font weights, radii or colors. Use tokens from `src/constants/theme.ts` (`Spacing`, `Colors`, typography tokens). If a needed value is missing, add a token instead of inlining a number.
- Text is always rendered through the `ui` text primitive (theme-aware), not raw `Text` with ad-hoc styles.
- Support light and dark mode through theme colors.

## Data conventions

- Primary keys are UUIDs generated on the client. Never use autoincrement ids.
- Every syncable table has `created_at`, `updated_at` and `deleted_at` (soft delete — never hard-delete user data) and an `owner_id`.
- Schema changes always go through a Drizzle migration; never edit an applied migration.
- Sessions store what was actually performed (exercise, sets, reps, kg); they must not depend on the current state of the plan to be read correctly.
- Weights are stored in kilograms.

## Testing

- Every function in `src/domain/` must have unit tests (`*.test.ts` next to the file).
- When a change has OpenSpec scenarios that map to domain logic, write tests that mirror those scenarios.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
- When a design decision becomes durable (affects more than the current change), record it in `docs/architecture.md`.
