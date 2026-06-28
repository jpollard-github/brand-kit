import { arcadeghostsSitePalette, createPalette } from "../colors";
import { defaultTypography } from "../typography";
import { createMetadata } from "../metadata";
import type { BrandConfig } from "../brand-config";

export const arcadeghostsBrand: BrandConfig = {
  id: "arcadeghosts",
  displayName: "ArcadeGhosts",
  shortName: "ArcadeGhosts",
  palette: createPalette(arcadeghostsSitePalette),
  typography: {
    ...defaultTypography,
  },
  metadata: createMetadata({
    summary:
      "ArcadeGhosts is Jason Pollard's personal site for software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
    homeUrl: "https://arcadeghosts.org",
    workWithMeUrl: "https://arcadeghosts.org/work-with-me",
    canonicalDomain: "arcadeghosts.org",
    contactEmail: "jason@arcadeghosts.org",
    toneRules: [
      "professional but personal",
      "neon but readable",
      "atmospheric but not cluttered",
    ],
    sourceReference: "brands/arcadeghosts/site-reference.md",
  }),
  labels: {
    workWithMe: "Work With Me",
    arcade: "ArcadeGhosts",
  },
};
