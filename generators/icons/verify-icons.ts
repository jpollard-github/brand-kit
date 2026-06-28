import { promises as fs } from "node:fs";
import path from "node:path";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import { createThemedOutputName } from "../../design-system/themes";
import { repoRootDir } from "../social/hero-composition";
import { readPngDimensions } from "../shared/output-manifest";
import type { IconManifest } from "./manifest";

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

const outputDir = path.join(repoRootDir, "generators", "outputs", "icons");

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
  return JSON.parse(contents) as IconManifest;
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
    throw new Error(`Icon verification failed with ${report.failed.length} issue(s).`);
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brand = getBrandConfig(options.brandId);
  const themeVariant = getBrandThemeVariant(options.brandId, options.themeId);
  const outputBaseName = createThemedOutputName(brand.id, themeVariant.id);
  const manifestPath = path.join(outputDir, `${outputBaseName}-icons.manifest.json`);
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  if (!(await fileExists(manifestPath))) {
    addFail(report, "icon manifest", `${path.relative(process.cwd(), manifestPath)} missing`);
    logVerificationReport("Icon manifest and preflight verification", report);
    assertVerificationPassed(report);
    return;
  }

  const manifest = await readManifest(manifestPath);
  const expectedSizes = new Map([
    ["icon-512", 512],
    ["icon-192", 192],
    ["apple-touch-icon", 180],
    ["favicon-32", 32],
  ]);

  if (manifest.generatorFamily !== "icons") {
    addFail(report, "icon manifest family", `expected icons, found ${manifest.generatorFamily}`);
  } else {
    addPass(report, "icon manifest family", manifest.generatorFamily);
  }

  if (manifest.brandId !== brand.id) {
    addFail(report, "icon manifest brand", `expected ${brand.id}, found ${manifest.brandId}`);
  } else {
    addPass(report, "icon manifest brand", manifest.brandId);
  }

  if (manifest.themeId !== themeVariant.id) {
    addFail(report, "icon manifest theme", `expected ${themeVariant.id}, found ${manifest.themeId}`);
  } else {
    addPass(report, "icon manifest theme", manifest.themeId);
  }

  if (manifest.vendorReadiness !== "production-candidate") {
    addFail(
      report,
      "icon vendor readiness",
      `expected production-candidate, found ${manifest.vendorReadiness}`,
    );
  } else {
    addPass(report, "icon vendor readiness", manifest.vendorReadiness);
  }

  if (
    !manifest.preflight.assetExistenceVerified ||
    !manifest.preflight.outputCompletenessVerified ||
    !manifest.preflight.dimensionsVerified
  ) {
    addFail(report, "icon preflight flags", JSON.stringify(manifest.preflight));
  } else {
    addPass(
      report,
      "icon preflight flags",
      "asset existence, output completeness, and dimensions verified",
    );
  }

  for (const output of manifest.outputs) {
    const outputPath = path.resolve(process.cwd(), output.path);
    if (!(await fileExists(outputPath))) {
      addFail(report, `${output.role} output`, `${output.path} missing`);
      continue;
    }

    if (output.role === "svg-source") {
      addPass(report, "svg icon output", output.path);
      continue;
    }

    const expectedSize = expectedSizes.get(output.role);
    if (!expectedSize) {
      addFail(report, "icon output role", `unexpected role ${output.role}`);
      continue;
    }

    const dimensions = await readPngDimensions(outputPath);
    if (
      dimensions.width !== expectedSize ||
      dimensions.height !== expectedSize
    ) {
      addFail(
        report,
        `${output.role} PNG dimensions`,
        `expected ${expectedSize}x${expectedSize}, found ${dimensions.width}x${dimensions.height}`,
      );
    } else {
      addPass(
        report,
        `${output.role} PNG dimensions`,
        `${output.path} ${dimensions.width}x${dimensions.height}`,
      );
    }
  }

  logVerificationReport("Icon manifest and preflight verification", report);
  assertVerificationPassed(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
