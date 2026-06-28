import { describe, expect, it } from "vitest";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandPalette,
  getBrandThemeVariant,
  listBrandIds,
} from "../../design-system/brand-config";

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
    expect(listBrandIds()).toEqual(["arcadeghosts"]);
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
