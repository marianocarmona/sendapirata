# Design: Mobile Route Nav Separator

## Technical Approach

Add one conditional decorative divider inside `src/components/EtapaNav.astro`, directly between the existing previous-link render block and next-link render block. The divider is rendered only when both `prev` and `next` exist, is hidden from assistive technology, and is hidden at `md` and above so the current desktop row layout remains equivalent.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|----------|--------|-------------------------|-----------|
| Single component scope | Modify only `src/components/EtapaNav.astro` | Page-level changes in `src/pages/etapas/*`; route data changes | `EtapaNav` already owns previous/next derivation and markup for all etapa pages, so one tiny component change satisfies the spec without duplicating behavior. |
| Conditional placement | Insert `{prev && next && (...)}` after the previous block's closing conditional and before the next block's opening conditional, inside the existing flex container | Add divider inside either anchor; add CSS pseudo-element | A sibling divider separates the two cards visually without changing link content, labels, tab order, or route semantics. |
| Styling | Use `class="my-1 h-px w-full bg-white/20 md:hidden"` with `aria-hidden="true"` | Stronger opacity; border token; desktop-aware CSS | White at low opacity is subtle on the black nav background, avoids new tokens, and `md:hidden` provides an explicit desktop guard. |

## Data Flow

No new data flow is introduced.

```text
Astro.props.current ──→ prev/next numbers ──→ EtapaNav markup
                              │
                              └── prev && next controls divider rendering
```

When only `prev` or only `next` exists, the condition is false and no separator is emitted. Existing desktop placeholder spans remain unchanged.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/EtapaNav.astro` | Modify | Add a decorative mobile-only divider between previous and next cards when both exist. |

No page, data, asset, style token, dependency, or config files should change during apply.

## Interfaces / Contracts

No public API or TypeScript interface changes.

Recommended markup for apply:

```astro
{prev && next && (
	<div aria-hidden="true" class="my-1 h-px w-full bg-white/20 md:hidden"></div>
)}
```

Place it inside the existing `<div class="flex flex-col gap-3 md:flex-row ...">`, between the previous conditional render and the next conditional render.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Astro/Tailwind compilation | Run `npm run build`. |
| Responsive review | `/etapas/etapa-01`, `/etapas/etapa-03`, `/etapas/etapa-05` | On mobile, confirm etapa 03 shows one separator between cards; etapa 01 and 05 show no orphan separator. At `md` and above, confirm no visible divider and layout remains equivalent. |
| Accessibility | Decorative/non-interactive behavior | Inspect rendered markup: divider has `aria-hidden="true"`, no focusability, and no link/navigation semantics. |

Before apply, the orchestrator should report the exact planned file and change: `src/components/EtapaNav.astro` only, inserting the conditional divider between previous and next blocks.

## Migration / Rollout

No migration required. Rollback is removing the conditional divider markup.

## Open Questions

None.
