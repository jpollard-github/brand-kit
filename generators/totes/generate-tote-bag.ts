import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig, getBrandPalette } from "../../design-system/brand-config";
import { repoRootDir } from "../social/hero-composition";
import { readAssetAsDataUrl } from "../shared/assets";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "totes");
const brandsRootDir = path.join(repoRootDir, "brands");

type ToteArgs = {
  brandId: string;
  outputName: string;
  phrase: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function parseArgs(argv: string[]): ToteArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: ToteArgs = {
    brandId: defaultBrandId,
    outputName: createBrandOutputName(defaultBrandId, "tote", process.env.BRAND_THEME),
    phrase: "Late-night signal chasing",
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
      args.phrase = argv[index + 1] ?? args.phrase;
      index += 1;
    } else if (arg.startsWith("--phrase=")) {
      args.phrase = arg.slice("--phrase=".length);
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
  const brand = getBrandConfig(brandId);
  const primaryPath = path.join(brandsRootDir, brandId, "assets", "logo.png");
  const fallbackPath = path.join(repoRootDir, brand.logo.fallbackAsset);
  const logoPath = (await fileExists(primaryPath)) ? primaryPath : fallbackPath;
  return readAssetAsDataUrl(logoPath);
}

async function writeToteFiles(args: ToteArgs) {
  const brand = getBrandConfig(args.brandId);
  const palette = getBrandPalette(brand.id, process.env.BRAND_THEME);
  const logoDataUrl = await resolveLogoDataUrl(brand.id);
  const fontStack = escapeXml(brand.typography.fontStack);
  const displayName = escapeXml(brand.displayName);
  const phrase = escapeXml(args.phrase);
  const safeLogoDataUrl = escapeXml(logoDataUrl);

  const frontSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2800" height="3200" viewBox="0 0 2800 3200">
  <rect width="2800" height="3200" rx="240" fill="#e9dfd0" />
  <rect x="180" y="220" width="2440" height="2760" rx="180" fill="${palette.backgroundDeep}" />
  <rect x="360" y="380" width="2080" height="2440" rx="140" fill="rgba(10, 14, 18, 0.92)" stroke="${palette.border}" stroke-width="10" />
  <path d="M 0 2400 C 260 2240, 520 2210, 820 2290 C 1120 2370, 1380 2310, 1650 2160 C 1950 1990, 2270 1990, 2580 2140 C 2670 2182, 2740 2228, 2800 2280 L 2800 3200 L 0 3200 Z" fill="rgba(7, 10, 14, 0.9)" />
  <text x="1400" y="710" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="84" font-weight="700" letter-spacing="18">${displayName.toUpperCase()}</text>
  <circle cx="1400" cy="1260" r="360" fill="rgba(7, 10, 14, 0.6)" stroke="rgba(248,239,227,0.08)" stroke-width="8" />
  <circle cx="1400" cy="1260" r="286" fill="none" stroke="${palette.teal}" stroke-opacity="0.24" stroke-width="16" />
  <circle cx="1400" cy="1260" r="226" fill="none" stroke="${palette.amber}" stroke-opacity="0.15" stroke-width="10" />
  <image href="${safeLogoDataUrl}" x="1060" y="920" width="680" height="680" preserveAspectRatio="xMidYMid meet" />
  <text x="1400" y="1880" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="190" font-weight="780" letter-spacing="-4">${displayName}</text>
  <text x="1400" y="2070" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="98" font-weight="520">Projects. Writing. Music. Cats.</text>
  <rect x="840" y="2190" width="1120" height="158" rx="79" fill="rgba(7, 10, 14, 0.74)" stroke="rgba(248,239,227,0.08)" stroke-width="6" />
  <text x="1400" y="2288" text-anchor="middle" fill="${palette.teal}" font-family="${fontStack}" font-size="88" font-weight="700">${brand.metadata.canonicalDomain}</text>
  <text x="1400" y="2600" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="88" font-weight="600">${phrase}</text>
</svg>`;

  const backSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2800" height="3200" viewBox="0 0 2800 3200">
  <rect width="2800" height="3200" rx="240" fill="#e9dfd0" />
  <rect x="180" y="220" width="2440" height="2760" rx="180" fill="${palette.background}" />
  <rect x="360" y="380" width="2080" height="2440" rx="140" fill="${palette.backgroundSoft}" stroke="${palette.border}" stroke-width="10" />
  <path d="M 500 840 C 860 510, 1940 510, 2300 840" fill="none" stroke="${palette.pink}" stroke-opacity="0.22" stroke-width="18" />
  <path d="M 620 1030 C 930 790, 1870 790, 2180 1030" fill="none" stroke="${palette.cyan}" stroke-opacity="0.18" stroke-width="12" />
  <text x="1400" y="1440" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="168" font-weight="760">${displayName}</text>
  <text x="1400" y="1650" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="92" font-weight="560">${phrase}</text>
  <text x="1400" y="1960" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="72" font-weight="600">carry the signal</text>
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
  const result = await writeToteFiles(args);
  console.log(`Tote front written to ${path.relative(process.cwd(), result.frontPath)}`);
  console.log(`Tote back written to ${path.relative(process.cwd(), result.backPath)}`);
  console.log(`Brand: ${result.brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
