import { createPalette } from "../colors";
import { createBrandGuardrails, toToneRuleLabels } from "../guardrails";
import { createLogoConfig } from "../logo";
import { createMetadata } from "../metadata";
import { createHeroSceneConfig } from "../scenes";
import { createThemeSystem, createThemeVariant } from "../themes";
import { defaultTypography } from "../typography";
import type { BrandConfig } from "../brand-config";

const guardrails = createBrandGuardrails({
  coreTension: [
    "technical depth without unnecessary complexity",
    "editorial calm without feeling generic",
    "personal authority without self-promotion",
  ],
  visualDna: [
    "warm neutral fields",
    "deep navy and ink structure",
    "restrained teal for technical signal",
    "copper used as a quiet editorial accent",
    "clear typography and generous negative space",
  ],
  preserveAcrossOutputs: [
    "the JP monogram",
    "warm-neutral and ink contrast",
    "restrained accent use",
    "calm, direct hierarchy",
  ],
  avoid: [
    "neon atmosphere",
    "generic corporate gradients",
    "decorative complexity without meaning",
    "inflated claims or consulting-sales language",
  ],
});

const themes = createThemeSystem({
  defaultVariantId: "default",
  variants: [
    createThemeVariant({
      id: "default",
      label: "Editorial",
      summary: "The current site palette: warm paper, deep ink, restrained teal, and copper accents.",
      bestFor: ["portfolio surfaces", "professional social graphics", "covers"],
    }),
    createThemeVariant({
      id: "minimal-print",
      label: "Minimal Print",
      summary: "A quieter, lighter proof variant that preserves the JP identity.",
      paletteOverrides: {
        background: "#fffdf8",
        backgroundSoft: "#f4f1e9",
        backgroundDeep: "#e9e4d8",
        text: "#112033",
        textMuted: "#56616d",
        border: "#c9c5bb",
      },
      bestFor: ["business cards", "documents", "print proofs"],
    }),
  ],
});

export const jasonpollardBrand: BrandConfig = {
  id: "jasonpollard",
  displayName: "Jason Pollard",
  shortName: "JP",
  palette: createPalette({
    background: "#f4f1e9",
    backgroundSoft: "#fffdf8",
    backgroundDeep: "#e9e4d8",
    text: "#112033",
    textMuted: "#56616d",
    amber: "#a8532c",
    teal: "#147d78",
    cyan: "#0c5e5b",
    pink: "#a8532c",
    violet: "#354455",
    border: "#c9c5bb",
  }),
  typography: {
    ...defaultTypography,
    fontStack: "Arial, Helvetica, sans-serif",
  },
  metadata: createMetadata({
    summary: "Staff-level software engineer and solutions architect modernizing difficult systems and applying AI with engineering judgment.",
    homeUrl: "https://jasonpollard.com",
    workWithMeUrl: "https://jasonpollard.com",
    canonicalDomain: "jasonpollard.com",
    contactEmail: "hello@jasonpollard.com",
    contactName: "Jason Pollard",
    toneRules: toToneRuleLabels(guardrails),
    sourceReference: "brands/jasonpollard/site-reference.md",
  }),
  logo: createLogoConfig({
    primaryAsset: "brands/jasonpollard/assets/jp-monogram.svg",
    fallbackAsset: "brands/jasonpollard/assets/jp-monogram.svg",
    usageRulesPath: "brands/jasonpollard/README.md",
    treatments: {
      preferredBackgrounds: ["warm neutral", "deep navy", "uncluttered fields"],
      avoidBackgrounds: ["busy photography", "high-saturation gradients"],
      preferredPlacements: ["quiet corner anchor", "contained editorial block"],
      avoidTreatments: ["glow", "distortion", "repeating patterns"],
    },
  }),
  scenes: {
    defaultHero: createHeroSceneConfig({
      id: "jasonpollard-hero",
      label: "Jason Pollard",
      kicker: "Staff / Principal Software Engineer · Solutions Architect",
      title: "Jason Pollard",
      subtitle: "I build, repair, modernize, and explain difficult software systems.",
      headline: "I build, repair, modernize, and explain difficult software systems.",
      subline: "AI-enabled engineering with human judgment governing security, maintainability, and architectural fit.",
      canonicalUrl: "https://jasonpollard.com",
    }),
  },
  guardrails,
  themes,
  composition: {
    family: "editorial",
    effects: { radialGlows: false, sweepingArcs: false, glassPanels: false },
  },
  labels: {
    workWithMe: "Engineering",
    arcade: "Jason Pollard",
  },
};
