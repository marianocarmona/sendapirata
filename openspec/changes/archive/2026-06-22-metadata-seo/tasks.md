# Tasks: Metadata SEO

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 180-260 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add shared metadata contract and defaults | PR 1 | `src/layouts/Layout.astro`, `src/data/site.ts`, `src/data/etapas.ts` |
| 2 | Wire page-specific metadata into public pages | PR 1 | `src/pages/index.astro`, `src/pages/etapas/index.astro`, `src/pages/etapas/etapa-01.astro`-`etapa-05.astro` |

## Phase 1: Shared SEO Contract

- [x] 1.1 Extend `src/layouts/Layout.astro` props with optional `socialImage` metadata and keep canonical URL generation centralized.
- [x] 1.2 Replace manual Twitter meta entries in `Layout.astro` with native `astro-seo` Open Graph/Twitter fields and preserve one coherent social set.
- [x] 1.3 Add fallback social image alt text and measured dimensions to `src/data/site.ts` using the existing `/images/cartilla.webp` asset.

## Phase 2: Page Metadata Content

- [x] 2.1 Enrich `src/data/etapas.ts` with truthful `layoutDescription` values and optional per-etapa social image metadata from existing assets.
- [x] 2.2 Update `src/pages/index.astro` to pass a richer homepage description and measured `/images/fondo_playa.webp` social metadata.
- [x] 2.3 Update `src/pages/etapas/index.astro` to pass a truthful listing description and page-specific social metadata.
- [x] 2.4 Update `src/pages/etapas/etapa-01.astro` through `etapa-05.astro` to forward `etapa.socialImage` to `Layout` without changing body content.

## Phase 3: Verification

- [x] 3.1 Run `npm run build` to verify Astro/TypeScript compatibility and asset validation.
- [x] 3.2 Inspect generated HTML for `/`, `/etapas`, and one etapa page to confirm one canonical URL plus matching OG/Twitter title, description, image, alt, width, and height.
- [x] 3.3 Confirm the diff does not touch body content, routes, JSON-LD, map behavior, or downloads.

## Phase 4: Cleanup

- [x] 4.1 Remove any now-redundant metadata constants or comments introduced during wiring.
