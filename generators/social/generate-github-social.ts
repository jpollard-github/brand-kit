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

const githubSocialSize = {
  width: 1280,
  height: 640,
};

type GithubSocialArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

function parseArgs(argv: string[]): GithubSocialArgs {
  const args: GithubSocialArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-github-social",
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

async function writeGithubSocialSvg(args: GithubSocialArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId, {
    kicker: args.kicker,
    title: args.title,
    subtitle: args.subtitle,
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${githubSocialSize.width}" height="${githubSocialSize.height}" viewBox="0 0 ${githubSocialSize.width} ${githubSocialSize.height}">
  ${renderHeroDefs(data.brand, 38, "#140f1f")}
  ${renderHeroBase(githubSocialSize.width, githubSocialSize.height, 0.4)}

  <rect x="50" y="50" width="1180" height="540" rx="36" fill="rgba(9, 12, 16, 0.56)" stroke="${data.brand.palette.border}" stroke-width="2" />
  <path d="M 774 112 C 958 58, 1090 58, 1172 118" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.24" stroke-width="10" />
  <path d="M 760 524 C 934 578, 1090 570, 1188 504" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.2" stroke-width="8" />

  <g transform="translate(104 94)">
    <text x="0" y="0" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="22" font-weight="700" letter-spacing="5">${data.kicker.toUpperCase()}</text>
    ${data.titleLines
      .map(
        (line, index) =>
          `<text x="0" y="${92 + index * 92}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="80" font-weight="780" letter-spacing="-3">${line}</text>`,
      )
      .join("")}
    ${data.subtitleLines
      .map(
        (line, index) =>
          `<text x="0" y="${286 + index * 46}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="29" font-weight="520">${line}</text>`,
      )
      .join("")}

    <rect x="0" y="360" width="420" height="76" rx="18" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <text x="26" y="407" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="24" font-weight="650">${data.displayUrl}</text>
  </g>

  <g transform="translate(848 136)">
    <rect x="-68" y="-38" width="336" height="336" rx="30" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.1)" stroke-width="1.5" />
    <circle cx="100" cy="130" r="136" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.22" stroke-width="12" />
    <circle cx="100" cy="130" r="102" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
    <image href="${data.logoDataUrl}" x="${100 - data.logoWidth / 2}" y="${130 - data.logoWidth / 2}" width="${data.logoWidth}" height="${data.logoWidth}" preserveAspectRatio="xMidYMid meet" />
    <text x="100" y="310" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="20" font-weight="700" letter-spacing="4">${data.scene.label.toUpperCase()}</text>
  </g>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  return { data, svg, svgPath };
}

async function writeGithubSocialPng(svg: string, outputName: string) {
  const pngPath = path.join(outputDir, `${outputName}.png`);
  return renderSvgToPng(svg, githubSocialSize, pngPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeGithubSocialSvg(args);
  const pngPath = await writeGithubSocialPng(result.svg, args.outputName);
  console.log(
    `GitHub social SVG written to ${path.relative(process.cwd(), result.svgPath)}`,
  );
  console.log(
    `GitHub social PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
