## Exploration: technical-seo-cleanup

### Current State
The project is an Astro 6 static site using `astro-seo` in `src/layouts/Layout.astro`. `Astro.site` is referenced there, but `astro.config.mjs` does not define a `site` URL, so canonical URL generation and absolute SEO metadata cannot rely on a stable production origin. No sitemap integration or `public/robots.txt` is present. The homepage (`src/pages/index.astro`) has no `<h1>`; its primary visible heading is an `<h2>`. Stage detail pages do have an `<h1>` via `EtapaHero.astro`.

Image rendering already uses lazy/async loading for several secondary images, but core images lack explicit intrinsic dimensions: homepage hero image, header logo, etapa hero images, treasure images, footer logos, and download icons. The planned first slice can address dimensions/aspect-ratio without changing content or layout intent.

### Affected Areas
- `astro.config.mjs` — add the production `site` URL and likely sitemap integration configuration.
- `package.json` / lockfile — add `@astrojs/sitemap` if sitemap generation is included in the first slice.
- `public/robots.txt` — create crawl policy and sitemap reference.
- `src/layouts/Layout.astro` — add stable canonical link behavior, preferably derived from `Astro.url` and `Astro.site`, while preserving existing `astro-seo` metadata.
- `src/pages/index.astro` — promote/add the homepage primary heading as `<h1>` and add dimensions/aspect ratio for the homepage hero image.
- `src/components/Cabecera.astro` — add image dimensions/aspect-ratio support for logo rendering without breaking caller-provided classes.
- `src/components/EtapaHero.astro` — add intrinsic image dimensions or an aspect-ratio wrapper for route hero images.
- `src/components/EtapaCard.astro` — already constrains card thumbnails with width/height classes; may still benefit from intrinsic `width`/`height` attributes.
- `src/components/EtapaTreasureCard.astro` — add intrinsic dimensions/aspect ratio for lazy treasure images.
- `src/components/Pie.astro` — add accurate alt text and intrinsic dimensions for footer logos; richer alt fixes may be a separate later slice if strict scope is required.
- `src/data/site.ts` — likely home for production URL and shared SEO constants if avoiding duplicated literals.

### Approaches
1. **Focused technical foundation slice** — Add Astro `site`, sitemap, `robots.txt`, layout canonical, homepage `<h1>`, and dimensions/aspect-ratio for high-impact shared image components.
   - Pros: Directly matches the recorded priority order; small enough for one reviewable PR; improves crawlability and layout stability together.
   - Cons: Requires adding one dependency if using official sitemap integration; exact production URL must be known.
   - Effort: Low/Medium

2. **Config-only crawlability slice** — Add only `site`, sitemap, `robots.txt`, and canonical; defer headings and image sizing.
   - Pros: Very small, low visual regression risk.
   - Cons: Leaves known homepage semantics and CLS-related image gaps unresolved; less aligned with the requested first point-by-point slice.
   - Effort: Low

3. **Broad SEO cleanup slice** — Include structured data, richer descriptions, footer alt fixes, and Core Web Vitals map/background work with the first slice.
   - Pros: Fewer SDD cycles.
   - Cons: Too broad for the 400-line review budget and mixes crawlability, semantics, metadata content, accessibility, and performance concerns.
   - Effort: High

### Recommendation
Proceed with Approach 1 as the first proposal scope, but keep it explicitly limited to foundational technical SEO: configure a production site URL, generate sitemap output, add `robots.txt`, add canonical links, ensure the homepage has one primary `<h1>`, and add image dimensions/aspect-ratio to the homepage and shared image-rendering components touched by the first slice. Defer structured data, richer meta descriptions, footer alt copy refinements beyond obvious logo identity, lazy Mapbox loading, and `background-attachment` performance review to later slices.

### Risks
- The production URL is not present in the current codebase; proposal/apply should confirm the canonical domain before implementation.
- `astro-seo` may already emit some URL-related metadata if configured; canonical changes should avoid duplicate canonical tags.
- Adding intrinsic image dimensions requires accurate source dimensions or a consistent ratio strategy; wrong values can distort layout or mislead browsers.
- Footer logo alt text is listed in the broader SEO plan but belongs more naturally to the second slice unless included only where dimensions are touched.

### Ready for Proposal
Yes — tell the user the first proposal should cover only the technical foundation slice: Astro site URL, sitemap, robots.txt, canonical, homepage h1, and image dimensions/aspect-ratio for shared/high-impact images, with production domain confirmation as the main open input.
