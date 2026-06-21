import { assertPublicAssetExists, type PublicAssetPath } from "./asset-validation";

export interface ImageDimensions {
  width: number;
  height: number;
}

const imageDimensions = {
  "/images/logo.webp": { width: 493, height: 200 },
  "/images/senda-logo.png": { width: 395, height: 160 },
  "/images/asemparna.webp": { width: 543, height: 250 },
  "/images/ayuntamiento.webp": { width: 1187, height: 200 },
  "/images/fondo_playa.webp": { width: 876, height: 252 },
  "/images/cartilla.webp": { width: 186, height: 224 },
  "/images/mp3.webp": { width: 101, height: 150 },
  "/images/pdf.webp": { width: 101, height: 150 },
  "/images/gpx.webp": { width: 101, height: 150 },
  "/images/01.webp": { width: 175, height: 200 },
  "/images/02.webp": { width: 175, height: 200 },
  "/images/03.webp": { width: 175, height: 200 },
  "/images/04.webp": { width: 174, height: 200 },
  "/images/05.webp": { width: 174, height: 200 },
  "/images/fondo-01.webp": { width: 1125, height: 500 },
  "/images/fondo-02.webp": { width: 1125, height: 500 },
  "/images/fondo-03.webp": { width: 1125, height: 500 },
  "/images/fondo-04.webp": { width: 1124, height: 500 },
  "/images/fondo-05.webp": { width: 1125, height: 500 },
  "/images/01-01.webp": { width: 400, height: 400 },
  "/images/01-02.webp": { width: 400, height: 400 },
  "/images/02-01.webp": { width: 400, height: 400 },
  "/images/02-02.webp": { width: 400, height: 400 },
  "/images/02-03.webp": { width: 400, height: 400 },
  "/images/02-04.webp": { width: 400, height: 400 },
  "/images/03-01.webp": { width: 400, height: 400 },
  "/images/03-02.webp": { width: 400, height: 400 },
  "/images/04-01.webp": { width: 400, height: 400 },
  "/images/04-02.webp": { width: 400, height: 400 },
  "/images/04-03.webp": { width: 400, height: 400 },
  "/images/05-01.webp": { width: 400, height: 400 },
  "/images/05-02.webp": { width: 500, height: 500 },
  "/images/senda.svg": { width: 51, height: 37 },
} as const satisfies Record<PublicAssetPath, ImageDimensions>;

export type MeasuredImagePath = keyof typeof imageDimensions;

for (const assetPath of Object.keys(imageDimensions) as MeasuredImagePath[]) {
  assertPublicAssetExists(assetPath, "Measured image");
}

export function getImageDimensions(path: PublicAssetPath): ImageDimensions {
  const dimensions = imageDimensions[path as MeasuredImagePath];

  if (!dimensions) {
    throw new Error(`Missing measured dimensions for image: ${path}`);
  }

  return dimensions;
}
