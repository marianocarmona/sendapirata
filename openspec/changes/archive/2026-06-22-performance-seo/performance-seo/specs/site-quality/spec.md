# Delta for Site Quality

## MODIFIED Requirements

### Requirement: Preserve public behavior

Cleanup MUST keep route content, visual identity, downloads, and public navigation behavior intact. Loading-order changes are allowed only when they do not create visible UX changes.
(Previously: Cleanup MUST keep route content, visual identity, downloads, and public navigation behavior intact.)

#### Scenario: Existing pages still work

- GIVEN a user opens any public etapa route
- WHEN the cleanup is deployed
- THEN the same content and downloads are available
- AND the page remains functionally recognizable

#### Scenario: Loading order changes stay invisible

- GIVEN a page now discovers fonts or hero images in a different order
- WHEN the page renders
- THEN the visible layout, text, and controls remain equivalent
- AND only resource timing/order may differ

### Requirement: Improve loading efficiency without regressions

Cleanup SHOULD reduce avoidable render-blocking or globally prioritized resources while preserving the current experience. Decorative background assets MUST NOT be globally preloaded on every route; hero images MAY receive higher priority only on the route where they are visible above the fold; font resources SHOULD be declared in the document head when emitted.
(Previously: Cleanup SHOULD reduce duplication, improve loading efficiency, preserve keyboard access, and harden dynamic HTML handling.)

#### Scenario: Homepage hero priority is route-scoped

- GIVEN the homepage renders its above-the-fold hero image
- WHEN the HTML is generated
- THEN the homepage hero MAY be prioritized for that route
- AND non-homepage hero assets are not globally preloaded

#### Scenario: Etapa hero priority is limited to the current route

- GIVEN an etapa detail page renders its hero image
- WHEN the HTML is generated
- THEN that page MAY prioritize its own hero image
- AND the decorative background is not globally preloaded

#### Scenario: Font links are head-owned

- GIVEN font discovery links are emitted
- WHEN the page head is rendered
- THEN the links are present in the document head
- AND the same font stylesheet is not duplicated in body content

## ADDED Requirements

### Requirement: Performance evidence is required

The change MUST be validated by build output and generated HTML inspection showing no visible UX regression and no unnecessary global preload behavior.

#### Scenario: Build and inspection pass

- GIVEN the change is complete
- WHEN the project build is run and the generated HTML is inspected
- THEN the build succeeds
- AND desktop background preload is absent or route-scoped
- AND homepage and etapa hero priority is route-specific only
- AND Mapbox behavior, audio preload, and legacy asset retention remain unchanged
