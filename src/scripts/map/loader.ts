import type { MapboxGL } from "./types";

const MAPBOX_CSS_ID = "sp-mapbox-css";
const MAPBOX_SCRIPT_ID = "sp-mapbox-script";
const MAPBOX_CSS_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
const MAPBOX_SCRIPT_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";

let mapboxPromise: Promise<MapboxGL> | null = null;

function ensureMapboxCss(): void {
  if (document.getElementById(MAPBOX_CSS_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = MAPBOX_CSS_ID;
  link.rel = "stylesheet";
  link.href = MAPBOX_CSS_URL;
  document.head.append(link);
}

export function loadMapbox(): Promise<MapboxGL> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Mapbox can only load in the browser."));
  }

  const existing = (window as typeof window & { mapboxgl?: MapboxGL }).mapboxgl;
  if (existing) {
    return Promise.resolve(existing);
  }

  if (mapboxPromise) {
    return mapboxPromise;
  }

  ensureMapboxCss();

  mapboxPromise = new Promise<MapboxGL>((resolve, reject) => {
    const scriptAlreadyOnPage = document.getElementById(MAPBOX_SCRIPT_ID) as HTMLScriptElement | null;

    const complete = () => {
      const loaded = (window as typeof window & { mapboxgl?: MapboxGL }).mapboxgl;
      if (loaded) {
        resolve(loaded);
      } else {
        reject(new Error("Mapbox loaded without exposing window.mapboxgl."));
      }
    };

    if (scriptAlreadyOnPage) {
      scriptAlreadyOnPage.addEventListener("load", complete, { once: true });
      scriptAlreadyOnPage.addEventListener("error", () => reject(new Error("Mapbox failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = MAPBOX_SCRIPT_ID;
    script.src = MAPBOX_SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", complete, { once: true });
    script.addEventListener("error", () => reject(new Error("Mapbox failed to load.")), { once: true });
    document.head.append(script);
  });

  return mapboxPromise;
}
