## Exploration: performance-seo

### Current State

The Astro build succeeds and produces 7 static pages in `dist/`. The current performance profile is mostly static HTML/CSS with small first-party JavaScript, but several above-the-fold and third-party resources create Core Web Vitals risk.

Evidence from `npm run build` and `dist/` inspection:

- Build completed successfully in ~1.19s and emitted 7 pages.
- Main CSS bundle is `dist/_astro/structured-data.WO3rGSfK.css` at ~26.4 KB uncompressed.
- First-party map bundle is `dist/_astro/Mapa.astro_astro_type_script_index_0_lang.yTjQF4B1.js` at ~15.2 KB uncompressed.
- `dist/index.html` is ~25.4 KB; etapa pages range from ~27.1 KB to ~34.4 KB.
- `public/images/grunge-background.webp` is ~1.42 MB and is preloaded on every page for desktop via `Layout.astro`, even though it is only a decorative body background at `min-width: 1024px`.
- Homepage LCP is likely `/images/fondo_playa.webp` (~48 KB) or logo/content depending viewport; etapa LCP is likely each `/images/fondo-XX.webp` hero image (~70 KB to ~190 KB). These hero images have dimensions, but no `fetchpriority="high"`, `decoding="async"`, or route-specific preload.
- `Sp2Shell.astro` injects Typekit and Google Fonts stylesheet/preconnect links inside rendered body content, not in `Layout.astro` head. The same font links appear in every page output after head resources.
- Google Analytics uses `type="text/partytown"`, and Partytown assets are emitted. The Partytown bootstrap is still inlined on every page, and each page includes one third-party `gtag` script declaration.
- Mapbox is not in the initial HTML head, but every etapa page loads the first-party map module immediately; `initMaps()` runs on DOMContentLoaded and then dynamically injects Mapbox GL CSS/JS from CDN. This avoids blocking the homepage/listing, but can affect etapa-page INP/network contention before the user interacts with the map.
- `AudioPlayer.astro` uses `<audio preload="none">`, so MP3 payloads are not fetched eagerly. The inline player initializer is duplicated once per rendered player instance; etapa 04 has the most players and the largest page HTML.
- `dist/` includes large public legacy/download assets because everything in `public/` is copied: total `.mp3` ~46.5 MB, `.pdf` ~25.9 MB, `.png` ~7.1 MB. The largest public legacy files are `public/sendapirata_html/landing.pdf` (~8.59 MB) and `landing.png` (~5.98 MB). Prior project docs state `public/sendapirata_html/` is intentionally retained until old public URLs are verified, so this is a hosting/storage and crawl-surface issue, not an immediate safe deletion.

### Affected Areas

- `src/layouts/Layout.astro` — emits global head resources, Partytown/GA, decorative background preload, and body background CSS.
- `src/components/Sp2Shell.astro` — owns Typekit/Google Fonts resource links and site shell classes; moving links to head could improve discovery and avoid body resource timing quirks.
- `src/pages/index.astro` — homepage hero image is above the fold and likely LCP on many viewports.
- `src/components/EtapaHero.astro` — etapa detail hero images are likely LCP candidates and already have measured dimensions.
- `src/components/Mapa.astro` and `src/scripts/map/*` — map module initializes on DOMContentLoaded and dynamically loads Mapbox GL CSS/JS before user interaction.
- `src/components/AudioPlayer.astro` — safe audio preload behavior exists, but inline initializer duplication increases HTML/JS per player.
- `public/images/` — contains the largest render-impacting image (`grunge-background.webp`) and route hero images.
- `public/sendapirata_html/` and `public/descargas/` — large copied static assets increase deployment size and may expose legacy crawl paths, but removal needs URL-retention evidence.

### Approaches

1. **Small Core Web Vitals pass** — Keep architecture intact and tune above-the-fold resources.
   - Pros: Low review size; directly targets LCP/resource discovery; can stay under the 400-line review budget.
   - Cons: Does not remove all third-party/runtime work; needs careful per-route image decisions.
   - Effort: Low

2. **Mapbox lazy activation** — Defer Mapbox GL CSS/JS until the map is near viewport or the user asks to expand/interact.
   - Pros: Strong INP/network improvement on etapa pages; avoids competing with hero/fonts during initial load.
   - Cons: Higher behavior risk; map status/ready timing must remain accessible; geolocation/fullscreen behavior needs manual verification.
   - Effort: Medium

3. **Asset and legacy cleanup** — Retire, redirect, or compress large legacy/download assets.
   - Pros: Large deployment-size and crawl-surface reduction; avoids accidentally indexing old HTML.
   - Cons: Risky without URL analytics/server redirect plan; prior docs explicitly deferred removal of `public/sendapirata_html/`.
   - Effort: Medium/High

4. **Audio player script extraction** — Replace per-instance inline player scripts with one shared module/initializer.
   - Pros: Reduces repeated HTML and duplicated inline JavaScript, especially etapa 04.
   - Cons: Requires careful DOM scoping and regression checks for all player states; smaller CWV impact than image/font/map work.
   - Effort: Medium

### Recommendation

Start with a small proposal for Approach 1, with one optional subtask from Approach 2 only if the line budget remains safe. The first implementation slice should:

- Stop globally preloading the 1.42 MB decorative `grunge-background.webp`; either remove that preload or replace it with a less aggressive hint only when there is evidence it improves desktop rendering.
- Move Typekit/Google Fonts links from `Sp2Shell.astro` into `Layout.astro` head so font discovery is predictable and centralized.
- Add route-specific LCP treatment for the homepage and etapa hero images (`fetchpriority="high"`, `decoding="async"`, and/or page-owned preload through `slot="head"`), while keeping existing width/height dimensions.
- Keep audio `preload="none"` unchanged.
- Do not delete `public/sendapirata_html/` in this slice; document it as a separate URL-retirement decision.

This slice is concrete, evidence-backed, and likely reviewable under 400 changed lines. Mapbox lazy activation should be designed separately if the team wants a stronger INP/network win, because it touches user-visible interactive behavior.

### Risks

- Removing or changing the decorative background preload could alter desktop perceived rendering; verify with generated HTML and manual desktop viewport checks.
- Font-link relocation can change font loading order/FOUT behavior; verify headings/body fonts on home, listing, and one etapa page.
- Hero image preloading must be route-specific; preloading all etapa heroes globally would make performance worse.
- Lazy-loading Mapbox can regress map readiness, expand button behavior, and geolocation activation if implemented too aggressively.
- Legacy public asset deletion is not safe without analytics, redirects, or explicit old-URL retirement approval.

### Ready for Proposal

Yes — propose a small `performance-seo` change focused on above-the-fold resource discovery and avoiding wasteful global preloads. Keep Mapbox lazy activation and legacy asset retirement as explicit follow-up options unless the user approves a larger/riskier scope.
