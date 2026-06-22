# Design: Content Interlinking SEO

## Technical Approach

Make the rendered page content more self-describing without changing routes, assets, metadata, JSON-LD, Mapbox behavior, or downloads. The implementation should keep ownership in the existing Astro page/component structure: pages own route-level headings and page-specific explanations; shared components own repeated card, resource, audio, and navigation labels.

## Architecture Decisions

| Area | Choice | Alternatives considered | Rationale |
|------|--------|-------------------------|-----------|
| `/etapas` heading ownership | `src/pages/etapas/index.astro` owns the visible page-level `h1` and a short listing-specific explanation. | Put the `h1` inside `EtapasIntro`. | The page knows the route intent; keeping the `h1` in the page avoids making a reusable intro component responsible for route semantics. |
| Home/listing intro intent | Add a small `variant` contract to `EtapasIntro.astro`, defaulting to the current home intro and using a listing-specific text when called from `/etapas`. | Duplicate separate intro markup in both pages. | One component preserves styling/audio behavior while allowing copy intent to differ: home introduces the journey; listing explains the stage index. |
| Card headings and links | `EtapaCard.astro` owns card heading level and destination link context, rendering stage links as descriptive text/accessibility names including etapa number and title. | Edit each page list separately. | Cards are reused by home and listing; the link destination context belongs to the card component. |
| Resource labels | Add optional context props to `DownloadIconLinks.astro` and derive richer audio labels inside `AudioPlayer.astro` from existing `title`/`subtitle`. | Expand `src/data/etapas.ts` labels for every resource. | Avoids broad data churn and keeps behavior/URLs unchanged while improving accessible names. |
| Metadata scope | Do not touch `Layout.astro`, `JsonLd.astro`, or `src/data/structured-data`. | Update head output alongside content. | The spec explicitly keeps metadata and JSON-LD unchanged unless strictly required. |

## Data Flow

```text
src/data/etapas.ts
  ├─ index.astro / etapas/index.astro ──→ EtapaCard ──→ DownloadIconLinks
  └─ etapa-XX.astro ──→ EtapaOverview ──→ AudioPlayer + DownloadIconLinks
                          └─ EtapaNav receives current etapa only
```

Spanish UI copy should remain consistent with the existing site language. New copy must use only existing facts from `etapas`: number, title, route summary, audio title/subtitle, and resource type.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/etapas/index.astro` | Modify | Add one visible `h1`, add/listing explanation, call `EtapasIntro` with listing intent, keep existing schemas untouched. |
| `src/components/EtapasIntro.astro` | Modify | Add `variant?: "home" | "listing"`; preserve intro audio/download behavior while changing copy intent per route. |
| `src/components/EtapaCard.astro` | Modify | Make visible/accessible stage links identify `Etapa XX` plus title; use a logical card heading under page `h1`; pass download context. |
| `src/components/DownloadIconLinks.astro` | Modify | Add optional context for computed `aria-label`/`title`; keep href, download, icon, and asset behavior unchanged. |
| `src/components/EtapaOverview.astro` | Modify | Add concise visible context around audio/download groups and pass etapa-specific download context. |
| `src/components/AudioPlayer.astro` | Modify | Derive play/pause/download accessible names from title/subtitle; keep DOM behavior and audio source unchanged. |
| `src/components/EtapaNav.astro` | Modify | Include destination etapa title in previous/next accessible names; visible labels already remain descriptive. |

Likely unchanged: `src/pages/index.astro`, `src/pages/etapas/etapa-01.astro` through `etapa-05.astro`, `src/data/etapas.ts`, `src/layouts/Layout.astro`, `src/components/JsonLd.astro`, and SEO data helpers.

## Interfaces / Contracts

```ts
// EtapasIntro.astro
variant?: "home" | "listing";

// DownloadIconLinks.astro
contextLabel?: string; // e.g. "Etapa 01 — El Guardián del Horizonte"
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Astro renders all public routes. | Run `npm run build`. |
| Content structure | `/etapas` has exactly one visible `h1`; detail pages keep `EtapaHero` as `h1` and section `h2`s. | Inspect rendered HTML or built files for headings. |
| Link/resource context | Etapa cards, navigation, audio, PDF, and GPX actions identify destination/resource without icon-only context. | Inspect rendered anchors/buttons and accessible labels. |
| Regression | Routes, map GeoJSON URLs, audio sources, PDFs, GPX files, metadata, and JSON-LD remain unchanged. | Compare changed files; verify no edits to metadata/structured-data files. |

## Migration / Rollout

No migration required. This should fit in one reviewable PR under the 400 changed-line budget because it avoids per-etapa page edits and data-model rewrites.

## Open Questions

- [ ] None.
