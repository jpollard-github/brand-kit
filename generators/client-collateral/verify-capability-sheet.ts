import { promises as fs } from "node:fs";
import path from "node:path";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import { getClientCollateralConfig } from "../../design-system/client-collateral";
import { createThemedOutputName } from "../../design-system/themes";
import { repoRootDir } from "../social/hero-composition";
import { readPdfPageCount, readPngDimensions, toDisplayUrl } from "../shared/output-manifest";
import type { CapabilitySheetManifest } from "./manifest";

type VerificationItem = {
  label: string;
  detail: string;
};

type VerificationReport = {
  passed: VerificationItem[];
  failed: VerificationItem[];
};

type VerifyOptions = {
  brandId: string;
  themeId?: string;
};

const outputDir = path.join(repoRootDir, "generators", "outputs", "client-collateral");

function addPass(report: VerificationReport, label: string, detail: string) {
  report.passed.push({ label, detail });
}

function addFail(report: VerificationReport, label: string, detail: string) {
  report.failed.push({ label, detail });
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseOptions(argv: string[]): VerifyOptions {
  let brandId = DEFAULT_BRAND_ID;
  let themeId = process.env.BRAND_THEME;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      brandId = argv[index + 1] ?? brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      brandId = arg.slice("--brand=".length);
    } else if (arg === "--theme") {
      themeId = argv[index + 1] ?? themeId;
      index += 1;
    } else if (arg.startsWith("--theme=")) {
      themeId = arg.slice("--theme=".length);
    }
  }

  return { brandId, themeId };
}

async function readManifest(manifestPath: string) {
  const contents = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(contents) as CapabilitySheetManifest;
}

function logVerificationReport(title: string, report: VerificationReport) {
  console.log(title);
  for (const item of report.passed) {
    console.log(`  [pass] ${item.label}: ${item.detail}`);
  }
  for (const item of report.failed) {
    console.log(`  [fail] ${item.label}: ${item.detail}`);
  }
}

function assertVerificationPassed(report: VerificationReport) {
  if (report.failed.length > 0) {
    throw new Error(`Capability sheet verification failed with ${report.failed.length} issue(s).`);
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brand = getBrandConfig(options.brandId);
  const collateral = getClientCollateralConfig(options.brandId);
  const themeVariant = getBrandThemeVariant(options.brandId, options.themeId);
  const outputName = createThemedOutputName(`${brand.id}-capability-sheet`, themeVariant.id);
  const manifestPath = path.join(outputDir, `${outputName}.manifest.json`);
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  if (!(await fileExists(manifestPath))) {
    addFail(report, "capability sheet manifest", `${path.relative(process.cwd(), manifestPath)} missing`);
    logVerificationReport("Capability sheet manifest and preflight verification", report);
    assertVerificationPassed(report);
    return;
  }

  const manifest = await readManifest(manifestPath);

  if (manifest.generatorFamily !== "client-collateral") {
    addFail(report, "capability manifest family", `expected client-collateral, found ${manifest.generatorFamily}`);
  } else {
    addPass(report, "capability manifest family", manifest.generatorFamily);
  }

  if (manifest.outputKind !== "capability-sheet") {
    addFail(report, "capability manifest kind", `expected capability-sheet, found ${manifest.outputKind}`);
  } else {
    addPass(report, "capability manifest kind", manifest.outputKind);
  }

  if (manifest.brandId !== brand.id) {
    addFail(report, "capability manifest brand", `expected ${brand.id}, found ${manifest.brandId}`);
  } else {
    addPass(report, "capability manifest brand", manifest.brandId);
  }

  if (manifest.themeId !== themeVariant.id) {
    addFail(report, "capability manifest theme", `expected ${themeVariant.id}, found ${manifest.themeId}`);
  } else {
    addPass(report, "capability manifest theme", manifest.themeId);
  }

  const htmlPath = path.resolve(process.cwd(), manifest.outputs.htmlPath);
  const pngPath = path.resolve(process.cwd(), manifest.outputs.pngPath);
  const pdfPath = path.resolve(process.cwd(), manifest.outputs.pdfPath);
  const [htmlExists, pngExists, pdfExists] = await Promise.all([
    fileExists(htmlPath),
    fileExists(pngPath),
    fileExists(pdfPath),
  ]);

  if (!htmlExists || !pngExists || !pdfExists) {
    addFail(
      report,
      "capability output completeness",
      `expected html, png, and pdf outputs, found html=${htmlExists}, png=${pngExists}, pdf=${pdfExists}`,
    );
  } else {
    addPass(
      report,
      "capability output completeness",
      `${manifest.outputs.htmlPath}, ${manifest.outputs.pngPath}, and ${manifest.outputs.pdfPath} present`,
    );
  }

  if (pngExists) {
    const dimensions = await readPngDimensions(pngPath);
    if (
      dimensions.width !== manifest.dimensions.width ||
      dimensions.height !== manifest.dimensions.height
    ) {
      addFail(
        report,
        "capability PNG dimensions",
        `expected ${manifest.dimensions.width}x${manifest.dimensions.height}, found ${dimensions.width}x${dimensions.height}`,
      );
    } else {
      addPass(report, "capability PNG dimensions", `${dimensions.width}x${dimensions.height}`);
    }
  }

  if (pdfExists) {
    const pageCount = await readPdfPageCount(pdfPath);
    if (pageCount !== manifest.outputs.pdfPageCount) {
      addFail(
        report,
        "capability PDF page count",
        `expected manifest ${manifest.outputs.pdfPageCount}, found ${pageCount}`,
      );
    } else if (pageCount !== 1) {
      addFail(report, "capability PDF page count", `expected 1 page, found ${pageCount}`);
    } else {
      addPass(report, "capability PDF page count", `${pageCount} page`);
    }
  }

  if (htmlExists) {
    const html = await fs.readFile(htmlPath, "utf8");
    const displayedWorkWithMeUrl = brand.metadata.workWithMeUrl.replace(
      /^https?:\/\//,
      "",
    );
    const requiredHtmlFields = [
      collateral.capability.title,
      collateral.positioning.oneLiner,
      collateral.positioning.primaryRole,
      collateral.positioning.serviceLine ??
        collateral.positioning.tagline ??
        collateral.positioning.oneLiner,
      brand.metadata.contactName,
      brand.metadata.contactEmail,
      displayedWorkWithMeUrl,
      collateral.ctas.primaryCTA.label,
    ];

    const missingFields = requiredHtmlFields.filter((field) => !html.includes(field));
    if (missingFields.length > 0) {
      addFail(report, "capability required HTML fields", `missing ${missingFields.join(", ")}`);
    } else {
      addPass(
        report,
        "capability required HTML fields",
        "title, positioning, contact, Work With Me URL, and CTA fields present",
      );
    }
  }

  const expectedDisplayUrl = toDisplayUrl(brand.metadata.homeUrl);
  if (manifest.preflight.expectedDisplayUrl !== expectedDisplayUrl) {
    addFail(
      report,
      "capability expected display URL",
      `expected ${expectedDisplayUrl}, found ${manifest.preflight.expectedDisplayUrl}`,
    );
  } else {
    addPass(report, "capability expected display URL", manifest.preflight.expectedDisplayUrl);
  }

  if (manifest.preflight.expectedWorkWithMeUrl !== brand.metadata.workWithMeUrl) {
    addFail(
      report,
      "capability Work With Me URL",
      `expected ${brand.metadata.workWithMeUrl}, found ${manifest.preflight.expectedWorkWithMeUrl}`,
    );
  } else {
    addPass(report, "capability Work With Me URL", manifest.preflight.expectedWorkWithMeUrl);
  }

  if (
    !manifest.preflight.assetExistenceVerified ||
    !manifest.preflight.outputCompletenessVerified ||
    !manifest.preflight.dimensionsVerified ||
    !manifest.preflight.requiredFieldsVerified ||
    !manifest.preflight.pdfPageCountVerified
  ) {
    addFail(report, "capability preflight flags", JSON.stringify(manifest.preflight));
  } else {
    addPass(
      report,
      "capability preflight flags",
      "asset existence, output completeness, dimensions, and required fields verified",
    );
  }

  if (manifest.vendorReadiness !== "production-candidate") {
    addFail(
      report,
      "capability vendor readiness",
      `expected production-candidate, found ${manifest.vendorReadiness}`,
    );
  } else {
    addPass(report, "capability vendor readiness", manifest.vendorReadiness);
  }

  logVerificationReport("Capability sheet manifest and preflight verification", report);
  assertVerificationPassed(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
