# Delta for Site Quality

## ADDED Requirements

### Requirement: Mobile route navigation includes a decorative separator

The site MUST render a subtle white or near-white separator between stacked previous and next route links on mobile when both links exist. The separator MUST be decorative, non-interactive, and hidden at `md` and above.

#### Scenario: Separator appears between two mobile links

- GIVEN etapa 03 renders both previous and next links on a narrow viewport
- WHEN the route nav is displayed
- THEN a separator is visible between the two stacked links
- AND the separator is ignored by assistive technology

#### Scenario: No orphan separator on edge etapas

- GIVEN etapa 01 or etapa 05 renders only one route link
- WHEN the route nav is displayed on mobile
- THEN no separator is rendered
- AND the single available link remains unchanged

#### Scenario: Desktop layout stays equivalent

- GIVEN any etapa route is rendered at `md` and above
- WHEN the route nav is displayed
- THEN the separator is hidden
- AND the desktop layout remains equivalent to the current presentation

## MODIFIED Requirements

### Requirement: Responsive changes remain verifiable

The site SHOULD remain easy to verify after layout changes using build output and responsive review focused on the affected etapa routes.
(Previously: Verification was generic and did not name the route set under review.)

#### Scenario: Build succeeds

- GIVEN the change is applied
- WHEN `npm run build` is executed
- THEN the build completes successfully

#### Scenario: Responsive review confirms the separator behavior

- GIVEN the change is applied
- WHEN etapa 01, etapa 03, and etapa 05 are reviewed responsively on mobile and desktop
- THEN etapa 03 shows the separator on mobile
- AND etapa 01 and etapa 05 do not show an orphan separator
- AND desktop layout remains preserved
