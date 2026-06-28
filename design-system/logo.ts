export type BrandLogoConfig = {
  primaryAsset: string;
  fallbackAsset: string;
  usageRulesPath: string;
  treatments: {
    preferredBackgrounds: string[];
    avoidBackgrounds: string[];
    preferredPlacements: string[];
    avoidTreatments: string[];
  };
  clearSpace: {
    ratioToLogoWidth: number;
    minimumPixels: number;
  };
  sizing: {
    minimumDigitalWidth: number;
    preferredDigitalWidth: number;
    heroDigitalWidth: number;
  };
};

export function createLogoConfig(
  overrides: Partial<BrandLogoConfig> = {},
): BrandLogoConfig {
  return {
    primaryAsset: "brands/example/assets/logo.png",
    fallbackAsset: "brands/example/assets/logo.png",
    usageRulesPath: "brands/example/logo-usage-rules.md",
    treatments: {
      preferredBackgrounds: [
        "dark layered gradients",
        "deep night panels",
        "atmospheric image crops with shadow support",
      ],
      avoidBackgrounds: [
        "flat white",
        "high-noise textures",
        "busy photography with weak contrast",
      ],
      preferredPlacements: [
        "anchored corner mark",
        "hero focal block",
        "contained badge or panel",
      ],
      avoidTreatments: [
        "stretching or squashing",
        "heavy glow that obscures edges",
        "tiny unreadable placements",
        "stacking over dense copy",
      ],
    },
    clearSpace: {
      ratioToLogoWidth: 0.2,
      minimumPixels: 24,
    },
    sizing: {
      minimumDigitalWidth: 96,
      preferredDigitalWidth: 160,
      heroDigitalWidth: 280,
    },
    ...overrides,
  };
}
