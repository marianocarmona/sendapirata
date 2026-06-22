# Design: Metadata SEO

## Technical Approach

Extend the existing layout-centered SEO gateway instead of spreading `astro-seo` configuration across pages. Pages continue to own `title` and `description`, and may pass optional social image metadata. `Layout.astro` remains responsible for canonical URL generation, absolute social image URLs, fallback behavior, and the final Open Graph/Twitter mapping.

This satisfies the delta spec by keeping page metadata truthful to existing content, allowing page-specific preview images with dimensions and alt text, preserving centralized canonicals, and removing duplicate Twitter tag paths.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Layout API | Add optional `socialImage` prop to `Layout.astro` while keeping `title` and `description` stable. | Full page-level `astro-seo` objects or a larger metadata-builder module. | Smallest change for seven static pages; preserves the current layout contract and keeps tag rules centralized. |
| Metadata source | Store richer etapa descriptions and social image intent on `EtapaRecord`; keep home/listing metadata local to their pages. | Duplicate etapa metadata in each page or create a separate SEO catalog. | Etapa data is already centralized, validated, and consumed by all etapa pages; home/listing are one-off pages. |
| Social tags | Use native `astro-seo` `openGraph` and `twitter` fields for title, description, image, and image alt; keep `extend.meta` only for metadata not covered natively. | Continue manual `twitter:*` entries in `extend.meta`. | One rendering path avoids duplicate/conflicting Twitter image/title/description tags. |
| Images | Reuse existing measured public images from `src/data/image-dimensions.ts`. | Add dedicated 1200x630 social cards or probe image files at runtime. | Meets scope without new assets; dimensions remain deterministic at build time. |
| Canonicals | Preserve `toCanonicalUrl(Astro.url.pathname, siteUrl)` inside `Layout.astro`. | Let pages pass canonical paths. | Centralized canonical generation already exists and is required by the spec. |

## Data Flow

```text
Page metadata intent
  ├─ home/listing local constants
  └─ etapa record fields
        ↓
<Layout title description socialImage?>
        ↓
Layout fallback + absolute URL + canonical URL
        ↓
astro-seo Open Graph + Twitter tags
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/layouts/Layout.astro` | Modify | Add the optional social metadata prop, resolve defaults, include `openGraph.basic.url`, `openGraph.optional.description/siteName/locale`, `openGraph.image`, and native `twitter` fields. Remove manual duplicate Twitter title/description/image entries from `extend.meta`. |
| `src/data/site.ts` | Modify | Add fallback social image alt text and dimensions using existing site default image data. |
| `src/data/etapas.ts` | Modify | Add richer `layoutDescription` values and optional social image metadata sourced from existing etapa image/alt fields. |
| `src/pages/index.astro` | Modify | Use richer homepage description and pass measured `/images/fondo_playa.webp` social image metadata. |
| `src/pages/etapas/index.astro` | Modify | Use richer listing description and pass measured listing/social image metadata. |
| `src/pages/etapas/etapa-01.astro` to `etapa-05.astro` | Modify | Pass `etapa.socialImage` to the layout while retaining page body content. |

## Interfaces / Contracts

```ts
interface SocialImageMetadata {
  src: PublicAssetPath;
  alt: string;
  width: number;
  height: number;
}

interface LayoutProps {
  title: string;
  description?: string;
  socialImage?: SocialImageMetadata;
}
```

Fallback contract: if `description` is omitted, use `SITE_DESCRIPTION`; if `socialImage` is omitted, use the site default image path, alt text, width, and height. `Layout.astro` converts `src` to an absolute URL with `toAbsoluteUrl()` before passing it to Open Graph and Twitter.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Build/type | Strict Astro/TypeScript compatibility and public asset validation. | Run `npm run build`. |
| Metadata output | Target pages emit one canonical, one coherent OG/Twitter title/description/image set, and image alt/width/height where configured. | Inspect generated HTML in `dist/` for `/`, `/etapas/`, and representative etapa pages. |
| Regression | Body content, routes, JSON-LD, sitemap, analytics, maps, downloads remain unchanged. | Review diff scope; avoid edits outside metadata/data/page props. |

## Migration / Rollout

No migration required. Static metadata changes roll out with the next build and can be reverted by reverting the implementation commit.

## Open Questions

None.
