export type HeroSceneConfig = {
  id: string;
  label: string;
  kicker: string;
  title: string;
  subtitle: string;
  headline?: string;
  subline?: string;
  canonicalUrl?: string;
};

export type BrandScenes = {
  defaultHero: HeroSceneConfig;
  workWithMeHero?: HeroSceneConfig;
};

export function createHeroSceneConfig(
  overrides: Partial<HeroSceneConfig> = {},
): HeroSceneConfig {
  return {
    id: "default-hero",
    label: "Default Hero",
    kicker: "Signal in the dark",
    title: "Brand Hero",
    subtitle: "Projects, stories, offerings, and a point of view.",
    headline: "Small software projects with a strange little heartbeat",
    subline: "Shared scene defaults that should be overridden per brand.",
    canonicalUrl: "https://example.com",
    ...overrides,
  };
}
