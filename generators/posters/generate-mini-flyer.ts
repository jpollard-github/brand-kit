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
const outputDir = path.join(repoRootDir, "generators", "outputs", "posters");

const flyerSize = {
  width: 1800,
  height: 2700,
};

type FlyerArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  footerLine?: string;
};

function parseArgs(argv: string[]): FlyerArgs {
  const args: FlyerArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-mini-flyer",
    footerLine: "Projects, writing, music, cats, and strange little experiments.",
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
    } else if (arg === "--footer") {
      args.footerLine = argv[index + 1] ?? args.footerLine;
      index += 1;
    } else if (arg.startsWith("--footer=")) {
      args.footerLine = arg.slice("--footer=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function writeFlyerSvg(args: FlyerArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${flyerSize.width}" height="${flyerSize.height}" viewBox="0 0 ${flyerSize.width} ${flyerSize.height}">
  ${renderHeroDefs(data.brand, 46, "#160f24")}
  ${renderHeroBase(flyerSize.width, flyerSize.height, 0.36)}

  <rect x="84" y="84" width="1632" height="2532" rx="58" fill="rgba(9, 12, 16, 0.48)" stroke="${data.brand.palette.border}" stroke-width="3" />
  <text x="900" y="262" text-anchor="middle" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="9">${data.kicker.toUpperCase()}</text>

  <circle cx="900" cy="760" r="310" fill="rgba(7, 10, 14, 0.66)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="900" cy="760" r="246" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="18" />
  <circle cx="900" cy="760" r="194" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="12" />
  <image href="${data.logoDataUrl}" x="620" y="480" width="560" height="560" preserveAspectRatio="xMidYMid meet" />

  ${data.titleLines
    .map(
      (line, index) =>
        `<text x="900" y="${1260 + index * 136}" text-anchor="middle" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="132" font-weight="790" letter-spacing="-4">${line}</text>`,
    )
    .join("")}

  ${data.subtitleLines
    .map(
      (line, index) =>
        `<text x="900" y="${1528 + index * 60}" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="42" font-weight="520">${line}</text>`,
    )
    .join("")}

  <rect x="430" y="1750" width="940" height="118" rx="30" fill="rgba(7, 10, 14, 0.74)" stroke="rgba(248,239,227,0.1)" stroke-width="2" />
  <text x="900" y="1824" text-anchor="middle" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="46" font-weight="700">${data.displayUrl}</text>

  <path d="M 274 2060 C 520 1940, 760 1940, 1020 2060" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="16" />
  <path d="M 780 2060 C 1034 2180, 1288 2180, 1530 2060" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="14" />
  <text x="900" y="2260" text-anchor="middle" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="40" font-weight="650">${args.footerLine}</text>
  <text x="900" y="2370" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="30" font-weight="520">Mini flyer / poster preview</text>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");
  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeFlyerSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    flyerSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(`Mini flyer SVG written to ${path.relative(process.cwd(), result.svgPath)}`);
  console.log(`Mini flyer PNG written to ${path.relative(process.cwd(), pngPath)}`);
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
