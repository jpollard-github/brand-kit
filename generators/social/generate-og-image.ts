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
import {
  createBrandOutputName,
  resolveBrandId,
  resolveSceneId,
} from "../shared/cli";
import { writeSocialManifest } from "./manifest";

type SocialArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  title?: string;
  kicker?: string;
  subtitle?: string;
};

function parseArgs(argv: string[]): SocialArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: SocialArgs = {
    brandId: defaultBrandId,
    sceneId: resolveSceneId(argv),
    outputName: createBrandOutputName(
      defaultBrandId,
      "og-image",
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
    } else if (arg === "--title") {
      args.title = argv[index + 1] ?? args.title;
      index += 1;
    } else if (arg.startsWith("--title=")) {
      args.title = arg.slice("--title=".length);
    } else if (arg === "--kicker") {
      args.kicker = argv[index + 1] ?? args.kicker;
      index += 1;
    } else if (arg.startsWith("--kicker=")) {
      args.kicker = arg.slice("--kicker=".length);
    } else if (arg === "--subtitle") {
      args.subtitle = argv[index + 1] ?? args.subtitle;
      index += 1;
    } else if (arg.startsWith("--subtitle=")) {
      args.subtitle = arg.slice("--subtitle=".length);
    }
  }

  return args;
}

async function writeOgSvg(args: SocialArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    title: args.title,
    kicker: args.kicker,
    subtitle: args.subtitle,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${renderHeroDefs(data.brand, 36)}
  ${renderHeroBase(1200, 630)}

  <rect x="54" y="54" width="1092" height="522" rx="34" fill="rgba(9, 12, 16, 0.52)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <rect x="74" y="74" width="360" height="482" rx="28" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.08)" stroke-width="1.5" />
  <circle cx="254" cy="246" r="150" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.22" stroke-width="12" />
  <circle cx="254" cy="246" r="118" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.14" stroke-width="8" />
  <image href="${data.logoDataUrl}" x="${254 - data.logoWidth / 2}" y="${246 - data.logoWidth / 2}" width="${data.logoWidth}" height="${data.logoWidth}" preserveAspectRatio="xMidYMid meet" />
  <text x="254" y="${246 + data.logoWidth / 2 + data.clearSpace + 18}" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="20" font-weight="700" letter-spacing="5">${data.scene.label.toUpperCase()}</text>

  <g transform="translate(490 118)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="22" font-weight="700" letter-spacing="5">${data.kicker.toUpperCase()}</text>
    ${data.titleLines
      .map(
        (line, index) =>
          `<text x="0" y="${90 + index * 90}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="78" font-weight="780" letter-spacing="-3">${line}</text>`,
      )
      .join("")}
    ${data.subtitleLines
      .map(
        (line, index) =>
          `<text x="0" y="${270 + index * 46}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="28" font-weight="520">${line}</text>`,
      )
      .join("")}
  </g>

  <path d="M 486 472 C 640 410, 846 410, 1008 472" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.26" stroke-width="10" />
  <path d="M 516 510 C 662 456, 822 456, 972 510" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="7" />
  <text x="492" y="554" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="24" font-weight="650">${data.displayUrl}</text>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function writeOgPng(svg: string, outputName: string) {
  const pngPath = path.join(outputDir, `${outputName}.png`);
  return renderSvgToPng(svg, { width: 1200, height: 630 }, pngPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeOgSvg(args);
  const pngPath = await writeOgPng(result.svg, args.outputName);
  const manifestPath = await writeSocialManifest({
    data: result.data,
    outputKind: "og-image",
    outputName: args.outputName,
    size: { width: 1200, height: 630 },
    svgPath: result.svgPath,
    pngPath,
  });
  console.log(
    `OG SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(`OG PNG written to ${path.relative(process.cwd(), pngPath)}`);
  console.log(`OG manifest written to ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
