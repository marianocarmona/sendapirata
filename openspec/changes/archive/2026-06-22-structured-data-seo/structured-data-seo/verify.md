# Verification Report: structured-data-seo

## Final Verdict
PASS

## Commands Run
- PASS: `npm run build`
- PASS: JSON-LD parse and type inspection for `/`, `/etapas/`, and `/etapas/etapa-01/` through `/etapas/etapa-05/`.
- PASS: JSON-LD banned-claim search for `GeoShape`, `Review`, `Offer`, `Event`, `FAQPage`, `AudioObject`, `MediaObject`, `DownloadAction`, `GeoCoordinates`, `coordinates`.
- PASS: Schema.org evidence check for `TouristTrip` via https://schema.org/TouristTrip.

## Output Inspection Matrix

| Route | JSON-LD blocks | Parsed nodes | Types | Result |
|---|---:|---:|---|---|
| `/` | 1 | 2 | WebSite, ItemList | PASS |
| `/etapas/` | 1 | 3 | CollectionPage, ItemList, BreadcrumbList | PASS |
| `/etapas/etapa-01/` | 1 | 2 | TouristTrip, BreadcrumbList | PASS |
| `/etapas/etapa-02/` | 1 | 2 | TouristTrip, BreadcrumbList | PASS |
| `/etapas/etapa-03/` | 1 | 2 | TouristTrip, BreadcrumbList | PASS |
| `/etapas/etapa-04/` | 1 | 2 | TouristTrip, BreadcrumbList | PASS |
| `/etapas/etapa-05/` | 1 | 2 | TouristTrip, BreadcrumbList | PASS |

## Findings
- PASS: All expected JSON-LD scripts exist and parse successfully.
- PASS: Homepage emits `WebSite` and `ItemList`, with no `BreadcrumbList`.
- PASS: Etapa listing emits `CollectionPage`, `ItemList`, and `BreadcrumbList`.
- PASS: Each etapa detail page emits one conservative `TouristTrip` route entity plus `BreadcrumbList`.
- PASS: JSON-LD URLs and images use the configured production origin `https://sendapirata.com/`, matching `astro.config.mjs` and shared SEO URL helpers.
- PASS: No duplicate or broken JSON-LD blocks were found. Each inspected page has exactly one JSON-LD script containing the expected node array.
- PASS: No banned/unsupported JSON-LD claims were emitted: `GeoShape`, `Review`, `Offer`, `Event`, `FAQPage`, `AudioObject`, `MediaObject`, `DownloadAction`, `GeoCoordinates`, `coordinates`.
- WARNING: Searching full HTML for the literal token `Event` finds Partytown runtime text outside JSON-LD; this is not structured data and does not violate the schema requirement.
- PASS: `TouristTrip` can remain. Local evidence describes each page as a tourist route itinerary using visible origin/destination labels, and schema.org documents `TouristTrip` as a valid type with `itinerary` accepting `ItemList` or `Place`. No validator rejection evidence was found, so the `WebPage` fallback is not required.

## Spec Compliance
- PASS: Public site and listing pages emit conservative identity data from existing visible site and etapa records.
- PASS: Etapa detail pages describe routes as itineraries using title, description, URL, image, origin, and destination only.
- PASS: Structured data stays within supported evidence and omits raw GeoJSON geometry, downloads, reviews, offers, events, FAQ, organization claims, and raw coordinates.

## Task Verification
- PASS: 4.1 completed by build plus parse inspection across all seven target routes.
- PASS: 4.2 completed by banned-claim search scoped to JSON-LD payloads.
- PASS: 4.3 completed as assessment: no fallback needed because `TouristTrip` is schema.org-valid and locally evidence-backed.

## Risks
- WARNING: There is no automated test runner in this project, so this verification relies on deterministic build/output inspection rather than CI-enforced tests.
- WARNING: Future unrelated runtime scripts may include banned words in full HTML; banned-claim checks should remain scoped to JSON-LD payloads to avoid false positives.
