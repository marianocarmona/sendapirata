import { assertPublicAssetExists } from "./asset-validation";

export const SITE_NAME = "Senda Pirata";
export const SITE_DESCRIPTION = "Ruta de cinco etapas por la costa de Cabo de Gata-Níjar.";
export const SOCIAL_IMAGE_PATH = "/images/cartilla.webp";

assertPublicAssetExists(SOCIAL_IMAGE_PATH, "Site social image");
