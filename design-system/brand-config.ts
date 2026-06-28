import type { DesignPalette } from "./colors";
import type { DesignTypography } from "./typography";
import type { BrandMetadata } from "./metadata";
import { arcadeghostsBrand } from "./brands/arcadeghosts";

export type BrandConfig = {
  id: string;
  displayName: string;
  shortName: string;
  palette: DesignPalette;
  typography: DesignTypography;
  metadata: BrandMetadata;
  labels: {
    workWithMe: string;
    arcade: string;
  };
};

const brandRegistry: Record<string, BrandConfig> = {
  arcadeghosts: arcadeghostsBrand,
};

export function getBrandConfig(brandId = "arcadeghosts"): BrandConfig {
  const normalized = brandId.toLowerCase();
  return brandRegistry[normalized] ?? arcadeghostsBrand;
}

export function listBrandIds(): string[] {
  return Object.keys(brandRegistry);
}
