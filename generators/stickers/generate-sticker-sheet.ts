import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig, getBrandPalette } from "../../design-system/brand-config";
import { createThemedOutputName } from "../../design-system/themes";
import {
  escapeXml,
  renderSvgToPng,
  repoRootDir,
} from "../social/hero-composition";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "stickers");

const sheetSize = {
  width: 2550,
  height: 3300,
};

type StickerSheetArgs = {
  brandId: string;
  outputName: string;
};

function parseArgs(argv: string[]): StickerSheetArgs {
  const args: StickerSheetArgs = {
    brandId: "arcadeghosts",
    outputName: createThemedOutputName(
      "arcadeghosts-sticker-sheet",
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

async function writeStickerSheetSvg(args: StickerSheetArgs) {
  const brand = getBrandConfig(args.brandId);
  const palette = getBrandPalette(brand.id, process.env.BRAND_THEME);
  const stickerSvg = await fs.readFile(
    path.join(
      outputDir,
      `${createThemedOutputName(`${brand.id}-sticker-set`, process.env.BRAND_THEME)}.svg`,
    ),
    "utf8",
  );
  const stickerDataUrl = `data:image/svg+xml;base64,${Buffer.from(stickerSvg).toString("base64")}`;
  const fontStack = escapeXml(brand.typography.fontStack);

  const stickerWidth = 700;
  const stickerHeight = 700;
  const positions = [
    { x: 170, y: 420 },
    { x: 925, y: 420 },
    { x: 1680, y: 420 },
    { x: 170, y: 1290 },
    { x: 925, y: 1290 },
    { x: 1680, y: 1290 },
  ];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetSize.width}" height="${sheetSize.height}" viewBox="0 0 ${sheetSize.width} ${sheetSize.height}">
  <rect width="${sheetSize.width}" height="${sheetSize.height}" fill="#f3efe7" />
  <rect x="84" y="84" width="2382" height="3132" rx="46" fill="#fffdfa" stroke="${palette.border}" stroke-width="8" />
  <text x="160" y="210" fill="${palette.backgroundDeep}" font-family="${fontStack}" font-size="92" font-weight="800">${brand.displayName} Sticker Sheet</text>
  <text x="160" y="300" fill="${palette.textMuted}" font-family="${fontStack}" font-size="44" font-weight="520">Print-ready sheet with six sticker placements and more comfortable page margins.</text>
  <text x="160" y="3090" fill="${palette.backgroundDeep}" font-family="${fontStack}" font-size="34" font-weight="700">${sheetSize.width / 300}" x ${sheetSize.height / 300}" at 300 DPI</text>
  <text x="160" y="3140" fill="${palette.textMuted}" font-family="${fontStack}" font-size="30" font-weight="520">Keep as proof sheet or adapt for your print vendor's bleed requirements.</text>

  ${positions
    .map(
      (position, index) => `
  <rect x="${position.x - 26}" y="${position.y - 26}" width="${stickerWidth + 52}" height="${stickerHeight + 52}" rx="72" fill="none" stroke="#cfd3da" stroke-width="4" stroke-dasharray="18 14" />
  <image href="${stickerDataUrl}" x="${position.x}" y="${position.y}" width="${stickerWidth}" height="${stickerHeight}" preserveAspectRatio="xMidYMid meet" />
  <text x="${position.x + stickerWidth / 2}" y="${position.y + stickerHeight + 92}" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="28" font-weight="600">Sticker ${index + 1}</text>`,
    )
    .join("")}
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");
  return { brand, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeStickerSheetSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    sheetSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(
    `Sticker sheet SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `Sticker sheet PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
