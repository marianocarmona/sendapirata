# Tasks: Mobile Route Footer Layout

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 60-120 additions/deletions |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR; if scope expands, split `EtapaNav.astro` and `Pie.astro` into separate slices |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Make route navigation compact and explicit on mobile while restoring `md:` desktop balance | PR 1 | `src/components/EtapaNav.astro`; add a short visible purpose label, stack mobile controls, hide empty mobile placeholders, and keep the current two-column layout from `md` upward. |
| 2 | Stack and center shared footer logos on mobile without changing desktop row behavior | PR 1 | `src/components/Pie.astro`; switch the logo wrapper to a vertical mobile layout with centered alignment and restore the current row/spacing at `md` and above. |
| 3 | Verify responsive behavior and build output against the spec scenarios | PR 1 | No file edits; confirm etapa 01, etapa 03, etapa 05, `/`, and `/etapas` at mobile and desktop widths plus `npm run build`. |

## Phase 1: Route Navigation Update

- [x] 1.1 Update `src/components/EtapaNav.astro` mobile markup to add a short visible purpose label (for example, `Navega por etapas`), connect it to `<nav>` via `aria-labelledby`, and keep the existing per-link `aria-label`s intact.
- [x] 1.2 Rework `EtapaNav.astro` mobile layout so previous/next controls stack vertically, use compact spacing, and hide inert placeholders on narrow screens; restore the existing two-column balance from `md` upward.
- [x] 1.3 Preserve first/last etapa behavior in `EtapaNav.astro` by ensuring etapa 01 and etapa 05 do not reserve misleading empty space on mobile, while desktop still maintains the current visual balance.

## Phase 2: Shared Footer Update

- [x] 2.1 Update `src/components/Pie.astro` logo row to stack logos vertically and center them on mobile using responsive Tailwind utilities, without altering image sources or copy.
- [x] 2.2 Restore the current footer row layout and spacing from `md` upward in `Pie.astro`, keeping home, listing, and route pages visually equivalent on desktop.

## Phase 3: Verification

- [x] 3.1 Run `npm run build` and confirm the Astro build succeeds after the layout changes.
- [x] 3.2 Responsive-check `src/pages/etapas/etapa-01.astro` at mobile and `md` widths to confirm the nav is compact, readable, and non-empty when the previous link is absent.
- [x] 3.3 Responsive-check `src/pages/etapas/etapa-03.astro` as the middle-route control case to confirm the stacked mobile nav and preserved desktop two-column layout.
- [x] 3.4 Responsive-check `src/pages/etapas/etapa-05.astro` at mobile and `md` widths to confirm the next link absence does not leave misleading space.
- [x] 3.5 Responsive-check `/` and `/etapas` to confirm `Pie.astro` stacks and centers logos on mobile while desktop remains equivalent on the listing and home pages.

## Phase 4: Cleanup / Review Notes

- [x] 4.1 Recheck the final diff scope to ensure only `src/components/EtapaNav.astro` and `src/components/Pie.astro` changed before apply.
