import { promises as fs } from "node:fs";
import path from "node:path";

import type { HeroCompositionData } from "../social/hero-composition";
import {
  readPngDimensions,
  toDisplayUrl,
} from "../shared/output-manifest";

export type WebsiteHeroManifest = {
  generatorFamily: "website";
  outputKind: "website-hero";
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
  };
  vendorReadiness: "production-candidate";
  preflight: {
    dimensionsVerified: boolean;
    assetExistenceVerified: boolean;
    outputCompletenessVerified: boolean;
    expectedDisplayUrl: string;
    safeArea: {
      label: string;
      description: string;
    };
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

export async function writeWebsiteHeroManifest(options: {
  data: HeroCompositionData;
  outputName: string;
  size: { width: number; height: number };
  svgPath: string;
  pngPath: string;
}) {
  const { data, outputName, size, svgPath, pngPath } = options;
  const manifestPath = path.join(path.dirname(pngPath), `${outputName}.manifest.json`);

  const [svgExists, pngExists] = await Promise.all([
    fileExists(svgPath),
    fileExists(pngPath),
  ]);
  if (!svgExists || !pngExists) {
    throw new Error(
      `Website hero completeness check failed for ${outputName}: svg=${svgExists}, png=${pngExists}`,
    );
  }

  const dimensions = await readPngDimensions(pngPath);
  if (dimensions.width !== size.width || dimensions.height !== size.height) {
    throw new Error(
      `Website hero PNG failed dimension verification: expected ${size.width}x${size.height}, got ${dimensions.width}x${dimensions.height}`,
    );
  }

  const expectedDisplayUrl = toDisplayUrl(
    data.scene.canonicalUrl ?? data.brand.metadata.homeUrl,
  );

  const manifest: WebsiteHeroManifest = {
    generatorFamily: "website",
    outputKind: "website-hero",
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
    },
    vendorReadiness: "production-candidate",
    preflight: {
      dimensionsVerified: true,
      assetExistenceVerified: true,
      outputCompletenessVerified: true,
      expectedDisplayUrl,
      safeArea: {
        label: "Hero copy zone",
        description:
          "Keep the left-side headline and subtitle area readable if the image is cropped responsively.",
      },
    },
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifestPath;
}
