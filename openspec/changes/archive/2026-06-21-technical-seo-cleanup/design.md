# Design: Technical SEO Cleanup

## Technical Approach

Implement the first SEO slice as a static Astro foundation change: configure the production origin once, let the official sitemap integration generate crawl discovery, expose a static crawl policy, use `astro-seo` as the only canonical tag emitter, promote the existing homepage heading to `<h1>`, and add stable sizing to targeted images without changing the visual layout. This satisfies the `site-quality` delta for crawl URLs, homepage heading semantics, and shared image stability.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Production origin | Set `site: "https://sendapirata.com/"` in `astro.config.mjs`; optionally mirror the literal as `SITE_ORIGIN` in `src/data/site.ts` only if reused outside config. | Environment-specific site URL. | The confirmed canonical origin is fixed for production; Astro sitemap and `Astro.site` need a stable absolute origin. |
| Sitemap and robots | Add `@astrojs/sitemap`, import `sitemap` in `astro.config.mjs`, append `sitemap()` after Partytown, and create `public/robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: https://sendapirata.com/sitemap-index.xml`. | Hand-written sitemap or Astro API `robots.txt`. | Official integration covers current file-based routes. Static robots is enough because the origin is confirmed and avoids extra runtime/API surface. |
| Canonical output | Compute `canonicalUrl = new URL(Astro.url.pathname, Astro.site).toString()` in `Layout.astro` and pass it through `<SEO canonical={canonicalUrl}>`. Do not add canonical links through `extend.link` or manual `<link>` tags. | Manual canonical link beside `astro-seo`; per-page canonical props. | `astro-seo` already supports canonical output; using its prop keeps one canonical source and avoids duplicate tags. |
| Homepage heading | Change the visible “Comienza la Senda Pirata” heading in `src/pages/index.astro` from `<h2>` to `<h1>` with the same classes. | Hidden `<h1>` or logo-as-heading. | The page already has the right visible primary text; changing the element preserves visual design and avoids hidden semantic debt. |
| Image sizing | Add exact `width`/`height` attributes through component markup, backed by a targeted `src/data/image-dimensions.ts` lookup for dynamic public image paths. Use CSS classes/object-fit/aspect-ratio for rendered size. | Guessing common dimensions; converting all images to Astro image pipeline. | Public assets are served directly today. A typed lookup prevents generic inaccurate dimensions, especially mixed 174/175 card images and 1124/1125 hero images. |

## Data Flow

```text
astro.config.mjs site ──→ Astro.site ──→ Layout canonical ──→ astro-seo <link rel="canonical">
        │
        └──→ @astrojs/sitemap ──→ dist/sitemap-index.xml

public image path ──→ image-dimensions lookup ──→ component width/height attrs ──→ existing CSS responsive rendering
```

## File Changes

| File | Action | Description |
|---|---|---|
| `astro.config.mjs` | Modify | Add `site` and `@astrojs/sitemap` integration while preserving Tailwind and Partytown. |
| `package.json`, `package-lock.json` | Modify | Add `@astrojs/sitemap`. |
| `public/robots.txt` | Create | Allow crawling and reference the generated sitemap index. |
| `src/layouts/Layout.astro` | Modify | Pass one absolute canonical URL to `astro-seo`; keep existing meta/Open Graph behavior. |
| `src/pages/index.astro` | Modify | Promote the current visible homepage heading to `<h1>` and size the homepage hero image. |
| `src/data/image-dimensions.ts` | Create | Exact dimensions for targeted public images, measured from source files; helper fails for missing entries. |
| `src/components/Cabecera.astro` | Modify | Apply exact logo dimensions for both logo variants. |
| `src/components/EtapaHero.astro`, `EtapaCard.astro`, `EtapaTreasureCard.astro`, `DownloadIconLinks.astro`, `EtapasIntro.astro`, `Pie.astro`, `EtapaCierre.astro` | Modify | Add exact dimensions or stable ratio guards while preserving existing responsive classes. |

## Interfaces / Contracts

```ts
export interface ImageDimensions { width: number; height: number }
export function getImageDimensions(path: PublicAssetPath): ImageDimensions;
```

The lookup MUST contain only measured dimensions for assets touched by this slice. If exact intrinsic dimensions are unavailable, the implementation MUST use a CSS aspect-ratio guard instead of inventing `width`/`height` values.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Build | Astro config, sitemap integration, typed component changes | Run `npm run build`. |
| Static output | `robots.txt`, sitemap index, one canonical per built HTML page, homepage one `<h1>` | Inspect `dist/robots.txt`, sitemap files, and built HTML with a small shell/Node check after build. |
| Visual smoke | Responsive image layout remains stable | Run `npm run preview` and check homepage plus one etapa page at mobile/desktop widths. |

Strict TDD is disabled for this Astro repo; verification is build + static-output inspection + manual preview smoke.

## Migration / Rollout

No migration required. Rollback is reverting config/dependency, deleting `robots.txt`, and reverting markup/data sizing changes.

## Open Questions

None.
