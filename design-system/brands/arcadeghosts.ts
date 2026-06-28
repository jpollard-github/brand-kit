import { arcadeghostsSitePalette, createPalette } from "../colors";
import { defaultTypography } from "../typography";
import { createMetadata } from "../metadata";
import { createLogoConfig } from "../logo";
import { createHeroSceneConfig } from "../scenes";
import { createBrandGuardrails, toToneRuleLabels } from "../guardrails";
import { createThemeSystem, createThemeVariant } from "../themes";
import type { BrandConfig } from "../brand-config";

const arcadeghostsGuardrails = createBrandGuardrails({
  coreTension: [
    "professional enough to trust",
    "personal enough to feel real",
    "playful enough to remember",
    "atmospheric enough to feel like a place",
  ],
  visualDna: [
    "dark, layered backgrounds instead of flat black",
    "warm off-white text instead of stark white",
    "neon accents used with restraint",
    "a world of pines, signals, diners, night roads, and arcade glow",
    "retro-futurist energy without turning into novelty cosplay",
  ],
  preserveAcrossOutputs: [
    "clear hierarchy before decoration",
    "a sense of invitation rather than noise",
    "enough warmth that the work still feels human",
    "enough discipline that the output could be used in real life",
  ],
  avoid: [
    "generic SaaS minimalism",
    "overly loud synthwave parody",
    "dense poster-like clutter",
    "cold tech-brand sterility",
    "cute-for-cute's-sake whimsy without edge or atmosphere",
  ],
});

const arcadeghostsThemes = createThemeSystem({
  defaultVariantId: "default",
  variants: [
    createThemeVariant({
      id: "default",
      label: "Default",
      summary: "The normal ArcadeGhosts night-signal palette.",
      bestFor: ["general site/social use", "merch", "hero compositions"],
      avoidFor: [],
    }),
    createThemeVariant({
      id: "synthwave",
      label: "Synthwave",
      summary:
        "A brighter, more theatrical neon variant with stronger magenta/violet energy.",
      paletteOverrides: {
        background: "#140a1c",
        backgroundSoft: "#211131",
        backgroundDeep: "#0b0511",
        text: "#fff2ea",
        textMuted: "#e3bfd2",
        amber: "#ffce73",
        teal: "#46ffe3",
        cyan: "#5fd8ff",
        pink: "#ff4a98",
        violet: "#a66dff",
        border: "rgba(255, 226, 241, 0.26)",
      },
      bestFor: ["social campaigns", "stickers", "event promo"],
      avoidFor: ["dense body-copy documents", "print-first minimal surfaces"],
    }),
    createThemeVariant({
      id: "winter",
      label: "Winter",
      summary: "Cooler and quieter while staying recognizably ArcadeGhosts.",
      paletteOverrides: {
        background: "#091018",
        backgroundSoft: "#111a24",
        backgroundDeep: "#060b11",
        textMuted: "#b9c7cf",
        teal: "#6ce2ea",
        cyan: "#8de7ff",
        pink: "#d46f93",
      },
      bestFor: ["seasonal site refreshes", "wallpapers", "newsletter headers"],
      avoidFor: ["high-energy promo pushes"],
    }),
    createThemeVariant({
      id: "conference",
      label: "Conference",
      summary:
        "An event/readability variant with clearer contrast and stronger stage-signage energy.",
      paletteOverrides: {
        background: "#0c1118",
        backgroundSoft: "#17202c",
        backgroundDeep: "#081018",
        text: "#fff6ea",
        textMuted: "#d8d8cf",
        amber: "#ffd76f",
        teal: "#4ef7e2",
        cyan: "#86ecff",
        pink: "#ff6b88",
        border: "rgba(255, 246, 234, 0.28)",
      },
      bestFor: ["badges", "flyers", "slides", "event banners"],
      avoidFor: ["moodier atmospheric pieces that want softer contrast"],
    }),
    createThemeVariant({
      id: "minimal-print",
      label: "Minimal Print",
      summary: "A restrained print-friendly variant for calmer physical documents.",
      paletteOverrides: {
        background: "#16181d",
        backgroundSoft: "#20242b",
        backgroundDeep: "#0e1115",
        textMuted: "#d7cec2",
        pink: "#d96a86",
        teal: "#5bc6bc",
      },
      bestFor: ["letterhead", "invoice", "print proofs"],
      avoidFor: ["pieces that depend on rich neon atmosphere"],
    }),
    createThemeVariant({
      id: "holiday",
      label: "Holiday",
      summary: "Seasonal warmth without breaking the core brand mood.",
      paletteOverrides: {
        amber: "#ffcd75",
        teal: "#54dbc5",
        pink: "#ff6678",
        violet: "#8f79ff",
      },
      bestFor: ["seasonal social art", "giftable merch", "year-end updates"],
      avoidFor: ["serious client-facing documents"],
    }),
  ],
});

export const arcadeghostsBrand: BrandConfig = {
  id: "arcadeghosts",
  displayName: "ArcadeGhosts",
  shortName: "ArcadeGhosts",
  palette: createPalette(arcadeghostsSitePalette),
  typography: {
    ...defaultTypography,
  },
  scenes: {
    defaultHero: createHeroSceneConfig({
      id: "arcadeghosts-hero",
      label: "ArcadeGhosts Hero",
      kicker: "Neon forest signal",
      title: "ArcadeGhosts",
      subtitle:
        "Software projects, writing, music, cats, and strange little experiments.",
      headline: "Small software projects with a strange little heartbeat",
      subline:
        "Web apps, automation, AI-assisted systems, and technical cleanup.",
      canonicalUrl: "https://arcadeghosts.org",
    }),
    workWithMeHero: createHeroSceneConfig({
      id: "work-with-me-hero",
      label: "Work With Me Hero",
      kicker: "Work With Me",
      title: "Small projects. Clear problems. Personal attention.",
      subtitle:
        "Web applications, tools, automations, AI workflows, and practical technical problem solving with Jason Pollard.",
      headline: "Small projects. Clear problems. Personal attention.",
      subline:
        "Need a website improvement, business automation, AI workflow, internal tool, or technical problem solved?",
      canonicalUrl: "https://arcadeghosts.org/work-with-me",
    }),
  },
  logo: createLogoConfig({
    primaryAsset: "brands/arcadeghosts/assets/logo.png",
    fallbackAsset: "brands/arcadeghosts/assets/logo.png",
    usageRulesPath: "brands/arcadeghosts/logo-usage-rules.md",
    treatments: {
      preferredBackgrounds: [
        "dark layered gradients",
        "muted neon panels",
        "foggy or forested night imagery with clear silhouette contrast",
      ],
      avoidBackgrounds: [
        "plain white fields",
        "harsh checker or glitch textures",
        "bright candy gradients that flatten the mood",
      ],
      preferredPlacements: [
        "upper-corner anchor",
        "contained brand panel",
        "hero focal block with breathing room",
      ],
      avoidTreatments: [
        "drop-shadow soup",
        "outline tracing effects",
        "using the logo as a repeating wallpaper tile",
        "placing copy directly across the mark",
      ],
    },
    clearSpace: {
      ratioToLogoWidth: 0.22,
      minimumPixels: 28,
    },
    sizing: {
      minimumDigitalWidth: 110,
      preferredDigitalWidth: 180,
      heroDigitalWidth: 320,
    },
  }),
  metadata: createMetadata({
    summary:
      "ArcadeGhosts is Jason Pollard's personal site for software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
    homeUrl: "https://arcadeghosts.org",
    workWithMeUrl: "https://arcadeghosts.org/work-with-me",
    canonicalDomain: "arcadeghosts.org",
    contactEmail: "jason@arcadeghosts.org",
    contactName: "Jason Pollard",
    toneRules: toToneRuleLabels(arcadeghostsGuardrails),
    sourceReference: "brands/arcadeghosts/site-reference.md",
  }),
  guardrails: arcadeghostsGuardrails,
  themes: arcadeghostsThemes,
  labels: {
    workWithMe: "Work With Me",
    arcade: "ArcadeGhosts",
  },
};
