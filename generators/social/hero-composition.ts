import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import {
  getBrandConfig,
  getBrandPalette,
  getBrandThemeVariant,
  type BrandConfig,
} from "../../design-system/brand-config";
import type { HeroSceneConfig } from "../../design-system/scenes";
import {
  getRequestedThemeVariantId,
  type BrandThemeVariant,
} from "../../design-system/themes";
import { readAssetAsDataUrl } from "../shared/assets";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const repoRootDir = path.resolve(currentDir, "../..");
export const outputDir = path.join(repoRootDir, "generators", "outputs", "social");
const brandsRootDir = path.join(repoRootDir, "brands");

export type HeroCompositionOverrides = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  subline?: string;
};

export type HeroCompositionData = {
  brand: BrandConfig;
  scene: HeroSceneConfig;
  themeVariant: BrandThemeVariant;
  fontStack: string;
  logoDataUrl: string;
  titleLines: string[];
  subtitleLines: string[];
  headlineLines: string[];
  sublineLines: string[];
  kicker: string;
  displayUrl: string;
  logoWidth: number;
  clearSpace: number;
};

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function wrapText(text: string, lineLength: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > lineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveLogoDataUrl(brandId: string, fallbackAsset: string) {
  const primaryPath = path.join(brandsRootDir, brandId, "assets", "logo.png");
  const fallbackPath = path.join(repoRootDir, fallbackAsset);
  const logoPath = (await fileExists(primaryPath)) ? primaryPath : fallbackPath;
  return readAssetAsDataUrl(logoPath);
}

export function getSceneForBrand(
  brandId: string,
  sceneId?: string,
  themeId?: string,
) {
  const brand = getBrandConfig(brandId);
  const themeVariant = getBrandThemeVariant(
    brandId,
    getRequestedThemeVariantId(themeId),
  );
  const themedBrand: BrandConfig = {
    ...brand,
    palette: getBrandPalette(brandId, themeVariant.id),
  };
  const scenes = [brand.scenes.defaultHero, brand.scenes.workWithMeHero].filter(
    Boolean,
  ) as HeroSceneConfig[];

  if (!sceneId) {
    return { brand: themedBrand, scene: brand.scenes.defaultHero, themeVariant };
  }

  const matched = scenes.find((scene) => scene.id === sceneId);
  return {
    brand: themedBrand,
    scene: matched ?? brand.scenes.defaultHero,
    themeVariant,
  };
}

export async function buildHeroCompositionData(
  brandId: string,
  sceneId?: string,
  overrides: HeroCompositionOverrides = {},
  options: { themeId?: string } = {},
) {
  const { brand, scene, themeVariant } = getSceneForBrand(
    brandId,
    sceneId,
    options.themeId,
  );
  const mergedScene: HeroSceneConfig = {
    ...scene,
    kicker: overrides.kicker ?? scene.kicker,
    title: overrides.title ?? scene.title,
    subtitle: overrides.subtitle ?? scene.subtitle,
    headline: overrides.headline ?? scene.headline ?? scene.title,
    subline: overrides.subline ?? scene.subline ?? scene.subtitle,
  };

  const logoDataUrl = await resolveLogoDataUrl(
    brand.id,
    brand.logo.fallbackAsset,
  );

  const titleLines = wrapText(mergedScene.title, 13).slice(0, 2).map(escapeXml);
  const subtitleLines = wrapText(mergedScene.subtitle, 42)
    .slice(0, 3)
    .map(escapeXml);
  const headlineLines = wrapText(mergedScene.headline ?? mergedScene.title, 34)
    .slice(0, 2)
    .map(escapeXml);
  const sublineLines = wrapText(mergedScene.subline ?? mergedScene.subtitle, 54)
    .slice(0, 2)
    .map(escapeXml);

  return {
    brand,
    scene: mergedScene,
    themeVariant,
    fontStack: escapeXml(brand.typography.fontStack),
    logoDataUrl: escapeXml(logoDataUrl),
    titleLines,
    subtitleLines,
    headlineLines,
    sublineLines,
    kicker: escapeXml(mergedScene.kicker),
    displayUrl: escapeXml(
      (mergedScene.canonicalUrl ?? brand.metadata.homeUrl).replace(
        /^https:\/\//,
        "",
      ),
    ),
    logoWidth: brand.logo.sizing.heroDigitalWidth,
    clearSpace: Math.max(
      Math.round(
        brand.logo.sizing.heroDigitalWidth *
          brand.logo.clearSpace.ratioToLogoWidth,
      ),
      brand.logo.clearSpace.minimumPixels,
    ),
  } satisfies HeroCompositionData;
}

export function renderHeroDefs(
  brand: BrandConfig,
  gridSize: number,
  backgroundEnd = "#120d19",
) {
  return `<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${brand.palette.backgroundDeep}" />
      <stop offset="52%" stop-color="${brand.palette.background}" />
      <stop offset="100%" stop-color="${backgroundEnd}" />
    </linearGradient>
    <radialGradient id="tealGlow" cx="22%" cy="24%" r="42%">
      <stop offset="0%" stop-color="${brand.palette.teal}" stop-opacity="0.34" />
      <stop offset="100%" stop-color="${brand.palette.teal}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="pinkGlow" cx="82%" cy="20%" r="38%">
      <stop offset="0%" stop-color="${brand.palette.pink}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${brand.palette.pink}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="amberGlow" cx="72%" cy="86%" r="34%">
      <stop offset="0%" stop-color="${brand.palette.amber}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${brand.palette.amber}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
      <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="rgba(248,239,227,0.06)" stroke-width="1" />
    </pattern>
  </defs>`;
}

export function renderHeroBase(width: number, height: number, gridOpacity = 0.42) {
  return `
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#tealGlow)" />
  <rect width="${width}" height="${height}" fill="url(#pinkGlow)" />
  <rect width="${width}" height="${height}" fill="url(#amberGlow)" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grid)" opacity="${gridOpacity}" />`;
}

export async function renderSvgToPng(
  svg: string,
  size: { width: number; height: number },
  pngPath: string,
) {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: size,
      deviceScaleFactor: 1,
    });

    await page.setContent(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: ${size.width}px;
              height: ${size.height}px;
              overflow: hidden;
              background: #07080b;
            }

            svg {
              display: block;
              width: ${size.width}px;
              height: ${size.height}px;
            }
          </style>
        </head>
        <body>${svg}</body>
      </html>`,
      { waitUntil: "load" },
    );

    await page.screenshot({
      path: pngPath,
      type: "png",
    });

    await page.close();
  } finally {
    await browser.close();
  }

  return pngPath;
}
