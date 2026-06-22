# Apply Progress: metadata-seo

## Implementation Progress

**Change**: metadata-seo
**Mode**: Standard

### Completed Tasks
- [x] 1.1 Extend `src/layouts/Layout.astro` props with optional `socialImage` metadata and keep canonical URL generation centralized.
- [x] 1.2 Replace manual Twitter meta entries in `Layout.astro` with native `astro-seo` Open Graph/Twitter fields and preserve one coherent social set.
- [x] 1.3 Add fallback social image alt text and measured dimensions to `src/data/site.ts` using the existing `/images/cartilla.webp` asset.
- [x] 2.1 Enrich `src/data/etapas.ts` with truthful `layoutDescription` values and optional per-etapa social image metadata from existing assets.
- [x] 2.2 Update `src/pages/index.astro` to pass a richer homepage description and measured `/images/fondo_playa.webp` social metadata.
- [x] 2.3 Update `src/pages/etapas/index.astro` to pass a truthful listing description and page-specific social metadata.
- [x] 2.4 Update `src/pages/etapas/etapa-01.astro` through `etapa-05.astro` to forward `etapa.socialImage` to `Layout` without changing body content.
- [x] 3.1 Run `npm run build` to verify Astro/TypeScript compatibility and asset validation.
- [x] 3.2 Inspect generated HTML for `/`, `/etapas`, and one etapa page to confirm one canonical URL plus matching OG/Twitter title, description, image, alt, width, and height.
- [x] 3.3 Confirm the diff does not touch body content, routes, JSON-LD, map behavior, or downloads.
- [x] 4.1 Remove any now-redundant metadata constants or comments introduced during wiring.

### Files Changed
| File | Action | What Was Done |
|------|--------|---------------|
| `src/layouts/Layout.astro` | Modified | Added optional `socialImage` support, kept canonical generation centralized, and mapped one coherent Open Graph/Twitter set through `astro-seo`. |
| `src/data/site.ts` | Modified | Added a typed social image metadata helper and the measured fallback metadata for `/images/cartilla.webp`. |
| `src/data/etapas.ts` | Modified | Added richer etapa descriptions plus measured social metadata for existing etapa hero assets. |
| `src/pages/index.astro` | Modified | Passed a richer homepage description and measured `/images/fondo_playa.webp` social metadata to the layout. |
| `src/pages/etapas/index.astro` | Modified | Passed a richer listing description and explicit social metadata for the etapas index page. |
| `src/pages/etapas/etapa-01.astro` | Modified | Forwarded `etapa.socialImage` into the shared layout without touching page body content. |
| `src/pages/etapas/etapa-02.astro` | Modified | Forwarded `etapa.socialImage` into the shared layout without touching page body content. |
| `src/pages/etapas/etapa-03.astro` | Modified | Forwarded `etapa.socialImage` into the shared layout without touching page body content. |
| `src/pages/etapas/etapa-04.astro` | Modified | Forwarded `etapa.socialImage` into the shared layout without touching page body content. |
| `src/pages/etapas/etapa-05.astro` | Modified | Forwarded `etapa.socialImage` into the shared layout without touching page body content. |
| `openspec/changes/metadata-seo/tasks.md` | Modified | Marked all apply tasks complete after implementation and verification. |

### Verification Results
- `npm run build` — passed
- `node --input-type=module -e '…metadata inspection…'` — passed for `/`, `/etapas`, and `/etapas/etapa-01/`; confirmed one canonical tag plus matching OG/Twitter title, description, image, alt, width, and height, with no duplicate Twitter title/description/image tags
- `git diff --stat` and targeted `git diff -- ...` review — confirmed the implementation stayed inside metadata/data/layout wiring and did not change body content, routes, JSON-LD, map behavior, or downloads

### Deviations from Design
None — implementation matches design.

### Issues Found
- `openspec/config.yaml` is absent, so apply mode relied on the orchestrator preflight plus direct project inspection for verification mode.
- Canonical output keeps Astro's trailing-slash build paths for non-root routes (`/etapas/`, `/etapas/etapa-01/`), which preserves the current centralized behavior.

### Remaining Tasks
- None.

### Workload / PR Boundary
- Mode: single PR
- Current work unit: Full metadata-seo apply slice
- Boundary: Starts with shared metadata wiring in `Layout.astro`/data files and ends with page-level metadata verification for `/`, `/etapas`, and etapa detail pages only.
- Estimated review budget impact: Small-to-medium; current diff remains well under the 400-line review budget.

### Status
11/11 tasks complete. Ready for verify.
