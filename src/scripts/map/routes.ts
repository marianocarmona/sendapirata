import { collectRouteBounds, fitToBounds, loadRouteGeoJsonMap } from "./bounds";
import type { MapConfig, MapboxMap, MapboxGL, RouteConfig, RouteGeoJson } from "./types";

const BASE_LINE_WIDTH = 3;
const HIGHLIGHT_LINE_WIDTH = 4.5;
const DIM_OPACITY = 0.25;
const BASE_POI_OPACITY = 0.9;
const BASE_LABEL_OPACITY = 1;
const HOVER_FIT_DURATION = 450;

function getPopupLabel(feature: any): string {
  const properties = feature?.properties ?? {};
  return String(properties.name ?? properties.nombre ?? properties.title ?? properties.titulo ?? "");
}

function addRouteLayers(map: MapboxMap, route: RouteConfig, routeGeoJson: RouteGeoJson): void {
  const existingSource = map.getSource(route.id);

  if (existingSource?.setData) {
    existingSource.setData(routeGeoJson);
  } else if (!existingSource) {
    map.addSource(route.id, {
      type: "geojson",
      data: routeGeoJson,
    });
  }

  if (!map.getLayer(`${route.id}-line`)) {
    map.addLayer({
      id: `${route.id}-line`,
      type: "line",
      source: route.id,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": route.color,
        "line-width": BASE_LINE_WIDTH,
        "line-opacity": 1,
      },
    });
  }

  if (!map.getLayer(`${route.id}-poi`)) {
    map.addLayer({
      id: `${route.id}-poi`,
      type: "circle",
      source: route.id,
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-color": route.color,
        "circle-radius": 5,
        "circle-opacity": BASE_POI_OPACITY,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
      },
    });
  }

  if (!map.getLayer(`${route.id}-poi-label`)) {
    map.addLayer({
      id: `${route.id}-poi-label`,
      type: "symbol",
      source: route.id,
      filter: ["==", ["geometry-type"], "Point"],
      minzoom: 11,
      layout: {
        "text-field": ["coalesce", ["get", "name"], ["get", "nombre"], ["get", "title"], ["get", "titulo"], ""],
        "text-size": 12,
        "text-offset": [0, 1.1],
        "text-anchor": "top",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#111827",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.5,
        "text-opacity": BASE_LABEL_OPACITY,
      },
    });
  }
}

export function createRouteController(map: MapboxMap, mapboxgl: MapboxGL, config: MapConfig, isExpanded: () => boolean) {
  let pendingHighlight: string | null = null;
  let activeRouteId: string | null = null;
  let globalBounds: any = null;
  const routeBoundsById = new Map<string, any>();
  const attachedPoiRoutes = new Set<string>();
  let highlightListenerAttached = false;

  const applyRouteHighlight = (routeId: string | null) => {
    const hasActiveRoute = typeof routeId === "string" && routeId.length > 0;

    config.routes.forEach((route) => {
      const lineLayer = `${route.id}-line`;
      const poiLayer = `${route.id}-poi`;
      const labelLayer = `${route.id}-poi-label`;

      if (!map.getLayer(lineLayer)) {
        return;
      }

      if (!hasActiveRoute) {
        map.setPaintProperty(lineLayer, "line-opacity", 1);
        map.setPaintProperty(lineLayer, "line-width", BASE_LINE_WIDTH);
        if (map.getLayer(poiLayer)) {
          map.setPaintProperty(poiLayer, "circle-opacity", BASE_POI_OPACITY);
          map.setPaintProperty(poiLayer, "circle-stroke-opacity", 1);
        }
        if (map.getLayer(labelLayer)) {
          map.setPaintProperty(labelLayer, "text-opacity", BASE_LABEL_OPACITY);
        }
        return;
      }

      const active = route.id === routeId;
      map.setPaintProperty(lineLayer, "line-opacity", active ? 1 : DIM_OPACITY);
      map.setPaintProperty(lineLayer, "line-width", active ? HIGHLIGHT_LINE_WIDTH : BASE_LINE_WIDTH);
      if (map.getLayer(poiLayer)) {
        map.setPaintProperty(poiLayer, "circle-opacity", active ? BASE_POI_OPACITY : DIM_OPACITY);
        map.setPaintProperty(poiLayer, "circle-stroke-opacity", active ? 1 : DIM_OPACITY);
      }
      if (map.getLayer(labelLayer)) {
        map.setPaintProperty(labelLayer, "text-opacity", active ? BASE_LABEL_OPACITY : DIM_OPACITY);
      }
    });
  };

  const fitCurrentRoute = (duration?: number) => {
    if (isExpanded()) {
      return;
    }

    const fitRouteId = activeRouteId ?? (config.routes.length === 1 ? config.routes[0]?.id ?? null : null);

    if (fitRouteId) {
      const routeBounds = routeBoundsById.get(fitRouteId);
      if (routeBounds) {
        fitToBounds(map, routeBounds, config, duration ?? HOVER_FIT_DURATION);
        return;
      }
    }

    fitToBounds(map, globalBounds, config, duration);
  };

  const setActiveRoute = (routeId: string | null, shouldFit = true) => {
    activeRouteId = typeof routeId === "string" && routeId.length > 0 ? routeId : null;
    applyRouteHighlight(activeRouteId);
    if (shouldFit) {
      fitCurrentRoute();
    }
  };

  const attachPoiInteractions = (route: RouteConfig) => {
    if (attachedPoiRoutes.has(route.id)) {
      return;
    }

    attachedPoiRoutes.add(route.id);

    const poiLayer = `${route.id}-poi`;
    map.on("mouseenter", poiLayer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", poiLayer, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", poiLayer, (event: any) => {
      const feature = event?.features?.[0];
      const coordinates = feature?.geometry?.coordinates;
      const label = getPopupLabel(feature);

      if (!Array.isArray(coordinates) || typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number" || !label) {
        return;
      }

      new mapboxgl.Popup({ closeButton: true, closeOnClick: true })
        .setLngLat([coordinates[0], coordinates[1]])
        .setText(label)
        .addTo(map);
    });
  };

  return {
    async onLoad() {
      const routeGeoJsonById = await loadRouteGeoJsonMap(config.routes);

      config.routes.forEach((route) => {
        const routeGeoJson = routeGeoJsonById.get(route.id);
        if (!routeGeoJson) {
          throw new Error(`Missing route GeoJSON for ${route.id}`);
        }

        addRouteLayers(map, route, routeGeoJson);
        attachPoiInteractions(route);
      });

      if (config.enableRouteHighlight && !highlightListenerAttached) {
        highlightListenerAttached = true;
        window.addEventListener("sp:route-highlight", (event: Event) => {
          const routeId = (event as CustomEvent<{ routeId?: string | null }>).detail?.routeId ?? null;
          setActiveRoute(routeId);
        });
      }

      try {
        const bounds = await collectRouteBounds(mapboxgl, config.routes, routeGeoJsonById);
        globalBounds = bounds.globalBounds;
        bounds.routeBoundsById.forEach((value, key) => routeBoundsById.set(key, value));
      } catch (error) {
        console.warn("Unable to load route GeoJSON for fitBounds.", error);
      }

      if (config.enableRouteHighlight) {
        setActiveRoute(pendingHighlight, false);
      }
    },
    schedulePendingHighlight(routeId: string | null) {
      pendingHighlight = routeId;
    },
    fitCurrentRoute,
  };
}
