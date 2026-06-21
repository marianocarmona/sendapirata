import type { MapConfig, MapboxMap, MapboxGL, RouteConfig, RouteGeoJson } from "./types";

type PaddingValue = MapConfig["fitPadding"];

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isFiniteCoordinatePair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

export function normalizePadding(padding: PaddingValue): number | { top: number; right: number; bottom: number; left: number } {
  if (typeof padding === "number") {
    return padding;
  }

  const top = toFiniteNumber(padding?.top);
  const right = toFiniteNumber(padding?.right);
  const bottom = toFiniteNumber(padding?.bottom);
  const left = toFiniteNumber(padding?.left);

  if (top == null || right == null || bottom == null || left == null) {
    return 100;
  }

  try {
    const width = window.innerWidth || 1024;
    const height = window.innerHeight || 900;

    const scaled = {
      top: Math.max(40, Math.min(260, Math.round(top * (height / 900)))),
      right,
      bottom: Math.max(160, Math.min(2000, Math.round(bottom * (height / 900)))),
      left,
    };

    if (width < 640) {
      return {
        ...scaled,
        left: Math.min(scaled.left, 140),
        right: Math.min(scaled.right, 80),
        top: Math.min(scaled.top, 120),
        bottom: Math.min(scaled.bottom, 260),
      };
    }

    if (width < 1024) {
      return {
        ...scaled,
        left: Math.min(scaled.left, 320),
        right: Math.min(scaled.right, 120),
        top: Math.min(scaled.top, 160),
        bottom: Math.min(scaled.bottom, 460),
      };
    }

    return scaled;
  } catch {
    return { top, right, bottom, left };
  }
}

export function computeFitPadding(config: Pick<MapConfig, "fitPadding" | "fitMaxHeight" | "fitMaxWidth" | "fitMaxWidthVw" | "fitSymmetricY">) {
  const normalized = normalizePadding(config.fitPadding);

  if (typeof normalized === "number") {
    return normalized;
  }

  let output = normalized;

  try {
    const width = window.innerWidth || 1024;
    const height = window.innerHeight || 900;
    const maxHeight = Number(config.fitMaxHeight);

    if (width >= 1024 && Number.isFinite(maxHeight) && maxHeight > 0) {
      const requiredBottom = Math.max(0, Math.round(height - normalized.top - maxHeight));
      output = { ...normalized, bottom: Math.max(normalized.bottom, requiredBottom) };
    }
  } catch {}

  try {
    const width = window.innerWidth || 1024;
    const maxWidthVw = Number(config.fitMaxWidthVw);
    const maxWidthPx = Number(config.fitMaxWidth);
    const maxWidth = Number.isFinite(maxWidthVw) && maxWidthVw > 0 ? Math.round(width * (maxWidthVw / 100)) : maxWidthPx;

    if (width >= 1024 && Number.isFinite(maxWidth) && maxWidth > 0) {
      const requiredLeft = Math.max(0, Math.round(width - output.right - maxWidth));
      output = { ...output, left: Math.max(output.left, requiredLeft) };
    }
  } catch {}

  try {
    const maxHeight = Number(config.fitMaxHeight);
    const usingMaxHeight = Number.isFinite(maxHeight) && maxHeight > 0;

    if (config.fitSymmetricY && !usingMaxHeight) {
      output = { ...output, bottom: output.top };
    }
  } catch {}

  return output;
}

export function extendBoundsFromGeometry(geometry: any, bounds: any): void {
  if (!geometry) {
    return;
  }

  if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
    geometry.geometries.forEach((entry: any) => extendBoundsFromGeometry(entry, bounds));
    return;
  }

  const walk = (coordinates: any): void => {
    if (!Array.isArray(coordinates)) {
      return;
    }

    if (isFiniteCoordinatePair(coordinates)) {
      bounds.extend([coordinates[0], coordinates[1]]);
      return;
    }

    coordinates.forEach((child) => walk(child));
  };

  walk(geometry.coordinates);
}

function hasBounds(bounds: any): boolean {
  if (!bounds || bounds._sw == null || bounds._ne == null) {
    return false;
  }

  try {
    const value = bounds.toArray?.();
    return Array.isArray(value) && isFiniteCoordinatePair(value[0]) && isFiniteCoordinatePair(value[1]);
  } catch {
    return false;
  }
}

function isRouteGeoJson(value: unknown): value is RouteGeoJson {
  return Boolean(value && typeof value === "object" && typeof (value as RouteGeoJson).type === "string");
}

export async function loadRouteGeoJson(route: RouteConfig): Promise<RouteGeoJson> {
  const response = await fetch(route.url);
  if (!response.ok) {
    throw new Error(`Unable to load ${route.url}`);
  }

  const geojson = await response.json();
  if (!isRouteGeoJson(geojson)) {
    throw new Error(`Invalid GeoJSON payload for ${route.url}`);
  }

  return geojson;
}

export async function loadRouteGeoJsonMap(routes: RouteConfig[]) {
  const entries = await Promise.all(routes.map(async (route) => [route.id, await loadRouteGeoJson(route)] as const));
  return new Map<string, RouteGeoJson>(entries);
}

function buildBounds(mapboxgl: MapboxGL, geojson: any): any {
  const bounds = new mapboxgl.LngLatBounds();

  if (geojson?.type === "FeatureCollection" && Array.isArray(geojson.features)) {
    geojson.features.forEach((feature: any) => extendBoundsFromGeometry(feature?.geometry, bounds));
    return bounds;
  }

  if (geojson?.type === "Feature") {
    extendBoundsFromGeometry(geojson.geometry, bounds);
    return bounds;
  }

  extendBoundsFromGeometry(geojson, bounds);
  return bounds;
}

export async function collectRouteBounds(mapboxgl: MapboxGL, routes: RouteConfig[], routeGeoJsonById?: Map<string, RouteGeoJson>) {
  const routeBoundsById = new Map<string, any>();
  const allBounds = new mapboxgl.LngLatBounds();

  const items = routeGeoJsonById
    ? routes.map((route) => {
        const geojson = routeGeoJsonById.get(route.id);
        if (!geojson) {
          throw new Error(`Missing loaded GeoJSON for ${route.id}`);
        }

        return { route, geojson };
      })
    : await Promise.all(routes.map(async (route) => ({ route, geojson: await loadRouteGeoJson(route) })));

  items.forEach(({ route, geojson }) => {
    const routeBounds = buildBounds(mapboxgl, geojson);
    if (hasBounds(routeBounds)) {
      routeBoundsById.set(route.id, routeBounds.toArray());
      extendBoundsFromGeometry({ type: "GeometryCollection", geometries: [{ type: "MultiLineString", coordinates: routeBounds.toArray() }] }, allBounds);
    }

    if (geojson?.type === "FeatureCollection" && Array.isArray(geojson.features)) {
      geojson.features.forEach((feature: any) => extendBoundsFromGeometry(feature?.geometry, allBounds));
      return;
    }

    if (geojson?.type === "Feature") {
      extendBoundsFromGeometry(geojson.geometry, allBounds);
      return;
    }

    extendBoundsFromGeometry(geojson, allBounds);
  });

  return {
    hasGlobalBounds: hasBounds(allBounds),
    globalBounds: hasBounds(allBounds) ? allBounds.toArray() : null,
    routeBoundsById,
  };
}

export function fitToBounds(map: MapboxMap, bounds: any, config: Pick<MapConfig, "fitPadding" | "fitMaxHeight" | "fitMaxWidth" | "fitMaxWidthVw" | "fitSymmetricY">, duration?: number): void {
  if (!Array.isArray(bounds) || !isFiniteCoordinatePair(bounds[0]) || !isFiniteCoordinatePair(bounds[1])) {
    return;
  }

  const options = {
    padding: computeFitPadding(config),
    duration,
  };

  const MAX_ATTEMPTS = 4;
  let attempts = 0;
  let lastError: unknown = null;
  let finished = false;

  const hasRenderableContainer = () => {
    try {
      const container = map.getContainer?.();
      const rect = container?.getBoundingClientRect?.();
      return Boolean(rect && Number.isFinite(rect.width) && rect.width > 0 && Number.isFinite(rect.height) && rect.height > 0);
    } catch {
      return true;
    }
  };

  const reportFailure = () => {
    if (lastError) {
      console.warn("Unable to fit map to route bounds.", lastError, bounds);
    }
  };

  const scheduleAttempt = (waitForIdle: boolean) => {
    if (finished) {
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      reportFailure();
      return;
    }

    const run = () => {
      if (finished) {
        return;
      }

      window.requestAnimationFrame(attemptFit);
    };

    if (!waitForIdle) {
      run();
      return;
    }

    let scheduled = false;

    try {
      map.once("idle", () => {
        if (scheduled) {
          return;
        }

        scheduled = true;
        run();
      });
    } catch {}

    window.setTimeout(() => {
      if (scheduled) {
        return;
      }

      scheduled = true;
      run();
    }, 120);
  };

  const attemptFit = () => {
    if (finished) {
      return;
    }

    attempts += 1;

    if (!hasRenderableContainer()) {
      scheduleAttempt(true);
      return;
    }

    try {
      map.resize?.();
    } catch {}

    try {
      map.fitBounds(bounds, options);
      finished = true;
      return;
    } catch (error) {
      lastError = error;
    }

    scheduleAttempt(true);
  };

  scheduleAttempt(false);
}
