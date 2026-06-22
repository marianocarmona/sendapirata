# Design: Performance SEO

## Technical Approach

Keep this slice small and resource-order focused: `Layout.astro` owns document-head resource discovery, `Sp2Shell.astro` owns only shell markup, and route components/components that render the visible hero own LCP priority. This implements `site-quality` requirements by removing unnecessary global priority while preserving content, Mapbox, audio, downloads, routes, and visual identity.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Decorative background priority | Remove the global `/images/grunge-background.webp` preload from `Layout.astro`; keep the existing desktop CSS background. | Route-scope the preload, keep it globally, or delete the background. | The asset is decorative and not route-specific LCP. Removing only the preload avoids over-prioritization without changing the visible background CSS. |
| Font ownership | Move the exact Typekit and Google Fonts links from `Sp2Shell.astro` into `Layout.astro` `<head>`. | Leave body-emitted links or add font preloads. | Head ownership satisfies the spec and improves discovery order. Keeping the same URLs/order avoids introducing new FOUT/FOIT behavior; no font-display or preload strategy changes. |
| Hero/LCP priority | Add native `loading="eager"` and `fetchpriority="high"` only to the homepage hero image and `EtapaHero.astro` detail hero image. | Global `<link rel="preload">` hero hints or a new `Layout` hero preload prop. | The image element is already route-scoped. Native attributes prioritize only the image rendered on that route and avoid preloading non-current hero assets. |
| Scope control | Do not change Mapbox lazy behavior, audio preload/refactor, or legacy asset cleanup. | Bundle these optimizations together. | They are explicit non-goals and would exceed the conservative first-slice review intent. |

## Data Flow

```text
Route page ──→ Layout head: SEO + font links + page head slot
           └─→ Sp2Shell shell markup
Homepage ───→ direct hero <img loading=eager fetchpriority=high>
Etapa page ─→ etapa data ─→ EtapaHero ─→ current hero <img loading=eager fetchpriority=high>
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/layouts/Layout.astro` | Modify | Remove decorative background preload; add existing Typekit/Google font links in `<head>`; keep CSS desktop background. |
| `src/components/Sp2Shell.astro` | Modify | Remove body-level font `<link>` tags; keep shell classes and slots unchanged. |
| `src/pages/index.astro` | Modify | Add eager/high-priority attributes to `/images/fondo_playa.webp` only on the homepage. |
| `src/components/EtapaHero.astro` | Modify | Add eager/high-priority attributes to the current etapa hero only. Props stay unchanged. |

Likely changed lines: low (<100). The orchestrator should report exact planned files and edits before `sdd-apply`.

## Interfaces / Contracts

No new public routes, data structures, component props, or environment variables. Existing `<Layout><slot name="head" /></Layout>` behavior remains. Existing `EtapaHero` `Props` contract remains `{ etapa: EtapaRecord }`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Static generation still succeeds | Run `npm run build`. |
| Generated HTML | No global decorative preload | Inspect `dist/**/*.html` for absence of `<link rel="preload" ... grunge-background.webp>`. CSS may still reference the background. |
| Generated HTML | Fonts are head-owned and not body-duplicated | Inspect `dist/index.html`, `dist/etapas/index.html`, and one detail page for Typekit/Google links inside `<head>` only. |
| Generated HTML | Hero priority is route-specific | Inspect `dist/index.html` for only `/images/fondo_playa.webp` high priority and each detail page for only its own `fondo-XX.webp`; listing cards remain lazy. |
| Regression | Non-goals preserved | Confirm Mapbox script behavior, audio `preload="none"`, and legacy/public assets are unchanged by source diff. |

## Migration / Rollout

No migration required. Rollback is a single implementation commit revert restoring previous preload placement and image attributes.

## Open Questions

None.
