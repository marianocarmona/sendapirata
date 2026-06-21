import type { MapElements } from "./types";

export function updateExpandButtonState(button: HTMLButtonElement | null, expandIcon: HTMLElement | null, collapseIcon: HTMLElement | null, expanded: boolean): void {
  if (!button) {
    return;
  }

  button.setAttribute("aria-label", expanded ? "Cerrar mapa" : "Expandir mapa");
  button.setAttribute("title", expanded ? "Cerrar mapa" : "Expandir mapa");

  if (expandIcon) {
    expandIcon.hidden = expanded;
  }

  if (collapseIcon) {
    collapseIcon.hidden = !expanded;
  }
}

export function setExpanded(elements: MapElements, expanded: boolean): void {
  elements.root.classList.toggle("is-expanded", expanded);
  document.documentElement.classList.toggle("map-no-scroll", expanded);
  updateExpandButtonState(elements.expandButton, elements.expandIcon, elements.collapseIcon, expanded);
}
