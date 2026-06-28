import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  type BrandConfig,
} from "../../design-system/brand-config";
import { createThemedOutputName } from "../../design-system/themes";

export function parseCliFlag(
  argv: string[],
  flagName: string,
  fallback?: string,
) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === flagName) {
      return argv[index + 1] ?? fallback;
    }
    if (arg.startsWith(`${flagName}=`)) {
      return arg.slice(flagName.length + 1);
    }
  }

  return fallback;
}

export function resolveBrandId(argv: string[], fallback = DEFAULT_BRAND_ID) {
  return parseCliFlag(argv, "--brand", fallback) ?? fallback;
}

export function resolveSceneId(argv: string[], fallback?: string) {
  return parseCliFlag(argv, "--scene", fallback);
}

export function resolveThemeId(fallback = process.env.BRAND_THEME) {
  return fallback ?? "default";
}

export function createBrandOutputName(
  brandId: string,
  suffix: string,
  themeId = process.env.BRAND_THEME,
) {
  return createThemedOutputName(`${brandId}-${suffix}`, themeId);
}

export function resolveBrandConfigFromCli(argv: string[]) {
  const brandId = resolveBrandId(argv);
  return getBrandConfig(brandId);
}

export function defaultRoleLabel(brand: BrandConfig) {
  return brand.shortName;
}
