# Proposal: Mobile Route Footer Layout

## Problem

Route detail pages show an oversized mobile previous/next band whose purpose is unclear, especially when one side is empty. The shared footer keeps two logos horizontal on narrow screens, reducing balance.

## Goals

- Make mobile previous/next navigation compact and clear.
- Stack and center footer logos on mobile.
- Preserve desktop layout and route behavior.
- Keep the slice limited to `EtapaNav.astro` and `Pie.astro` if possible.

## Non-Goals

- Redesign route content, maps, downloads, or page order.
- Create separate mobile/desktop navigation components.
- Change footer assets or desktop footer spacing.

## Scope

### In Scope
- Add concise purpose context to `EtapaNav`.
- Stack/compact mobile links and avoid placeholder space.
- Stack and center footer logos on mobile.

### Out of Scope
- Direct edits to `src/pages/etapas/*.astro` unless unavoidable.

## Constraints

- Keep Spanish UI copy short and clear.
- Keep desktop visually equivalent from `md` upward.
- Verify with `npm run build` and manual responsive review.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `site-quality`: Improve mobile navigation/footer readability and accessibility while preserving public behavior.

## Approach / First Implementation Slice

Apply the exploration recommendation: keep centralized components, add a short visible route-navigation label, make `EtapaNav` compact and stacked on mobile with `md:` restoring the two-column desktop layout, and make `Pie` mobile `flex-col items-center justify-center` with desktop row/spacing restored at `md`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/EtapaNav.astro` | Modified | Mobile clarity, spacing, placeholders. |
| `src/components/Pie.astro` | Modified | Mobile stacked centered logos. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Label copy feels noisy | Medium | Keep it short; review screenshots. |
| First/last route alignment regresses | Low | Review etapa 01 and 05. |
| Shared footer affects non-route pages | Medium | Review home, list, and one route. |

## Rollback Plan

Revert `EtapaNav.astro` and `Pie.astro`; no data, assets, or route files should change.

## Dependencies

- Existing Tailwind v4 utilities and Astro component structure.

## Success Criteria / Acceptance Criteria

- [ ] Mobile route nav communicates purpose and uses less space.
- [ ] Missing previous/next links do not reserve confusing mobile space.
- [ ] Footer logos stack vertically and center on mobile.
- [ ] Desktop route nav and footer remain equivalent.
- [ ] `npm run build` passes; manual review covers mobile and desktop.
