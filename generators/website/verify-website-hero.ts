import { promises as fs } from "node:fs";
import path from "node:path";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import { createThemedOutputName } from "../../design-system/themes";
import { repoRootDir } from "../social/hero-composition";
import {
  readPngDimensions,
  toDisplayUrl,
} from "../shared/output-manifest";
import type { WebsiteHeroManifest } from "./manifest";

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

const outputDir = path.join(repoRootDir, "generators", "outputs", "website");
const expectedSize = { width: 1600, height: 900 };

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
  return JSON.parse(contents) as WebsiteHeroManifest;
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
    throw new Error(`Website hero verification failed with ${report.failed.length} issue(s).`);
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brand = getBrandConfig(options.brandId);
  const themeVariant = getBrandThemeVariant(options.brandId, options.themeId);
  const outputName = createThemedOutputName(`${brand.id}-website-hero`, themeVariant.id);
  const manifestPath = path.join(outputDir, `${outputName}.manifest.json`);
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  if (!(await fileExists(manifestPath))) {
    addFail(
      report,
      "website hero manifest",
      `${path.relative(process.cwd(), manifestPath)} missing`,
    );
    logVerificationReport("Website hero manifest and preflight verification", report);
    assertVerificationPassed(report);
    return;
  }

  const manifest = await readManifest(manifestPath);
  const expectedDisplayUrl = toDisplayUrl(
    manifest.sourceMetadata.sceneCanonicalUrl || brand.metadata.homeUrl,
  );

  if (manifest.generatorFamily !== "website") {
    addFail(report, "website hero manifest family", `expected website, found ${manifest.generatorFamily}`);
  } else {
    addPass(report, "website hero manifest family", manifest.generatorFamily);
  }

  if (manifest.outputKind !== "website-hero") {
    addFail(report, "website hero manifest kind", `expected website-hero, found ${manifest.outputKind}`);
  } else {
    addPass(report, "website hero manifest kind", manifest.outputKind);
  }

  if (manifest.brandId !== brand.id) {
    addFail(report, "website hero manifest brand", `expected ${brand.id}, found ${manifest.brandId}`);
  } else {
    addPass(report, "website hero manifest brand", manifest.brandId);
  }

  if (manifest.themeId !== themeVariant.id) {
    addFail(report, "website hero manifest theme", `expected ${themeVariant.id}, found ${manifest.themeId}`);
  } else {
    addPass(report, "website hero manifest theme", manifest.themeId);
  }

  if (
    manifest.dimensions.width !== expectedSize.width ||
    manifest.dimensions.height !== expectedSize.height
  ) {
    addFail(
      report,
      "website hero manifest dimensions",
      `expected ${expectedSize.width}x${expectedSize.height}, found ${manifest.dimensions.width}x${manifest.dimensions.height}`,
    );
  } else {
    addPass(
      report,
      "website hero manifest dimensions",
      `${manifest.dimensions.width}x${manifest.dimensions.height}`,
    );
  }

  const svgPath = path.resolve(process.cwd(), manifest.outputs.svgPath);
  const pngPath = path.resolve(process.cwd(), manifest.outputs.pngPath);
  const [svgExists, pngExists] = await Promise.all([
    fileExists(svgPath),
    fileExists(pngPath),
  ]);

  if (!svgExists || !pngExists) {
    addFail(
      report,
      "website hero output completeness",
      `expected svg and png outputs, found svg=${svgExists}, png=${pngExists}`,
    );
  } else {
    addPass(
      report,
      "website hero output completeness",
      `${manifest.outputs.svgPath} and ${manifest.outputs.pngPath} present`,
    );
  }

  if (pngExists) {
    const dimensions = await readPngDimensions(pngPath);
    if (
      dimensions.width !== expectedSize.width ||
      dimensions.height !== expectedSize.height
    ) {
      addFail(
        report,
        "website hero PNG dimensions",
        `expected ${expectedSize.width}x${expectedSize.height}, found ${dimensions.width}x${dimensions.height}`,
      );
    } else {
      addPass(
        report,
        "website hero PNG dimensions",
        `${manifest.outputs.pngPath} ${dimensions.width}x${dimensions.height}`,
      );
    }
  }

  if (manifest.sourceMetadata.contactEmail !== brand.metadata.contactEmail) {
    addFail(
      report,
      "website hero contact email",
      `expected ${brand.metadata.contactEmail}, found ${manifest.sourceMetadata.contactEmail}`,
    );
  } else {
    addPass(report, "website hero contact email", manifest.sourceMetadata.contactEmail);
  }

  if (manifest.preflight.expectedDisplayUrl !== expectedDisplayUrl) {
    addFail(
      report,
      "website hero expected display URL",
      `expected ${expectedDisplayUrl}, found ${manifest.preflight.expectedDisplayUrl}`,
    );
  } else {
    addPass(
      report,
      "website hero expected display URL",
      manifest.preflight.expectedDisplayUrl,
    );
  }

  if (
    !manifest.preflight.dimensionsVerified ||
    !manifest.preflight.assetExistenceVerified ||
    !manifest.preflight.outputCompletenessVerified
  ) {
    addFail(report, "website hero preflight flags", JSON.stringify(manifest.preflight));
  } else {
    addPass(
      report,
      "website hero preflight flags",
      "dimensions, asset existence, and output completeness verified",
    );
  }

  if (!manifest.preflight.safeArea) {
    addFail(report, "website hero safe area", "expected a safe-area note in the manifest");
  } else {
    addPass(
      report,
      "website hero safe area",
      `${manifest.preflight.safeArea.label}: ${manifest.preflight.safeArea.description}`,
    );
  }

  if (manifest.vendorReadiness !== "production-candidate") {
    addFail(
      report,
      "website hero vendor readiness",
      `expected production-candidate, found ${manifest.vendorReadiness}`,
    );
  } else {
    addPass(report, "website hero vendor readiness", manifest.vendorReadiness);
  }

  logVerificationReport("Website hero manifest and preflight verification", report);
  assertVerificationPassed(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
