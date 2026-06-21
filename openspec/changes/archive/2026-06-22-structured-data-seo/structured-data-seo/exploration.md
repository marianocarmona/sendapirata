# Exploration: structured-data-seo

## Current State

The site is an Astro 6 static site with shared SEO metadata centralized in `src/layouts/Layout.astro` through `astro-seo`. The first technical SEO slice has already established `site: 'https://sendapirata.com/'` in `astro.config.mjs`, sitemap integration, `public/robots.txt`, canonical URLs, Open Graph/Twitter image metadata, homepage `<h1>`, and intrinsic image dimensions in shared image components.

No JSON-LD or schema.org structured data is currently present in `src/`. The relevant page types are the homepage (`/`), the etapa listing page (`/etapas`), and five etapa detail pages (`/etapas/etapa-01` through `/etapas/etapa-05`). Route and media content is already centralized in `src/data/etapas.ts`, while global site constants live in `src/data/site.ts`. GeoJSON files in `public/geojson/XX.geojson` contain route geometry and names, but the current stage model already exposes the safer first-slice fields: title, path, description, distance, duration, start/end labels, downloads, audio tracks, hero/card images, and treasure spots.

## Affected Areas

- `src/layouts/Layout.astro` — likely injection point if pages pass structured data into the shared layout, but must avoid mixing page-specific schema construction into the layout.
- `src/data/site.ts` — source for site identity, canonical base, shared image, and possible Organization/WebSite constants.
- `src/data/etapas.ts` — primary source for etapa-specific schema values; currently has string stats rather than normalized numeric distance/duration fields.
- `src/pages/index.astro` — candidate for WebSite/WebPage and ItemList JSON-LD referencing the five etapas.
- `src/pages/etapas/index.astro` — candidate for CollectionPage and ItemList JSON-LD referencing etapa detail pages.
- `src/pages/etapas/etapa-01.astro` to `src/pages/etapas/etapa-05.astro` — candidates for detail-page schema using each `EtapaRecord`.
- `public/geojson/XX.geojson` — potential future source for route geometry, but too noisy and not needed for a safe first structured-data slice.

## Approaches

1. **Reusable JSON-LD component plus page-provided schema** — Add a small Astro component that serializes JSON-LD safely, and let pages provide schema objects assembled from existing data.
   - Pros: Keeps layout generic; explicit per-page control; easy to review; avoids a dependency.
   - Cons: Some page boilerplate unless helper builders are added.
   - Effort: Low/Medium

2. **Schema builder module from centralized data** — Add TypeScript helpers that build WebSite, BreadcrumbList, ItemList, and route/page schema from `site.ts` and `etapas.ts`, then render with a small JSON-LD component.
   - Pros: Best fit for five repeated etapa pages; minimizes duplication; build/type-check catches field mistakes.
   - Cons: Requires deciding normalized schema boundaries and validating string-to-schema mappings.
   - Effort: Medium

3. **Broad schema coverage including GeoShape/route geometry/audio objects/download artifacts** — Model detailed route geometry, all audio files, PDFs/GPX, treasure POIs, and tourism entities in one slice.
   - Pros: Richest data model.
   - Cons: High review risk; schema accuracy risk; GeoJSON extraction can produce very large JSON-LD; likely exceeds a focused first slice.
   - Effort: High

## Recommendation

Proceed with Approach 2, scoped tightly. First slice should introduce a small reusable JSON-LD rendering component and schema builder helpers for: `WebSite`/site identity on the homepage, `CollectionPage` or `ItemList` for the etapa listing, `BreadcrumbList` on listing/detail pages, and a conservative etapa detail entity such as `TouristTrip` or `WebPage` with `name`, `description`, canonical URL, image, and route facts derived from `EtapaRecord`.

Do not include raw GeoJSON geometry, downloadable file schemas, full audio object modeling, FAQ, Review, Event, Product, or claims requiring content not present in the codebase. If `TouristTrip` proves too ambiguous during proposal/spec, fall back to page-level `WebPage` plus `BreadcrumbList` and `ItemList`; correctness is more important than maximizing schema count.

## Risks

- Schema overclaiming: structured data must describe visible page content and should not invent organization details, events, offers, ratings, or FAQs.
- `EtapaRecord.stats` values are human-readable Spanish strings, so machine fields like ISO 8601 duration or numeric distance would need explicit normalization before use.
- Duplicate or conflicting canonical/image URLs can happen if JSON-LD URL generation diverges from `Layout.astro` canonical behavior.
- `astro-seo` handles metadata but not JSON-LD here; JSON serialization must avoid unsafe string interpolation and invalid script escaping.
- Search engines may ignore overly generic or unsupported schema types; validation should focus on syntactic correctness and accurate representation, not guaranteed rich-result eligibility.

## Ready for Proposal

Yes — propose a focused structured-data foundation slice: add safe JSON-LD rendering, centralized schema builders, WebSite/ItemList/BreadcrumbList coverage, and conservative detail-page schema for the five etapa pages using existing `site.ts` and `etapas.ts` data. Keep GeoJSON/audio/download-rich modeling for later slices.
