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
const outputDir = path.join(repoRootDir, "generators", "outputs", "newsletter");

const headerSize = {
  width: 1600,
  height: 480,
};

type HeaderArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  headline?: string;
  subline?: string;
};

function parseArgs(argv: string[]): HeaderArgs {
  const args: HeaderArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-newsletter-header",
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

async function writeHeaderSvg(args: HeaderArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    headline: args.headline,
    subline: args.subline,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${headerSize.width}" height="${headerSize.height}" viewBox="0 0 ${headerSize.width} ${headerSize.height}">
  ${renderHeroDefs(data.brand, 34, "#140f20")}
  ${renderHeroBase(headerSize.width, headerSize.height, 0.4)}

  <rect x="38" y="34" width="1524" height="412" rx="30" fill="rgba(9, 12, 16, 0.52)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <path d="M 1060 82 C 1200 38, 1364 38, 1494 96" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="9" />
  <path d="M 1050 372 C 1186 432, 1368 432, 1510 366" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="7" />

  <g transform="translate(96 92)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="20" font-weight="700" letter-spacing="4.5">${data.kicker.toUpperCase()}</text>
    ${data.headlineLines
      .map(
        (line, index) =>
          `<text x="0" y="${80 + index * 66}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="62" font-weight="780" letter-spacing="-2.5">${line}</text>`,
      )
      .join("")}
    ${data.sublineLines
      .map(
        (line, index) =>
          `<text x="0" y="${220 + index * 34}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="26" font-weight="520">${line}</text>`,
      )
      .join("")}
    <text x="0" y="300" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="22" font-weight="650">${data.displayUrl}</text>
  </g>

  <g transform="translate(1220 90)">
    <rect x="-74" y="-24" width="280" height="280" rx="28" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <circle cx="66" cy="116" r="100" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.22" stroke-width="10" />
    <circle cx="66" cy="116" r="76" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.15" stroke-width="7" />
    <image href="${data.logoDataUrl}" x="${66 - 90}" y="${116 - 90}" width="180" height="180" preserveAspectRatio="xMidYMid meet" />
  </g>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeHeaderSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    headerSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(
    `Newsletter header SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `Newsletter header PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
