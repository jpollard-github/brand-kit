import { promises as fs } from "node:fs";
import path from "node:path";

import type { ClientCollateralConfig } from "../../design-system/client-collateral";
import type { HeroCompositionData } from "../social/hero-composition";
import { readPngDimensions, toDisplayUrl } from "../shared/output-manifest";

function escapeHtmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type EmailSignatureManifest = {
  generatorFamily: "email";
  outputKind: "email-signature";
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
    manifestPath: string;
  };
  sourceMetadata: {
    contactName: string;
    primaryRole: string;
    roleLine: string;
    contactEmail: string;
    homeUrl: string;
    workWithMeUrl: string;
    displayUrl: string;
    primaryCtaLabel: string;
    subline?: string;
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
  const requiredFields = [
    data.brand.metadata.contactName,
    collateral.email?.roleLine ?? collateral.positioning.primaryRole,
    data.brand.metadata.contactEmail,
    data.brand.metadata.homeUrl,
    data.brand.metadata.workWithMeUrl,
    collateral.ctas.primaryCTA.label,
  ];

  const subline =
    collateral.email?.subline ??
    `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`;

  if (subline) {
    requiredFields.push(subline);
  }

  return requiredFields.every((field) => html.includes(escapeHtmlText(field)));
}

export async function writeEmailSignatureManifest(options: {
  html: string;
  collateral: ClientCollateralConfig;
  data: HeroCompositionData;
  outputName: string;
  htmlPath: string;
  pngPath: string;
}) {
  const { html, collateral, data, outputName, htmlPath, pngPath } = options;
  const manifestPath = path.join(path.dirname(pngPath), `${outputName}.manifest.json`);

  const [htmlExists, pngExists] = await Promise.all([
    fileExists(htmlPath),
    fileExists(pngPath),
  ]);

  if (!htmlExists || !pngExists) {
    throw new Error(
      `Email signature completeness check failed for ${outputName}: html=${htmlExists}, png=${pngExists}`,
    );
  }

  const dimensions = await readPngDimensions(pngPath);
  const requiredFieldsVerified = verifyRequiredHtmlFields({
    html,
    data,
    collateral,
  });

  if (!requiredFieldsVerified) {
    throw new Error(`Email signature required-field check failed for ${outputName}`);
  }

  const manifest: EmailSignatureManifest = {
    generatorFamily: "email",
    outputKind: "email-signature",
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
      manifestPath: path.relative(process.cwd(), manifestPath),
    },
    sourceMetadata: {
      contactName: data.brand.metadata.contactName,
      primaryRole: collateral.positioning.primaryRole,
      roleLine: collateral.email?.roleLine ?? collateral.positioning.primaryRole,
      contactEmail: data.brand.metadata.contactEmail,
      homeUrl: data.brand.metadata.homeUrl,
      workWithMeUrl: data.brand.metadata.workWithMeUrl,
      displayUrl: toDisplayUrl(data.brand.metadata.homeUrl),
      primaryCtaLabel: collateral.ctas.primaryCTA.label,
      ...((collateral.email?.subline ??
        `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`)
        ? {
            subline:
              collateral.email?.subline ??
              `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`,
          }
        : {}),
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
