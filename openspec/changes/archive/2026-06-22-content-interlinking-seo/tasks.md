# Tasks: Content Interlinking SEO

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~180-260 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Make `/etapas` self-describing and improve shared link context | PR 1 | Single reviewable slice; keep metadata/JSON-LD unchanged. |

## Phase 1: Route semantics

- [x] 1.1 Update `src/pages/etapas/index.astro` to add one visible page-level `h1` and a short listing explanation; pass `variant="listing"` to `EtapasIntro`; leave all `JsonLd` and metadata wiring untouched.
- [x] 1.2 Extend `src/components/EtapasIntro.astro` with `variant?: "home" | "listing"` and route-specific copy; keep `/descargas/intro.mp3` href, icon, and `AudioPlayer` behavior unchanged.

## Phase 2: Shared link and resource labels

- [x] 2.1 Update `src/components/EtapaCard.astro` so the visible card link/heading identifies `Etapa XX — title`, while preserving the same route and thumbnail.
- [x] 2.2 Add optional context props in `src/components/DownloadIconLinks.astro` so `aria-label`/`title` mention the etapa or resource type; keep href, download, and icon output the same.
- [x] 2.3 Derive richer play/pause/download labels in `src/components/AudioPlayer.astro` from `title`/`subtitle`; do not change the audio source, DOM shape, or JS playback flow.
- [x] 2.4 Add concise visible helper copy in `src/components/EtapaOverview.astro` around audio/download groups and pass etapa context into `DownloadIconLinks`.
- [x] 2.5 Update `src/components/EtapaNav.astro` so prev/next accessible names include the destination etapa title; keep visible labels and routes intact.

## Phase 3: Verification

- [x] 3.1 Build the site and inspect `/`, `/etapas`, and one etapa detail page to confirm heading order, descriptive link names, and unchanged routes/assets.
- [x] 3.2 Verify no edits land in `src/data/structured-data.ts`, `src/layouts/Layout.astro`, or any etapa page files; metadata and JSON-LD must remain unchanged.
