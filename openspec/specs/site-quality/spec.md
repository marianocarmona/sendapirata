# Site Quality Specification

## Purpose

Define the cleanup rules that preserve the public Astro site while improving maintainability, performance, accessibility, and security.

## Requirements

### Requirement: Preserve public behavior

Cleanup MUST keep route content, visual identity, downloads, and public navigation behavior intact.

#### Scenario: Existing pages still work

- GIVEN a user opens any public etapa route
- WHEN the cleanup is deployed
- THEN the same content and downloads are available
- AND the page remains functionally recognizable

#### Scenario: Deletions are verified

- GIVEN a public asset or dependency is proposed for removal
- WHEN references are not fully confirmed
- THEN the asset or dependency MUST remain until verification is complete

### Requirement: Improve quality without regressions

Cleanup SHOULD reduce duplication, improve loading efficiency, preserve keyboard access, and harden dynamic HTML handling.

#### Scenario: Shared code is extracted safely

- GIVEN repeated structure exists across pages
- WHEN it is extracted into shared code
- THEN output and behavior remain equivalent

#### Scenario: Unsafe dynamic HTML is blocked

- GIVEN a feature renders dynamic HTML
- WHEN cleanup touches that code
- THEN the implementation MUST avoid unsafe raw insertion paths

### Requirement: Mobile route navigation is compact and clear

The site MUST present etapa previous/next navigation as a compact, readable mobile control with an explicit purpose label or equivalent context. Desktop layout MUST remain equivalent from `md` upward.

#### Scenario: Mobile route nav reads as navigation

- GIVEN a route detail page is rendered on a narrow viewport
- WHEN the previous/next section appears
- THEN the section is visually compact
- AND the purpose of the links is clear without relying only on the route titles

#### Scenario: First and last etapas remain understandable

- GIVEN etapa 01 has no previous route or etapa 05 has no next route
- WHEN the page is rendered on mobile
- THEN the missing side does not reserve misleading empty space
- AND the available link still reads as a navigation action

### Requirement: Shared footer logos stack on mobile

The site MUST stack the shared footer logos vertically and center them on mobile, while preserving the current desktop row layout and spacing unless intentionally improved.

#### Scenario: Footer is centered on narrow screens

- GIVEN the home page, etapa listing, or a route detail page is rendered on mobile
- WHEN the footer appears
- THEN the logos are stacked vertically
- AND the logos are centered as a group

#### Scenario: Desktop footer stays equivalent

- GIVEN the same page is rendered at `md` and above
- WHEN the footer appears
- THEN the horizontal layout remains equivalent to the current desktop presentation

### Requirement: Responsive changes remain verifiable

The site SHOULD remain easy to verify after layout changes using build output and responsive review.

#### Scenario: Build succeeds

- GIVEN the change is applied
- WHEN `npm run build` is executed
- THEN the build completes successfully

#### Scenario: Responsive review confirms intent

- GIVEN the site is reviewed at mobile and desktop widths
- WHEN the footer and route navigation are compared with the baseline
- THEN mobile clarity improvements are visible
- AND desktop layout remains preserved
