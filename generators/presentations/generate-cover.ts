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
const outputDir = path.join(repoRootDir, "generators", "outputs", "presentations");

const coverSize = {
  width: 1920,
  height: 1080,
};

type CoverArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

function parseArgs(argv: string[]): CoverArgs {
  const args: CoverArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-presentation-cover",
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

async function writeCoverSvg(args: CoverArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    title: args.title,
    subtitle: args.subtitle,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${coverSize.width}" height="${coverSize.height}" viewBox="0 0 ${coverSize.width} ${coverSize.height}">
  ${renderHeroDefs(data.brand, 48, "#171024")}
  ${renderHeroBase(coverSize.width, coverSize.height, 0.34)}

  <rect x="64" y="62" width="1792" height="956" rx="40" fill="rgba(9, 12, 16, 0.42)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <path d="M 1216 146 C 1400 82, 1648 84, 1788 170" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="12" />
  <path d="M 1162 862 C 1374 954, 1618 952, 1822 840" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="9" />

  <g transform="translate(132 156)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="28" font-weight="700" letter-spacing="6">${data.kicker.toUpperCase()}</text>
    ${data.titleLines
      .map(
        (line, index) =>
          `<text x="0" y="${126 + index * 112}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="104" font-weight="790" letter-spacing="-3">${line}</text>`,
      )
      .join("")}
    ${data.subtitleLines
      .map(
        (line, index) =>
          `<text x="0" y="${382 + index * 58}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="38" font-weight="520">${line}</text>`,
      )
      .join("")}

    <rect x="0" y="560" width="516" height="88" rx="22" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <text x="34" y="614" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="28" font-weight="650">${data.displayUrl}</text>
  </g>

  <g transform="translate(1308 210)">
    <rect x="-88" y="-48" width="430" height="640" rx="36" fill="rgba(7, 10, 14, 0.7)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <circle cx="128" cy="242" r="180" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="14" />
    <circle cx="128" cy="242" r="142" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="10" />
    <image href="${data.logoDataUrl}" x="${128 - 200}" y="${242 - 200}" width="400" height="400" preserveAspectRatio="xMidYMid meet" />
    <text x="128" y="560" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="24" font-weight="700" letter-spacing="5">${data.scene.label.toUpperCase()}</text>
  </g>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeCoverSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    coverSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(
    `Presentation cover SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `Presentation cover PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
