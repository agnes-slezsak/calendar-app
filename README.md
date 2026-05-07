# Calendar App

A 7-day calendar built with React + TypeScript.

## Running the app

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Other scripts:

```bash
npm run typecheck   # TypeScript check (no emit)
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Vitest unit tests
npm run build       # Production build
```

## What it does

- Displays appointments for the week of **Apr 7–13, 2025** loaded from a mock API
- Shows a 7-day grid (Mon–Sun, 08:00–20:00, hourly)
- Multi-hour appointments span their rows visually — title shown once at the start row, colored block on continuation rows
- Hours with no appointments on any day are collapsed into a single row with a button to expand; clicking the first expanded row collapses it back

## Component overview

```
App
└── CalendarView          — grid state (expandedGroups), renders row components
    ├── CalendarHeader    — empty time-label cell + 7 day headers (Mon 07/04 etc.)
    ├── CollapsedHoursRow — button row for a collapsed hour group (e.g. 12:00 – 14:00 ▼)
    └── TimeSlotRow       — one hour row: time label + 7 AppointmentCells
        └── AppointmentCell — single cell: title, continuation block, or empty
```

Utilities (`src/utils/calendarUtils.ts`):

- `getWeekDays()` — produces the 7 ISO date strings for the week
- `computeHourGroups(appointments)` — derives visible and collapsed hour groups purely from appointment data
- `getAppointmentForCell(appointments, date, hour)` — range-based lookup (`startHour <= hour < endHour`)

Data fetching (`src/hooks/useAppointments.ts`):

- Wraps `fetchAppointments()` and exposes `{ appointments, loading, error }`

## Design decisions

- **Vite** — faster dev server, modern standard over CRA
- **No external state library** — all state is local; `useState` is sufficient for this scope
- **No CSS framework** — wireframe-level per spec, minimal dependencies
- **`useMemo` for `computeHourGroups`** — memoized so expanding/collapsing groups doesn't recompute hour groups on every render
- **`Appointment` type imported from `mockApi.ts`** — single source of truth, never redefined across files

## Trade-offs

- **Hardcoded week start (`2025-04-07`)** — `getWeekDays()` accepts a `weekStart` parameter; defaulting to the current week would be a one-line change at the call site.
- **Tests cover only the pure utility functions** — pure functions are the highest-ROI target: deterministic, easy to assert, no DOM setup. Component-level tests for the expand/collapse interaction (via React Testing Library) would be the next addition.
- **Accessibility** — semantic `<button>` elements throughout; production would add `aria-expanded` on collapsed rows and richer labels on appointment cells.
