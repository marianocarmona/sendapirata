# Design: Mobile Route Footer Layout

## Technical Approach

Implement the change in the two shared components that already own the affected UI: `EtapaNav.astro` for previous/next route navigation and `Pie.astro` for footer logos. Use mobile-first Tailwind utilities, then restore the current desktop presentation from `md` upward. This satisfies the `site-quality` delta without touching route pages, data, assets, maps, or downloads.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|----------|--------|-------------------------|-----------|
| Route nav ownership | Keep all route-nav behavior in `src/components/EtapaNav.astro`. | Edit every `src/pages/etapas/etapa-*.astro`; create a mobile-only component. | The route pages already consume one shared component, so centralized markup keeps the diff small and avoids page-order regressions. |
| Purpose clarity | Add one short visible label, e.g. `Navega por etapas`, and connect the `<nav>` to it with `aria-labelledby`. | Add longer explanatory copy; rely only on `aria-label`; add per-link helper text. | A compact visible label makes purpose clear for sighted users and assistive tech without adding noisy copy. Existing per-link `aria-label`s still describe exact destinations. |
| Mobile missing-link behavior | Hide previous/next placeholders on mobile and keep desktop-only placeholders with `hidden md:block` when needed. | Remove placeholders entirely; keep current transparent placeholders. | Mobile avoids misleading empty space for etapa 01/05, while desktop keeps the current two-column visual balance. |
| Footer ownership | Change only the logo row in `src/components/Pie.astro` to `flex-col items-center justify-center` on mobile and `md:flex-row md:justify-between` on desktop. | Add page-specific footer variants; change assets or text. | `Pie` is shared by home, listing, and route pages, so one responsive wrapper fixes all surfaces while preserving desktop behavior. |

## Data Flow

No data model changes.

```text
src/pages/etapas/etapa-01..05 ── current ──> EtapaNav
                                      │
                                      ├─ computes prev/next from current + totalEtapas
                                      └─ renders compact mobile links / desktop two-column links

Home, listing, route pages ───────────────> Pie ── renders same images with responsive layout
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/EtapaNav.astro` | Modify | Reduce mobile padding, add concise visible purpose label, use mobile `flex-col` stacked links, hide missing-side placeholders on mobile, restore desktop row layout and placeholder balance with `md:` utilities. |
| `src/components/Pie.astro` | Modify | Stack and center logos on mobile with a vertical gap; preserve current desktop row and spacing from `md` upward. |

No direct changes are planned for `src/pages/etapas/*.astro`, `src/pages/index.astro`, `src/pages/etapas/index.astro`, assets, data, or global styles.

## Interfaces / Contracts

No public props or data contracts change. `EtapaNav` keeps `current`, `total`, and `basePath`; `Pie` keeps `class` and `containerClass`.

Accessibility contract:
- The nav landmark remains a real `<nav>` and should use the visible label as its accessible name.
- Previous/next links remain real anchors with full destination `aria-label`s such as “Volver a la etapa 01 — …”.
- On etapa 01 and etapa 05, the missing side should not expose an inert mobile control or misleading empty visual card.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Astro/Tailwind output remains valid. | Run `npm run build`. |
| Responsive review | Mobile route nav is compact and clear; missing side does not reserve space. | Review `/etapas/etapa-01`, `/etapas/etapa-03`, `/etapas/etapa-05` at narrow width and at `md` or wider. |
| Shared footer review | Logos stack and center on mobile while desktop remains equivalent. | Review `/`, `/etapas`, and one route page on mobile and desktop. |
| Accessibility review | Nav label and link names remain understandable by keyboard/screen reader inspection. | Tab through route nav and inspect accessible names if tooling is available. |

## Migration / Rollout

No migration required. Rollback is limited to reverting `EtapaNav.astro` and `Pie.astro`.

## Review Budget

Expected implementation is well under the 400 changed-line budget: two component files, no duplicated page edits, no asset churn. Before apply, the orchestrator should report the exact planned file changes and confirm the diff remains scoped to `EtapaNav.astro` and `Pie.astro`.

## Open Questions

None.
