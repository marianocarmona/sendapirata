# Delta for structured-data-seo

## ADDED Requirements

### Requirement: Public site and listing pages emit conservative identity data

The system MUST emit JSON-LD on the homepage and etapa index pages using only existing visible site data. The homepage SHOULD describe the site with `WebSite`, and etapa listing pages SHOULD describe the collection with `CollectionPage` and `ItemList`. `BreadcrumbList` MAY be emitted only when the page already has a clear visible hierarchy.

#### Scenario: Homepage exposes site identity

- GIVEN the homepage is rendered
- WHEN structured data is generated
- THEN it includes the site name and description from existing site content
- AND it does not invent organization or promotional facts

#### Scenario: Etapa index exposes the collection

- GIVEN the etapa index page is rendered
- WHEN structured data is generated
- THEN it represents the page as a collection of the existing etapa entries
- AND each list item points to an existing etapa URL

#### Scenario: No breadcrumb trail means no breadcrumb schema

- GIVEN a page has no clear visible parent path
- WHEN structured data is generated
- THEN `BreadcrumbList` is omitted
- AND no synthetic hierarchy is created

### Requirement: Etapa detail pages describe routes as itineraries

The system MUST describe each etapa detail page as a tourist route itinerary using `TouristTrip` or an equally conservative page-level schema when validation requires it. The emitted data MUST use only existing fields such as the etapa name, route summary, page URL, hero image, and the visible start and end labels from the etapa record.

#### Scenario: A detail page publishes route facts

- GIVEN an etapa detail page is rendered
- WHEN structured data is generated
- THEN it includes the etapa name, description, URL, image, origin, and destination
- AND the values match the current visible page content

#### Scenario: Multiple downloads and treasures do not expand the schema

- GIVEN an etapa has several audio, PDF, GPX, or treasure entries
- WHEN structured data is generated
- THEN the schema still models one itinerary for the page
- AND it does not enumerate downloads, reviews, or every POI

### Requirement: Structured data stays within supported evidence

The system MUST NOT add GeoJSON geometry, `GeoShape`, ratings, reviews, offers, events, FAQ, organization claims, or any other field that is not directly supported by existing visible content.

#### Scenario: Unsupported claims are excluded

- GIVEN the source data contains route maps and route media
- WHEN structured data is generated
- THEN only supported page facts are emitted
- AND large route coordinate modeling is omitted

#### Scenario: Missing evidence causes omission, not invention

- GIVEN a field cannot be backed by existing content
- WHEN structured data is generated
- THEN the field is omitted or the schema is simplified
- AND no unsupported value is fabricated
