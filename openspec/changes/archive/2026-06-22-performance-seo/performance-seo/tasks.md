# Tasks: Performance SEO

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~60-110 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

Out of scope: Mapbox lazy-loading, audio refactor/preload changes, legacy asset cleanup.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Move font ownership to the document head and remove duplicate body links. | PR 1 | `src/layouts/Layout.astro` + `src/components/Sp2Shell.astro` only. |
| 2 | Make hero priority route-specific on the homepage and etapa details. | PR 1 | `src/pages/index.astro` + `src/components/EtapaHero.astro` only. |

## Phase 1: Head Resource Ownership

- [x] 1.1 Update `src/layouts/Layout.astro` to remove the global `grunge-background.webp` preload and add the existing Typekit/Google font links to `<head>` before `slot name="head"`.
- [x] 1.2 Update `src/components/Sp2Shell.astro` to delete the body-emitted font `<link>` tags while keeping shell markup, classes, and slots unchanged.

## Phase 2: Route-Specific Hero Priority

- [x] 2.1 Update `src/pages/index.astro` so only `/images/fondo_playa.webp` gets `loading="eager"` and `fetchpriority="high"`.
- [x] 2.2 Update `src/components/EtapaHero.astro` so the current etapa hero image gets the same priority hints without changing props or layout.

## Phase 3: Verification

- [x] 3.1 Run `npm run build` and inspect `dist/index.html`, `dist/etapas/index.html`, and one etapa detail HTML for head-only font links and no global decorative preload.
- [x] 3.2 Verify route-scoped hero priority only, and confirm the diff does not touch Mapbox lazy behavior, audio refactor/preload behavior, or legacy asset cleanup.
