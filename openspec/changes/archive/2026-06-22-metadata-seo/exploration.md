## Exploration: metadata-seo

### Current State

The site centralizes HTML metadata in `src/layouts/Layout.astro` through `astro-seo`. Every public page provides a `title` and `description` to the layout, and the layout derives canonical URLs with `toCanonicalUrl(Astro.url.pathname, siteUrl)` using the configured Astro site base (`https://sendapirata.com/`). Open Graph and Twitter card metadata are already emitted globally, but the implementation uses one shared social image (`/images/cartilla.webp`) for all pages, does not pass page-specific social image alt text or dimensions, and repeats Twitter image/title/description through `extend.meta` instead of using the richer `twitter` object supported by `astro-seo`.

Homepage and listing descriptions are valid but short. Etapa detail descriptions are currently route summaries only, such as `Agua Amarga → Las Negras (13 km)`, which under-explains the page content for search previews and social cards. Etapa content and media references are centralized in `src/data/etapas.ts`; each etapa already has `layoutTitle`, `layoutDescription`, `heroImage`, `heroAlt`, `cardImage`, route facts, treasure descriptions, and validations for public asset existence. `src/data/image-dimensions.ts` already records dimensions for the shared social image, homepage hero, etapa card images, and etapa hero images, so page-specific OG image width/height can be sourced without probing files at runtime.

### Affected Areas

- `src/layouts/Layout.astro` — metadata gateway; should accept optional social metadata while keeping canonical generation centralized.
- `src/data/site.ts` — global defaults for site name, fallback description, and fallback social image.
- `src/data/image-dimensions.ts` — existing dimension registry for social image metadata; may need to remain the source for `og:image:width` and `og:image:height`.
- `src/data/etapas.ts` — source of etapa page metadata; likely needs richer page descriptions and optional per-etapa social image metadata.
- `src/pages/index.astro` — should provide richer homepage description and social image intent.
- `src/pages/etapas/index.astro` — should provide richer collection-page description and social image intent.
- `src/pages/etapas/etapa-01.astro` to `src/pages/etapas/etapa-05.astro` — should pass richer etapa descriptions and page-specific social image information from the etapa record.
- `astro.config.mjs` / `src/data/seo-urls.ts` — canonical behavior is already established and should not be duplicated elsewhere.

### Approaches

1. **Layout-level optional social metadata** — Extend `Layout.astro` props with an optional social metadata object (`image`, `imageAlt`, optional title/description overrides), defaulting to `site.ts` values.
   - Pros: Keeps one metadata rendering point; preserves existing page contract; small first slice; supports page-specific OG/Twitter cards without spreading `astro-seo` details across pages.
   - Cons: Requires a clear prop shape and careful fallback behavior; layout becomes responsible for mapping internal metadata to `astro-seo` fields.
   - Effort: Low/Medium

2. **Central page metadata builder module** — Add helpers that derive full metadata objects for home, listing, and etapa pages from `site.ts`, `etapas.ts`, and `image-dimensions.ts`; pages pass the builder output to `Layout`.
   - Pros: Strong consistency and validation; avoids per-page boilerplate; scales if more routes are added.
   - Cons: More abstraction for a seven-page static site; could be overbuilt before requirements settle.
   - Effort: Medium

3. **Per-page explicit `astro-seo` configuration** — Let individual pages pass or inject full Open Graph/Twitter fields directly.
   - Pros: Maximum per-page flexibility; minimal new data modeling.
   - Cons: Duplicates metadata rules, weakens the existing layout contract, and increases risk of inconsistent canonical/social tags.
   - Effort: Medium

### Recommendation

Proceed with Approach 1, with a small amount of shared typing/data support. Keep canonical URL generation and `astro-seo` rendering inside `Layout.astro`; extend the layout API so pages may provide page-specific social image metadata while still falling back to `SITE_DESCRIPTION` and `SOCIAL_IMAGE_PATH`. Use `astro-seo` native fields where available: `openGraph.basic.url`, `openGraph.optional.description`, `openGraph.optional.locale`, `openGraph.optional.siteName`, `openGraph.image.width`, `openGraph.image.height`, `openGraph.image.alt`, `twitter.title`, `twitter.description`, `twitter.image`, and `twitter.imageAlt`.

For page responsibilities, pages should own content intent (`title`, richer meta description, selected social image and alt text), while the layout owns tag emission, canonical URL calculation, URL absolutization, and fallback behavior. The first implementation slice should update only the homepage, `/etapas`, and five etapa detail pages. It should prefer already-measured, existing images (`/images/fondo_playa.webp`, `/images/fondo-XX.webp`, or `/images/XX.webp`) and should not add new image assets unless a later design phase explicitly chooses a dedicated 1200x630 social image strategy.

Scope boundaries: do not change rendered body content, route structure, sitemap behavior, robots configuration, JSON-LD schema, Mapbox behavior, downloads, or analytics. Do not introduce a new SEO dependency. Do not generate social images dynamically in this slice. Do not add language alternate tags unless multilingual content actually exists.

### Risks

- Social image aspect ratio: existing images are not classic 1200x630 social-card assets; page-specific previews may improve relevance but still crop differently across platforms.
- Metadata duplication: `astro-seo` already supports Twitter fields, so keeping manual `extend.meta` entries alongside native props could produce duplicate/conflicting tags if not cleaned up carefully.
- Description quality: richer descriptions must describe visible page content accurately; keyword stuffing or invented claims would be worse than short descriptions.
- Type/API drift: `astro-seo` requires Open Graph basic fields to be complete; the implementation should include `url` explicitly and map optional image metadata only when dimensions and alt text are known.
- Review size: updating layout, shared data, and seven pages is likely within the 400-line budget, but adding large metadata catalogs or new image assets could push the slice beyond the intended review scope.

### Ready for Proposal

Yes — propose a focused metadata SEO slice that extends the shared layout metadata API, improves page descriptions, and supplies page-specific Open Graph/Twitter images with alt text and dimensions for the homepage, etapas listing, and etapa detail pages. Keep dedicated social-image asset creation, multilingual alternates, and broader structured-data changes out of scope.
