# Tasks: Technical SEO Cleanup

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 260-340 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR: crawl foundation + canonical + homepage h1 + image stability |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Ship the full first SEO slice | PR 1 | Base on `main`; keep config, markup, image sizing, and verification together. |

## Phase 1: Crawl Foundation

- [x] 1.1 Add `@astrojs/sitemap` to `package.json` and refresh `package-lock.json`; keep existing Astro, Partytown, and Tailwind setup intact.
- [x] 1.2 Set `site: "https://sendapirata.com/"` and enable `sitemap()` in `astro.config.mjs` after the Partytown integration.
- [x] 1.3 Create `public/robots.txt` with `Allow: /` and the production sitemap index URL.

## Phase 2: Canonical + Homepage Semantics

- [x] 2.1 Update `src/layouts/Layout.astro` to compute one absolute canonical URL from `Astro.url` + `Astro.site` and pass it to `<SEO canonical={...}>`.
- [x] 2.2 Keep `astro-seo` as the sole canonical emitter; remove any duplicate manual canonical or link behavior if present.
- [x] 2.3 Change the visible homepage heading in `src/pages/index.astro` from `<h2>` to `<h1>` without altering its classes or copy.

## Phase 3: Image Stability

- [x] 3.1 Create `src/data/image-dimensions.ts` with measured width/height for touched public images and a typed lookup helper.
- [x] 3.2 Add intrinsic dimensions or ratio guards in `src/components/Cabecera.astro`, `src/components/Pie.astro`, `src/components/EtapaHero.astro`, and `src/components/EtapaCard.astro` using the helper where needed.
- [x] 3.3 Add intrinsic dimensions or ratio guards in `src/components/EtapaTreasureCard.astro`, `src/components/EtapaCierre.astro`, `src/components/EtapasIntro.astro`, and `src/components/DownloadIconLinks.astro`.
- [x] 3.4 Add width/height or an aspect-ratio wrapper for the homepage hero image in `src/pages/index.astro` so the box is stable before decode.

## Phase 4: Verification

- [x] 4.1 Run `npm run build` and confirm the build emits `sitemap-index.xml` plus `robots.txt`.
- [x] 4.2 Inspect built HTML to confirm one canonical URL per public page and exactly one `<h1>` on the homepage.
- [x] 4.3 Preview the homepage and one etapa page at mobile and desktop widths to confirm no layout shift around the touched images.
