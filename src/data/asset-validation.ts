import { existsSync } from "fs";
import { resolve } from "path";

export type PublicAssetPath = `/${string}`;
export function assertNonEmpty(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertPublicAssetExists(assetPath: PublicAssetPath, label: string): void {
  const absolutePath = resolve(process.cwd(), "public", assetPath.slice(1));

  if (!existsSync(absolutePath)) {
    throw new Error(`${label} is missing: ${assetPath}`);
  }
}
