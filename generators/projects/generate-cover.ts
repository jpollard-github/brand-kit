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
const outputDir = path.join(repoRootDir, "generators", "outputs", "projects");

const coverSize = {
  width: 1280,
  height: 720,
};

type ProjectCoverArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

function parseArgs(argv: string[]): ProjectCoverArgs {
  const args: ProjectCoverArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-project-cover",
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

async function writeProjectCoverSvg(args: ProjectCoverArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    title: args.title,
    subtitle: args.subtitle,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${coverSize.width}" height="${coverSize.height}" viewBox="0 0 ${coverSize.width} ${coverSize.height}">
  ${renderHeroDefs(data.brand, 40, "#120e1d")}
  ${renderHeroBase(coverSize.width, coverSize.height, 0.36)}

  <rect x="54" y="54" width="1172" height="612" rx="36" fill="rgba(9, 12, 16, 0.56)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <path d="M 840 108 C 964 64, 1102 70, 1178 136" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="10" />
  <path d="M 806 578 C 948 648, 1104 640, 1200 566" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="8" />

  <g transform="translate(110 112)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="22" font-weight="700" letter-spacing="5">${data.kicker.toUpperCase()}</text>
    ${data.titleLines
      .map(
        (line, index) =>
          `<text x="0" y="${92 + index * 88}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="78" font-weight="780" letter-spacing="-3">${line}</text>`,
      )
      .join("")}
    ${data.subtitleLines
      .map(
        (line, index) =>
          `<text x="0" y="${286 + index * 46}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="29" font-weight="520">${line}</text>`,
      )
      .join("")}
    <rect x="0" y="352" width="402" height="74" rx="18" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <text x="26" y="398" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="24" font-weight="650">${data.displayUrl}</text>
  </g>

  <g transform="translate(918 164)">
    <rect x="-74" y="-34" width="320" height="320" rx="30" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <circle cx="86" cy="126" r="128" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.22" stroke-width="12" />
    <circle cx="86" cy="126" r="96" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
    <image href="${data.logoDataUrl}" x="${86 - 110}" y="${126 - 110}" width="220" height="220" preserveAspectRatio="xMidYMid meet" />
    <text x="86" y="302" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="18" font-weight="700" letter-spacing="4">${data.scene.label.toUpperCase()}</text>
  </g>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeProjectCoverSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    coverSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(
    `Project cover SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `Project cover PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
