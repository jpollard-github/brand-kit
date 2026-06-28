import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildHeroCompositionData,
  renderHeroBase,
  renderHeroDefs,
  renderSvgToPng,
  repoRootDir,
} from "../social/hero-composition";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "video");

const thumbnailSize = {
  width: 1920,
  height: 1080,
};

type ThumbnailArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  headline?: string;
  subline?: string;
};

function parseArgs(argv: string[]): ThumbnailArgs {
  const args: ThumbnailArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-stream-thumbnail",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      args.brandId = argv[index + 1] ?? args.brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      args.brandId = arg.slice("--brand=".length);
    } else if (arg === "--scene") {
      args.sceneId = argv[index + 1] ?? args.sceneId;
      index += 1;
    } else if (arg.startsWith("--scene=")) {
      args.sceneId = arg.slice("--scene=".length);
    } else if (arg === "--output") {
      args.outputName = argv[index + 1] ?? args.outputName;
      index += 1;
    } else if (arg.startsWith("--output=")) {
      args.outputName = arg.slice("--output=".length);
    } else if (arg === "--kicker") {
      args.kicker = argv[index + 1] ?? args.kicker;
      index += 1;
    } else if (arg.startsWith("--kicker=")) {
      args.kicker = arg.slice("--kicker=".length);
    } else if (arg === "--headline") {
      args.headline = argv[index + 1] ?? args.headline;
      index += 1;
    } else if (arg.startsWith("--headline=")) {
      args.headline = arg.slice("--headline=".length);
    } else if (arg === "--subline") {
      args.subline = argv[index + 1] ?? args.subline;
      index += 1;
    } else if (arg.startsWith("--subline=")) {
      args.subline = arg.slice("--subline=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function writeThumbnailSvg(args: ThumbnailArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    headline: args.headline,
    subline: args.subline,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${thumbnailSize.width}" height="${thumbnailSize.height}" viewBox="0 0 ${thumbnailSize.width} ${thumbnailSize.height}">
  ${renderHeroDefs(data.brand, 48, "#150f23")}
  ${renderHeroBase(thumbnailSize.width, thumbnailSize.height, 0.34)}
  <rect x="64" y="64" width="1792" height="952" rx="44" fill="rgba(9, 12, 16, 0.44)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <path d="M 0 830 C 210 724, 444 732, 646 820 C 850 908, 1078 878, 1272 760 C 1502 620, 1710 616, 1920 724 L 1920 1080 L 0 1080 Z" fill="rgba(6, 10, 14, 0.88)" />
  <path d="M 130 830 L 340 470 L 500 830 Z" fill="rgba(10, 18, 22, 0.76)" />
  <path d="M 380 830 L 690 360 L 920 830 Z" fill="rgba(10, 20, 24, 0.84)" />
  <path d="M 760 830 L 1086 290 L 1328 830 Z" fill="rgba(10, 20, 24, 0.88)" />
  <g transform="translate(110 120)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="28" font-weight="700" letter-spacing="6">${data.kicker.toUpperCase()}</text>
    ${data.headlineLines
      .map(
        (line, index) =>
          `<text x="0" y="${128 + index * 116}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="110" font-weight="790" letter-spacing="-4">${line}</text>`,
      )
      .join("")}
    ${data.sublineLines
      .map(
        (line, index) =>
          `<text x="0" y="${398 + index * 56}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="40" font-weight="520">${line}</text>`,
      )
      .join("")}
    <rect x="0" y="550" width="540" height="88" rx="22" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <text x="32" y="605" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="34" font-weight="700">${data.displayUrl}</text>
  </g>
  <g transform="translate(1360 164)">
    <rect x="-92" y="-42" width="420" height="420" rx="36" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <circle cx="118" cy="168" r="162" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="14" />
    <circle cx="118" cy="168" r="126" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="10" />
    <image href="${data.logoDataUrl}" x="${118 - 180}" y="${168 - 180}" width="360" height="360" preserveAspectRatio="xMidYMid meet" />
    <text x="118" y="396" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="22" font-weight="700" letter-spacing="4">STREAM / VIDEO</text>
  </g>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");
  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeThumbnailSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    thumbnailSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(`Stream thumbnail SVG written to ${path.relative(process.cwd(), result.svgPath)}`);
  console.log(`Stream thumbnail PNG written to ${path.relative(process.cwd(), pngPath)}`);
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
