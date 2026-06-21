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
