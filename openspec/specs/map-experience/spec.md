# Map Experience Specification

## Purpose

Define the cleanup expectations for the Mapbox experience so the map remains usable, accessible, and safe after refactoring.

## Requirements

### Requirement: Map loading is progressive

The map experience MUST allow the page's static content to load and remain useful even if Mapbox is delayed or unavailable.

#### Scenario: Mapbox loads late

- GIVEN the map script has not finished loading
- WHEN the page is rendered
- THEN the rest of the page remains usable
- AND the map area shows a clear fallback state

#### Scenario: Mapbox fails completely

- GIVEN Mapbox cannot initialize
- WHEN the user opens the page
- THEN the core route content still appears

### Requirement: Map interactions remain safe and accessible

The map cleanup MUST preserve keyboard focus behavior, visible controls, and safe handling of marker or popup HTML.

#### Scenario: Keyboard users can reach controls

- GIVEN a keyboard-only user opens the map page
- WHEN they tab through the interface
- THEN controls and focus states are reachable and visible

#### Scenario: Popup HTML is constrained

- GIVEN map content is rendered into a popup
- WHEN the content is assembled
- THEN it MUST not rely on unsafe arbitrary HTML insertion
