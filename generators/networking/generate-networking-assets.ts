import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig } from "../../design-system/brand-config";
import { toDisplayUrl } from "../../design-system/metadata";
import {
  getNetworkingConfig,
  resolveNetworkingUrl,
} from "../../design-system/networking";
import {
  buildHeroCompositionData,
  escapeXml,
  renderHeroBase,
  renderHeroDefs,
  renderSvgToPng,
  repoRootDir,
} from "../social/hero-composition";
import { readAssetAsDataUrl } from "../shared/assets";
import {
  createBrandOutputName,
  parseCliFlag,
  resolveBrandId,
} from "../shared/cli";
import { generateQrPng, verifyQrImage } from "../shared/qr";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "networking");
const phoneImportDir = path.join(outputDir, "PHONE-IMPORT");

const conferenceCardSize = { width: 1290, height: 2796 };
const lockScreenSize = { width: 1320, height: 2868 };
const previewSize = { width: 1200, height: 630 };

type NetworkingAssetId = "conference-card" | "lock-screen" | "all";

type GeneratorArgs = {
  brandId: string;
  sceneId?: string;
  asset: NetworkingAssetId;
  qrTarget?: string;
};

type GeneratedAssets = {
  qrPngPath: string;
  conferenceCardPngPath?: string;
  conferenceCardPreviewPngPath?: string;
  lockScreenPngPath?: string;
  lockScreenMinimalPngPath?: string;
  lockScreenMinimalInstalledTunedPngPath?: string;
  reportJsonPath: string;
  reportTxtPath: string;
  notesPath: string;
  phoneImportReadmePath: string;
};

type VerificationRow = {
  asset: string;
  path: string;
  decodedUrl: string;
  matchesExpected: boolean;
};

type LockScreenLayoutMode = "default" | "minimal" | "minimal-installed-tuned";

type LockScreenLayout = {
  visualCenterX: number;
  clockSafeAreaBottom: number;
  logoTopY: number;
  logoCenterY: number;
  logoRadius: number;
  logoImageSize: number;
  labelY?: number;
  urlY: number;
  qrCardSize: number;
  qrCardY: number;
  qrCornerRadius: number;
  qrImageSize: number;
  qrInsetTop: number;
  qrBottomMargin: number;
  helperY?: number;
};

type ConferenceCardLayout = {
  visualCenterX: number;
  heroCardX: number;
  heroCardY: number;
  heroCardWidth: number;
  heroCardHeight: number;
  logoCenterY: number;
  logoRadiusOuter: number;
  logoImageSize: number;
  labelY: number;
  nameY: number;
  roleLineY: number;
  taglineY?: number;
  qrCardTopY: number;
  qrCardWidth: number;
  qrCardHeight: number;
  qrCardCornerRadius: number;
  qrInsetTop: number;
  qrSize: number;
  displayUrlY: number;
  helperY: number;
};

function parseArgs(argv: string[]): GeneratorArgs {
  return {
    brandId: resolveBrandId(argv),
    sceneId: parseCliFlag(argv, "--scene"),
    asset:
      (parseCliFlag(argv, "--asset", "all") as NetworkingAssetId) ?? "all",
    qrTarget: parseCliFlag(argv, "--qr-target"),
  };
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function relativePath(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

function currentDateTimeStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} EDT`;
}

function createLockScreenLayout(mode: LockScreenLayoutMode): LockScreenLayout {
  const canvasCenterX = Math.round(lockScreenSize.width / 2);
  const defaultOpticalCenterOffsetX = -34;
  const minimalOpticalCenterOffsetX = -72;
  const installedTunedOpticalCenterOffsetX = -164;
  const visualCenterX =
    canvasCenterX +
    (mode === "minimal-installed-tuned"
      ? installedTunedOpticalCenterOffsetX
      : mode === "minimal"
        ? minimalOpticalCenterOffsetX
        : defaultOpticalCenterOffsetX);

  if (mode === "default") {
    const clockSafeAreaBottom = 880;
    const logoTopY = 956;
    const logoRadius = 198;
    const logoCenterY = logoTopY + logoRadius;
    const qrCardSize = 676;
    const qrCardY = 1798;
    return {
      visualCenterX,
      clockSafeAreaBottom,
      logoTopY,
      logoCenterY,
      logoRadius,
      logoImageSize: 356,
      labelY: 1476,
      urlY: 1578,
      qrCardSize,
      qrCardY,
      qrCornerRadius: 44,
      qrImageSize: 494,
      qrInsetTop: 86,
      qrBottomMargin: lockScreenSize.height - (qrCardY + qrCardSize),
      helperY: 2600,
    };
  }

  const clockSafeAreaBottom = 920;
  const logoTopY = mode === "minimal-installed-tuned" ? 1214 : 1170;
  const logoRadius = mode === "minimal-installed-tuned" ? 142 : 150;
  const logoCenterY = logoTopY + logoRadius;
  const qrCardSize = mode === "minimal-installed-tuned" ? 620 : 596;
  const qrCardY = mode === "minimal-installed-tuned" ? 1804 : 1786;
  return {
    visualCenterX,
    clockSafeAreaBottom,
    logoTopY,
    logoCenterY,
    logoRadius,
    logoImageSize: mode === "minimal-installed-tuned" ? 236 : 256,
    urlY: mode === "minimal-installed-tuned" ? 1688 : 1638,
    qrCardSize,
    qrCardY,
    qrCornerRadius: 40,
    qrImageSize: mode === "minimal-installed-tuned" ? 468 : 454,
    qrInsetTop: mode === "minimal-installed-tuned" ? 76 : 63,
    qrBottomMargin: lockScreenSize.height - (qrCardY + qrCardSize),
  };
}

function createConferenceCardLayout(): ConferenceCardLayout {
  const canvasCenterX = Math.round(conferenceCardSize.width / 2);
  const opticalCenterOffsetX = -10;
  const visualCenterX = canvasCenterX + opticalCenterOffsetX;
  const heroCardWidth = 1150;
  const qrCardWidth = 960;
  const qrCardHeight = 1090;
  return {
    visualCenterX,
    heroCardX: visualCenterX - heroCardWidth / 2,
    heroCardY: 80,
    heroCardWidth,
    heroCardHeight: 2636,
    logoCenterY: 510,
    logoRadiusOuter: 224,
    logoImageSize: 416,
    labelY: 842,
    nameY: 980,
    roleLineY: 1062,
    taglineY: 1182,
    qrCardTopY: 1360,
    qrCardWidth,
    qrCardHeight,
    qrCardCornerRadius: 48,
    qrInsetTop: 140,
    qrSize: 500,
    displayUrlY: 2244,
    helperY: 2322,
  };
}

function buildConferenceCardSvg(args: {
  logoDataUrl: string;
  fontStack: string;
  brandPalette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"];
  qrDataUrl: string;
  name: string;
  roleLine: string;
  tagline?: string;
  displayUrl: string;
  label: string;
  brandName: string;
}) {
  const {
    logoDataUrl,
    fontStack,
    brandPalette,
    qrDataUrl,
    name,
    roleLine,
    tagline,
    displayUrl,
    label,
    brandName,
  } = args;
  const layout = createConferenceCardLayout();
  const logoImageX = layout.visualCenterX - layout.logoImageSize / 2;
  const logoImageY = layout.logoCenterY - layout.logoImageSize / 2;
  const qrCardX = layout.visualCenterX - layout.qrCardWidth / 2;
  const qrWhiteCardSize = 670;
  const qrWhiteCardX = layout.visualCenterX - qrWhiteCardSize / 2;
  const qrWhiteCardY = layout.qrCardTopY + layout.qrInsetTop;
  const qrImageX = layout.visualCenterX - layout.qrSize / 2;
  const qrImageY = qrWhiteCardY + (qrWhiteCardSize - layout.qrSize) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${conferenceCardSize.width}" height="${conferenceCardSize.height}" viewBox="0 0 ${conferenceCardSize.width} ${conferenceCardSize.height}">
  ${renderHeroDefs({ palette: brandPalette } as never, 44, "#110b18")}
  ${renderHeroBase(conferenceCardSize.width, conferenceCardSize.height, 0.28)}

  <rect x="${layout.heroCardX}" y="${layout.heroCardY}" width="${layout.heroCardWidth}" height="${layout.heroCardHeight}" rx="58" fill="rgba(8, 11, 15, 0.62)" stroke="${brandPalette.border}" stroke-width="3" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="${layout.logoRadiusOuter}" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.09)" stroke-width="2" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="178" fill="none" stroke="${brandPalette.teal}" stroke-opacity="0.26" stroke-width="12" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="138" fill="none" stroke="${brandPalette.amber}" stroke-opacity="0.18" stroke-width="8" />
  <image href="${logoDataUrl}" x="${logoImageX}" y="${logoImageY}" width="${layout.logoImageSize}" height="${layout.logoImageSize}" preserveAspectRatio="xMidYMid meet" />

  <text x="${layout.visualCenterX}" y="${layout.labelY}" text-anchor="middle" fill="${brandPalette.amber}" font-family="${fontStack}" font-size="34" font-weight="700" letter-spacing="7">${escapeXml(label.toUpperCase())}</text>
  <text x="${layout.visualCenterX}" y="${layout.nameY}" text-anchor="middle" fill="${brandPalette.text}" font-family="${fontStack}" font-size="100" font-weight="790" letter-spacing="-3">${escapeXml(name)}</text>
  <text x="${layout.visualCenterX}" y="${layout.roleLineY}" text-anchor="middle" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="42" font-weight="650">${escapeXml(roleLine)}</text>
  ${
    tagline
      ? `<text x="${layout.visualCenterX}" y="${layout.taglineY}" text-anchor="middle" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="34" font-weight="520">${escapeXml(tagline)}</text>`
      : ""
  }

  <rect x="${qrCardX}" y="${layout.qrCardTopY}" width="${layout.qrCardWidth}" height="${layout.qrCardHeight}" rx="${layout.qrCardCornerRadius}" fill="rgba(10, 14, 18, 0.82)" stroke="rgba(248,239,227,0.1)" stroke-width="2" />
  <rect x="${qrWhiteCardX}" y="${qrWhiteCardY}" width="${qrWhiteCardSize}" height="${qrWhiteCardSize}" rx="42" fill="#ffffff" />
  <image href="${qrDataUrl}" x="${qrImageX}" y="${qrImageY}" width="${layout.qrSize}" height="${layout.qrSize}" preserveAspectRatio="xMidYMid meet" />
  <text x="${layout.visualCenterX}" y="${layout.displayUrlY}" text-anchor="middle" fill="${brandPalette.teal}" font-family="${fontStack}" font-size="46" font-weight="780">${escapeXml(displayUrl)}</text>
  <text x="${layout.visualCenterX}" y="${layout.helperY}" text-anchor="middle" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="30" font-weight="520">Scan to open ${escapeXml(brandName)}</text>
</svg>`;
}

function buildConferencePreviewSvg(args: {
  logoDataUrl: string;
  fontStack: string;
  brandPalette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"];
  qrDataUrl: string;
  name: string;
  roleLine: string;
  tagline?: string;
  displayUrl: string;
  label: string;
}) {
  const {
    logoDataUrl,
    fontStack,
    brandPalette,
    qrDataUrl,
    name,
    roleLine,
    tagline,
    displayUrl,
    label,
  } = args;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${previewSize.width}" height="${previewSize.height}" viewBox="0 0 ${previewSize.width} ${previewSize.height}">
  ${renderHeroDefs({ palette: brandPalette } as never, 42, "#110b18")}
  ${renderHeroBase(previewSize.width, previewSize.height, 0.26)}
  <rect x="38" y="34" width="1124" height="562" rx="34" fill="rgba(8, 11, 15, 0.62)" stroke="${brandPalette.border}" stroke-width="2" />
  <circle cx="188" cy="164" r="92" fill="rgba(7, 10, 14, 0.78)" stroke="rgba(248,239,227,0.09)" stroke-width="2" />
  <image href="${logoDataUrl}" x="116" y="92" width="144" height="144" preserveAspectRatio="xMidYMid meet" />
  <text x="322" y="130" fill="${brandPalette.amber}" font-family="${fontStack}" font-size="20" font-weight="700" letter-spacing="5">${escapeXml(label.toUpperCase())}</text>
  <text x="322" y="212" fill="${brandPalette.text}" font-family="${fontStack}" font-size="58" font-weight="790" letter-spacing="-2">${escapeXml(name)}</text>
  <text x="322" y="268" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="26" font-weight="650">${escapeXml(roleLine)}</text>
  ${
    tagline
      ? `<text x="322" y="334" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="22" font-weight="520">${escapeXml(tagline)}</text>`
      : ""
  }
  <text x="322" y="430" fill="${brandPalette.teal}" font-family="${fontStack}" font-size="28" font-weight="760">${escapeXml(displayUrl)}</text>
  <rect x="832" y="110" width="250" height="250" rx="28" fill="#ffffff" />
  <image href="${qrDataUrl}" x="867" y="145" width="180" height="180" preserveAspectRatio="xMidYMid meet" />
  <text x="957" y="404" text-anchor="middle" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="18" font-weight="520">Scan to open</text>
</svg>`;
}

function buildLockScreenSvg(args: {
  logoDataUrl: string;
  fontStack: string;
  brandPalette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"];
  qrDataUrl: string;
  displayUrl: string;
  label: string;
}) {
  const { logoDataUrl, fontStack, brandPalette, qrDataUrl, displayUrl, label } =
    args;
  const layout = createLockScreenLayout("default");
  const logoImageX = layout.visualCenterX - layout.logoImageSize / 2;
  const qrCardX = layout.visualCenterX - layout.qrCardSize / 2;
  const qrImageX = layout.visualCenterX - layout.qrImageSize / 2;
  const qrImageY = layout.qrCardY + layout.qrInsetTop;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lockScreenSize.width}" height="${lockScreenSize.height}" viewBox="0 0 ${lockScreenSize.width} ${lockScreenSize.height}">
  ${renderHeroDefs({ palette: brandPalette } as never, 44, "#110b18")}
  ${renderHeroBase(lockScreenSize.width, lockScreenSize.height, 0.24)}
  <path d="M 0 2348 C 126 2212, 306 2144, 470 2176 C 650 2210, 822 2130, 970 1968 C 1098 1824, 1212 1786, 1320 1838 L 1320 2868 L 0 2868 Z" fill="rgba(6, 10, 14, 0.94)" />

  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="${layout.logoRadius}" fill="rgba(7, 10, 14, 0.74)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="156" fill="none" stroke="${brandPalette.teal}" stroke-opacity="0.24" stroke-width="10" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="120" fill="none" stroke="${brandPalette.amber}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${logoDataUrl}" x="${logoImageX}" y="${layout.logoTopY}" width="${layout.logoImageSize}" height="${layout.logoImageSize}" preserveAspectRatio="xMidYMid meet" />

  <text x="${layout.visualCenterX}" y="${layout.labelY}" text-anchor="middle" fill="${brandPalette.amber}" font-family="${fontStack}" font-size="34" font-weight="700" letter-spacing="7">${escapeXml(label.toUpperCase())}</text>
  <text x="${layout.visualCenterX}" y="${layout.urlY}" text-anchor="middle" fill="${brandPalette.text}" font-family="${fontStack}" font-size="56" font-weight="760">${escapeXml(displayUrl)}</text>

  <rect x="${qrCardX}" y="${layout.qrCardY}" width="${layout.qrCardSize}" height="${layout.qrCardSize}" rx="${layout.qrCornerRadius}" fill="#ffffff" />
  <image href="${qrDataUrl}" x="${qrImageX}" y="${qrImageY}" width="${layout.qrImageSize}" height="${layout.qrImageSize}" preserveAspectRatio="xMidYMid meet" />
  <text x="${layout.visualCenterX}" y="${layout.helperY}" text-anchor="middle" fill="${brandPalette.textMuted}" font-family="${fontStack}" font-size="30" font-weight="520">Scan from lock screen</text>
</svg>`;
}

function buildMinimalLockScreenSvg(args: {
  logoDataUrl: string;
  fontStack: string;
  brandPalette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"];
  qrDataUrl: string;
  displayUrl: string;
  mode?: Extract<LockScreenLayoutMode, "minimal" | "minimal-installed-tuned">;
}) {
  const {
    logoDataUrl,
    fontStack,
    brandPalette,
    qrDataUrl,
    displayUrl,
    mode = "minimal",
  } = args;
  const layout = createLockScreenLayout(mode);
  const logoImageX = layout.visualCenterX - layout.logoImageSize / 2;
  const qrCardX = layout.visualCenterX - layout.qrCardSize / 2;
  const qrImageX = layout.visualCenterX - layout.qrImageSize / 2;
  const qrImageY = layout.qrCardY + layout.qrInsetTop;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${lockScreenSize.width}" height="${lockScreenSize.height}" viewBox="0 0 ${lockScreenSize.width} ${lockScreenSize.height}">
  ${renderHeroDefs({ palette: brandPalette } as never, 44, "#110b18")}
  ${renderHeroBase(lockScreenSize.width, lockScreenSize.height, 0.2)}

  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="${layout.logoRadius}" fill="rgba(7, 10, 14, 0.58)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <circle cx="${layout.visualCenterX}" cy="${layout.logoCenterY}" r="116" fill="none" stroke="${brandPalette.teal}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${logoDataUrl}" x="${logoImageX}" y="${layout.logoTopY}" width="${layout.logoImageSize}" height="${layout.logoImageSize}" preserveAspectRatio="xMidYMid meet" />

  <text x="${layout.visualCenterX}" y="${layout.urlY}" text-anchor="middle" fill="${brandPalette.text}" font-family="${fontStack}" font-size="56" font-weight="740">${escapeXml(displayUrl)}</text>

  <rect x="${qrCardX}" y="${layout.qrCardY}" width="${layout.qrCardSize}" height="${layout.qrCardSize}" rx="${layout.qrCornerRadius}" fill="#ffffff" />
  <image href="${qrDataUrl}" x="${qrImageX}" y="${qrImageY}" width="${layout.qrImageSize}" height="${layout.qrImageSize}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

async function writeAssetFiles(fileBaseName: string, svg: string, size: { width: number; height: number }) {
  const svgPath = path.join(outputDir, `${fileBaseName}.svg`);
  const pngPath = path.join(outputDir, `${fileBaseName}.png`);
  await fs.writeFile(svgPath, svg, "utf8");
  await renderSvgToPng(svg, size, pngPath);
  return { svgPath, pngPath };
}

async function writePhoneImportReadme(args: {
  conferenceCardFileName: string;
  lockScreenFileName: string;
  minimalLockScreenFileName: string;
  minimalInstalledTunedLockScreenFileName: string;
  qrFileName: string;
}) {
  const readmePath = path.join(phoneImportDir, "README-FIRST.md");
  await fs.writeFile(
    readmePath,
    [
      "# PHONE-IMPORT",
      "",
      "Use these files on iPhone 17 for the Friday AI meetup.",
      "",
      "## Which file is which",
      "",
      `- Conference card: \`${args.conferenceCardFileName}\``,
      `- Lock screen: \`${args.lockScreenFileName}\``,
      `- Minimal lock screen: \`${args.minimalLockScreenFileName}\``,
      `- Minimal installed-tuned lock screen: \`${args.minimalInstalledTunedLockScreenFileName}\``,
      `- Raw QR: \`${args.qrFileName}\``,
      "",
      "## Fast wallpaper cycle",
      "",
      "Use `WALLPAPER-CYCLE/` when you are iterating on wallpaper proofing.",
      "",
      `- Start with \`2-${args.minimalInstalledTunedLockScreenFileName}\` for on-device wallpaper tests.`,
      `- Use \`1-${args.minimalLockScreenFileName}\` when you want the simpler baseline.`,
      "- AirDrop only one wallpaper candidate at a time instead of the whole PHONE-IMPORT folder.",
      "- After the image lands in Files on iPhone, open it once and tap Share -> Save Image.",
      "- In Photos, keep a small album like `Wallpaper Tests` so the latest pass is easy to find.",
      "- Clean up old Files copies later in one batch instead of during every iteration.",
      "",
      "## AirDrop to iPhone",
      "",
      "1. Select the files in this folder on your Mac.",
      "2. Right-click and choose Share -> AirDrop, or drag them onto your iPhone in AirDrop.",
      "3. Accept the transfer on iPhone.",
      "",
      "## Save to Photos",
      "",
      "1. Open each transferred image on iPhone.",
      "2. Tap Share.",
      "3. Tap Save Image if it did not already land in Photos.",
      "",
      "## Set the lock screen",
      "",
      "1. Open Photos on iPhone 17.",
      `2. Choose \`${args.lockScreenFileName}\`, \`${args.minimalLockScreenFileName}\`, or \`${args.minimalInstalledTunedLockScreenFileName}\`.`,
      "3. Tap Share -> Use as Wallpaper.",
      "4. Adjust the crop carefully.",
      "5. Make sure the QR stays clear of time, widgets, and bottom controls.",
      "",
      "## Test the QR",
      "",
      "1. Open the conference card or lock screen full-screen.",
      "2. Use another phone to scan the QR.",
      "3. Confirm it opens exactly `https://arcadeghosts.org`.",
      "4. Test at normal brightness and dimmer brightness.",
      "",
      "## Meetup reminder",
      "",
      "Favorite the conference card in Photos.",
      "At the meetup, open it full-screen when someone asks what you do.",
      "",
      "The QR should open exactly `https://arcadeghosts.org`.",
    ].join("\n"),
    "utf8",
  );
  return readmePath;
}

async function buildPhoneImportFolder(files: {
  brandId: string;
  conferenceCardPngPath?: string;
  lockScreenPngPath?: string;
  lockScreenMinimalPngPath?: string;
  lockScreenMinimalInstalledTunedPngPath?: string;
  qrPngPath: string;
}) {
  const existingConferenceCardPngPath =
    files.conferenceCardPngPath ??
    path.join(
      outputDir,
      `${createBrandOutputName(files.brandId, "conference-card", process.env.BRAND_THEME)}.png`,
    );
  const existingLockScreenPngPath =
    files.lockScreenPngPath ??
    path.join(
      outputDir,
      `${createBrandOutputName(files.brandId, "lock-screen", process.env.BRAND_THEME)}.png`,
    );
  const existingMinimalLockScreenPngPath =
    files.lockScreenMinimalPngPath ??
    path.join(
      outputDir,
      `${createBrandOutputName(files.brandId, "lock-screen-minimal", process.env.BRAND_THEME)}.png`,
    );
  const existingMinimalInstalledTunedLockScreenPngPath =
    files.lockScreenMinimalInstalledTunedPngPath ??
    path.join(
      outputDir,
      `${createBrandOutputName(
        files.brandId,
        "lock-screen-minimal-installed-tuned",
        process.env.BRAND_THEME,
      )}.png`,
    );

  await fs.rm(phoneImportDir, { recursive: true, force: true });
  await fs.mkdir(phoneImportDir, { recursive: true });
  const wallpaperCycleDir = path.join(phoneImportDir, "WALLPAPER-CYCLE");
  await fs.mkdir(wallpaperCycleDir, { recursive: true });

  if (await pathExists(existingConferenceCardPngPath)) {
    await fs.copyFile(
      existingConferenceCardPngPath,
      path.join(phoneImportDir, path.basename(existingConferenceCardPngPath)),
    );
  }
  if (await pathExists(existingLockScreenPngPath)) {
    await fs.copyFile(
      existingLockScreenPngPath,
      path.join(phoneImportDir, path.basename(existingLockScreenPngPath)),
    );
  }
  if (await pathExists(existingMinimalLockScreenPngPath)) {
    await fs.copyFile(
      existingMinimalLockScreenPngPath,
      path.join(phoneImportDir, path.basename(existingMinimalLockScreenPngPath)),
    );
    await fs.copyFile(
      existingMinimalLockScreenPngPath,
      path.join(
        wallpaperCycleDir,
        `1-${path.basename(existingMinimalLockScreenPngPath)}`,
      ),
    );
  }
  if (await pathExists(existingMinimalInstalledTunedLockScreenPngPath)) {
    await fs.copyFile(
      existingMinimalInstalledTunedLockScreenPngPath,
      path.join(
        phoneImportDir,
        path.basename(existingMinimalInstalledTunedLockScreenPngPath),
      ),
    );
    await fs.copyFile(
      existingMinimalInstalledTunedLockScreenPngPath,
      path.join(
        wallpaperCycleDir,
        `2-${path.basename(existingMinimalInstalledTunedLockScreenPngPath)}`,
      ),
    );
  }
  await fs.copyFile(files.qrPngPath, path.join(phoneImportDir, path.basename(files.qrPngPath)));

  return writePhoneImportReadme({
    conferenceCardFileName: path.basename(existingConferenceCardPngPath),
    lockScreenFileName: path.basename(existingLockScreenPngPath),
    minimalLockScreenFileName: path.basename(existingMinimalLockScreenPngPath),
    minimalInstalledTunedLockScreenFileName: path.basename(
      existingMinimalInstalledTunedLockScreenPngPath,
    ),
    qrFileName: path.basename(files.qrPngPath),
  });
}

async function generateAssets(args: GeneratorArgs): Promise<GeneratedAssets> {
  const brand = getBrandConfig(args.brandId);
  const networking = getNetworkingConfig(args.brandId);
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const qrTarget =
    args.qrTarget ??
    resolveNetworkingUrl(brand.metadata, networking.qrLinkKey ?? "website");
  const displayUrl = networking.displayUrl ?? toDisplayUrl(qrTarget);
  const qrPngPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "networking-qr", process.env.BRAND_THEME)}.png`,
  );

  await generateQrPng(qrTarget, qrPngPath, {
    size: 1024,
    margin: 96,
    correctionLevel: "H",
  });

  const qrDataUrl = await readAssetAsDataUrl(qrPngPath);

  const baseRenderArgs = {
    logoDataUrl: data.logoDataUrl,
    fontStack: data.fontStack,
    brandPalette: data.brand.palette,
    qrDataUrl: escapeXml(qrDataUrl),
    name: brand.metadata.contactName,
    roleLine: networking.roleLine,
    tagline: networking.tagline,
    displayUrl,
    label: networking.conferenceCardLabel ?? brand.displayName,
    brandName: brand.displayName,
  };

  let conferenceCardPngPath: string | undefined;
  let conferenceCardPreviewPngPath: string | undefined;
  let lockScreenPngPath: string | undefined;
  let lockScreenMinimalPngPath: string | undefined;
  let lockScreenMinimalInstalledTunedPngPath: string | undefined;

  if (args.asset === "conference-card" || args.asset === "all") {
    const conferenceCard = await writeAssetFiles(
      createBrandOutputName(args.brandId, "conference-card", process.env.BRAND_THEME),
      buildConferenceCardSvg(baseRenderArgs),
      conferenceCardSize,
    );
    conferenceCardPngPath = conferenceCard.pngPath;

    const preview = await writeAssetFiles(
      createBrandOutputName(args.brandId, "conference-card-preview", process.env.BRAND_THEME),
      buildConferencePreviewSvg(baseRenderArgs),
      previewSize,
    );
    conferenceCardPreviewPngPath = preview.pngPath;
  }

  if (args.asset === "lock-screen" || args.asset === "all") {
    const lockScreen = await writeAssetFiles(
      createBrandOutputName(args.brandId, "lock-screen", process.env.BRAND_THEME),
      buildLockScreenSvg({
        logoDataUrl: data.logoDataUrl,
        fontStack: data.fontStack,
        brandPalette: data.brand.palette,
        qrDataUrl: escapeXml(qrDataUrl),
        displayUrl,
        label: networking.lockScreenLabel ?? brand.displayName,
      }),
      lockScreenSize,
    );
    lockScreenPngPath = lockScreen.pngPath;

    const minimalLockScreen = await writeAssetFiles(
      createBrandOutputName(args.brandId, "lock-screen-minimal", process.env.BRAND_THEME),
      buildMinimalLockScreenSvg({
        logoDataUrl: data.logoDataUrl,
        fontStack: data.fontStack,
        brandPalette: data.brand.palette,
        qrDataUrl: escapeXml(qrDataUrl),
        displayUrl,
      }),
      lockScreenSize,
    );
    lockScreenMinimalPngPath = minimalLockScreen.pngPath;

    const minimalInstalledTunedLockScreen = await writeAssetFiles(
      createBrandOutputName(
        args.brandId,
        "lock-screen-minimal-installed-tuned",
        process.env.BRAND_THEME,
      ),
      buildMinimalLockScreenSvg({
        logoDataUrl: data.logoDataUrl,
        fontStack: data.fontStack,
        brandPalette: data.brand.palette,
        qrDataUrl: escapeXml(qrDataUrl),
        displayUrl,
        mode: "minimal-installed-tuned",
      }),
      lockScreenSize,
    );
    lockScreenMinimalInstalledTunedPngPath =
      minimalInstalledTunedLockScreen.pngPath;
  }

  const notesPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "lock-screen-notes", process.env.BRAND_THEME)}.txt`,
  );
  await fs.writeFile(
    notesPath,
    [
      "Lock screen notes",
      "",
      ...networking.lockScreenSafeAreaNotes,
      "",
      "Manual setup:",
      "1. Save the generated lock screen PNG to Photos.",
      "2. Open Photos, tap Share, then tap Use as Wallpaper.",
      "3. Adjust crop if needed and confirm the QR stays above the bottom affordances.",
    ].join("\n"),
    "utf8",
  );

  const verificationRows: VerificationRow[] = [];
  for (const [assetLabel, assetPath] of [
    ["Raw QR", qrPngPath],
    ["Conference card", conferenceCardPngPath],
    ["Conference preview", conferenceCardPreviewPngPath],
    ["Lock screen", lockScreenPngPath],
    ["Minimal lock screen", lockScreenMinimalPngPath],
    ["Minimal installed-tuned lock screen", lockScreenMinimalInstalledTunedPngPath],
  ] as const) {
    if (!assetPath) {
      continue;
    }
    const result = await verifyQrImage(assetPath, qrTarget);
    verificationRows.push({
      asset: assetLabel,
      path: relativePath(assetPath),
      decodedUrl: result.decodedUrl,
      matchesExpected: result.matchesExpected,
    });
  }

  const failedVerification = verificationRows.find((row) => !row.matchesExpected);
  if (failedVerification) {
    throw new Error(
      `QR verification failed for ${failedVerification.asset}: expected ${qrTarget}, decoded ${failedVerification.decodedUrl}`,
    );
  }

  const report = {
    generatedAt: currentDateTimeStamp(),
    brandId: args.brandId,
    assetSelection: args.asset,
    qrTargetUrl: qrTarget,
    qrImagePath: relativePath(qrPngPath),
    verificationStatus: "pass",
    generatedAssets: [
      relativePath(qrPngPath),
      conferenceCardPngPath ? relativePath(conferenceCardPngPath) : null,
      conferenceCardPreviewPngPath ? relativePath(conferenceCardPreviewPngPath) : null,
      lockScreenPngPath ? relativePath(lockScreenPngPath) : null,
      lockScreenMinimalPngPath ? relativePath(lockScreenMinimalPngPath) : null,
      lockScreenMinimalInstalledTunedPngPath
        ? relativePath(lockScreenMinimalInstalledTunedPngPath)
        : null,
      relativePath(notesPath),
    ].filter(Boolean),
    verifications: verificationRows,
  };

  const phoneImportReadmePath = await buildPhoneImportFolder({
    brandId: args.brandId,
    conferenceCardPngPath,
    lockScreenPngPath,
    lockScreenMinimalPngPath,
    lockScreenMinimalInstalledTunedPngPath,
    qrPngPath,
  });

  const reportJsonPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "networking-report", process.env.BRAND_THEME)}.json`,
  );
  const reportTxtPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "networking-report", process.env.BRAND_THEME)}.txt`,
  );
  await fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await fs.writeFile(
    reportTxtPath,
    [
      `Generated: ${report.generatedAt}`,
      `Brand: ${brand.displayName}`,
      `QR target URL: ${qrTarget}`,
      `QR image path: ${relativePath(qrPngPath)}`,
      "Verification status: pass",
      "",
      "Verified assets:",
      ...verificationRows.map(
        (row) =>
          `- ${row.asset}: ${row.path} -> ${row.decodedUrl} [${row.matchesExpected ? "pass" : "fail"}]`,
      ),
      "",
      "Generated asset paths:",
      ...report.generatedAssets.map((assetPath) => `- ${assetPath}`),
    ].join("\n"),
    "utf8",
  );

  return {
    qrPngPath,
    conferenceCardPngPath,
    conferenceCardPreviewPngPath,
    lockScreenPngPath,
    lockScreenMinimalPngPath,
    lockScreenMinimalInstalledTunedPngPath,
    reportJsonPath,
    reportTxtPath,
    notesPath,
    phoneImportReadmePath,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const assets = await generateAssets(args);

  console.log(`Networking QR PNG written to ${relativePath(assets.qrPngPath)}`);
  if (assets.conferenceCardPngPath) {
    console.log(`Conference card PNG written to ${relativePath(assets.conferenceCardPngPath)}`);
  }
  if (assets.conferenceCardPreviewPngPath) {
    console.log(`Conference card preview PNG written to ${relativePath(assets.conferenceCardPreviewPngPath)}`);
  }
  if (assets.lockScreenPngPath) {
    console.log(`Lock screen PNG written to ${relativePath(assets.lockScreenPngPath)}`);
  }
  if (assets.lockScreenMinimalPngPath) {
    console.log(`Minimal lock screen PNG written to ${relativePath(assets.lockScreenMinimalPngPath)}`);
  }
  if (assets.lockScreenMinimalInstalledTunedPngPath) {
    console.log(
      `Minimal installed-tuned lock screen PNG written to ${relativePath(assets.lockScreenMinimalInstalledTunedPngPath)}`,
    );
  }
  console.log(`Networking report written to ${relativePath(assets.reportTxtPath)}`);
  console.log(`Lock screen notes written to ${relativePath(assets.notesPath)}`);
  console.log(`Phone import README written to ${relativePath(assets.phoneImportReadmePath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
