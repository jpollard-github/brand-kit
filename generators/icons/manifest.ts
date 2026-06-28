import { promises as fs } from "node:fs";
import path from "node:path";

import type { HeroCompositionData } from "../social/hero-composition";
import { readPngDimensions } from "../shared/output-manifest";

export type IconManifest = {
  generatorFamily: "icons";
  brandId: string;
  brandName: string;
  themeId: string;
  sceneId: string;
  sceneLabel: string;
  outputBaseName: string;
  generatedAt: string;
  sourceMetadata: {
    canonicalDomain: string;
    homeUrl: string;
    contactEmail: string;
  };
  outputs: Array<{
    role: string;
    path: string;
    width?: number;
    height?: number;
  }>;
  vendorReadiness: "production-candidate";
  preflight: {
    assetExistenceVerified: boolean;
    outputCompletenessVerified: boolean;
    dimensionsVerified: boolean;
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

export async function writeIconManifest(options: {
  data: HeroCompositionData;
  outputBaseName: string;
  svgPath: string;
  pngPaths: Array<{
    role: string;
    path: string;
    expectedWidth: number;
    expectedHeight: number;
  }>;
}) {
  const { data, outputBaseName, svgPath, pngPaths } = options;
  const manifestPath = path.join(
    path.dirname(svgPath),
    `${outputBaseName}-icons.manifest.json`,
  );

  const svgExists = await fileExists(svgPath);
  if (!svgExists) {
    throw new Error(`Icon manifest completeness check failed: missing ${svgPath}`);
  }

  const outputEntries: IconManifest["outputs"] = [
    {
      role: "svg-source",
      path: path.relative(process.cwd(), svgPath),
    },
  ];

  for (const png of pngPaths) {
    if (!(await fileExists(png.path))) {
      throw new Error(`Icon manifest completeness check failed: missing ${png.path}`);
    }
    const dimensions = await readPngDimensions(png.path);
    if (
      dimensions.width !== png.expectedWidth ||
      dimensions.height !== png.expectedHeight
    ) {
      throw new Error(
        `Icon PNG failed dimension verification for ${png.role}: expected ${png.expectedWidth}x${png.expectedHeight}, got ${dimensions.width}x${dimensions.height}`,
      );
    }
    outputEntries.push({
      role: png.role,
      path: path.relative(process.cwd(), png.path),
      width: dimensions.width,
      height: dimensions.height,
    });
  }

  const manifest: IconManifest = {
    generatorFamily: "icons",
    brandId: data.brand.id,
    brandName: data.brand.displayName,
    themeId: data.themeVariant.id,
    sceneId: data.scene.id,
    sceneLabel: data.scene.label,
    outputBaseName,
    generatedAt: new Date().toISOString(),
    sourceMetadata: {
      canonicalDomain: data.brand.metadata.canonicalDomain,
      homeUrl: data.brand.metadata.homeUrl,
      contactEmail: data.brand.metadata.contactEmail,
    },
    outputs: outputEntries,
    vendorReadiness: "production-candidate",
    preflight: {
      assetExistenceVerified: true,
      outputCompletenessVerified: true,
      dimensionsVerified: true,
    },
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifestPath;
}
