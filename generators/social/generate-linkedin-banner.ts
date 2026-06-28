import { promises as fs } from "node:fs";
import path from "node:path";

import {
  buildHeroCompositionData,
  ensureOutputDir,
  outputDir,
  renderSvgToPng,
  renderHeroBase,
  renderHeroDefs,
} from "./hero-composition";

const bannerSize = {
  width: 1584,
  height: 396,
};

type BannerArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  headline?: string;
  subline?: string;
};

function parseArgs(argv: string[]): BannerArgs {
  const args: BannerArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-linkedin-banner",
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

async function writeBannerSvg(args: BannerArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    headline: args.headline,
    subline: args.subline,
  });

  const logoWidth = 190;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${bannerSize.width}" height="${bannerSize.height}" viewBox="0 0 ${bannerSize.width} ${bannerSize.height}">
  ${renderHeroDefs(data.brand, 34, "#150f1f")}
  ${renderHeroBase(bannerSize.width, bannerSize.height, 0.4)}

  <rect x="34" y="28" width="1516" height="340" rx="28" fill="rgba(10, 13, 18, 0.54)" stroke="${data.brand.palette.border}" stroke-width="2" />

  <circle cx="144" cy="320" r="86" fill="rgba(8, 10, 14, 0.84)" stroke="rgba(248,239,227,0.12)" stroke-width="2" />
  <text x="144" y="326" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="18" font-weight="700" letter-spacing="3">AVATAR</text>

  <g transform="translate(270 72)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="19" font-weight="700" letter-spacing="4.5">${data.kicker.toUpperCase()}</text>
    ${data.headlineLines
      .map(
        (line, index) =>
          `<text x="0" y="${76 + index * 66}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="58" font-weight="780" letter-spacing="-2.5">${line}</text>`,
      )
      .join("")}
    ${data.sublineLines
      .map(
        (line, index) =>
          `<text x="0" y="${230 + index * 34}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="26" font-weight="520">${line}</text>`,
      )
      .join("")}
    <text x="0" y="286" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="22" font-weight="640">${data.displayUrl}</text>
  </g>

  <rect x="1190" y="60" width="296" height="276" rx="24" fill="rgba(8, 10, 14, 0.7)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
  <circle cx="1338" cy="198" r="96" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.22" stroke-width="10" />
  <circle cx="1338" cy="198" r="72" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.14" stroke-width="7" />
  <image href="${data.logoDataUrl}" x="${1338 - logoWidth / 2}" y="${198 - logoWidth / 2}" width="${logoWidth}" height="${logoWidth}" preserveAspectRatio="xMidYMid meet" />

  <path d="M 1080 82 C 1180 40, 1300 40, 1404 82" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="8" />
  <path d="M 1060 304 C 1180 348, 1312 348, 1432 304" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.16" stroke-width="6" />
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function writeBannerPng(svg: string, outputName: string) {
  const pngPath = path.join(outputDir, `${outputName}.png`);
  return renderSvgToPng(svg, bannerSize, pngPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeBannerSvg(args);
  const pngPath = await writeBannerPng(result.svg, args.outputName);
  console.log(
    `LinkedIn banner SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `LinkedIn banner PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
