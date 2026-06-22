# Proposal: Metadata SEO

## Problem

Current metadata is valid but too generic for search and social previews: all pages share one social image, image alt/dimensions are missing, and etapa descriptions are mostly route summaries. The SEO direction must balance hiking routes/stages, historical pirate storytelling, and useful downloadable resources without keyword stuffing or unsupported claims.

## Goals

- Improve metadata for the homepage, `/etapas`, and five etapa detail pages.
- Support optional page-specific Open Graph/Twitter image metadata through the shared layout.
- Reuse existing content, images, alt text, and dimension data.

## Non-goals

- Change body content, routes, sitemap/robots, analytics, Mapbox, downloads, or JSON-LD.
- Add a new SEO dependency, generated social images, multilingual alternates, or invented marketing claims.

## Scope

### In Scope
- Richer page descriptions based on visible route, story, audio, PDF, and GPX content.
- Layout-level optional social metadata with safe defaults from site data.
- Page-specific social image, alt text, width, and height where existing data supports it.

### Out of Scope
- Dedicated 1200x630 social-card assets.
- Broader content rewrite or structured-data changes.

## Capabilities

### New Capabilities
- `metadata-seo`: Page-level HTML metadata, canonical/social tag behavior, and social image fallback rules.

### Modified Capabilities
- None.

## Approach

Use the exploration recommendation: extend `src/layouts/Layout.astro` with an optional social metadata prop while keeping canonical URL generation and `astro-seo` tag emission centralized. Pages own title/description intent and selected existing images; layout owns absolute URLs, fallback behavior, and Open Graph/Twitter mapping.

## Constraints

- Metadata copy MUST describe existing page content only.
- Existing image dimensions from `src/data/image-dimensions.ts` SHOULD be used rather than runtime probing.
- Canonical behavior in `astro.config.mjs` / `src/data/seo-urls.ts` MUST remain centralized.

## First Implementation Slice

Update `Layout.astro`, shared site/image metadata data, `src/pages/index.astro`, `src/pages/etapas/index.astro`, and `src/pages/etapas/etapa-01.astro` through `etapa-05.astro` only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/layouts/Layout.astro` | Modified | Optional social metadata API and tag mapping. |
| `src/data/site.ts`, `src/data/image-dimensions.ts`, `src/data/etapas.ts` | Modified | Defaults, dimensions, and richer page metadata. |
| `src/pages/**` target pages | Modified | Pass page-specific metadata intent. |

## Acceptance Criteria

- [ ] Each target page has accurate, balanced metadata covering route/stage value, pirate-story experience, and relevant downloads where present.
- [ ] Open Graph/Twitter metadata uses page-specific images when available and falls back safely otherwise.
- [ ] No duplicate/conflicting Twitter image/title/description tags are emitted.
- [ ] Build succeeds and public page content remains unchanged.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Existing images crop poorly in social cards | Medium | Reuse best available measured images; defer dedicated assets. |
| Metadata overclaims content | Medium | Require copy to map to visible content/data. |
| Duplicate social tags | Medium | Prefer native `astro-seo` fields and clean old manual meta entries. |
| Review size exceeds 400 lines | Low | Keep the first slice to layout/data/seven pages only. |

## Rollback Plan

Revert the proposal implementation commit(s); metadata falls back to the current shared image and existing descriptions without data migration.

## Dependencies

- Existing `astro-seo`, `SITE_DESCRIPTION`, `SOCIAL_IMAGE_PATH`, etapa data, and image dimension registry.
