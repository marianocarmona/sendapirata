import { setExpanded, updateExpandButtonState } from "./controls";
import { createGeolocationController } from "./geolocation";
import { loadMapbox } from "./loader";
import { createRouteController } from "./routes";
import type { MapConfig, MapElements, MapboxGL, MapboxMap } from "./types";

const FALLBACK_CENTER: [number, number] = [-2.2063888888889, 36.965555555556];
const FALLBACK_MIN_HEIGHT = "22.5rem";
const DEFAULT_ZOOM = 8;

function setStatus(elements: MapElements, message: string, hidden = false): void {
  if (!elements.status) {
    return;
  }

  elements.status.textContent = message;
  elements.status.hidden = hidden;
}

function parseConfig(root: HTMLElement): MapConfig {
  const raw = root.dataset.mapConfig;

  if (!raw) {
    throw new Error("Map config is missing.");
  }

  return JSON.parse(raw) as MapConfig;
}

function getElements(root: HTMLElement): MapElements {
  const canvas = root.querySelector<HTMLElement>("[data-map-canvas]");

  if (!canvas) {
    throw new Error("Map canvas is missing.");
  }

  return {
    root,
    canvas,
    status: root.querySelector<HTMLElement>("[data-map-status]"),
    expandButton: root.querySelector<HTMLButtonElement>("[data-map-action='toggle-expand']"),
    expandIcon: root.querySelector<HTMLElement>("[data-map-icon='expand']"),
    collapseIcon: root.querySelector<HTMLElement>("[data-map-icon='collapse']"),
  };
}

function configureInteractions(map: MapboxMap, interactive: boolean): void {
  try {
    map.scrollZoom?.disable?.();
    map.dragRotate?.disable?.();
    map.touchZoomRotate?.disableRotation?.();
  } catch {}

  if (interactive === false) {
    try {
      map.boxZoom?.disable?.();
      map.dragPan?.disable?.();
      map.keyboard?.disable?.();
      map.doubleClickZoom?.disable?.();
      map.touchZoomRotate?.disable?.();
    } catch {}
  }
}

function hasPositivePixelSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return Number.isFinite(rect.width) && rect.width > 0 && Number.isFinite(rect.height) && rect.height > 0;
}

function ensureRenderableMinHeight(canvas: HTMLElement): void {
  const currentMinHeight = canvas.style.minHeight.trim();

  if (!currentMinHeight || currentMinHeight === "100%") {
    canvas.style.minHeight = FALLBACK_MIN_HEIGHT;
  }
}

async function waitForRenderableCanvas(canvas: HTMLElement, timeout = 1600): Promise<void> {
  if (hasPositivePixelSize(canvas)) {
    return;
  }

  ensureRenderableMinHeight(canvas);

  await new Promise<void>((resolve, reject) => {
    let completed = false;
    let observer: ResizeObserver | null = null;
    let frameId = 0;

    const cleanup = () => {
      completed = true;
      window.clearTimeout(timerId);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      try {
        observer?.disconnect();
      } catch {}
    };

    const finish = () => {
      if (completed) {
        return;
      }

      cleanup();
      resolve();
    };

    const fail = () => {
      if (completed) {
        return;
      }

      cleanup();
      reject(new Error("Map canvas has no renderable size."));
    };

    const check = () => {
      if (hasPositivePixelSize(canvas)) {
        finish();
      }
    };

    const loop = () => {
      if (completed) {
        return;
      }

      check();
      if (!completed) {
        frameId = window.requestAnimationFrame(loop);
      }
    };

    const timerId = window.setTimeout(() => {
      check();
      if (!completed) {
        fail();
      }
    }, timeout);

    try {
      observer = new ResizeObserver(check);
      observer.observe(canvas);
    } catch {}

    check();
    if (!completed) {
      frameId = window.requestAnimationFrame(loop);
    }
  });
}

function getSafeCenter(center: unknown): [number, number] {
  if (
    Array.isArray(center) &&
    center.length >= 2 &&
    typeof center[0] === "number" &&
    typeof center[1] === "number" &&
    Number.isFinite(center[0]) &&
    Number.isFinite(center[1])
  ) {
    return [center[0], center[1]];
  }

  return FALLBACK_CENTER;
}

async function waitForMapEvent(map: MapboxMap, eventName: string, timeout = 1200): Promise<void> {
  await new Promise<void>((resolve) => {
    let completed = false;

    const finish = () => {
      if (completed) {
        return;
      }

      completed = true;
      window.clearTimeout(timerId);
      resolve();
    };

    const timerId = window.setTimeout(finish, timeout);

    try {
      map.once(eventName, finish);
    } catch {
      finish();
    }
  });
}

async function waitForStableMap(map: MapboxMap, canvas: HTMLElement): Promise<void> {
  await waitForRenderableCanvas(canvas);

  try {
    map.resize?.();
  } catch {}

  await waitForMapEvent(map, "idle");
}

function observeResize(map: MapboxMap, refit: () => void, target: HTMLElement): void {
  try {
    const observer = new ResizeObserver(() => {
      try {
        map.resize();
      } catch {}
      refit();
    });
    observer.observe(target);
  } catch {}

  try {
    window.addEventListener("resize", refit, { passive: true });
    window.addEventListener("orientationchange", refit, { passive: true });
  } catch {}
}

async function waitForStyleReady(map: MapboxMap): Promise<void> {
  if (map.isStyleLoaded?.()) {
    if (map.loaded?.()) {
      return;
    }

    await new Promise<void>((resolve) => {
      map.once("idle", () => resolve());
    });
    return;
  }

  await new Promise<void>((resolve) => {
    map.once("load", () => resolve());
  });
}

async function initializeMap(root: HTMLElement): Promise<void> {
  if (root.dataset.mapInitialized === "true") {
    return;
  }

  root.dataset.mapInitialized = "true";

  const elements = getElements(root);
  const config = parseConfig(root);
  updateExpandButtonState(elements.expandButton, elements.expandIcon, elements.collapseIcon, false);

  if (!config.token.trim()) {
    setStatus(elements, "Mapa no disponible: configura PUBLIC_MAPBOX_TOKEN para activar la experiencia interactiva.");
    return;
  }

  setStatus(elements, "Cargando mapa interactivo...");

  try {
    const mapboxgl = await loadMapbox();
    await startMap(elements, config, mapboxgl);
  } catch (error) {
    console.warn("Unable to initialize Mapbox.", error);
    setStatus(elements, "No se pudo cargar el mapa interactivo. El contenido de la etapa sigue disponible.");
  }
}

async function startMap(elements: MapElements, config: MapConfig, mapboxgl: MapboxGL): Promise<void> {
  mapboxgl.accessToken = config.token;

  await waitForRenderableCanvas(elements.canvas);

  const map = new mapboxgl.Map({
    container: elements.canvas,
    style: config.style,
    center: getSafeCenter(config.center),
    zoom: DEFAULT_ZOOM,
    attributionControl: false,
    logoPosition: "bottom-right",
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
  configureInteractions(map, config.interactive);

  const navigationControl = config.interactive
    ? new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false })
    : null;
  let navigationControlVisible = false;

  const syncNavigationControl = (expanded: boolean) => {
    if (!navigationControl) {
      return;
    }

    if (expanded && !navigationControlVisible) {
      map.addControl(navigationControl, "top-right");
      navigationControlVisible = true;
      return;
    }

    if (!expanded && navigationControlVisible) {
      map.removeControl?.(navigationControl);
      navigationControlVisible = false;
    }
  };

  let refitTimer: number | null = null;
  const routeController = createRouteController(map, mapboxgl, config, () => elements.root.classList.contains("is-expanded"));
  const geolocation = createGeolocationController(map, elements);
  let routeLayersInitialized = false;

  syncNavigationControl(elements.root.classList.contains("is-expanded"));

  const scheduleRefit = () => {
    if (refitTimer != null) {
      window.clearTimeout(refitTimer);
    }

    refitTimer = window.setTimeout(() => {
      try {
        map.resize();
      } catch {}

      routeController.fitCurrentRoute();
    }, 160);
  };

  if (elements.expandButton) {
    elements.expandButton.addEventListener("click", () => {
      const nextExpanded = !elements.root.classList.contains("is-expanded");
      setExpanded(elements, nextExpanded);
      syncNavigationControl(nextExpanded);
      window.setTimeout(() => {
        try {
          map.resize();
        } catch {}
      }, 50);

      if (nextExpanded) {
        geolocation.start();
        return;
      }

      geolocation.stop();
      window.setTimeout(() => routeController.fitCurrentRoute(), 80);
    });
  }

  observeResize(map, scheduleRefit, elements.canvas);

  const initializeRouteLayers = async () => {
    if (routeLayersInitialized) {
      return;
    }

    routeLayersInitialized = true;
    try {
      await waitForStyleReady(map);
      await waitForStableMap(map, elements.canvas);
      await routeController.onLoad();
      await waitForStableMap(map, elements.canvas);
      scheduleRefit();
      setStatus(elements, "Mapa interactivo listo.", true);

      if (elements.root.classList.contains("is-expanded")) {
        syncNavigationControl(true);
        geolocation.start();
      }
    } catch (error) {
      routeLayersInitialized = false;
      console.warn("Unable to load route layers.", error);
      setStatus(elements, "No se pudieron cargar las rutas del mapa. El contenido de la etapa sigue disponible.");
    }
  };

  if (map.isStyleLoaded?.()) {
    void initializeRouteLayers();
  } else {
    map.once("load", () => {
      void initializeRouteLayers();
    });
  }

  map.on("error", () => {
    setStatus(elements, "No se pudo cargar el mapa interactivo. El contenido de la etapa sigue disponible.");
  });
}

function initMaps(): void {
  document.querySelectorAll<HTMLElement>("[data-map-root]").forEach((root) => {
    void initializeMap(root);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMaps(), { once: true });
  } else {
    initMaps();
  }
}

export { initMaps };
