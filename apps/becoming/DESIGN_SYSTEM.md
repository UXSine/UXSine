# Becoming — Design System
*A training-partner app for behavior change, grounded in habit-formation science.*

> **Companion artifact:** `becoming-design-system-interactive.html` — live tokens, interactive mockups of every Layer 3 component, and the working register-flex demo. The CSS in that file (especially the `.cloth` texture and motion values) is the reference implementation; where this doc and the artifact disagree, the artifact wins.

---

## Layer 1 — Design principles

These resolve arguments before they happen. Every component, copy line, and animation in this document is tested against them.

1. **Compassion through respect, not cuteness.** We do not infantilize the user to be kind. No mascots, no baby-talk, no forced positivity. Warmth shows up as clarity and honesty, not decoration.
2. **The app shows its work.** Every score, phase transition, or claim is explainable — the user can always see the mechanism behind a number. We treat the user as an intellectual equal, not a subject to be nudged.
3. **Earned, not decorated.** Celebration and identity language ("you're becoming someone who...") appear only when the underlying data supports them. No confetti for opening the app.
4. **Design for the worst day.** The miss-response flow gets the same design attention as onboarding. Most habit apps optimize for the unbroken streak; we optimize for the return.
5. **Cite the mechanism, not just the metric.** Data visualizations and claims are grounded in the research they're drawn from (automaticity curves, SRBAI) — never an arbitrary gamified number.

---

## Layer 2 — Foundations

**The material metaphor: a well-bound book.** Dark cloth surfaces (buckram texture) carry identity and meaning — affirmations, the miss-flow anchor, graduation. Pearl paper surfaces carry daily function — the today view, the pulse, settings. The visual register tells the user which kind of moment they're in before a single word is read.

### Color — semantic tokens (final)

| Token | Hex | Semantic role |
|---|---|---|
| `paper` | `#F1EDE4` | Page background — daily-function surfaces |
| `flyleaf` | `#E4DFD2` | Secondary surface — cards, reflective tint (WOOP, weekly review) |
| `ink` | `#17130E` | Primary text, **all state indication**, and dark identity surfaces |
| `garnet` | `#521E28` | Identity + user-initiated action only — never state |
| `midnight` | `#202B3D` | Evidence + data — chart lines, citations, mechanism callouts |
| `gilt` | `#A8894F` | **Graduation only.** Gold leaf, earned. If gilt appears on any other surface, it's a bug. |
| `pearl` | `#F4F1EA` | Text on dark surfaces |

**No failure color exists.** A miss is never color-coded. State is carried entirely by shape and fill — filled ink circle for complete, open outline for not-yet, dash for paused. This applies to form validation too: errors use ink text + outline emphasis, not a hue. The AVE guardrail lives in the token system itself.

**Keep garnet and midnight separate.** Garnet is what the *user* does; midnight is what the *data* says. A screen can cite research without it reading as a brand moment, and vice versa.

### Typography (final)

| Role | Face | Use |
|---|---|---|
| Display | Libre Caslon Text, regular + italic | Identity statements, screen titles, graduation |
| Headline / Title | Libre Caslon Text | WOOP prompts, card headers ("Day 34") |
| Eyebrow | IBM Plex Mono 500, tracked 0.2em, caps | Section labels, evidence tags, dates |
| Body | IBM Plex Sans | Primary UI copy, tasks, settings |
| Data / caption | IBM Plex Mono, **tabular-nums** | Scores, chart labels, timestamps — numbers never jitter |

The division of labor: **Caslon carries meaning, Plex carries function.** The serif appears only where identity lives; everything operational stays in the Plex family. All three are on Google Fonts — no licensing work needed for v1.

### Texture

Buckram/linen texture appears **only on dark cloth surfaces**, never on paper (where it would compete with data). Implementation: the `.cloth` class in the companion artifact — SVG `feTurbulence` grain + a 3px repeating weave, ≤6% opacity, pure CSS, no image assets.

### Spacing, radius

- **Spacing:** 8pt base grid (4/8/12/16/24/32/48/64). Today view uses the tight end (8/12/16) to stay glanceable; WOOP and weekly review use the loose end (32/48/64) to slow the pace deliberately.
- **Radius:** controls 12px, cards 20px, today-widget 28px, pills full-round.

### Motion stance

Two tiers, matching the register-flex decision:

**Structural motion (always on, never A/B'd).** Transitions, feedback affordances, phase-state changes. 150–220ms, spring (stiffness ~300, damping ~30), no bounce or overshoot — overshoot reads as playful/gamified, which this app avoids everywhere except the swappable layer below. Examples: checkmark fill on completion, phase-badge crossfade, screen push/pop.

**Celebratory motion (the swappable A/B layer).** Milestone moments only — graduation, automaticity threshold crossings, weekly-review highlights. Two variants, both defined in Layer 5, both required to remain informational per the SDT guardrail: motion may get more expressive, but it never substitutes for real data on screen.

---

## Layer 3 — Component inventory

Ordered by daily exposure, per the build spec.

### 1. Today view (one-tap, ~90% of surface area)

Designed as a widget, not a screen — because for most sessions, it *is* the screen. Single card, today-widget radius (28px), `paper` background. One primary tap target (the behavior's name in Title type + a large filled/outline circle affordance), one secondary line of context (streak-free — see automaticity note below instead of a day count), and nothing else. No navigation chrome competing for the tap. If the user does nothing else in a session, this screen alone should feel complete.

### 2. Automaticity curve (the novel component)

Explicitly not a streak flame. The science: automaticity (measured via periodic SRBAI pulses) rises along an asymptotic curve toward "effortless" — and, unlike a streak, a single miss does not reset it to zero.

Design as a smooth line chart, x-axis in *pulse instances* (not calendar days — this is what keeps a miss from visually reading as a gap or break), y-axis 0–100 automaticity. Render in `midnight` (the evidence color — never `garnet`), on a `paper` field, minimal gridlines. Include a shaded "typical plateau range" band (research-informed, honest about variability — Lally et al. found plateaus anywhere from ~18 to ~254 days) rather than false precision. A horizontal dotted line marks the "automatic" threshold the curve approaches. The user's current position is a single labeled point in `ink`, tabular numeral. Misses simply don't appear as marks on this chart at all — only the pulse data does, which is the entire point.

### 3. Phase states (ignition · maintenance · break · decayed-retry · graduation)

One consistent glyph family in `ink`, differentiated by fill and form — never by hue, so no phase reads as "the bad one":

| Phase | Glyph | Meaning |
|---|---|---|
| Ignition | Outline circle, low fill | Just starting |
| Maintenance | Filled circle | Steady state |
| Break | Circle with a horizontal dash | Paused — not failed |
| Decayed-retry | Circle with a small return-arrow | Re-engaging, framed as continuation |
| Graduation | Concentric seal mark, rendered in `gilt` | Earned transition — the only gilt surface in the system (see Layer 5) |

Graduation is the one phase allowed a genuinely unique visual moment — it's the payoff for "earned, not decorated" — but it's triggered strictly by the automaticity curve crossing the threshold line, never by elapsed time alone.

### 4. Miss-response flow

Three screens on the dark `ink` cloth surface — this is a meaning moment, not a task — in strict order; the order itself is the SDT/AVE safeguard:

1. **Identity anchor.** Re-surfaces the identity statement from WOOP onboarding *before* anything about the miss. Autonomy and competence support come first.
2. **Attribution chips.** Single-tap, neutral-framed reasons (traveled, got sick, forgot, chose not to, overwhelmed). Used for the app's own pattern-recognition, never displayed as a judgment. Sub-20-second interaction, matching the SRBAI pulse's speed bar.
3. **Plan-forward.** One concrete implementation intention ("When [cue], I will [action]") — never a vague reassurance.

### 5. Weekly review

A data reflection, not a report card. No grade, no color-coded pass/fail. Shows the week's automaticity trend and any attribution-chip patterns as a mechanism-based insight ("mornings after travel were harder this week") rather than a score.

### 6. WOOP onboarding

Four screens — Wish, Outcome, Obstacle, Plan — one question per screen, generous 48/64px spacing, Libre Caslon prompts over a `flyleaf`-tinted field. Feels like guided journaling: large open text input, minimal chrome, no progress-bar gamification (a simple 1-of-4 eyebrow label is enough).

### 7. SRBAI pulse

Four items, sub-20-seconds total — the input control is the whole design problem. A single screen, four compact rows, each a 5-point horizontal tap-scale (not a slider — sliders are too slow for this budget). Selecting a row auto-advances focus to the next; the whole thing should be completable with four taps and no scrolling.

---

## Layer 4 — Voice & copy patterns

Tone is a design token here, same as color or type.

### Do / don't

| Never | Always |
|---|---|
| "Streak broken" | "One miss is data, not a verdict" |
| "You failed" | "You paused. Here's what's next" |
| "Don't give up!" | "What got in the way today?" |
| "Start over" / "Day 1 again" | "Automaticity holds steadier than streaks — you're still at [score]" |
| "You're so close, don't ruin it" | "The data still supports what you've built" |
| Exclamation-heavy praise | Specific, evidence-tied acknowledgment |

### Example copy — high-stakes moments

**Miss screen**
> *Identity anchor:* "You're someone who trains in the morning, even on hard weeks."
> *Attribution:* "What got in the way today?" [chips]
> *Plan-forward:* "When your alarm goes off tomorrow, what's the one thing that makes it easier to get up?"

**Two-miss pattern screen**
> "This is the second Tuesday in a row. Automaticity dips a little after a pattern like this — it doesn't reset. Want to adjust the plan for Tuesdays specifically?"

**Graduation**
> "Your automaticity score has held above 85 across your last three check-ins. That's closer to automatic than effortful now. Morning training has moved from a practice to a pattern."

**Taper proposal**
> "You're operating in the automatic range. Daily check-ins might be more support than this needs now — want to shift to a weekly pulse instead?"

---

## Layer 5 — Register-flex architecture

The swappable celebration layer, for A/B testing tone without touching the underlying information.

**Components with restrained/celebratory variants:**
- Graduation moment
- Automaticity threshold crossings (50 / 75 / 90)
- Weekly review headline framing

**Components with no celebratory variant — restrained only, always:**
- Today view
- Miss-response flow (all three screens)
- Phase-state badges (ignition/maintenance/break/decayed-retry)

**The guardrail:** both variants must remain informational. The celebratory variant is allowed more expressive motion (curve draw-on emphasis, a brief seal-stamp animation, haptic) and slightly warmer copy — but it always displays the same real number and the same mechanism explanation as the restrained variant. Celebration is a *delivery style* for true information, never a replacement for it. If a variant would read the same with the number blanked out, it fails the guardrail.

| | Restrained (A) | Celebratory (B) |
|---|---|---|
| Motion | 400ms crossfade + scale 0.98→1 | Same, plus emphasized curve draw-on, ~800ms cap |
| Copy | States the number and mechanism plainly | States the same number and mechanism, warmer framing |
| Haptic | None | Single light tap |
| Visual | No additional embellishment | Seal/mark resolves fully (graduation only) |

---

## Open items for next pass
- Dark mode token mapping. Note the system is already dual-register (paper surfaces + ink cloth surfaces), so a true dark mode mostly means inverting which register dominates — but don't improvise it in v1; ship light-with-dark-identity-surfaces as designed.
- Exact SRBAI item wording, to confirm the 5-point tap-scale labels match the validated instrument (the four items in the interactive artifact are placeholders in the right shape).
- Whether the automaticity chart's "typical plateau range" band should be personalized (behavior-type specific) or a single universal band for v1 — v1 default: single universal band.
