# Route Content Structure Specification

## Purpose

Define the shared content and layout expectations for the etapa routes so duplication can be reduced without changing the public pages.

## Requirements

### Requirement: Shared etapa structure remains consistent

The etapa list and detail pages MUST present the same core content model, order, and download availability for equivalent data.

#### Scenario: Shared content renders consistently

- GIVEN two routes reference the same etapa data
- WHEN either route is rendered
- THEN the user sees the same stage facts and downloads

#### Scenario: Route wrappers may differ

- GIVEN a list route and a detail route
- WHEN the page chrome differs
- THEN the content model MUST still map to the same underlying stage data

### Requirement: Route data changes stay safe

Cleanup SHOULD centralize repeated route data while preserving static generation and safe fallback behavior for missing values.

#### Scenario: Repeated data is centralized

- GIVEN the same stage metadata appears in multiple files
- WHEN it is consolidated
- THEN the public routes continue to render the same output

#### Scenario: Missing shared data fails safely

- GIVEN a required field is absent
- WHEN the page is built or rendered
- THEN the issue MUST be visible rather than silently changing the page meaning
