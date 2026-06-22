# Proposal: Performance SEO

## Problem

The site is mostly static and builds cleanly, but exploration found avoidable Core Web Vitals risk: every page globally preloads the 1.42 MB decorative `grunge-background.webp`, font stylesheet links are emitted from `Sp2Shell.astro` inside body content, and likely LCP hero images do not receive route-specific priority hints.

## Goals

- Improve perceived LCP/Core Web Vitals without changing visible UX.
- Keep the first slice conservative, reviewable, and under the 400-line budget.
- Prioritize only resources needed for the current route above the fold.

## Non-Goals

- Mapbox lazy-loading or interaction changes.
- Audio player script extraction or audio preload changes.
- Legacy asset deletion, redirects, or `public/sendapirata_html/` cleanup.

## Scope

### In Scope
- Remove or re-scope the global preload for `/images/grunge-background.webp`.
- Move font discovery links from `Sp2Shell.astro` to `Layout.astro` head if output remains equivalent.
- Add small route-specific LCP treatment for homepage and etapa hero images.

### Out of Scope
- Any user-visible layout/content change.
- Any public asset deletion without URL-retention evidence.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `site-quality`: loading efficiency must improve while preserving public behavior and visual identity.

## Approach

Apply the exploration's small Core Web Vitals pass: stop wasting global priority on a decorative desktop background, centralize low-risk font links in the document head, and prioritize only the current route's likely LCP image with attributes or page-owned head hints. Keep Mapbox, audio, downloads, routes, metadata, and content unchanged.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/layouts/Layout.astro` | Modified | Head resource ownership, background preload decision. |
| `src/components/Sp2Shell.astro` | Modified | Remove duplicated/body font resource links if moved. |
| `src/pages/index.astro` | Modified | Homepage hero/LCP priority if feasible. |
| `src/components/EtapaHero.astro` | Modified | Etapa hero image loading attributes or route-safe priority. |

## Constraints

- No application behavior or visible UX changes.
- No global preload of all route hero images.
- Keep existing image dimensions and audio `preload="none"` behavior.

## First Implementation Slice

1. Reconsider/remove the global decorative background preload.
2. Move font links to head only if the generated output stays equivalent.
3. Add minimal route-specific hero priority hints.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Desktop background appears later | Medium | Manual desktop viewport check. |
| Font order/FOUT shifts | Medium | Verify home, listing, one etapa page. |
| Over-preloading hurts performance | Low | Prioritize only current-route hero assets. |

## Rollback Plan

Revert the proposal's implementation commit to restore previous preload, font placement, and image-loading attributes.

## Dependencies

- Existing Astro static build and generated HTML inspection.

## Acceptance Criteria

- [ ] `npm run build` succeeds.
- [ ] Generated HTML no longer globally preloads the 1.42 MB decorative background on every route.
- [ ] Font links are in head or intentionally left unchanged with documented reason.
- [ ] Homepage and etapa pages keep equivalent visual output and content.
