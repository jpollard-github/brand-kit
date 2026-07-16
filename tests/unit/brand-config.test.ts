import { describe, expect, it } from "vitest";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandPalette,
  getBrandThemeVariant,
  listBrandIds,
} from "../../design-system/brand-config";
import { readFile } from "node:fs/promises";
import {
  buildHeroCompositionData,
} from "../../generators/social/hero-composition";
import { renderJasonPollardLinkedIn } from "../../generators/social/editorial-format-layouts";

describe("brand config", () => {
  it("returns the ArcadeGhosts default brand", () => {
    expect(getBrandConfig().id).toBe(DEFAULT_BRAND_ID);
  });

  it("returns a known brand by id", () => {
    expect(getBrandConfig("arcadeghosts").displayName).toBe("ArcadeGhosts");
  });

  it("throws on an unknown brand id", () => {
    expect(() => getBrandConfig("unknown-brand")).toThrow(
      /Unknown brand ID "unknown-brand"/,
    );
  });

  it("lists registered brand ids", () => {
    expect(listBrandIds()).toEqual(["arcadeghosts", "jasonpollard"]);
  });

  it("keeps ArcadeGhosts as the explicit default", () => {
    expect(DEFAULT_BRAND_ID).toBe("arcadeghosts");
  });

  it("resolves Jason Pollard public metadata and palette", () => {
    const brand = getBrandConfig("jasonpollard");
    expect(brand.metadata).toMatchObject({
      canonicalDomain: "jasonpollard.com",
      homeUrl: "https://jasonpollard.com",
      contactEmail: "hello@jasonpollard.com",
    });
    expect(brand.palette).toEqual({
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
    });
    expect(brand.typography.fontStack).toBe("Arial, Helvetica, sans-serif");
  });

  it("does not leak ArcadeGhosts copy or metadata into Jason Pollard", () => {
    expect(JSON.stringify(getBrandConfig("jasonpollard")).toLowerCase()).not.toContain("arcadeghosts");
  });

  it("preserves Jason Pollard identity through theme variants", () => {
    const brand = getBrandConfig("jasonpollard");
    const palette = getBrandPalette("jasonpollard", "minimal-print");
    expect(brand.shortName).toBe("JP");
    expect(brand.scenes.defaultHero.title).toBe("Jason Pollard");
    expect(palette.teal).toBe(brand.palette.teal);
    expect(palette.amber).toBe(brand.palette.amber);
  });

  it("uses the site JP monogram source", async () => {
    const source = await readFile("brands/jasonpollard/assets/jp-monogram.svg", "utf8");
    expect(source).toContain('viewBox="0 0 64 64"');
    expect(source).toContain('rx="8" fill="#112033"');
    expect(source).toContain('font-family="ui-monospace, SFMono-Regular, Consolas, monospace"');
    expect(source).toContain('fill="#fffdf8"');
    expect(source).not.toContain("<path");
  });

  it("selects an editorial composition with atmospheric effects disabled", () => {
    expect(getBrandConfig("jasonpollard").composition).toEqual({
      family: "editorial",
      effects: { radialGlows: false, sweepingArcs: false, glassPanels: false },
    });
    expect(getBrandConfig("arcadeghosts").composition).toEqual({
      family: "atmospheric",
      effects: { radialGlows: true, sweepingArcs: true, glassPanels: true },
    });
  });

  it("renders Jason Pollard without glow, arc, glass, or avatar patterns", async () => {
    const data = await buildHeroCompositionData("jasonpollard");
    const svg = renderJasonPollardLinkedIn(data);
    expect(svg).toContain('pattern id="siteGrid"');
    expect(svg).not.toMatch(/radialGradient|Glow|<path d="M .* C |rgba\(|AVATAR/i);
  });

  it("returns named theme variants from the brand theme system", () => {
    expect(getBrandThemeVariant("arcadeghosts", "conference").id).toBe(
      "conference",
    );
  });

  it("returns a themed palette when a variant is requested", () => {
    const defaultPalette = getBrandPalette("arcadeghosts", "default");
    const conferencePalette = getBrandPalette("arcadeghosts", "conference");

    expect(conferencePalette.amber).not.toBe(defaultPalette.amber);
  });
});
