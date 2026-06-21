# Proposal: Project Quality Cleanup

## Intent

Improve the public Astro site across maintainability, performance, accessibility, and security. Use the audit scope, reduce maintenance risk, and preserve route content, visual identity, downloads, and Mapbox maps. `index_2` removal is already complete and out of scope.

## Proposal Question Round

Assumptions for review: legacy `public/sendapirata_html/` can be removed unless external links require it; Mapbox remains; cleanup favors small extractions over redesign. Open questions: canonical social image, required legacy downloads, and old-URL redirects.

## Scope

### In Scope
- Refactor large `src/components/Mapa.astro` into safer, smaller client responsibilities.
- Reduce duplicated etapa page structure/data where it lowers risk.
- Audit/remove legacy public assets and unused `@vite-pwa/astro` if confirmed unused.
- Improve Mapbox CDN/loading, image loading/decoding, SEO metadata, keyboard focus, token guidance, and static `innerHTML` hardening.

### Out of Scope
- Redesign, copy rewrite, provider migration, analytics changes, or new PWA behavior.
- Completed `index_2` deletion.

## Capabilities

### New Capabilities
- `site-quality`: quality requirements for maintainability, performance, accessibility, SEO, and security cleanup.
- `route-content-structure`: shared etapa structure/data expectations across list and detail pages.
- `map-experience`: Mapbox loading, fallback, interaction, and token safety.

### Modified Capabilities
- None; no baseline OpenSpec specs exist yet.

## Approach

Make low-risk cleanup first, then component/data extraction. Verify references before deleting assets or dependencies. Prefer progressive enhancement: maps/images load efficiently and fail clearly without blocking static content.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Mapa.astro` | Modified | Split logic, improve loading, harden SVG toggles. |
| `src/pages/etapas/*.astro` | Modified | Reduce repeated stage layout/data. |
| `public/sendapirata_html/`, `public/images/`, `public/descargas/` | Removed/Modified | Remove or document legacy/unused assets. |
| `Layout.astro`, page images | Modified | Real SEO metadata and image loading/decoding. |
| `package.json`, docs | Modified | Remove unused PWA dependency if safe; document token restrictions. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Removing externally linked legacy files | Medium | Inventory URLs; defer or redirect uncertain assets. |
| Map behavior regression | Medium | Keep public API stable and test all five routes. |
| Over-refactor exceeds review budget | Medium | Slice work before apply if forecast exceeds 800 changed lines. |

## Rollback Plan

Revert the cleanup commit or PR slice. Restoring deleted public assets and dependency entries recovers prior output; no data migration is planned.

## Dependencies

- Confirm legacy asset ownership and canonical SEO image.
- Restrict Mapbox public token by domain in Mapbox.

## Success Criteria

- [ ] Build passes and all five etapa pages retain current content and downloads.
- [ ] No confirmed unused dependency or legacy asset remains publicly served.
- [ ] Mapbox/images load efficiently with focus states and no unsafe dynamic HTML.
- [ ] SEO placeholders are replaced with product-specific metadata.
