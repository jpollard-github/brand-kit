import { describe, expect, it } from "vitest";

import {
  applyThemeVariant,
  createThemeSystem,
  createThemeVariant,
  createThemedOutputName,
  getThemeVariant,
} from "../../design-system/themes";
import { defaultPalette } from "../../design-system/colors";

describe("themes", () => {
  it("keeps default output names unsuffixed", () => {
    expect(createThemedOutputName("arcadeghosts-og-image", "default")).toBe(
      "arcadeghosts-og-image",
    );
  });

  it("suffixes non-default output names", () => {
    expect(createThemedOutputName("arcadeghosts-og-image", "conference")).toBe(
      "arcadeghosts-og-image-conference",
    );
  });

  it("resolves a matching theme variant", () => {
    const system = createThemeSystem({
      variants: [
        createThemeVariant({ id: "default", label: "Default" }),
        createThemeVariant({ id: "conference", label: "Conference" }),
      ],
    });

    expect(getThemeVariant(system, "conference").id).toBe("conference");
  });

  it("applies palette overrides onto the base palette", () => {
    const variant = createThemeVariant({
      id: "winter",
      label: "Winter",
      paletteOverrides: {
        teal: "#abcdef",
      },
    });

    expect(applyThemeVariant(defaultPalette, variant).teal).toBe("#abcdef");
    expect(applyThemeVariant(defaultPalette, variant).amber).toBe(
      defaultPalette.amber,
    );
  });
});
