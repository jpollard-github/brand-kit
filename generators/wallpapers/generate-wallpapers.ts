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
const outputDir = path.join(repoRootDir, "generators", "outputs", "wallpapers");

type WallpaperArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
};

const desktopSize = { width: 2560, height: 1440 };
const mobileSize = { width: 1290, height: 2796 };

function parseArgs(argv: string[]): WallpaperArgs {
  const args: WallpaperArgs = {
    brandId: "arcadeghosts",
    sceneId: "arcadeghosts-hero",
    outputName: "arcadeghosts-wallpaper",
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

function renderDesktopWallpaper(data: Awaited<ReturnType<typeof buildHeroCompositionData>>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${desktopSize.width}" height="${desktopSize.height}" viewBox="0 0 ${desktopSize.width} ${desktopSize.height}">
  ${renderHeroDefs(data.brand, 52, "#140f22")}
  ${renderHeroBase(desktopSize.width, desktopSize.height, 0.32)}
  <path d="M 0 1180 C 260 1030, 520 1010, 782 1110 C 1030 1200, 1320 1160, 1560 1010 C 1820 842, 2140 822, 2414 978 C 2476 1012, 2528 1048, 2560 1080 L 2560 1440 L 0 1440 Z" fill="rgba(6, 10, 14, 0.9)" />
  <path d="M 160 1180 L 398 726 L 560 1180 Z" fill="rgba(10, 18, 22, 0.76)" />
  <path d="M 430 1180 L 778 560 L 1020 1180 Z" fill="rgba(10, 20, 24, 0.84)" />
  <path d="M 890 1180 L 1280 452 L 1560 1180 Z" fill="rgba(10, 20, 24, 0.88)" />
  <path d="M 1430 1180 L 1760 618 L 2020 1180 Z" fill="rgba(10, 18, 22, 0.82)" />
  <path d="M 1840 1180 L 2140 720 L 2370 1180 Z" fill="rgba(10, 18, 22, 0.76)" />

  <circle cx="680" cy="590" r="232" fill="rgba(7, 10, 14, 0.54)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="680" cy="590" r="184" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="12" />
  <circle cx="680" cy="590" r="142" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${data.logoDataUrl}" x="470" y="380" width="420" height="420" preserveAspectRatio="xMidYMid meet" />

  <text x="1040" y="450" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="32" font-weight="700" letter-spacing="8">${data.kicker.toUpperCase()}</text>
  ${data.titleLines
    .map(
      (line, index) =>
        `<text x="1040" y="${590 + index * 120}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="118" font-weight="790" letter-spacing="-4">${line}</text>`,
    )
    .join("")}
  ${data.subtitleLines
    .map(
      (line, index) =>
        `<text x="1040" y="${820 + index * 54}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="36" font-weight="520">${line}</text>`,
    )
    .join("")}
  <text x="1040" y="1048" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="40" font-weight="700">${data.displayUrl}</text>
</svg>`;
}

function renderMobileWallpaper(data: Awaited<ReturnType<typeof buildHeroCompositionData>>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${mobileSize.width}" height="${mobileSize.height}" viewBox="0 0 ${mobileSize.width} ${mobileSize.height}">
  ${renderHeroDefs(data.brand, 44, "#160f23")}
  ${renderHeroBase(mobileSize.width, mobileSize.height, 0.3)}
  <path d="M 0 2230 C 140 2100, 260 2030, 426 2048 C 600 2068, 730 2000, 842 1868 C 966 1722, 1100 1682, 1290 1748 L 1290 2796 L 0 2796 Z" fill="rgba(6, 10, 14, 0.92)" />
  <path d="M 60 2230 L 240 1760 L 360 2230 Z" fill="rgba(10, 18, 22, 0.76)" />
  <path d="M 240 2230 L 468 1460 L 654 2230 Z" fill="rgba(10, 20, 24, 0.84)" />
  <path d="M 534 2230 L 790 1320 L 1008 2230 Z" fill="rgba(10, 20, 24, 0.88)" />
  <path d="M 884 2230 L 1110 1560 L 1260 2230 Z" fill="rgba(10, 18, 22, 0.8)" />

  <circle cx="646" cy="720" r="244" fill="rgba(7, 10, 14, 0.54)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="646" cy="720" r="194" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="12" />
  <circle cx="646" cy="720" r="150" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${data.logoDataUrl}" x="426" y="500" width="440" height="440" preserveAspectRatio="xMidYMid meet" />

  <text x="130" y="1160" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="32" font-weight="700" letter-spacing="8">${data.kicker.toUpperCase()}</text>
  ${data.titleLines
    .map(
      (line, index) =>
        `<text x="130" y="${1300 + index * 126}" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="122" font-weight="790" letter-spacing="-4">${line}</text>`,
    )
    .join("")}
  ${data.subtitleLines
    .map(
      (line, index) =>
        `<text x="130" y="${1598 + index * 58}" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="42" font-weight="520">${line}</text>`,
    )
    .join("")}
  <text x="130" y="1858" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="42" font-weight="700">${data.displayUrl}</text>
</svg>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const desktopSvg = renderDesktopWallpaper(data);
  const mobileSvg = renderMobileWallpaper(data);
  const desktopSvgPath = path.join(outputDir, `${args.outputName}-desktop.svg`);
  const mobileSvgPath = path.join(outputDir, `${args.outputName}-mobile.svg`);
  await fs.writeFile(desktopSvgPath, desktopSvg, "utf8");
  await fs.writeFile(mobileSvgPath, mobileSvg, "utf8");
  const desktopPng = await renderSvgToPng(
    desktopSvg,
    desktopSize,
    path.join(outputDir, `${args.outputName}-desktop.png`),
  );
  const mobilePng = await renderSvgToPng(
    mobileSvg,
    mobileSize,
    path.join(outputDir, `${args.outputName}-mobile.png`),
  );
  console.log(`Wallpaper desktop SVG written to ${path.relative(process.cwd(), desktopSvgPath)}`);
  console.log(`Wallpaper desktop PNG written to ${path.relative(process.cwd(), desktopPng)}`);
  console.log(`Wallpaper mobile SVG written to ${path.relative(process.cwd(), mobileSvgPath)}`);
  console.log(`Wallpaper mobile PNG written to ${path.relative(process.cwd(), mobilePng)}`);
  console.log(`Brand: ${data.brand.displayName}`);
  console.log(`Scene: ${data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
