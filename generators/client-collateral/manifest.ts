import { promises as fs } from "node:fs";
import path from "node:path";

import type { ClientCollateralConfig } from "../../design-system/client-collateral";
import type { HeroCompositionData } from "../social/hero-composition";
import { readPngDimensions, toDisplayUrl } from "../shared/output-manifest";

export type CapabilitySheetManifest = {
  generatorFamily: "client-collateral";
  outputKind: "capability-sheet";
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
    htmlPath: string;
    pngPath: string;
    pdfPath: string;
    manifestPath: string;
  };
  sourceMetadata: {
    contactName: string;
    primaryRole: string;
    serviceLine: string;
    contactEmail: string;
    homeUrl: string;
    workWithMeUrl: string;
    displayUrl: string;
    primaryCtaLabel: string;
    capabilityTitle: string;
  };
  vendorReadiness: "production-candidate";
  preflight: {
    assetExistenceVerified: boolean;
    outputCompletenessVerified: boolean;
    dimensionsVerified: boolean;
    requiredFieldsVerified: boolean;
    expectedDisplayUrl: string;
    expectedWorkWithMeUrl: string;
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

function verifyRequiredHtmlFields(options: {
  html: string;
  data: HeroCompositionData;
  collateral: ClientCollateralConfig;
}) {
  const { html, data, collateral } = options;
  const displayedWorkWithMeUrl = data.brand.metadata.workWithMeUrl.replace(
    /^https?:\/\//,
    "",
  );
  const requiredFields = [
    collateral.capability.title,
    collateral.positioning.oneLiner,
    collateral.positioning.primaryRole,
    collateral.positioning.serviceLine ??
      collateral.positioning.tagline ??
      collateral.positioning.oneLiner,
    data.brand.metadata.contactName,
    data.brand.metadata.contactEmail,
    displayedWorkWithMeUrl,
    collateral.ctas.primaryCTA.label,
  ];

  return requiredFields.every((field) => html.includes(field));
}

export async function writeCapabilitySheetManifest(options: {
  html: string;
  collateral: ClientCollateralConfig;
  data: HeroCompositionData;
  outputName: string;
  htmlPath: string;
  pngPath: string;
  pdfPath: string;
}) {
  const { html, collateral, data, outputName, htmlPath, pngPath, pdfPath } = options;
  const manifestPath = path.join(path.dirname(pngPath), `${outputName}.manifest.json`);

  const [htmlExists, pngExists, pdfExists] = await Promise.all([
    fileExists(htmlPath),
    fileExists(pngPath),
    fileExists(pdfPath),
  ]);

  if (!htmlExists || !pngExists || !pdfExists) {
    throw new Error(
      `Capability sheet completeness check failed for ${outputName}: html=${htmlExists}, png=${pngExists}, pdf=${pdfExists}`,
    );
  }

  const dimensions = await readPngDimensions(pngPath);
  const requiredFieldsVerified = verifyRequiredHtmlFields({
    html,
    data,
    collateral,
  });

  if (!requiredFieldsVerified) {
    throw new Error(`Capability sheet required-field check failed for ${outputName}`);
  }

  const manifest: CapabilitySheetManifest = {
    generatorFamily: "client-collateral",
    outputKind: "capability-sheet",
    brandId: data.brand.id,
    brandName: data.brand.displayName,
    themeId: data.themeVariant.id,
    sceneId: data.scene.id,
    sceneLabel: data.scene.label,
    outputName,
    generatedAt: new Date().toISOString(),
    dimensions,
    outputs: {
      htmlPath: path.relative(process.cwd(), htmlPath),
      pngPath: path.relative(process.cwd(), pngPath),
      pdfPath: path.relative(process.cwd(), pdfPath),
      manifestPath: path.relative(process.cwd(), manifestPath),
    },
    sourceMetadata: {
      contactName: data.brand.metadata.contactName,
      primaryRole: collateral.positioning.primaryRole,
      serviceLine:
        collateral.positioning.serviceLine ??
        collateral.positioning.tagline ??
        collateral.positioning.oneLiner,
      contactEmail: data.brand.metadata.contactEmail,
      homeUrl: data.brand.metadata.homeUrl,
      workWithMeUrl: data.brand.metadata.workWithMeUrl,
      displayUrl: toDisplayUrl(data.brand.metadata.homeUrl),
      primaryCtaLabel: collateral.ctas.primaryCTA.label,
      capabilityTitle: collateral.capability.title,
    },
    vendorReadiness: "production-candidate",
    preflight: {
      assetExistenceVerified: true,
      outputCompletenessVerified: true,
      dimensionsVerified: true,
      requiredFieldsVerified: true,
      expectedDisplayUrl: toDisplayUrl(data.brand.metadata.homeUrl),
      expectedWorkWithMeUrl: data.brand.metadata.workWithMeUrl,
    },
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifestPath;
}
