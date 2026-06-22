# Proposal: Content Interlinking SEO

## Problem

The site is crawlable, but visible structure and internal-link context are weaker than the recent metadata layer: `/etapas` has no page-level `h1`, some links are generic, and audio/download resources rely on icon-led labels.

## Goals

- Make route hierarchy obvious to users and search engines through visible headings and explanatory copy.
- Improve descriptive internal links for etapa cards, previous/next navigation, audio, and downloads.
- Keep the first slice small, reviewable, and focused on indexing signals in rendered content.

## Acceptance Criteria

- [x] `/etapas` has one visible page-level `h1` and clear listing explanation.
- [x] Internal links and resource actions include descriptive visible or accessibility context.
- [x] Heading hierarchy remains consistent on home, listing, and etapa detail pages.
- [x] No application code is changed until apply approval.

## Non-goals

- No metadata, canonical, Open Graph, Twitter, sitemap, or JSON-LD work unless a later phase proves a required mismatch.
- No route, asset, Mapbox, visual redesign, or content-architecture rewrite.

## Scope and Constraints

### In Scope
- Add a visible `/etapas` `h1` and short listing explanation.
- Normalize heading hierarchy where route pages currently depend on surrounding chrome.
- Add concise visible/accessibility context for audio and download resources if it can be done without expanding the data model broadly.

### Constraints
- No code changes before apply approval.
- Before apply, the orchestrator must tell the user exactly which files and changes are proposed.
- Review budget target: under 400 changed lines; prefer one small PR.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `route-content-structure`: Require route content to expose meaningful visible headings, explanations, and link labels from the existing etapa model.
- `site-quality`: Preserve public behavior while improving crawlable content, accessibility context, and reviewability.

## First Implementation Slice

Update the `/etapas` listing structure first, then shared components that improve labels/resource context across pages. Touch individual etapa pages only if shared components cannot provide the necessary context cleanly.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/etapas/index.astro` | Modified | Add listing `h1` and explanatory copy. |
| `src/components/EtapasIntro.astro` | Modified | Separate homepage/listing intro intent if needed. |
| `src/components/EtapaCard.astro` | Modified | Make etapa links more descriptive. |
| `src/components/EtapaOverview.astro`, `AudioPlayer.astro`, `DownloadIconLinks.astro`, `EtapaNav.astro` | Modified | Add concise resource and navigation context. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Duplicate copy between `/` and `/etapas` | Medium | Keep listing copy route-specific and short. |
| Scope creep into SEO metadata | Low | Defer metadata/JSON-LD explicitly. |
| Five detail pages increase diff size | Medium | Prefer shared components first. |

## Rollback Plan

Revert the proposal slice commit; no data migrations, route changes, or asset removals are expected.

## Dependencies

- Exploration artifact: `openspec/changes/content-interlinking-seo/exploration.md` and Engram `sdd/content-interlinking-seo/explore`.

## Acceptance Criteria

- [ ] `/etapas` has one visible page-level `h1` and clear listing explanation.
- [ ] Internal links and resource actions include descriptive visible or accessibility context.
- [ ] Heading hierarchy remains consistent on home, listing, and etapa detail pages.
- [ ] No application code is changed until apply approval.
