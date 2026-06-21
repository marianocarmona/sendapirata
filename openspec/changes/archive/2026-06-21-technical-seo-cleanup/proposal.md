# Proposal: Technical SEO Cleanup

## Proposal Question Round

Assumptions for review: sitemap/robots expose current public routes, homepage `<h1>` keeps current copy, and image sizing preserves existing responsive visuals.

## Intent

Establish a focused technical SEO foundation for the Astro static site: stable production URLs, crawl discovery, one homepage primary heading, and reduced layout instability for shared/high-impact images without redesigning content.

## Scope

### In Scope
- Configure Astro `site` as `https://sendapirata.com/`.
- Add official sitemap support if absent and reference it from `public/robots.txt`.
- Make canonical URLs explicit while avoiding duplicate `astro-seo` canonical output.
- Add a proper homepage `<h1>`.
- Add intrinsic dimensions or aspect-ratio safeguards for homepage, header/footer, etapa, treasure, card, and download icon images touched by the slice.

### Out of Scope
- Broad structured data rollout.
- Full meta description rewrite.
- Mapbox lazy-loading/performance overhaul.
- Broad visual redesign.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `site-quality`: add crawlability, canonical URL, heading semantics, and image stability requirements while preserving public behavior.

## Approach

Use the focused foundation slice from exploration. Add `site` and sitemap integration in Astro config, create crawl policy in `robots.txt`, centralize or reuse site constants where useful, update `Layout.astro` canonical behavior without duplicating `astro-seo`, promote/add the homepage `<h1>`, and add accurate dimensions/aspect-ratio through existing components and markup.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add `site` and sitemap integration. |
| `package.json`, `package-lock.json` | Modified | Add `@astrojs/sitemap` if needed. |
| `public/robots.txt` | New | Allow crawl and reference sitemap. |
| `src/layouts/Layout.astro` | Modified | Explicit canonical handling with existing SEO metadata. |
| `src/pages/index.astro` | Modified | Homepage `<h1>` and hero image sizing. |
| `src/components/*.astro` | Modified | Shared logo, etapa, treasure, card, and icon image dimensions/aspect-ratio. |
| `src/data/site.ts` | Modified | Shared SEO constants if useful. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Duplicate canonical tags | Medium | Inspect `astro-seo` output path before adding links. |
| Wrong image dimensions distort layout | Medium | Verify source dimensions or use aspect-ratio wrappers. |
| Sitemap exposes unintended routes | Low | Limit to Astro public routes. |

## Rollback Plan

Remove sitemap integration/dependency, delete `robots.txt`, and revert touched layout/page/component changes.

## Dependencies

- Canonical production domain: `https://sendapirata.com/`.
- Optional dependency: `@astrojs/sitemap`.

## Success Criteria

- [ ] Build succeeds and emits sitemap output.
- [ ] `robots.txt` references `https://sendapirata.com/sitemap-index.xml` or generated equivalent.
- [ ] Pages have one canonical URL source and homepage has one `<h1>`.
- [ ] Targeted images declare dimensions or stable aspect ratios without visual redesign.
