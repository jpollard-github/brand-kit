import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig } from "../../design-system/brand-config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const outputDir = path.join(rootDir, "outputs", "stickers");

function parseArgs(argv: string[]) {
  const args = {
    brandId: "arcadeghosts",
    outputName: "arcadeghosts-sticker-set",
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

async function writePlaceholderSvg(
  brandConfig: ReturnType<typeof getBrandConfig>,
  outputName: string,
) {
  const svg = `<?xml version="1.0" encoding="UTF-8" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="3000" viewBox="0 0 3000 3000">
  <rect width="3000" height="3000" rx="420" fill="${brandConfig.palette.backgroundDeep}" />
  <rect x="180" y="180" width="2640" height="2640" rx="360" fill="${brandConfig.palette.backgroundSoft}" stroke="${brandConfig.palette.border}" stroke-width="12" />
  <text x="1500" y="1280" text-anchor="middle" fill="${brandConfig.palette.amber}" font-family="Inter, Arial, sans-serif" font-size="220" font-weight="700" letter-spacing="10">${brandConfig.displayName}</text>
  <text x="1500" y="1580" text-anchor="middle" fill="${brandConfig.palette.text}" font-family="Inter, Arial, sans-serif" font-size="150" font-weight="500">Printify-ready starter sticker</text>
  <circle cx="1500" cy="2060" r="420" fill="none" stroke="${brandConfig.palette.teal}" stroke-width="34" />
  <circle cx="1500" cy="2060" r="260" fill="none" stroke="${brandConfig.palette.pink}" stroke-width="24" />
  <text x="1500" y="2460" text-anchor="middle" fill="${brandConfig.palette.cyan}" font-family="Inter, Arial, sans-serif" font-size="110" font-weight="600">${outputName}</text>
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
