# SEO improvements

## Goal
Improve organic discoverability for Senda Pirata by strengthening page titles, meta descriptions, structured data, and crawl hygiene without changing the public visual design.

## Scope
- Update route page SEO metadata for the home, listing, and stage pages.
- Enrich structured data for route downloadable/audio assets where supported by existing data.
- Avoid indexing legacy duplicated public content.
- Validate the Astro build.

## Tasks

- [x] T1 — Improve metadata copy
  - Updated home, listing, and stage page titles/descriptions with Cabo de Gata-Níjar, route endpoints, senderismo, GPX/PDF/audio intent.
  - Evidence: `src/pages/index.astro`, `src/pages/etapas/index.astro`, `src/data/etapas.ts`.

- [x] T2 — Enrich structured data and crawl hygiene
  - Added `AudioObject` schema for etapa audio tracks and `DigitalDocument` schema for PDF/GPX downloads.
  - Added `Disallow: /sendapirata_html/` to avoid crawling legacy duplicated public content.
  - Evidence: `src/data/structured-data.ts`, `public/robots.txt`.

- [x] T3 — Validate output
  - Ran `npm run build` successfully.
  - LSP diagnostics: Astro files unsupported by current LSP; TypeScript emitted auxiliary warnings only, no build failure.
  - Evidence: build completed 7 static pages and generated sitemap.

## Decisions
- Keep changes visual-design neutral.
- Do not delete legacy assets in this pass; use robots exclusion first.
- Work-unit commits were not created because the project safety rule requires an explicit user request before committing.
- Writer delegation was attempted twice but both subagents stalled in auxiliary MCP work without producing changes; implementation completed inline to avoid leaving a half-finished SEO change.
