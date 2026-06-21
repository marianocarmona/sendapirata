import { etapas, type EtapaRecord } from "./etapas";
import { SITE_DESCRIPTION, SITE_NAME } from "./site";
import { toAbsoluteUrl, toCanonicalUrl } from "./seo-urls";

export type SchemaNode = Record<string, unknown>;

export interface AbsoluteUrlContext {
  site: URL;
}

export interface BreadcrumbListItem {
  name: string;
  path: string;
}

export interface PageSchemaInput {
  name: string;
  description: string;
  path: string;
}

export interface EtapaSchemaOptions {
  pageType?: "TouristTrip" | "WebPage";
}

type EtapaListItem = {
  "@type": "ListItem";
  position: number;
  url: string;
  name: string;
  description: string;
};

export function buildWebSiteSchema(context: AbsoluteUrlContext): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: toCanonicalUrl("/", context.site),
  };
}

export function buildCollectionPageSchema(input: PageSchemaInput, context: AbsoluteUrlContext): SchemaNode {
  return compactSchemaNode({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: toCanonicalUrl(input.path, context.site),
  });
}

export function buildEtapaItemListSchema(
  context: AbsoluteUrlContext,
  input: Partial<PageSchemaInput> = {},
): SchemaNode {
  const itemListElements = etapas.map((etapa, index) => buildEtapaListItem(etapa, context, index + 1));

  return compactSchemaNode({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    url: input.path ? toCanonicalUrl(input.path, context.site) : undefined,
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  });
}

export function buildBreadcrumbListSchema(
  items: BreadcrumbListItem[],
  context: AbsoluteUrlContext,
): SchemaNode | null {
  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toCanonicalUrl(item.path, context.site),
    })),
  };
}

export function buildEtapaSchemas(
  etapa: EtapaRecord,
  context: AbsoluteUrlContext,
  options: EtapaSchemaOptions = {},
): SchemaNode[] {
  const pageType = options.pageType ?? "TouristTrip";
  const routeDescription = etapa.layoutDescription || etapa.routeSummary;
  const origin = getEtapaStat(etapa, "Inicio");
  const destination = getEtapaStat(etapa, "Final");

  const commonFields = {
    name: etapa.detailTitle,
    description: routeDescription,
    url: toCanonicalUrl(etapa.path, context.site),
    image: toAbsoluteUrl(etapa.heroImage, context.site),
  };

  if (pageType === "WebPage") {
    return [
      compactSchemaNode({
        "@context": "https://schema.org",
        "@type": "WebPage",
        ...commonFields,
        about: buildRouteSummaryThing(etapa.routeSummary, origin, destination),
      }),
    ];
  }

  return [
    compactSchemaNode({
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      ...commonFields,
      itinerary: buildItinerary(origin, destination),
    }),
  ];
}

function buildEtapaListItem(
  etapa: EtapaRecord,
  context: AbsoluteUrlContext,
  position: number,
): EtapaListItem {
  return {
    "@type": "ListItem",
    position,
    url: toCanonicalUrl(etapa.path, context.site),
    name: etapa.cardTitle,
    description: etapa.routeSummary,
  };
}

function buildItinerary(origin?: string, destination?: string): SchemaNode | undefined {
  const places = [origin, destination]
    .filter((value): value is string => Boolean(value))
    .map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Place",
        name,
      },
    }));

  if (places.length === 0) {
    return undefined;
  }

  return {
    "@type": "ItemList",
    itemListElement: places,
  };
}

function buildRouteSummaryThing(
  routeSummary: string,
  origin?: string,
  destination?: string,
): SchemaNode {
  return compactSchemaNode({
    "@type": "Thing",
    name: routeSummary,
    description:
      origin && destination
        ? `${origin} → ${destination}`
        : undefined,
  });
}

function getEtapaStat(etapa: EtapaRecord, label: string): string | undefined {
  return etapa.stats.find((stat) => stat.label === label)?.value;
}

function compactSchemaNode(node: SchemaNode): SchemaNode {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => value !== undefined && value !== null),
  );
}
