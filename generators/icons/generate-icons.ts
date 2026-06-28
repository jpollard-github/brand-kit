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
import {
  resolveBrandId,
  resolveSceneId,
} from "../shared/cli";
import { createThemedOutputName } from "../../design-system/themes";
import { writeIconManifest } from "./manifest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "icons");

const iconSizes = [512, 192, 180, 32] as const;

type IconArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
};

function parseArgs(argv: string[]): IconArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: IconArgs = {
    brandId: defaultBrandId,
    sceneId: resolveSceneId(argv),
    outputName: createThemedOutputName(
      defaultBrandId,
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
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

function renderIconSvg(
  size: number,
  data: Awaited<ReturnType<typeof buildHeroCompositionData>>,
) {
  const inset = Math.round(size * 0.085);
  const panelSize = size - inset * 2;
  const radius = Math.round(size * 0.18);
  const logoSize = Math.round(size * 0.5);
  const logoX = (size - logoSize) / 2;
  const logoY = Math.round(size * 0.17);
  const labelY = size - inset - Math.round(size * 0.1);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${renderHeroDefs(data.brand, Math.max(18, Math.round(size * 0.08)), "#160f20")}
  ${renderHeroBase(size, size, 0.3)}
  <rect x="${inset}" y="${inset}" width="${panelSize}" height="${panelSize}" rx="${radius}" fill="rgba(8, 11, 16, 0.72)" stroke="${data.brand.palette.border}" stroke-width="${Math.max(2, Math.round(size * 0.006))}" />
  <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.24}" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.25" stroke-width="${Math.max(6, Math.round(size * 0.02))}" />
  <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.18}" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.18" stroke-width="${Math.max(4, Math.round(size * 0.014))}" />
  <image href="${data.logoDataUrl}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />
  <text x="${size / 2}" y="${labelY}" text-anchor="middle" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="${Math.max(22, Math.round(size * 0.09))}" font-weight="760" letter-spacing="-1">${data.brand.shortName}</text>
</svg>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);

  const svg = renderIconSvg(512, data);
  const svgPath = path.join(outputDir, `${args.outputName}-icon.svg`);
  await fs.writeFile(svgPath, svg, "utf8");

  const renderedPngs: string[] = [];
  const manifestPngs: Array<{
    role: string;
    path: string;
    expectedWidth: number;
    expectedHeight: number;
  }> = [];
  for (const size of iconSizes) {
    const pngName =
      size === 180
        ? `${args.outputName}-apple-touch-icon.png`
        : size === 32
          ? `${args.outputName}-favicon-32.png`
          : `${args.outputName}-icon-${size}.png`;
    const pngPath = path.join(outputDir, pngName);
    await renderSvgToPng(renderIconSvg(size, data), { width: size, height: size }, pngPath);
    renderedPngs.push(path.relative(process.cwd(), pngPath));
    manifestPngs.push({
      role:
        size === 512
          ? "icon-512"
          : size === 192
            ? "icon-192"
            : size === 180
              ? "apple-touch-icon"
              : "favicon-32",
      path: pngPath,
      expectedWidth: size,
      expectedHeight: size,
    });
  }
  const manifestPath = await writeIconManifest({
    data,
    outputBaseName: args.outputName,
    svgPath,
    pngPaths: manifestPngs,
  });

  console.log(`Icon SVG written to ${path.relative(process.cwd(), svgPath)}`);
  for (const pngPath of renderedPngs) {
    console.log(`Icon PNG written to ${pngPath}`);
  }
  console.log(`Icon manifest written to ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Brand: ${data.brand.displayName}`);
  console.log(`Scene: ${data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
