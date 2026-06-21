# Delta for site-quality

## ADDED Requirements

### Requirement: Production crawl foundation

The system MUST define a single production origin for public SEO metadata and MUST expose crawl discovery for public routes. The system MUST publish sitemap output for public pages and reference that sitemap from `robots.txt`. Public pages MUST use one canonical URL source that resolves to `https://sendapirata.com/`.

#### Scenario: Public route resolves to production SEO URLs

- GIVEN a public page is built for production
- WHEN a crawler reads its metadata
- THEN the canonical URL is absolute and uses `https://sendapirata.com/`
- AND `robots.txt` points crawlers to the sitemap that covers public routes

#### Scenario: Alternate access paths do not create alternate canonicals

- GIVEN the same public page is reachable through a non-preferred URL form
- WHEN metadata is generated
- THEN the preferred canonical remains the production URL
- AND no second canonical URL is emitted

### Requirement: Homepage primary heading

The homepage MUST expose exactly one primary `<h1>` that states the site’s main identity or purpose. The homepage MUST preserve the existing visible content hierarchy around that heading.

#### Scenario: Homepage has a single primary heading

- GIVEN the homepage is rendered
- WHEN the document is inspected
- THEN exactly one `<h1>` is present
- AND it describes the Senda Pirata site or journey

#### Scenario: Other pages keep their own heading structure

- GIVEN a non-home public page is rendered
- WHEN the page is inspected
- THEN the homepage `<h1>` requirement does not add extra headings to that page

### Requirement: Stable shared image sizing

Shared and high-impact public images touched by this slice MUST declare intrinsic dimensions or an equivalent stable aspect-ratio guard. This MUST prevent avoidable layout shift while preserving the existing responsive appearance.

#### Scenario: High-impact images keep layout stability

- GIVEN the homepage hero or shared logo/image components load
- WHEN the browser renders them
- THEN their boxes are stable before image decode completes
- AND responsive scaling still matches the current design intent

#### Scenario: Image responsiveness is preserved

- GIVEN an image uses responsive classes or container sizing
- WHEN intrinsic sizing is added
- THEN the image still scales correctly on small and large screens
