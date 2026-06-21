export function getSiteBase(site: URL | undefined, url: URL): URL {
  return site ?? new URL(url.origin);
}

export function toAbsoluteUrl(path: string | URL, base: URL): string {
  return new URL(path, base).toString();
}

export function toCanonicalUrl(pathname: string, base: URL): string {
  return toAbsoluteUrl(pathname, base);
}
