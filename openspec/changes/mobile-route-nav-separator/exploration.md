## Exploration: mobile-route-nav-separator

### Current State
`src/components/EtapaNav.astro` is the shared previous/next navigation component used by all route detail pages (`etapa-01` through `etapa-05`). It renders a black navigation band with a visible heading, a mobile-first vertical link container (`flex flex-col gap-3`) and a desktop row layout from `md` upward.

The prior mobile layout already hides missing previous/next placeholders on mobile (`hidden ... md:block`), so first and last route pages only show one available link. Middle route pages show both previous and next links stacked on mobile with only `gap-3` between full-card links. This can make the two actions feel visually merged or awkward without a separator. Desktop alignment relies on the current `md:flex-row`, `md:flex-1`, and placeholder behavior and should remain untouched.

### Affected Areas
- `src/components/EtapaNav.astro` — single source of route previous/next navigation; the separator should be implemented here if proposed.
- `src/pages/etapas/etapa-01.astro` through `src/pages/etapas/etapa-05.astro` — consumers of `EtapaNav`; likely no direct changes needed.
- `openspec/specs/site-quality/spec.md` — contains the existing mobile route navigation requirements and verification expectations.

### Approaches
1. **Conditional mobile divider between links** — Render a narrow white divider only when both `prev` and `next` exist, hidden at `md` and above.
   - Pros: Matches the user request directly; avoids separators on first/last route pages; preserves desktop layout; tiny and reviewable.
   - Cons: Adds one conditional markup element that must not be exposed as meaningful content to assistive technology.
   - Effort: Low

2. **Use border/pseudo-element styling on one link** — Add a mobile-only top or bottom border to the next/previous link when both links exist.
   - Pros: Minimal extra DOM; can stay inside existing link markup.
   - Cons: Harder to reason about because the visual separator is attached to one action; riskier with rounded card borders and hover states.
   - Effort: Low

3. **Increase spacing only** — Increase the mobile `gap-*` between stacked links instead of adding a line.
   - Pros: Smallest class-only change.
   - Cons: Does not satisfy the requested white line; may make the section taller without improving grouping clarity enough.
   - Effort: Low

### Recommendation
Use Approach 1. Add a conditional mobile-only separator between the previous and next anchors when both links exist, for example an `aria-hidden="true"` divider with white/low-opacity border or background styling and `md:hidden`. Keep the existing mobile column and desktop row classes unchanged so the change is limited to the visual relationship between stacked links.

### Risks
- A full-opacity white line may be too visually strong against the current black band and card borders; a white line with controlled opacity may better preserve the visual hierarchy.
- The separator must be conditional on `prev && next` so first and last route pages do not show an orphan divider.
- The separator must be hidden from assistive technology and hidden on desktop to avoid changing navigation semantics or desktop presentation.
- No visual regression test runner is configured; verification should rely on `npm run build` plus manual mobile and desktop viewport checks.

### Ready for Proposal
Yes — propose a very small visual refinement scoped to `EtapaNav.astro`: add a conditional mobile-only white separator between stacked previous/next links, preserve first/last route behavior, preserve desktop layout, and verify with build plus responsive review.
