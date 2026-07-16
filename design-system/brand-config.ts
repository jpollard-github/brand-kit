import type { DesignPalette } from "./colors";
import type { DesignTypography } from "./typography";
import type { BrandMetadata } from "./metadata";
import type { BrandLogoConfig } from "./logo";
import type { BrandScenes } from "./scenes";
import type { BrandGuardrails } from "./guardrails";
import {
  applyThemeVariant,
  getThemeVariant,
  type BrandThemeSystem,
} from "./themes";
import { arcadeghostsBrand } from "./brands/arcadeghosts";
import { jasonpollardBrand } from "./brands/jasonpollard";

export const DEFAULT_BRAND_ID = "arcadeghosts";

export type BrandConfig = {
  id: string;
  displayName: string;
  shortName: string;
  palette: DesignPalette;
  typography: DesignTypography;
  metadata: BrandMetadata;
  logo: BrandLogoConfig;
  scenes: BrandScenes;
  guardrails: BrandGuardrails;
  themes: BrandThemeSystem;
  composition: {
    family: "atmospheric" | "editorial";
    effects: {
      radialGlows: boolean;
      sweepingArcs: boolean;
      glassPanels: boolean;
    };
  };
  labels: {
    workWithMe: string;
    arcade: string;
  };
};

const brandRegistry: Record<string, BrandConfig> = {
  arcadeghosts: arcadeghostsBrand,
  jasonpollard: jasonpollardBrand,
};

function normalizeBrandId(brandId: string) {
  return brandId.trim().toLowerCase();
}

export function getBrandConfig(brandId = DEFAULT_BRAND_ID): BrandConfig {
  const normalized = normalizeBrandId(brandId);
  const brand = brandRegistry[normalized];
  if (!brand) {
    throw new Error(
      `Unknown brand ID "${brandId}". Known brand IDs: ${listBrandIds().join(", ")}`,
    );
  }
  return brand;
}

export function listBrandIds(): string[] {
  return Object.keys(brandRegistry);
}

export function getBrandThemeVariant(
  brandId = DEFAULT_BRAND_ID,
  variantId?: string,
) {
  const brand = getBrandConfig(brandId);
  return getThemeVariant(brand.themes, variantId);
}

export function getBrandPalette(
  brandId = DEFAULT_BRAND_ID,
  variantId?: string,
): DesignPalette {
  const brand = getBrandConfig(brandId);
  const variant = getBrandThemeVariant(brandId, variantId);
  return applyThemeVariant(brand.palette, variant);
}
