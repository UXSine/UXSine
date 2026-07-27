# Becoming

A training-partner app for behavior change, grounded in habit-formation science.
Built to the spec in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

- **Frontend:** Vite + React + Tailwind (matches the other UXSine apps)
- **Backend:** Supabase (Postgres + anonymous auth + Row-Level Security)
- **Data model:** WOOP profile, daily logs, SRBAI pulses → automaticity curve

## Running the data layer

The app works out of the box with **no backend** — it stores everything in
`localStorage`. That's what the deployed GitHub Pages build uses until Supabase
credentials are supplied.

To switch on the real backend:

1. Create a Supabase project.
2. In the SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).
3. Enable anonymous sign-ins: **Authentication → Providers → Anonymous sign-ins → ON**.
4. Copy `.env.example` to `.env.local` and fill in:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   For the deployed build, set these as repository/Actions variables and pass
   them to the Vite build step.

The anon key is meant to ship in the client bundle; RLS (scoped to
`auth.uid()`) is what keeps each device's data private.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build   # outputs to dist/
```

## What's implemented

- WOOP onboarding (Wish / Outcome / Obstacle / Plan)
- Today view — the one-tap ~90% surface
- SRBAI pulse — four-item, 5-point tap-scale, sub-20s
- Automaticity curve — midnight line, plateau band, dotted threshold, no miss marks
- Phase glyphs — ignition / maintenance / break / decayed-retry / graduation
- Miss-response flow — identity anchor → attribution → plan-forward, on cloth
- Weekly review — mechanism-based insight + register-flex A/B toggle

## Notes / open items

Carried from the design system's own open-items list:

- SRBAI item wording is placeholder-in-the-right-shape; confirm against the
  validated instrument before ship.
- The automaticity "typical plateau range" band is a single universal band in v1.
- Dark mode is deferred — the system already ships light-with-dark-identity-surfaces.
