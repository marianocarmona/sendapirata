## Exploration: content-interlinking-seo

### Current State

The site already has a clear route set: the homepage (`/`), the etapas listing (`/etapas`), and five etapa detail pages (`/etapas/etapa-01` through `/etapas/etapa-05`). Metadata and structured data were recently improved, so this change should focus on visible page content and internal links rather than metadata or JSON-LD unless a later phase finds a concrete mismatch.

The homepage has one `h1` (`Comienza la Senda Pirata`) followed by `EtapasIntro` and etapa cards. The etapas listing currently renders `EtapasIntro` and cards but no visible `h1`, so its heading structure depends on logo/breadcrumb context instead of a page-level heading. Detail pages have one `h1` in `EtapaHero`, then repeated `h2` sections (`Relato`, `Los tesoros escondidos`, `Advertencia del vigía`, `CONSIGUE TU CARTILLA DEL VIGÍA`) and treasure cards as `h3` items.

Internal linking exists through cards, breadcrumbs, and previous/next etapa navigation. Link context is functional but sometimes generic: etapa image links use `Ir a Etapa 01`, card titles omit the route endpoints, download icon links expose labels such as `PDF`, `GPX`, or `Audio (MP3)`, and audio-player download links use `Descargar audio` without the specific track or etapa context. Visible download sections are icon-only, which is efficient visually but weak for visible SEO copy and user clarity.

### Affected Areas

- `src/pages/index.astro` — homepage heading, introductory copy placement, etapa card list context, and links into detail pages.
- `src/pages/etapas/index.astro` — missing visible page-level heading and opportunity for listing-specific intro copy aligned with route-search intent.
- `src/pages/etapas/etapa-01.astro` through `src/pages/etapas/etapa-05.astro` — detail content structure, narrative headings, contextual links back to listing/home, and per-stage resource context.
- `src/components/EtapasIntro.astro` — shared intro appears on both home and listing; useful but currently generic and may need props or surrounding headings to avoid duplicate visible copy.
- `src/components/EtapaCard.astro` — internal links to etapa detail pages and visible card summaries; good candidate for richer link labels or route context without touching page metadata.
- `src/components/DownloadIconLinks.astro` and `src/components/AudioPlayer.astro` — download/audio links are accessible but mostly generic and icon-led; visible labels or contextual aria/title text can improve clarity.
- `src/components/EtapaOverview.astro` — detail page map, audio, stats, and downloads area; good place for small resource copy before PDF/GPX links.
- `src/components/EtapaNav.astro` — previous/next internal linking already exists; labels can be made more descriptive without changing behavior.
- `src/data/etapas.ts` — centralized source for etapa titles, route summaries, downloads, audio tracks, and descriptions; safest place to add reusable SEO-visible copy if needed.

### Approaches

1. **Visible content and link-label refinement** — Add the missing listing `h1`, add short visible intro/context blocks where needed, and improve card/download/audio/navigation labels while preserving existing routes and assets.
   - Pros: Small, reviewable, directly targets semantic headings, visible SEO intent, and internal-link clarity.
   - Cons: Requires careful Spanish copy editing to avoid repetition between homepage, listing, and detail pages.
   - Effort: Low/Medium

2. **Data-model expansion for SEO content** — Extend `EtapaRecord` with dedicated fields such as `introSummary`, `resourceDescription`, and richer download labels, then render them consistently across cards/details.
   - Pros: Centralizes copy and keeps page components clean; reduces future duplication.
   - Cons: More changed lines across data, validation, and components; higher risk of exceeding a small review slice if copy grows.
   - Effort: Medium

3. **Metadata/structured-data follow-up** — Revisit `Layout.astro` and JSON-LD after visible copy changes.
   - Pros: Could align snippets with new page copy if future content materially changes search intent.
   - Cons: Not currently necessary; recent metadata and structured-data work already covers this layer and the requested focus is visible content/internal links.
   - Effort: Medium

### Recommendation

Proceed with Approach 1, using minimal data-model changes only where necessary. The next proposal should keep the scope to visible content and internal links: add a real `h1` to `/etapas`, distinguish homepage vs listing intro intent, improve link/download/audio labels with etapa-specific context, and add small visible resource copy near icon-only download groups. Avoid metadata and JSON-LD changes unless the spec phase identifies a specific user-visible content mismatch that requires metadata alignment.

### Risks

- Duplicate intro copy on `/` and `/etapas` could dilute page purpose if not separated clearly.
- Icon-only download UI may require careful design to add visible text without disrupting the existing compact layout.
- Etapa detail pages duplicate structure manually, so small heading/link changes may touch five files unless extracted cautiously.
- Spanish public copy must remain natural and accurate; generated SDD artifacts stay English, but implementation copy is site-facing Spanish.

### Ready for Proposal

Yes — tell the user this should be proposed as a small visible-content/internal-linking SEO slice, separate from metadata and structured data. Keep the implementation under the 400-line review budget by prioritizing `/etapas` heading/intro, shared link-label improvements, and concise resource context before considering larger copy expansion.
