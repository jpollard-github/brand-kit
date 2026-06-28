import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig, getBrandPalette } from "../../design-system/brand-config";
import { readAssetAsDataUrl } from "../shared/assets";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "../..");
const outputDir = path.join(repoRootDir, "generators", "outputs", "shirts");
const brandsRootDir = path.join(repoRootDir, "brands");

type ShirtArgs = {
  brandId: string;
  outputName: string;
  backPhrase: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function parseArgs(argv: string[]): ShirtArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: ShirtArgs = {
    brandId: defaultBrandId,
    outputName: createBrandOutputName(
      defaultBrandId,
      "shirt",
      process.env.BRAND_THEME,
    ),
    backPhrase: "Useful tools with a strange little heartbeat",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      args.brandId = argv[index + 1] ?? args.brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      args.brandId = arg.slice("--brand=".length);
    } else if (arg === "--output") {
      args.outputName = argv[index + 1] ?? args.outputName;
      index += 1;
    } else if (arg.startsWith("--output=")) {
      args.outputName = arg.slice("--output=".length);
    } else if (arg === "--phrase") {
      args.backPhrase = argv[index + 1] ?? args.backPhrase;
      index += 1;
    } else if (arg.startsWith("--phrase=")) {
      args.backPhrase = arg.slice("--phrase=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveLogoDataUrl(brandId: string) {
  const primaryPath = path.join(brandsRootDir, brandId, "assets", "logo.png");
  const fallbackPath = path.join(
    brandsRootDir,
    "arcadeghosts",
    "assets",
    "logo.png",
  );
  const logoPath = (await fileExists(primaryPath)) ? primaryPath : fallbackPath;
  return readAssetAsDataUrl(logoPath);
}

async function writeShirtFiles(args: ShirtArgs) {
  const brand = getBrandConfig(args.brandId);
  const palette = getBrandPalette(brand.id, process.env.BRAND_THEME);
  const logoDataUrl = await resolveLogoDataUrl(brand.id);
  const fontStack = escapeXml(brand.typography.fontStack);
  const displayName = escapeXml(brand.displayName);
  const backPhrase = escapeXml(args.backPhrase);
  const safeLogoDataUrl = escapeXml(logoDataUrl);

  const frontSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="3000" viewBox="0 0 2400 3000">
  <rect width="2400" height="3000" rx="220" fill="${palette.background}" />
  <rect x="110" y="110" width="2180" height="2780" rx="180" fill="${palette.backgroundSoft}" stroke="${palette.border}" stroke-width="10" />
  <path d="M520 380 C760 220, 1640 220, 1880 380" fill="none" stroke="${palette.teal}" stroke-opacity="0.2" stroke-width="12" />
  <image href="${safeLogoDataUrl}" x="420" y="720" width="520" height="520" preserveAspectRatio="xMidYMid meet" />
  <text x="1120" y="980" fill="${palette.text}" font-family="${fontStack}" font-size="122" font-weight="700">${displayName}</text>
  <text x="1120" y="1145" fill="${palette.textMuted}" font-family="${fontStack}" font-size="64" font-weight="600" letter-spacing="10">LEFT-CHEST FRONT</text>
  <text x="1200" y="2630" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="74" font-weight="560">wearable first</text>
</svg>`;

  const backSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="3000" viewBox="0 0 2400 3000">
  <rect width="2400" height="3000" rx="220" fill="${palette.background}" />
  <rect x="110" y="110" width="2180" height="2780" rx="180" fill="${palette.backgroundDeep}" stroke="${palette.border}" stroke-width="10" />
  <path d="M430 710 C710 430, 1690 430, 1970 710" fill="none" stroke="${palette.pink}" stroke-opacity="0.24" stroke-width="14" />
  <path d="M560 840 C810 640, 1590 640, 1840 840" fill="none" stroke="${palette.cyan}" stroke-opacity="0.18" stroke-width="10" />
  <text x="1200" y="1220" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="166" font-weight="720">${displayName}</text>
  <text x="1200" y="1460" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="84" font-weight="560">${backPhrase}</text>
  <text x="1200" y="1720" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="60" font-weight="600" letter-spacing="12">UPPER-BACK GRAPHIC</text>
  <circle cx="1200" cy="2050" r="210" fill="none" stroke="${palette.teal}" stroke-opacity="0.24" stroke-width="12" />
  <circle cx="1200" cy="2050" r="145" fill="none" stroke="${palette.amber}" stroke-opacity="0.18" stroke-width="8" />
</svg>`;

  const frontPath = path.join(outputDir, `${args.outputName}-front.svg`);
  const backPath = path.join(outputDir, `${args.outputName}-back.svg`);

  await fs.writeFile(frontPath, frontSvg, "utf8");
  await fs.writeFile(backPath, backSvg, "utf8");

  return { brand, frontPath, backPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeShirtFiles(args);
  console.log(
    `Shirt front written to ${path.relative(process.cwd(), result.frontPath)}`,
  );
  console.log(
    `Shirt back written to ${path.relative(process.cwd(), result.backPath)}`,
  );
  console.log(`Brand: ${result.brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
