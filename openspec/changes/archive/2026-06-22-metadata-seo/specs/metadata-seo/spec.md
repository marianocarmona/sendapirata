# metadata-seo Specification

## Purpose

Define public-page metadata for Senda Pirata so search snippets and social previews are specific, complete, and truthful without changing page content.

## Requirements

### Requirement: Page descriptions reflect existing page content

Each public page MUST provide a meta description derived only from content already visible on that page or in its shared page data. The system MUST NOT invent claims, keywords, rewards, partnerships, or capabilities that are not supported by the page.

#### Scenario: Homepage description stays truthful

- GIVEN the homepage presents the five-stage coastal route and the pirate-story introduction
- WHEN metadata is rendered
- THEN the description mentions the route and the page’s story/theme
- AND it does not add unsupported marketing claims

#### Scenario: Etapa descriptions stay factual

- GIVEN an etapa detail page includes route facts, story sections, and downloads
- WHEN metadata is rendered
- THEN the description can mention the stage, origin/destination, and available resources
- AND it MUST NOT mention unsupported distances, claims, or features

### Requirement: Social previews support page-specific image metadata

The shared layout MUST support optional page-specific social metadata including image URL, alt text, width, and height when those values are known. When provided, the system MUST use the same page-specific image for Open Graph and Twitter cards; when omitted, it MUST fall back to the site defaults.

#### Scenario: Homepage uses a measured preview image

- GIVEN the homepage provides a measured existing image and alt text
- WHEN the page is built
- THEN Open Graph and Twitter tags reference that image
- AND the image alt text, width, and height are emitted

#### Scenario: Etapa pages reuse existing artwork

- GIVEN an etapa page provides an existing measured image from the site assets
- WHEN the page is built
- THEN the preview metadata uses that page-specific image
- AND no new generated social asset is required

### Requirement: Canonical URLs remain centralized and preserved

The system MUST keep canonical URL generation in the shared layout and MUST preserve the primary canonical URL for every public route.

#### Scenario: Public routes keep one canonical URL

- GIVEN `/`, `/etapas`, and an etapa detail page are rendered
- WHEN metadata is emitted
- THEN each page has one canonical URL based on its public path

#### Scenario: Alternate access does not change canonical output

- GIVEN a page is requested through any valid access path that resolves to the same public page
- WHEN metadata is emitted
- THEN the canonical still points to the primary public URL

### Requirement: Social metadata does not duplicate or conflict

The system MUST emit a single coherent set of Open Graph and Twitter tags without duplicate or conflicting title, description, or image values.

#### Scenario: Built HTML exposes one social set

- GIVEN a page is built with page-specific social metadata
- WHEN the HTML head is inspected
- THEN Open Graph and Twitter metadata agree on title, description, and image
- AND there are no conflicting duplicate Twitter tags
