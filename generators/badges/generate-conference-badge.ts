import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildHeroCompositionData,
  renderHeroBase,
  renderHeroDefs,
  renderSvgToPng,
  repoRootDir,
  wrapText,
} from "../social/hero-composition";
import {
  createBrandOutputName,
  defaultRoleLabel,
  resolveBrandId,
} from "../shared/cli";
import { getBrandConfig } from "../../design-system/brand-config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "badges");

const badgeSize = {
  width: 1200,
  height: 1800,
};

type BadgeArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
  attendeeName?: string;
  roleLabel?: string;
};

function parseArgs(argv: string[]): BadgeArgs {
  const defaultBrandId = resolveBrandId(argv);
  const defaultBrand = getBrandConfig(defaultBrandId);
  const args: BadgeArgs = {
    brandId: defaultBrandId,
    sceneId: "work-with-me-hero",
    outputName: createBrandOutputName(
      defaultBrandId,
      "conference-badge",
      process.env.BRAND_THEME,
    ),
    attendeeName: defaultBrand.metadata.contactName,
    roleLabel: defaultRoleLabel(defaultBrand),
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
    } else if (arg === "--name") {
      args.attendeeName = argv[index + 1] ?? args.attendeeName;
      index += 1;
    } else if (arg.startsWith("--name=")) {
      args.attendeeName = arg.slice("--name=".length);
    } else if (arg === "--role") {
      args.roleLabel = argv[index + 1] ?? args.roleLabel;
      index += 1;
    } else if (arg.startsWith("--role=")) {
      args.roleLabel = arg.slice("--role=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function writeBadgeSvg(args: BadgeArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const badgeSubline = wrapText(
    data.scene.subline ?? data.scene.subtitle,
    42,
  )
    .slice(0, 3)
    .map((line) => line.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${badgeSize.width}" height="${badgeSize.height}" viewBox="0 0 ${badgeSize.width} ${badgeSize.height}">
  ${renderHeroDefs(data.brand, 44, "#150f22")}
  ${renderHeroBase(badgeSize.width, badgeSize.height, 0.34)}

  <rect x="70" y="80" width="1060" height="1640" rx="54" fill="rgba(9, 12, 16, 0.58)" stroke="${data.brand.palette.border}" stroke-width="3" />
  <circle cx="600" cy="130" r="42" fill="rgba(7, 10, 14, 0.9)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />

  <text x="600" y="258" text-anchor="middle" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="30" font-weight="700" letter-spacing="7">${data.kicker.toUpperCase()}</text>
  <circle cx="600" cy="560" r="236" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="600" cy="560" r="186" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.26" stroke-width="14" />
  <circle cx="600" cy="560" r="144" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="10" />
  <image href="${data.logoDataUrl}" x="420" y="380" width="360" height="360" preserveAspectRatio="xMidYMid meet" />

  <text x="600" y="920" text-anchor="middle" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="96" font-weight="790" letter-spacing="-3">${args.attendeeName}</text>
  <text x="600" y="1000" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="44" font-weight="600">${args.roleLabel}</text>
  <text x="600" y="1110" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="34" font-weight="520">Small projects. Clear problems. Personal attention.</text>

  <rect x="236" y="1188" width="728" height="132" rx="28" fill="rgba(7, 10, 14, 0.76)" stroke="rgba(248,239,227,0.1)" stroke-width="2" />
  <text x="600" y="1268" text-anchor="middle" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="40" font-weight="700">${data.brand.metadata.canonicalDomain}</text>

  <path d="M 244 1444 C 388 1378, 530 1378, 674 1444" fill="none" stroke="${data.brand.palette.pink}" stroke-opacity="0.26" stroke-width="12" />
  <path d="M 526 1444 C 682 1518, 842 1518, 960 1444" fill="none" stroke="${data.brand.palette.cyan}" stroke-opacity="0.18" stroke-width="10" />

  ${badgeSubline
    .map(
      (line, index) =>
        `<text x="600" y="${1554 + index * 48}" text-anchor="middle" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="31" font-weight="640">${line}</text>`,
    )
    .join("")}
  <text x="600" y="1710" text-anchor="middle" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="28" font-weight="520">${data.brand.displayName} conference badge preview</text>
</svg>`;

  const svgPath = path.join(outputDir, `${args.outputName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");
  return { data, svg, svgPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeBadgeSvg(args);
  const pngPath = await renderSvgToPng(
    result.svg,
    badgeSize,
    path.join(outputDir, `${args.outputName}.png`),
  );
  console.log(`Conference badge SVG written to ${path.relative(process.cwd(), result.svgPath)}`);
  console.log(`Conference badge PNG written to ${path.relative(process.cwd(), pngPath)}`);
  console.log(`Brand: ${result.data.brand.displayName}`);
  console.log(`Scene: ${result.data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
