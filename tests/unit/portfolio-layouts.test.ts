import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import { buildHeroCompositionData } from "../../generators/social/hero-composition";
import {
  brandKitProjectCoverLayout,
  isWithinCanvas,
  jasonPollardLinkedInLayout,
  jasonPollardOgLayout,
  renderBrandKitProjectCover,
  renderJasonPollardLinkedIn,
  renderJasonPollardOg,
  type Rect,
} from "../../generators/social/editorial-format-layouts";
import { renderBrandKitSystemPreview, systemPreviewLayout } from "../../generators/portfolio/brandkit-proof-visuals";

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

describe("job-search format layouts", () => {
  it("keeps every declared text bound inside its canvas", () => {
    for (const layout of [jasonPollardOgLayout, jasonPollardLinkedInLayout, brandKitProjectCoverLayout]) {
      expect(Object.values(layout.textBounds).every((rect) => isWithinCanvas(rect, layout.canvas))).toBe(true);
      expect(isWithinCanvas(layout.contentBounds, layout.canvas)).toBe(true);
    }
  });

  it("renders the complete site-approved Open Graph composition", async () => {
    const data = await buildHeroCompositionData("jasonpollard");
    const svg = renderJasonPollardOg(data);
    for (const copy of jasonPollardOgLayout.requiredCopy) expect(svg.replaceAll("&amp;", "&")).toContain(copy);
    expect(svg).toContain('height="14"');
    expect(svg).not.toContain("logoDataUrl");
  });

  it("keeps LinkedIn essential text outside the profile overlap and its JP mark nonessential to the centered crop", async () => {
    const profile = jasonPollardLinkedInLayout.safeAreas.profilePhoto;
    for (const key of ["headline", "positioning", "domain"] as const) expect(overlaps(jasonPollardLinkedInLayout.textBounds[key], profile)).toBe(false);
    const mobile = jasonPollardLinkedInLayout.safeAreas.centeredMobileCrop;
    const jpMark = { x: 56, y: 46, width: 112, height: 112 };
    expect(overlaps(jpMark, mobile)).toBe(false);
    const svg = renderJasonPollardLinkedIn(await buildHeroCompositionData("jasonpollard"));
    expect(svg.replaceAll("&amp;", "&")).toContain("I build, repair, modernize, and explain difficult software systems.");
    expect(svg).not.toMatch(/AVATAR/i);
  });

  it("renders a BrandKit-specific project cover", async () => {
    const svg = renderBrandKitProjectCover(await buildHeroCompositionData("jasonpollard"));
    for (const copy of brandKitProjectCoverLayout.requiredCopy) expect(svg).toContain(copy);
    expect(svg).not.toContain("I build, repair");
  });

  it("uses the 1600 × 1100 deliberate preview layout without a giant blank region", () => {
    expect(systemPreviewLayout.canvas).toEqual({ width: 1600, height: 1100 });
    expect(systemPreviewLayout.evidence.y + systemPreviewLayout.evidence.height).toBeGreaterThanOrEqual(1040);
    const svg = renderBrandKitSystemPreview({ jasonOg: "a", jasonLinkedIn: "b", projectCover: "c", arcadeGhostsOg: "d" });
    expect(svg).not.toMatch(/2200|fullPage|object-fit/i);
  });

  it("keeps business cards out of the public candidate list and defaults visuals to human review", async () => {
    const source = await readFile("scripts/create-brandkit-proof.ts", "utf8");
    expect(source).toContain('status: "human-review-required"');
    expect(source).not.toContain('publicProofFamilies: ["business');
    expect(source).not.toContain("createCardProof");
  });

  it("uses plain-language public diagram labels", async () => {
    const svg = await readFile("docs/brandkit-architecture.svg", "utf8");
    expect(svg).toContain("How BrandKit turns a brand into approved assets");
    expect(svg).toContain("Brand ingredients + format rules + shared generation + verification = repeatable output");
    for (const banned of ["Registry + typed config", "Guardrails", "Generator family", "Human review packet"]) expect(svg).not.toContain(banned);
  });
});
