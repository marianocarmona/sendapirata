export interface RouteConfig {
  id: string;
  url: string;
  color: string;
}

export interface RouteGeoJson {
  type: string;
  features?: unknown[];
  geometry?: unknown;
  coordinates?: unknown;
  geometries?: unknown[];
}

export interface MapConfig {
  token: string;
  style: string;
  center: [number, number];
  routes: RouteConfig[];
  fitPadding: number | { top: number; right: number; bottom: number; left: number };
  interactive: boolean;
  enableRouteHighlight: boolean;
  fitMaxHeight?: number;
  fitMaxWidth?: number;
  fitMaxWidthVw?: number;
  fitSymmetricY: boolean;
}

export type MapboxMap = any;
export type MapboxGL = any;

export interface MapElements {
  root: HTMLElement;
  canvas: HTMLElement;
  status: HTMLElement | null;
  expandButton: HTMLButtonElement | null;
  expandIcon: HTMLElement | null;
  collapseIcon: HTMLElement | null;
}
