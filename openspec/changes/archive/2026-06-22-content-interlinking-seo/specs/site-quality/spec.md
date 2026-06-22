# Delta for Site Quality

## ADDED Requirements

### Requirement: Public behavior is preserved during content-linking cleanup

The system MUST keep existing routes, assets, map rendering, and download behavior intact while improving visible content and link context. Route paths, map sources, and downloadable files SHALL remain available from the same public URLs.

#### Scenario: Public pages still open

- GIVEN any existing public route
- WHEN the cleanup is deployed
- THEN the route still resolves
- AND the page remains functionally recognizable

#### Scenario: Maps and downloads still work

- GIVEN a user opens an etapa detail page
- WHEN they use the map or download actions
- THEN the same map and asset endpoints remain available
- AND no download is removed from the page

### Requirement: Metadata and JSON-LD stay unchanged unless required

The system MUST NOT introduce metadata, canonical, or JSON-LD changes in this slice unless an explicit acceptance criterion requires them.

#### Scenario: Content-only change leaves head output alone

- GIVEN the `/etapas` content changes
- WHEN the page is built
- THEN the metadata and JSON-LD behavior remains as before
- AND the change stays focused on visible content and internal links
