import { promises as fs } from "node:fs";
import path from "node:path";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import { createThemedOutputName } from "../../design-system/themes";
import { outputDir } from "./hero-composition";
import {
  type SocialManifest,
  type SocialOutputKind,
} from "./manifest";
import {
  readPngDimensions,
  toDisplayUrl,
} from "../shared/output-manifest";

type VerifyOptions = {
  brandId: string;
  themeId?: string;
};

type VerificationItem = {
  label: string;
  detail: string;
};

type VerificationReport = {
  passed: VerificationItem[];
  failed: VerificationItem[];
};

type SocialTarget = {
  outputKind: SocialOutputKind;
  suffix: string;
  size: {
    width: number;
    height: number;
  };
  requiresSafeArea: boolean;
};

const socialTargets: SocialTarget[] = [
  {
    outputKind: "og-image",
    suffix: "og-image",
    size: { width: 1200, height: 630 },
    requiresSafeArea: false,
  },
  {
    outputKind: "linkedin-banner",
    suffix: "linkedin-banner",
    size: { width: 1584, height: 396 },
    requiresSafeArea: true,
  },
  {
    outputKind: "github-social",
    suffix: "github-social",
    size: { width: 1280, height: 640 },
    requiresSafeArea: false,
  },
];

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
  return JSON.parse(contents) as SocialManifest;
}

async function verifyTarget(
  report: VerificationReport,
  brandId: string,
  themeId: string | undefined,
  target: SocialTarget,
) {
  const brand = getBrandConfig(brandId);
  const themeVariant = getBrandThemeVariant(brandId, themeId);
  const outputName = createThemedOutputName(`${brand.id}-${target.suffix}`, themeVariant.id);
  const manifestPath = path.join(outputDir, `${outputName}.manifest.json`);

  if (!(await fileExists(manifestPath))) {
    addFail(
      report,
      `${target.outputKind} manifest`,
      `${path.relative(process.cwd(), manifestPath)} missing`,
    );
    return;
  }

  const manifest = await readManifest(manifestPath);
  const expectedDisplayUrl = toDisplayUrl(
    manifest.sourceMetadata.sceneCanonicalUrl || brand.metadata.homeUrl,
  );

  if (manifest.generatorFamily !== "social") {
    addFail(
      report,
      `${target.outputKind} manifest family`,
      `expected social, found ${manifest.generatorFamily}`,
    );
  } else {
    addPass(report, `${target.outputKind} manifest family`, manifest.generatorFamily);
  }

  if (manifest.outputKind !== target.outputKind) {
    addFail(
      report,
      `${target.outputKind} manifest kind`,
      `expected ${target.outputKind}, found ${manifest.outputKind}`,
    );
  } else {
    addPass(report, `${target.outputKind} manifest kind`, manifest.outputKind);
  }

  if (manifest.brandId !== brand.id) {
    addFail(
      report,
      `${target.outputKind} manifest brand`,
      `expected ${brand.id}, found ${manifest.brandId}`,
    );
  } else {
    addPass(report, `${target.outputKind} manifest brand`, manifest.brandId);
  }

  if (manifest.themeId !== themeVariant.id) {
    addFail(
      report,
      `${target.outputKind} manifest theme`,
      `expected ${themeVariant.id}, found ${manifest.themeId}`,
    );
  } else {
    addPass(report, `${target.outputKind} manifest theme`, manifest.themeId);
  }

  if (
    manifest.dimensions.width !== target.size.width ||
    manifest.dimensions.height !== target.size.height
  ) {
    addFail(
      report,
      `${target.outputKind} manifest dimensions`,
      `expected ${target.size.width}x${target.size.height}, found ${manifest.dimensions.width}x${manifest.dimensions.height}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} manifest dimensions`,
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
      `${target.outputKind} output completeness`,
      `expected svg and png outputs, found svg=${svgExists}, png=${pngExists}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} output completeness`,
      `${manifest.outputs.svgPath} and ${manifest.outputs.pngPath} present`,
    );
  }

  if (pngExists) {
    const dimensions = await readPngDimensions(pngPath);
    if (
      dimensions.width !== target.size.width ||
      dimensions.height !== target.size.height
    ) {
      addFail(
        report,
        `${target.outputKind} PNG dimensions`,
        `expected ${target.size.width}x${target.size.height}, found ${dimensions.width}x${dimensions.height}`,
      );
    } else {
      addPass(
        report,
        `${target.outputKind} PNG dimensions`,
        `${manifest.outputs.pngPath} ${dimensions.width}x${dimensions.height}`,
      );
    }
  }

  if (manifest.sourceMetadata.contactEmail !== brand.metadata.contactEmail) {
    addFail(
      report,
      `${target.outputKind} contact email`,
      `expected ${brand.metadata.contactEmail}, found ${manifest.sourceMetadata.contactEmail}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} contact email`,
      manifest.sourceMetadata.contactEmail,
    );
  }

  if (manifest.preflight.expectedDisplayUrl !== expectedDisplayUrl) {
    addFail(
      report,
      `${target.outputKind} expected display URL`,
      `expected ${expectedDisplayUrl}, found ${manifest.preflight.expectedDisplayUrl}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} expected display URL`,
      manifest.preflight.expectedDisplayUrl,
    );
  }

  if (manifest.sourceMetadata.displayUrl !== expectedDisplayUrl) {
    addFail(
      report,
      `${target.outputKind} rendered display URL`,
      `expected ${expectedDisplayUrl}, found ${manifest.sourceMetadata.displayUrl}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} rendered display URL`,
      manifest.sourceMetadata.displayUrl,
    );
  }

  if (
    !manifest.preflight.dimensionsVerified ||
    !manifest.preflight.assetExistenceVerified ||
    !manifest.preflight.outputCompletenessVerified
  ) {
    addFail(
      report,
      `${target.outputKind} preflight flags`,
      `expected all preflight flags true, found ${JSON.stringify(manifest.preflight)}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} preflight flags`,
      "dimensions, asset existence, and output completeness verified",
    );
  }

  if (target.requiresSafeArea) {
    if (!manifest.preflight.safeArea) {
      addFail(
        report,
        `${target.outputKind} safe area`,
        "expected a safe-area note in the manifest",
      );
    } else {
      addPass(
        report,
        `${target.outputKind} safe area`,
        `${manifest.preflight.safeArea.label}: ${manifest.preflight.safeArea.description}`,
      );
    }
  }

  if (manifest.vendorReadiness !== "production-candidate") {
    addFail(
      report,
      `${target.outputKind} vendor readiness`,
      `expected production-candidate, found ${manifest.vendorReadiness}`,
    );
  } else {
    addPass(
      report,
      `${target.outputKind} vendor readiness`,
      manifest.vendorReadiness,
    );
  }
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
    throw new Error(`Social verification failed with ${report.failed.length} issue(s).`);
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  for (const target of socialTargets) {
    await verifyTarget(report, options.brandId, options.themeId, target);
  }

  logVerificationReport("Social manifest and preflight verification", report);
  assertVerificationPassed(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
