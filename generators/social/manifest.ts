import { promises as fs } from "node:fs";
import path from "node:path";

import type { HeroCompositionData } from "./hero-composition";
import { readPngDimensions, toDisplayUrl } from "../shared/output-manifest";

export type SocialOutputKind = "og-image" | "linkedin-banner" | "github-social";

export type SocialSafeArea = {
  label: string;
  description: string;
};

export type SocialManifest = {
  generatorFamily: "social";
  outputKind: SocialOutputKind;
  brandId: string;
  brandName: string;
  themeId: string;
  sceneId: string;
  sceneLabel: string;
  outputName: string;
  generatedAt: string;
  dimensions: {
    width: number;
    height: number;
  };
  outputs: {
    svgPath: string;
    pngPath: string;
    manifestPath: string;
  };
  sourceMetadata: {
    canonicalDomain: string;
    homeUrl: string;
    contactEmail: string;
    sceneCanonicalUrl: string;
    displayUrl: string;
    kicker: string;
    title: string;
    subtitle: string;
    headline: string;
    subline: string;
  };
  vendorReadiness: "production-candidate";
  preflight: {
    dimensionsVerified: boolean;
    assetExistenceVerified: boolean;
    outputCompletenessVerified: boolean;
    expectedDisplayUrl: string;
    safeArea?: SocialSafeArea;
  };
};

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeSocialManifest(options: {
  data: HeroCompositionData;
  outputKind: SocialOutputKind;
  outputName: string;
  size: { width: number; height: number };
  svgPath: string;
  pngPath: string;
  safeArea?: SocialSafeArea;
}) {
  const { data, outputKind, outputName, size, svgPath, pngPath, safeArea } = options;
  const manifestPath = path.join(path.dirname(pngPath), `${outputName}.manifest.json`);

  const [svgExists, pngExists] = await Promise.all([
    fileExists(svgPath),
    fileExists(pngPath),
  ]);

  if (!svgExists || !pngExists) {
    throw new Error(
      `${outputKind} output completeness check failed for ${outputName}: svg=${svgExists}, png=${pngExists}`,
    );
  }

  const pngDimensions = await readPngDimensions(pngPath);
  if (
    pngDimensions.width !== size.width ||
    pngDimensions.height !== size.height
  ) {
    throw new Error(
      `${outputKind} PNG failed dimension verification: expected ${size.width}x${size.height}, got ${pngDimensions.width}x${pngDimensions.height}`,
    );
  }

  const expectedDisplayUrl = toDisplayUrl(
    data.scene.canonicalUrl ?? data.brand.metadata.homeUrl,
  );

  const manifest: SocialManifest = {
    generatorFamily: "social",
    outputKind,
    brandId: data.brand.id,
    brandName: data.brand.displayName,
    themeId: data.themeVariant.id,
    sceneId: data.scene.id,
    sceneLabel: data.scene.label,
    outputName,
    generatedAt: new Date().toISOString(),
    dimensions: size,
    outputs: {
      svgPath: path.relative(process.cwd(), svgPath),
      pngPath: path.relative(process.cwd(), pngPath),
      manifestPath: path.relative(process.cwd(), manifestPath),
    },
    sourceMetadata: {
      canonicalDomain: data.brand.metadata.canonicalDomain,
      homeUrl: data.brand.metadata.homeUrl,
      contactEmail: data.brand.metadata.contactEmail,
      sceneCanonicalUrl: data.scene.canonicalUrl ?? data.brand.metadata.homeUrl,
      displayUrl: data.displayUrl,
      kicker: data.scene.kicker,
      title: data.scene.title,
      subtitle: data.scene.subtitle,
      headline: data.scene.headline ?? data.scene.title,
      subline: data.scene.subline ?? data.scene.subtitle,
    },
    vendorReadiness: "production-candidate",
    preflight: {
      dimensionsVerified: true,
      assetExistenceVerified: true,
      outputCompletenessVerified: true,
      expectedDisplayUrl,
      ...(safeArea ? { safeArea } : {}),
    },
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifestPath;
}
