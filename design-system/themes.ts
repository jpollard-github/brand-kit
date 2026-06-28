import type { DesignPalette } from "./colors";

export type ThemeVariantId =
  | "default"
  | "synthwave"
  | "winter"
  | "conference"
  | "minimal-print"
  | "holiday";

export type BrandThemeVariant = {
  id: ThemeVariantId;
  label: string;
  summary: string;
  paletteOverrides: Partial<DesignPalette>;
  bestFor: string[];
  avoidFor: string[];
};

export type BrandThemeSystem = {
  defaultVariantId: ThemeVariantId;
  variants: BrandThemeVariant[];
};

export function getRequestedThemeVariantId(variantId?: string): string {
  return variantId ?? process.env.BRAND_THEME ?? "default";
}

export function createThemedOutputName(
  baseName: string,
  variantId?: string,
): string {
  const resolvedVariantId = getRequestedThemeVariantId(variantId);
  return resolvedVariantId === "default"
    ? baseName
    : `${baseName}-${resolvedVariantId}`;
}

export function createThemeVariant(
  overrides: Partial<BrandThemeVariant> & Pick<BrandThemeVariant, "id" | "label">,
): BrandThemeVariant {
  return {
    id: overrides.id,
    label: overrides.label,
    summary: overrides.summary ?? "A safe palette-level theme variation.",
    paletteOverrides: overrides.paletteOverrides ?? {},
    bestFor: overrides.bestFor ?? [],
    avoidFor: overrides.avoidFor ?? [],
  };
}

export function createThemeSystem(
  overrides: Partial<BrandThemeSystem> = {},
): BrandThemeSystem {
  return {
    defaultVariantId: "default",
    variants: [
      createThemeVariant({
        id: "default",
        label: "Default",
        summary: "Primary brand palette with the normal brand mood balance.",
      }),
    ],
    ...overrides,
  };
}

export function getThemeVariant(
  system: BrandThemeSystem,
  variantId?: string,
): BrandThemeVariant {
  const requestedVariantId = getRequestedThemeVariantId(variantId);

  if (requestedVariantId === "default") {
    return (
      system.variants.find((variant) => variant.id === system.defaultVariantId) ??
      system.variants[0]
    );
  }

  return (
    system.variants.find((variant) => variant.id === requestedVariantId) ??
    system.variants.find((variant) => variant.id === system.defaultVariantId) ??
    system.variants[0]
  );
}

export function applyThemeVariant(
  palette: DesignPalette,
  variant: BrandThemeVariant,
): DesignPalette {
  return {
    ...palette,
    ...variant.paletteOverrides,
  };
}

export function listThemeVariantIds(system: BrandThemeSystem): ThemeVariantId[] {
  return system.variants.map((variant) => variant.id);
}
