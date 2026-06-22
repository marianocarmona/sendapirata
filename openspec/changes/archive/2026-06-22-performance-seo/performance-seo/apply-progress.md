# Apply Progress: performance-seo

## Implementation Progress

**Change**: performance-seo
**Mode**: Standard

### Completed Tasks
- [x] 1.1 Update `src/layouts/Layout.astro` to remove the global `grunge-background.webp` preload and add the existing Typekit/Google font links to `<head>` before `slot name="head"`.
- [x] 1.2 Update `src/components/Sp2Shell.astro` to delete the body-emitted font `<link>` tags while keeping shell markup, classes, and slots unchanged.
- [x] 2.1 Update `src/pages/index.astro` so only `/images/fondo_playa.webp` gets `loading="eager"` and `fetchpriority="high"`.
- [x] 2.2 Update `src/components/EtapaHero.astro` so the current etapa hero image gets the same priority hints without changing props or layout.
- [x] 3.1 Run `npm run build` and inspect `dist/index.html`, `dist/etapas/index.html`, and one etapa detail HTML for head-only font links and no global decorative preload.
- [x] 3.2 Verify route-scoped hero priority only, and confirm the diff does not touch Mapbox lazy behavior, audio refactor/preload behavior, or legacy asset cleanup.

### Files Changed
| File | Action | What Was Done |
|------|--------|---------------|
| `src/layouts/Layout.astro` | Modified | Removed the global decorative background preload and moved the existing Typekit/Google font discovery links into the shared document head. |
| `src/components/Sp2Shell.astro` | Modified | Removed body-emitted font links and kept the shell markup, classes, and slots unchanged. |
| `src/pages/index.astro` | Modified | Added eager/high-priority loading hints only to the visible homepage hero image. |
| `src/components/EtapaHero.astro` | Modified | Added eager/high-priority loading hints only to the current etapa hero image without changing the props contract or layout. |
| `openspec/changes/performance-seo/tasks.md` | Modified | Marked all approved apply and verification tasks complete. |
| `openspec/changes/performance-seo/apply-progress.md` | Created | Recorded the cumulative apply implementation summary and verification evidence for this change. |

### Verification Results
- `npm run build` — passed
- Built HTML inspection for `dist/index.html`, `dist/etapas/index.html`, and `dist/etapas/etapa-01/index.html` — confirmed the Typekit/Google font links are in `<head>` only and no `grunge-background.webp` preload is emitted
- Built HTML inspection for `dist/index.html` and `dist/etapas/etapa-01/index.html` — confirmed route-scoped `loading="eager" fetchpriority="high"` on the visible hero image only
- Source diff review — confirmed Mapbox lazy loading, audio `preload="none"`, and legacy public assets were not changed

### Deviations from Design
None — implementation matches design.

### Issues Found
- `openspec/config.yaml` is absent, so apply mode relied on the orchestrator preflight plus direct project inspection for verification mode.

### Remaining Tasks
- None.

### Workload / PR Boundary
- Mode: single PR
- Current work unit: Full performance-seo apply slice
- Boundary: Starts with head resource ownership in `Layout.astro`/`Sp2Shell.astro` and ends with route-scoped hero priority plus generated HTML inspection for `/`, `/etapas/`, and one etapa detail page.
- Estimated review budget impact: Small; the implementation stays well under the 400-line review budget.

### Status
6/6 tasks complete. Ready for verify.
