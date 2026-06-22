import {
  assertNonEmpty,
  assertPublicAssetExists,
  type PublicAssetPath,
} from "./asset-validation";
import { getImageDimensions } from "./image-dimensions";

export interface SocialImageMetadata {
  src: PublicAssetPath;
  alt: string;
  width: number;
  height: number;
}

export const SITE_NAME = "Senda Pirata";
export const SITE_DESCRIPTION = "Ruta de cinco etapas por la costa de Cabo de Gata-Níjar.";
export const SOCIAL_IMAGE_PATH = "/images/cartilla.webp";
export const SITE_SOCIAL_IMAGE = createSocialImageMetadata(
  SOCIAL_IMAGE_PATH,
  "Cartilla de la Senda Pirata con el recorrido de cinco etapas por Cabo de Gata-Níjar.",
);

assertPublicAssetExists(SOCIAL_IMAGE_PATH, "Site social image");

export function createSocialImageMetadata(
  src: PublicAssetPath,
  alt: string,
): SocialImageMetadata {
  assertPublicAssetExists(src, "Social image");
  assertNonEmpty(alt, "Social image alt");

  const { width, height } = getImageDimensions(src);

  return {
    src,
    alt,
    width,
    height,
  };
}
