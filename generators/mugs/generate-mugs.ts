import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig, getBrandPalette } from "../../design-system/brand-config";
import { readAssetAsDataUrl } from "../shared/assets";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "../..");
const outputDir = path.join(repoRootDir, "generators", "outputs", "mugs");
const brandsRootDir = path.join(repoRootDir, "brands");

type MugArgs = {
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

function parseArgs(argv: string[]): MugArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: MugArgs = {
    brandId: defaultBrandId,
    outputName: createBrandOutputName(defaultBrandId, "mug", process.env.BRAND_THEME),
    phrase: "Strange little experiments",
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

async function writeMugFiles(args: MugArgs) {
  const brand = getBrandConfig(args.brandId);
  const palette = getBrandPalette(brand.id, process.env.BRAND_THEME);
  const logoDataUrl = await resolveLogoDataUrl(brand.id);
  const fontStack = escapeXml(brand.typography.fontStack);
  const displayName = escapeXml(brand.displayName);
  const phrase = escapeXml(args.phrase);
  const safeLogoDataUrl = escapeXml(logoDataUrl);

  const sideASvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1800" viewBox="0 0 1800 1800">
  <rect width="1800" height="1800" rx="220" fill="${palette.background}" />
  <rect x="70" y="70" width="1660" height="1660" rx="180" fill="${palette.backgroundSoft}" stroke="${palette.border}" stroke-width="10" />
  <circle cx="900" cy="900" r="520" fill="none" stroke="${palette.teal}" stroke-opacity="0.24" stroke-width="16" />
  <circle cx="900" cy="900" r="430" fill="none" stroke="${palette.amber}" stroke-opacity="0.18" stroke-width="10" />
  <image href="${safeLogoDataUrl}" x="470" y="410" width="860" height="860" preserveAspectRatio="xMidYMid meet" />
  <text x="900" y="1520" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="72" font-weight="600" letter-spacing="10">MUG SIDE A</text>
</svg>`;

  const sideBSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1800" viewBox="0 0 1800 1800">
  <rect width="1800" height="1800" rx="220" fill="${palette.background}" />
  <rect x="70" y="70" width="1660" height="1660" rx="180" fill="${palette.backgroundDeep}" stroke="${palette.border}" stroke-width="10" />
  <path d="M330 470 C650 260, 1150 260, 1470 470" fill="none" stroke="${palette.pink}" stroke-opacity="0.22" stroke-width="12" />
  <path d="M410 1310 C720 1480, 1080 1480, 1390 1310" fill="none" stroke="${palette.cyan}" stroke-opacity="0.22" stroke-width="10" />
  <text x="900" y="760" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="138" font-weight="700">${displayName}</text>
  <text x="900" y="950" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="88" font-weight="560">${phrase}</text>
  <text x="900" y="1520" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="72" font-weight="600" letter-spacing="10">MUG SIDE B</text>
</svg>`;

  const wrapSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="4200" height="1800" viewBox="0 0 4200 1800">
  <rect width="4200" height="1800" rx="240" fill="${palette.backgroundDeep}" />
  <rect x="80" y="80" width="4040" height="1640" rx="200" fill="${palette.background}" stroke="${palette.border}" stroke-width="10" />
  <rect x="210" y="230" width="1660" height="1340" rx="180" fill="${palette.backgroundSoft}" />
  <rect x="2330" y="230" width="1660" height="1340" rx="180" fill="${palette.backgroundSoft}" />
  <circle cx="1040" cy="900" r="430" fill="none" stroke="${palette.teal}" stroke-opacity="0.26" stroke-width="14" />
  <image href="${safeLogoDataUrl}" x="610" y="430" width="860" height="860" preserveAspectRatio="xMidYMid meet" />
  <path d="M2530 520 C2800 320, 3520 320, 3790 520" fill="none" stroke="${palette.pink}" stroke-opacity="0.24" stroke-width="12" />
  <path d="M2530 1280 C2800 1480, 3520 1480, 3790 1280" fill="none" stroke="${palette.cyan}" stroke-opacity="0.22" stroke-width="10" />
  <text x="3160" y="770" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="134" font-weight="700">${displayName}</text>
  <text x="3160" y="960" text-anchor="middle" fill="${palette.amber}" font-family="${fontStack}" font-size="82" font-weight="560">${phrase}</text>
  <text x="2100" y="1640" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="58" font-weight="600" letter-spacing="12">PRINTIFY-READY STARTER MUG WRAP</text>
</svg>`;

  const sideAPath = path.join(outputDir, `${args.outputName}-side-a.svg`);
  const sideBPath = path.join(outputDir, `${args.outputName}-side-b.svg`);
  const wrapPath = path.join(outputDir, `${args.outputName}-wrap.svg`);

  await fs.writeFile(sideAPath, sideASvg, "utf8");
  await fs.writeFile(sideBPath, sideBSvg, "utf8");
  await fs.writeFile(wrapPath, wrapSvg, "utf8");

  return { brand, sideAPath, sideBPath, wrapPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeMugFiles(args);
  console.log(
    `Mug side A written to ${path.relative(process.cwd(), result.sideAPath)}`,
  );
  console.log(
    `Mug side B written to ${path.relative(process.cwd(), result.sideBPath)}`,
  );
  console.log(
    `Mug wrap written to ${path.relative(process.cwd(), result.wrapPath)}`,
  );
  console.log(`Brand: ${result.brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
