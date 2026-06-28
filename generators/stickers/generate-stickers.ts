import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig, getBrandPalette } from "../../design-system/brand-config";
import { repoRootDir } from "../social/hero-composition";
import { readAssetAsDataUrl } from "../shared/assets";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const outputDir = path.join(rootDir, "outputs", "stickers");

function parseArgs(argv: string[]) {
  const args = {
    brandId: resolveBrandId(argv),
    outputName: createBrandOutputName(
      resolveBrandId(argv),
      "sticker-set",
      process.env.BRAND_THEME,
    ),
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
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function readLogoDataUrl(brandId: string) {
  const logoPath = path.join(repoRootDir, "brands", brandId, "assets", "logo.png");
  return readAssetAsDataUrl(logoPath);
}

async function writePlaceholderSvg(
  brandConfig: ReturnType<typeof getBrandConfig>,
  outputName: string,
) {
  const palette = getBrandPalette(brandConfig.id, process.env.BRAND_THEME);
  const logoDataUrl = await readLogoDataUrl(brandConfig.id);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="3000" viewBox="0 0 3000 3000">
  <defs>
    <clipPath id="stickerShape">
      <rect width="3000" height="3000" rx="420" />
    </clipPath>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.backgroundDeep}" />
      <stop offset="55%" stop-color="${palette.background}" />
      <stop offset="100%" stop-color="#150f1f" />
    </linearGradient>
    <radialGradient id="tealGlow" cx="22%" cy="18%" r="42%">
      <stop offset="0%" stop-color="${palette.teal}" stop-opacity="0.24" />
      <stop offset="100%" stop-color="${palette.teal}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="pinkGlow" cx="82%" cy="22%" r="34%">
      <stop offset="0%" stop-color="${palette.pink}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${palette.pink}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="amberGlow" cx="50%" cy="84%" r="30%">
      <stop offset="0%" stop-color="${palette.amber}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${palette.amber}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <g clip-path="url(#stickerShape)">
    <rect width="3000" height="3000" rx="420" fill="url(#bg)" />
    <rect width="3000" height="3000" rx="420" fill="url(#tealGlow)" />
    <rect width="3000" height="3000" rx="420" fill="url(#pinkGlow)" />
    <rect width="3000" height="3000" rx="420" fill="url(#amberGlow)" />

    <path d="M 0 2460 C 320 2280, 560 2230, 860 2310 C 1140 2380, 1360 2330, 1600 2200 C 1850 2060, 2140 2050, 2440 2190 C 2680 2300, 2860 2280, 3000 2200 L 3000 3000 L 0 3000 Z" fill="rgba(6, 10, 14, 0.88)" />
    <path d="M 180 2360 L 420 1820 L 590 2360 Z" fill="rgba(10, 18, 22, 0.78)" />
    <path d="M 460 2360 L 760 1660 L 990 2360 Z" fill="rgba(10, 20, 24, 0.82)" />
    <path d="M 880 2360 L 1240 1540 L 1510 2360 Z" fill="rgba(10, 20, 24, 0.86)" />
    <path d="M 1460 2360 L 1770 1640 L 2030 2360 Z" fill="rgba(10, 18, 22, 0.82)" />
    <path d="M 1900 2360 L 2190 1740 L 2400 2360 Z" fill="rgba(10, 18, 22, 0.78)" />

    <rect x="390" y="300" width="2220" height="2130" rx="280" fill="rgba(8, 11, 16, 0.5)" stroke="${palette.border}" stroke-width="10" />
    <text x="1500" y="650" text-anchor="middle" fill="${palette.amber}" font-family="Inter, Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="20">NEON FOREST SIGNAL</text>
    <circle cx="1500" cy="1220" r="420" fill="rgba(7, 10, 14, 0.54)" stroke="rgba(248,239,227,0.08)" stroke-width="8" />
    <circle cx="1500" cy="1220" r="348" fill="none" stroke="${palette.teal}" stroke-opacity="0.26" stroke-width="18" />
    <circle cx="1500" cy="1220" r="282" fill="none" stroke="${palette.amber}" stroke-opacity="0.14" stroke-width="12" />
    <image href="${logoDataUrl}" x="1160" y="880" width="680" height="680" preserveAspectRatio="xMidYMid meet" />
    <text x="1500" y="1910" text-anchor="middle" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="224" font-weight="780" letter-spacing="-3">${brandConfig.displayName}</text>
    <text x="1500" y="2100" text-anchor="middle" fill="${palette.textMuted}" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="520">Projects. Writing. Music. Cats.</text>
    <rect x="960" y="2200" width="1080" height="156" rx="78" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.08)" stroke-width="6" />
    <text x="1500" y="2298" text-anchor="middle" fill="${palette.teal}" font-family="Inter, Arial, sans-serif" font-size="90" font-weight="700">${brandConfig.metadata.canonicalDomain}</text>
    <text x="1500" y="2690" text-anchor="middle" fill="${palette.textMuted}" font-family="Inter, Arial, sans-serif" font-size="86" font-weight="600">Late-night signal chasing</text>
  </g>
  <rect x="6" y="6" width="2988" height="2988" rx="414" fill="none" stroke="rgba(248,239,227,0.14)" stroke-width="12" />
</svg>`;

  const filePath = path.join(outputDir, `${outputName}.svg`);
  await fs.writeFile(filePath, svg, "utf8");
  return filePath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const brandConfig = getBrandConfig(args.brandId);
  await ensureOutputDir();
  const filePath = await writePlaceholderSvg(brandConfig, args.outputName);
  console.log(
    `Sticker placeholder written to ${path.relative(process.cwd(), filePath)}`,
  );
  console.log(`Brand: ${brandConfig.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
