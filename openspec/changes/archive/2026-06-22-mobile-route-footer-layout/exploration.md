# Exploration: mobile-route-footer-layout

### Current State

Route detail pages (`src/pages/etapas/etapa-01.astro` through `etapa-05.astro`) all render the same closing sequence: `EtapaCierre`, then `EtapaNav`, then `Pie`. The previous/next route area is centralized in `src/components/EtapaNav.astro`; the footer logo layout is centralized in `src/components/Pie.astro`.

`EtapaNav` currently uses a black full-width band with `py-8!`, two equal-width card links, and transparent placeholder spans when one side is missing. On mobile this keeps a large navigation block even when only one real link exists, makes the section purpose depend mostly on the link labels, and truncates titles inside constrained horizontal cards.

`Pie` currently lays the two logos in one horizontal row with `flex items-center justify-between py-6`. This preserves desktop spacing, but on narrow screens the logos remain separated horizontally instead of stacking vertically and centering.

### Affected Areas

- `src/components/EtapaNav.astro` — shared previous/next route navigation for all route detail pages; main source of mobile spacing and purpose clarity issues.
- `src/components/Pie.astro` — shared site footer logos used by home, route listing, and route detail pages; main source of mobile logo alignment issue.
- `src/pages/etapas/etapa-01.astro` through `src/pages/etapas/etapa-05.astro` — consumers of `EtapaNav` and `Pie`; likely no direct changes needed unless copy or placement changes are required.
- `openspec/specs/route-content-structure/spec.md` — existing requirements expect route detail structure to remain consistent and public behavior to stay safe.
- `openspec/specs/site-quality/spec.md` — existing requirements emphasize preserving visual identity, public navigation behavior, and keyboard access.

### Approaches

1. **Responsive class-only adjustment** — Keep the same markup and use mobile-first Tailwind classes to stack the nav links, reduce padding, hide placeholders on mobile, and stack footer logos.
   - Pros: Smallest implementation; preserves centralized components and desktop behavior; low review risk.
   - Cons: Limited opportunity to improve semantic clarity beyond spacing and visible labels.
   - Effort: Low

2. **Add a mobile section heading and compact stacked links** — Add concise visible text such as a small heading/label to `EtapaNav`, make mobile layout vertical, hide empty placeholders on mobile, and keep the current horizontal card layout from `md` upward.
   - Pros: Directly addresses unclear purpose and excessive mobile footprint; keeps desktop mostly unchanged; improves scanability and accessibility context.
   - Cons: Adds visible copy that must be approved; needs careful spacing so the black band does not become taller than necessary.
   - Effort: Low

3. **Replace route nav with a different mobile-only component variant** — Render a dedicated compact mobile layout and a separate desktop layout.
   - Pros: Maximum control over mobile UX.
   - Cons: More duplication and higher regression risk for a small layout issue; unnecessary unless design requirements diverge strongly by breakpoint.
   - Effort: Medium

### Recommendation

Use Approach 2. Keep `EtapaNav` as the single source of truth, add a concise visible purpose label, make the mobile layout compact and vertical, remove mobile space reserved for missing previous/next links, and preserve the current two-column desktop layout with `md:` classes. In `Pie`, switch the logo wrapper to mobile `flex-col items-center justify-center gap-*` and restore desktop `md:flex-row md:justify-between` behavior.

This is the lowest-risk path that addresses both user complaints: purpose clarity in the route navigation and stacked, centered logos on mobile.

### Risks

- The purpose label copy is visible UI text; it should stay short and match the existing Spanish site tone.
- Hiding placeholder spans on mobile must not collapse desktop alignment for first and last route pages.
- Footer changes affect home, route listing, and route detail pages because `Pie` is shared; desktop classes should preserve current horizontal layout.
- There is no configured visual regression test runner, so verification should rely on `npm run build` plus targeted manual viewport checks.

### Ready for Proposal

Yes — propose a small responsive layout change scoped to `EtapaNav.astro` and `Pie.astro`, preserving route pages and desktop layout while improving mobile clarity and spacing.
