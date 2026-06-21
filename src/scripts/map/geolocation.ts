import type { MapElements, MapboxMap } from "./types";

const USER_POINT_SOURCE_ID = "user-point";
const USER_ACCURACY_SOURCE_ID = "user-accuracy";

function accuracyCirclePolygon(lng: number, lat: number, radiusMeters: number) {
  const earthRadius = 6378137;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const toDegrees = (value: number) => (value * 180) / Math.PI;
  const latRadians = toRadians(lat);
  const lngRadians = toRadians(lng);
  const distance = radiusMeters / earthRadius;
  const coordinates: [number, number][] = [];
  const steps = 64;

  for (let index = 0; index <= steps; index += 1) {
    const bearing = (2 * Math.PI * index) / steps;
    const nextLat = Math.asin(
      Math.sin(latRadians) * Math.cos(distance) +
        Math.cos(latRadians) * Math.sin(distance) * Math.cos(bearing),
    );
    const nextLng =
      lngRadians +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(latRadians),
        Math.cos(distance) - Math.sin(latRadians) * Math.sin(nextLat),
      );

    coordinates.push([toDegrees(nextLng), toDegrees(nextLat)]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coordinates] },
  };
}

function ensureUserLayers(map: MapboxMap): void {
  if (map.getSource(USER_POINT_SOURCE_ID) && map.getSource(USER_ACCURACY_SOURCE_ID)) {
    return;
  }

  map.addSource(USER_POINT_SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addSource(USER_ACCURACY_SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  map.addLayer({
    id: "user-accuracy-fill",
    type: "fill",
    source: USER_ACCURACY_SOURCE_ID,
    paint: {
      "fill-color": "#0ea5e9",
      "fill-opacity": 0.12,
    },
  });
  map.addLayer({
    id: "user-accuracy-outline",
    type: "line",
    source: USER_ACCURACY_SOURCE_ID,
    paint: {
      "line-color": "#0ea5e9",
      "line-width": 2,
      "line-opacity": 0.4,
    },
  });
  map.addLayer({
    id: "user-point",
    type: "circle",
    source: USER_POINT_SOURCE_ID,
    paint: {
      "circle-color": "#0ea5e9",
      "circle-radius": 6,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
  });
}

function moveUserLayersToTop(map: MapboxMap): void {
  ["user-accuracy-fill", "user-accuracy-outline", "user-point"].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.moveLayer(layerId);
    }
  });
}

export function createGeolocationController(map: MapboxMap, elements: MapElements) {
  let watchId: number | null = null;
  let pingTimer: number | null = null;
  let hasFix = false;

  const applyPosition = (position: GeolocationPosition) => {
    const lng = position.coords?.longitude;
    const lat = position.coords?.latitude;
    const accuracy = position.coords?.accuracy;

    if (typeof lng !== "number" || typeof lat !== "number") {
      return;
    }

    const pointCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [lng, lat] },
        },
      ],
    };

    const accuracyCollection = {
      type: "FeatureCollection",
      features:
        typeof accuracy === "number" && Number.isFinite(accuracy) && accuracy > 0
          ? [accuracyCirclePolygon(lng, lat, Math.min(accuracy, 200))]
          : [],
    };

    map.getSource(USER_POINT_SOURCE_ID)?.setData?.(pointCollection);
    map.getSource(USER_ACCURACY_SOURCE_ID)?.setData?.(accuracyCollection);

    const expanded = elements.root.classList.contains("is-expanded");
    if (!expanded) {
      return;
    }

    if (!hasFix) {
      hasFix = true;
      map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 15), duration: 600 });
      return;
    }

    map.easeTo({ center: [lng, lat], duration: 400 });
  };

  return {
    start(): void {
      if (watchId != null || !("geolocation" in navigator)) {
        return;
      }

      ensureUserLayers(map);
      moveUserLayersToTop(map);

      watchId = navigator.geolocation.watchPosition(
        (position) => applyPosition(position),
        (error) => {
          console.warn("Geolocation is unavailable or denied.", error);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
      );

      if (pingTimer == null) {
        pingTimer = window.setInterval(() => {
          if (!elements.root.classList.contains("is-expanded")) {
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => applyPosition(position),
            () => undefined,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
          );
        }, 60000);
      }
    },
    stop(): void {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
      watchId = null;

      if (pingTimer != null) {
        window.clearInterval(pingTimer);
      }
      pingTimer = null;
      hasFix = false;
    },
  };
}
