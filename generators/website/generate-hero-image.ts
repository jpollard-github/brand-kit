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
const outputDir = path.join(repoRootDir, "generators", "outputs", "website");

const heroSize = {
  width: 1600,
  height: 900,
};

type HeroArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

function parseArgs(argv: string[]): HeroArgs {
  const args: HeroArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-website-hero",
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
    } else if (arg === "--title") {
      args.title = argv[index + 1] ?? args.title;
      index += 1;
    } else if (arg.startsWith("--title=")) {
      args.title = arg.slice("--title=".length);
    } else if (arg === "--subtitle") {
      args.subtitle = argv[index + 1] ?? args.subtitle;
      index += 1;
    } else if (arg.startsWith("--subtitle=")) {
      args.subtitle = arg.slice("--subtitle=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function writeHeroSvg(args: HeroArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    title: args.title,
    kicker: args.kicker,
    subtitle: args.subtitle,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${heroSize.width}" height="${heroSize.height}" viewBox="0 0 ${heroSize.width} ${heroSize.height}">
  ${renderHeroDefs(data.brand, 42, "#171022")}
  ${renderHeroBase(heroSize.width, heroSize.height, 0.38)}

  <rect x="48" y="46" width="1504" height="808" rx="34" fill="rgba(9, 12, 16, 0.46)" stroke="${data.brand.palette.border}" stroke-width="2" />

  <g transform="translate(104 106)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="24" font-weight="700" letter-spacing="5">${data.kicker.toUpperCase()}</text>
    ${data.titleLines
      .map(
        (line, index) =>
          `<text x="0" y="${106 + index * 104}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="96" font-weight="790" letter-spacing="-3">${line}</text>`,
      )
      .join("")}
    ${data.subtitleLines
      .map(
        (line, index) =>
          `<text x="0" y="${330 + index * 54}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="34" font-weight="520">${line}</text>`,
      )
      .join("")}
    <text x="0" y="574" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="28" font-weight="650">${data.displayUrl}</text>
  </g>

  <rect x="1000" y="132" width="444" height="580" rx="34" fill="rgba(8, 10, 14, 0.68)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
  <circle cx="1222" cy="420" r="166" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="14" />
  <circle cx="1222" cy="420" r="130" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.14" stroke-width="10" />
  <image href="${data.logoDataUrl}" x="${1222 - 190}" y="${420 - 190}" width="380" height="380" preserveAspectRatio="xMidYMid meet" />
  <text x="1222" y="736" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="22" font-weight="700" letter-spacing="5">${data.scene.label.toUpperCase()}</text>

  <path d="M 934 174 C 1070 116, 1306 116, 1444 174" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="10" />
  <path d="M 920 676 C 1064 736, 1318 736, 1458 676" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="8" />
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeHeroSvg(args);
  const pngPath = await renderSvgToPng(result.svg, heroSize, path.join(outputDir, `${args.outputName}.png`));
  console.log(
    `Website hero SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `Website hero PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
