# Focus

A distraction-free Pomodoro focus timer. Work in focused sprints, take short
breaks, and a longer break after every few rounds.

## Features

- Focus / short break / long break modes with a circular progress ring
- Configurable durations and rounds-before-long-break
- Optional auto-start and an end-of-timer chime (Web Audio, no assets)
- A task field to name what you're working on
- Daily focus-session counter (resets each day)
- Space bar to start/pause; settings persist in `localStorage`
- Add `?reset` to the URL to clear saved settings

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Part of the [UXSine](../../) monorepo; deployed to GitHub Pages under `/focus/`.
