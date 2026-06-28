import path from "node:path";
import { promises as fs } from "node:fs";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
} from "../../../design-system/brand-config";
import {
  assertVerificationPassed,
  logVerificationReport,
  type CopySet,
  verifyBusinessCardSources,
  verifyExportArtifacts,
} from "./verification";

const rootDir = path.resolve(import.meta.dirname, "..");
const brandsRootDir = path.resolve(import.meta.dirname, "../../../brands");

type VerifyOptions = {
  brandId: string;
  guides: boolean;
  pdf: boolean;
};

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readLines(filePath: string) {
  const contents = await fs.readFile(filePath, "utf8");
  return contents
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(
      (line, index, lines) => !(line === "" && index === lines.length - 1),
    );
}

async function readCopyLines(primaryPath: string, fallbackPath: string) {
  if (await fileExists(primaryPath)) {
    return readLines(primaryPath);
  }
  return readLines(fallbackPath);
}

async function resolveBrandRootDir(brandId: string) {
  const normalizedId = brandId.toLowerCase();
  const candidateDir = path.join(brandsRootDir, normalizedId);
  if (await fileExists(candidateDir)) {
    return candidateDir;
  }

  return path.join(brandsRootDir, DEFAULT_BRAND_ID);
}

async function loadCopy(brandId: string): Promise<CopySet> {
  const brandRootDir = await resolveBrandRootDir(brandId);

  return {
    workFront: await readCopyLines(
      path.join(brandRootDir, "copy", "work-with-me", "front-copy.txt"),
      path.join(rootDir, "work-with-me", "front-copy.txt"),
    ),
    workBack: await readCopyLines(
      path.join(brandRootDir, "copy", "work-with-me", "back-copy.txt"),
      path.join(rootDir, "work-with-me", "back-copy.txt"),
    ),
    arcadeFront: await readCopyLines(
      path.join(brandRootDir, "copy", brandId, "front-copy.txt"),
      path.join(rootDir, brandId, "front-copy.txt"),
    ),
    arcadeBack: await readCopyLines(
      path.join(brandRootDir, "copy", brandId, "back-copy.txt"),
      path.join(rootDir, brandId, "back-copy.txt"),
    ),
  };
}

async function loadAssetPaths(brandId: string) {
  const brandRootDir = await resolveBrandRootDir(brandId);
  const brandAssetsDir = path.join(brandRootDir, "assets");
  const sharedDir = path.join(rootDir, "shared-assets");

  const resolvePath = async (brandPath: string, fallbackPath: string) =>
    (await fileExists(brandPath)) ? brandPath : fallbackPath;

  return {
    logoPath: await resolvePath(
      path.join(brandAssetsDir, "logo.png"),
      path.join(sharedDir, "logo.png"),
    ),
    workQrPath: await resolvePath(
      path.join(brandAssetsDir, "qr-work-with-me.svg"),
      path.join(sharedDir, "qr-work-with-me.svg"),
    ),
    arcadeQrPath: await resolvePath(
      path.join(brandAssetsDir, `qr-${brandId}.svg`),
      path.join(sharedDir, `qr-${brandId}.svg`),
    ),
  };
}

function parseOptions(argv: string[]): VerifyOptions {
  let brandId = DEFAULT_BRAND_ID;
  let guides = true;
  let pdf = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--brand") {
      brandId = argv[index + 1] ?? brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      brandId = arg.slice("--brand=".length);
    } else if (arg === "--no-guides") {
      guides = false;
    } else if (arg === "--no-pdf") {
      pdf = false;
    }
  }

  return { brandId, guides, pdf };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brandConfig = getBrandConfig(options.brandId);
  const [copy, assets] = await Promise.all([
    loadCopy(brandConfig.id),
    loadAssetPaths(brandConfig.id),
  ]);

  const sourceReport = await verifyBusinessCardSources(brandConfig, copy, assets);
  logVerificationReport("Brand source verification", sourceReport);
  assertVerificationPassed(sourceReport);

  const exportPaths = [
    path.join(rootDir, "work-with-me", "exports", "front-final.png"),
    path.join(rootDir, "work-with-me", "exports", "back-final.png"),
    path.join(rootDir, brandConfig.id, "exports", "front-final.png"),
    path.join(rootDir, brandConfig.id, "exports", "back-final.png"),
  ];

  const exportReport = await verifyExportArtifacts(exportPaths, {
    guides: options.guides,
    pdf: options.pdf,
  });
  logVerificationReport("Export artifact verification", exportReport);
  assertVerificationPassed(exportReport);

  console.log("Pre-flight checklist");
  console.log("  [pass] Name, email, website, QR targets, dimensions, PNGs, guides, and PDFs all verified.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
