# Delta for Route Content Structure

## ADDED Requirements

### Requirement: Public routes expose clear semantic headings

The system MUST render a visible page-level `h1` for `/etapas` and SHALL keep home, listing, and detail pages in a logical heading hierarchy. Explanatory copy SHOULD describe the route using existing stage facts only and MUST NOT add unsupported claims or keyword-stuffed text.

#### Scenario: Listing page is self-describing

- GIVEN a user opens `/etapas`
- WHEN the page renders
- THEN the page shows one visible `h1`
- AND the page includes short explanatory copy about the listing

#### Scenario: Detail page headings stay ordered

- GIVEN a user opens any etapa detail page
- WHEN the page renders
- THEN the page still exposes its existing page title and section headings in a semantic order
- AND the route chrome does not replace page content headings

### Requirement: Internal links describe destination and resource context

The system MUST make internal links understandable without relying on icons alone. Etapa cards, previous/next navigation, audio controls, and download links SHALL include visible or accessibility context that identifies the etapa or resource type they open.

#### Scenario: Etapa links identify the destination

- GIVEN a user views the home page or `/etapas`
- WHEN etapa cards render
- THEN the link text or accessible name identifies the etapa destination
- AND the destination remains the same public route

#### Scenario: Resource links are contextual

- GIVEN a user views an etapa detail page
- WHEN audio and download links render
- THEN each action still plays or downloads the existing asset
- AND the label or accessible name identifies the relevant etapa or resource type
