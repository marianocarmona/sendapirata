# Proposal: Mobile Route Nav Separator

## Problem

On mobile, middle etapa pages stack the previous and next navigation cards vertically with only spacing between them. The actions are valid, but the pair can read as visually merged or awkward. First and last etapas already show only one available link and should not gain extra decoration.

## Goals

- Add a subtle mobile-only separator between stacked previous and next links.
- Render the separator only when both `prev` and `next` exist.
- Keep the separator decorative with `aria-hidden="true"` and no navigation semantics.
- Preserve the current desktop layout from `md` upward.

## Non-Goals

- No route content, page, footer, data, or asset changes.
- No redesign of link cards, typography, spacing system, or desktop behavior.
- No new dependency or visual regression tooling.

## Scope

### In Scope
- Update `src/components/EtapaNav.astro` only.
- Add a white or near-white balanced line, likely low-opacity, between both mobile cards.
- Verify etapa 01, 03, and 05 responsive states.

### Out of Scope
- Changes to `src/pages/etapas/*`, `Pie.astro`, or shared route data.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `site-quality`: refine mobile route navigation clarity while preserving desktop equivalence and first/last etapa behavior.

## Constraints

- Generated markup must not affect screen reader output, tab order, link labels, or route semantics.
- The separator must be hidden at `md` and above.
- The implementation must stay inside the existing mobile-first `EtapaNav.astro` structure.

## Approach

Use the exploration recommendation: insert a conditional decorative divider between the previous and next anchors when `prev && next`. Style it as a short or full-width white/near-white line with controlled opacity so it separates actions without becoming noisy.

## First Implementation Slice

- In `EtapaNav.astro`, place `{prev && next && (...)}` between the two link render blocks with `aria-hidden="true"` and `md:hidden`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/EtapaNav.astro` | Modified | Mobile-only decorative separator between available previous/next route links. |
| `openspec/specs/site-quality/spec.md` | Modified | Delta should clarify this mobile nav visual separation requirement. |

## Acceptance Criteria

- [ ] Etapa 03 mobile shows a subtle separator between previous and next links.
- [ ] Etapa 01 and etapa 05 mobile do not show an orphan separator.
- [ ] Desktop layout from `md` upward is visually unchanged.
- [ ] Separator is `aria-hidden` and non-interactive.
- [ ] `npm run build` passes.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Divider looks too strong on black background | Medium | Use near-white or white with opacity and review on mobile. |
| Divider appears on first/last etapa | Low | Gate rendering on `prev && next`. |
| Desktop layout changes accidentally | Low | Add `md:hidden` and responsive review. |

## Rollback Plan

Remove the conditional divider markup from `EtapaNav.astro`; no data or asset rollback is needed.

## Dependencies

- Existing `site-quality` spec and exploration artifact.

## Proposal Question Round

Assumption: the separator is purely decorative and the first slice should favor balance over prominence. If product review wants a stronger visual cue, adjust opacity/width during apply.
