# Tasks: Mobile Route Nav Separator

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 10-25 additions/deletions |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR; keep `src/components/EtapaNav.astro` as one focused slice |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add the mobile-only decorative separator in the shared etapa nav | PR 1 | `src/components/EtapaNav.astro`; insert one conditional sibling divider between the existing previous and next render blocks, with `aria-hidden="true"` and `md:hidden`, while keeping desktop markup and link order unchanged. |
| 2 | Verify the separator appears only where both links exist | PR 1 | No file edits; confirm etapa 03 shows the divider on mobile and etapa 01 / etapa 05 do not render an orphan separator. |
| 3 | Confirm desktop equivalence and build health | PR 1 | No file edits; review etapa 01, etapa 03, and etapa 05 at `md`+ plus `npm run build` to ensure the layout stays equivalent. |

## Phase 1: Scope and insertion point

- [x] 1.1 Confirm `src/components/EtapaNav.astro` is the only file to change and place the divider directly between the existing previous and next conditional blocks inside the current flex container.
- [x] 1.2 Preserve the current previous/next link order, labels, and placeholder behavior so the only new element is a decorative separator on mobile.

## Phase 2: Core implementation

- [x] 2.1 Update `src/components/EtapaNav.astro` to render `{prev && next && (<div aria-hidden="true" class="my-1 h-[4px] w-full bg-white/20 md:hidden"></div>)}` only when both route links exist.
- [x] 2.2 Keep the divider non-interactive and desktop-hidden so the `md`+ row layout remains visually equivalent to the current presentation.

## Phase 3: Verification

- [x] 3.1 Run `npm run build` and confirm the Astro/Tailwind build passes after the nav change.
- [x] 3.2 Responsive-check `src/pages/etapas/etapa-03.astro` on mobile to confirm one separator appears between stacked links.
- [x] 3.3 Responsive-check `src/pages/etapas/etapa-01.astro` and `src/pages/etapas/etapa-05.astro` on mobile to confirm no orphan separator appears when only one link is present.
- [x] 3.4 Responsive-check etapa 01, etapa 03, and etapa 05 at `md` and above to confirm the divider stays hidden and desktop behavior is preserved.

## Phase 4: Cleanup / Diff review

- [x] 4.1 Recheck the final diff scope to ensure only `src/components/EtapaNav.astro` changes before handing off to apply.
