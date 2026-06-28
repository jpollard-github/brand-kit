import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  boxStyle,
  CARD_HEIGHT,
  CARD_WIDTH,
  cardBoxes,
  exportSize,
  fontStack,
  logo,
  palette,
  qr,
  radius,
  safeAreaStyle,
  shadows,
  typography,
  type CardId,
} from "./theme";
import {
  getBrandConfig,
  type BrandConfig,
} from "../../design-system/brand-config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const sharedDir = path.join(rootDir, "shared-assets");
const generatorDir = path.join(rootDir, "generator");
const brandsRootDir = path.resolve(currentDir, "../../brands");

type CardExport = {
  id: CardId;
  title: string;
  exportPath: string;
  html: string;
};

type ExportOptions = {
  guides: boolean;
  pdf: boolean;
  brandId: string;
  outputType: string;
};

type CopySet = {
  workFront: string[];
  workBack: string[];
  arcadeFront: string[];
  arcadeBack: string[];
};

type AssetBundle = {
  logoDataUrl: string;
  workQrDataUrl: string;
  arcadeQrDataUrl: string;
};

type ManifestEntry = {
  cardId: CardId;
  outputPath: string;
  width: number;
  height: number;
  hasGuides: boolean;
  pdfGenerated: boolean;
  timestamp: string;
};

async function readLines(filePath: string) {
  const contents = await fs.readFile(filePath, "utf8");
  return contents
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(
      (line, index, lines) => !(line === "" && index === lines.length - 1),
    );
}

function withoutQrLabel(lines: string[]) {
  return lines.filter((line) => line.trim().toLowerCase() !== "qr code");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toParagraphs(lines: string[], className = "") {
  return lines
    .filter((line) => line.trim().length > 0)
    .map(
      (line) =>
        `<div${className ? ` class="${className}"` : ""}>${escapeHtml(line)}</div>`,
    )
    .join("");
}

function splitWorkBack(lines: string[]) {
  const cleaned = withoutQrLabel(lines);
  const blankIndexes = cleaned
    .map((line, index) => ({ line, index }))
    .filter((entry) => entry.line.trim() === "")
    .map((entry) => entry.index);

  const firstBlank = blankIndexes[0] ?? 2;
  const secondBlank = blankIndexes[1] ?? cleaned.length;

  return {
    url: cleaned[0] ?? "",
    email: cleaned[1] ?? "",
    intro: cleaned[firstBlank + 1] ?? "",
    bullets: cleaned.slice(firstBlank + 2, secondBlank),
  };
}

function splitArcadeBack(lines: string[]) {
  const cleaned = withoutQrLabel(lines).filter((line) => line.trim() !== "");

  return {
    url: cleaned[0] ?? "",
    descriptor: cleaned.slice(1),
  };
}

async function readAssetAsDataUrl(filePath: string) {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === ".svg"
      ? "image/svg+xml"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";

  return `data:${mimeType};base64,${data.toString("base64")}`;
}

async function requireAsset(filePath: string, label: string) {
  try {
    await fs.access(filePath);
  } catch {
    console.warn(`Warning: missing required asset "${label}" at ${filePath}`);
    throw new Error(`Missing required asset: ${label}`);
  }
}

function cssNumber(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function baseCss() {
  return `
    :root {
      color-scheme: dark;
      --bg: ${palette.background};
      --bg-soft: ${palette.backgroundSoft};
      --bg-deep: ${palette.backgroundDeep};
      --text: ${palette.text};
      --muted: ${palette.textMuted};
      --amber: ${palette.amber};
      --teal: ${palette.teal};
      --cyan: ${palette.cyan};
      --pink: ${palette.pink};
      --violet: ${palette.violet};
      --border: ${palette.border};
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: var(--bg-deep);
      font-family: ${fontStack};
      color: var(--text);
    }

    body.preview {
      padding: 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(555px, 1fr));
      gap: 28px;
    }

    .preview-frame {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .preview-label {
      font-size: ${cssNumber(typography.previewLabel.fontSize)};
      letter-spacing: ${typography.previewLabel.letterSpacing};
      text-transform: uppercase;
      color: var(--muted);
    }

    body.export {
      width: ${exportSize.width}px;
      height: ${exportSize.height}px;
      overflow: hidden;
    }

    .card {
      position: relative;
      width: ${exportSize.width}px;
      height: ${exportSize.height}px;
      border-radius: ${radius.card}px;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 18%, rgba(100, 213, 207, 0.16), transparent 30%),
        radial-gradient(circle at 85% 18%, rgba(240, 191, 108, 0.14), transparent 28%),
        linear-gradient(145deg, #0b0f14 0%, #11161c 58%, #090d12 100%);
      box-shadow: ${shadows.card};
    }

    .card::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(255,255,255,0.045), transparent 18%, transparent 82%, rgba(255,255,255,0.03)),
        linear-gradient(180deg, rgba(255,255,255,0.02), transparent 28%, transparent 76%, rgba(255,255,255,0.02));
      pointer-events: none;
    }

    .safe-area {
      position: absolute;
      border: 1px dashed rgba(255,255,255,0.08);
      border-radius: ${radius.safeArea}px;
      pointer-events: none;
    }

    body.export .safe-area {
      border-color: transparent;
    }

    body.guides-on .safe-area {
      border-color: rgba(255,255,255,0.16);
    }

    .trim-area {
      position: absolute;
      border: 1px solid rgba(92, 215, 255, 0.16);
      border-radius: ${radius.trimArea}px;
      pointer-events: none;
      opacity: 0;
    }

    .bleed-label,
    .safe-label {
      position: absolute;
      padding: 5px 8px;
      border-radius: ${radius.pill}px;
      font-size: ${cssNumber(typography.guideLabel.fontSize)};
      letter-spacing: ${typography.guideLabel.letterSpacing};
      text-transform: uppercase;
      font-weight: ${typography.guideLabel.fontWeight};
      pointer-events: none;
      opacity: 0;
    }

    .bleed-label {
      top: 14px;
      left: 18px;
      color: rgba(92, 215, 255, 0.88);
      background: rgba(8, 10, 12, 0.75);
      border: 1px solid rgba(92, 215, 255, 0.22);
    }

    .safe-label {
      right: 18px;
      bottom: 16px;
      color: rgba(240, 191, 108, 0.92);
      background: rgba(8, 10, 12, 0.75);
      border: 1px solid rgba(240, 191, 108, 0.25);
    }

    .trim-corners {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }

    .trim-corners span {
      position: absolute;
      width: 22px;
      height: 22px;
      border-color: rgba(92, 215, 255, 0.4);
      border-style: solid;
    }

    .trim-corners .tl { left: 29px; top: 29px; border-width: 2px 0 0 2px; border-top-left-radius: 6px; }
    .trim-corners .tr { right: 29px; top: 29px; border-width: 2px 2px 0 0; border-top-right-radius: 6px; }
    .trim-corners .bl { left: 29px; bottom: 29px; border-width: 0 0 2px 2px; border-bottom-left-radius: 6px; }
    .trim-corners .br { right: 29px; bottom: 29px; border-width: 0 2px 2px 0; border-bottom-right-radius: 6px; }

    body.guides-on .trim-area,
    body.guides-on .bleed-label,
    body.guides-on .safe-label,
    body.guides-on .trim-corners {
      opacity: 1;
    }

    .box {
      position: absolute;
      z-index: 2;
    }

    .eyebrow {
      display: inline-block;
      font-size: ${cssNumber(typography.eyebrow.fontSize)};
      line-height: ${typography.eyebrow.lineHeight};
      letter-spacing: ${typography.eyebrow.letterSpacing};
      text-transform: uppercase;
      color: var(--amber);
      margin-bottom: 16px;
      font-weight: ${typography.eyebrow.fontWeight};
    }

    .name {
      font-size: ${cssNumber(typography.name.fontSize)};
      line-height: ${typography.name.lineHeight};
      font-weight: ${typography.name.fontWeight};
      letter-spacing: ${typography.name.letterSpacing};
      max-width: 100%;
      text-wrap: balance;
    }

    .title {
      font-size: ${cssNumber(typography.workTitle.fontSize)};
      line-height: ${typography.workTitle.lineHeight};
      color: var(--teal);
      font-weight: ${typography.workTitle.fontWeight};
      letter-spacing: ${typography.workTitle.letterSpacing};
    }

    .tagline {
      font-size: ${cssNumber(typography.tagline.fontSize)};
      line-height: ${typography.tagline.lineHeight};
      color: var(--text);
      font-weight: ${typography.tagline.fontWeight};
      letter-spacing: ${typography.tagline.letterSpacing};
    }

    .quiet-copy {
      font-size: ${cssNumber(typography.quietCopy.fontSize)};
      line-height: ${typography.quietCopy.lineHeight};
      color: var(--muted);
    }

    .url {
      font-size: ${cssNumber(typography.url.fontSize)};
      line-height: ${typography.url.lineHeight};
      font-weight: ${typography.url.fontWeight};
      letter-spacing: ${typography.url.letterSpacing};
    }

    .email {
      font-size: ${cssNumber(typography.email.fontSize)};
      line-height: ${typography.email.lineHeight};
      color: var(--teal);
      font-weight: ${typography.email.fontWeight};
    }

    .service-intro {
      font-size: ${cssNumber(typography.serviceIntro.fontSize)};
      line-height: ${typography.serviceIntro.lineHeight};
      text-transform: uppercase;
      letter-spacing: ${typography.serviceIntro.letterSpacing};
      color: var(--amber);
      margin-bottom: 12px;
      font-weight: ${typography.serviceIntro.fontWeight};
    }

    .bullets {
      margin: 0;
      padding: 0 0 0 24px;
      font-size: ${cssNumber(typography.bullets.fontSize)};
      line-height: ${typography.bullets.lineHeight};
      color: var(--text);
    }

    .bullets li::marker {
      color: var(--amber);
    }

    .logo-mark {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: ${radius.logo}px;
      opacity: ${logo.workFrontOpacity};
      filter: saturate(${logo.workFrontSaturation}) contrast(1.04) brightness(${logo.workFrontBrightness});
      box-shadow: ${shadows.logoFrame};
    }

    .work-front-logo-wrap {
      padding: 4px;
      border-radius: ${radius.logo}px;
      background: linear-gradient(145deg, rgba(15,18,24,0.92), rgba(8,10,14,0.84));
      backdrop-filter: blur(4px);
    }

    .qr-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)),
        rgba(8, 10, 12, 0.68);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: ${qr.borderRadius}px;
      padding: ${qr.padding}px;
      box-shadow: ${shadows.qr};
    }

    .qr-wrap img {
      width: 100%;
      max-width: ${qr.maxWidth}px;
      aspect-ratio: 1;
      display: block;
      background: white;
      border-radius: ${qr.imageBorderRadius}px;
      padding: ${qr.imagePadding}px;
      image-rendering: crisp-edges;
    }

    .work-back-stripe {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, rgba(100, 213, 207, 0.08), transparent 30%),
        linear-gradient(300deg, rgba(240, 191, 108, 0.08), transparent 40%);
      opacity: 0.95;
      z-index: 1;
      pointer-events: none;
    }

    .arcade-front {
      background:
        radial-gradient(circle at 72% 22%, rgba(255, 92, 184, 0.28), transparent 25%),
        radial-gradient(circle at 64% 18%, rgba(92, 215, 255, 0.24), transparent 28%),
        radial-gradient(circle at 18% 82%, rgba(143, 123, 255, 0.18), transparent 26%),
        linear-gradient(150deg, #05070d 0%, #140d20 44%, #0a0d12 100%);
    }

    .arcade-front::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%, transparent 78%, rgba(255,255,255,0.03)),
        repeating-linear-gradient(180deg, transparent 0, transparent 12px, rgba(255,255,255,0.015) 13px, transparent 14px);
      pointer-events: none;
    }

    .arcade-title {
      font-size: ${cssNumber(typography.arcadeTitle.fontSize)};
      line-height: ${typography.arcadeTitle.lineHeight};
      letter-spacing: ${typography.arcadeTitle.letterSpacing};
      font-weight: ${typography.arcadeTitle.fontWeight};
      text-shadow: ${shadows.arcadeTitleGlow};
    }

    .arcade-descriptor {
      font-size: ${cssNumber(typography.arcadeDescriptor.fontSize)};
      line-height: ${typography.arcadeDescriptor.lineHeight};
      color: rgba(245, 239, 228, 0.88);
      max-width: 100%;
      font-weight: ${typography.arcadeDescriptor.fontWeight};
    }

    .arcade-back-descriptor {
      font-size: ${cssNumber(typography.arcadeBackDescriptor.fontSize)};
      line-height: ${typography.arcadeBackDescriptor.lineHeight};
      color: rgba(245, 239, 228, 0.9);
      max-width: 100%;
      font-weight: ${typography.arcadeBackDescriptor.fontWeight};
      letter-spacing: ${typography.arcadeBackDescriptor.letterSpacing};
    }

    .arcade-back-descriptor div {
      margin-bottom: 3px;
    }

    .focal-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${radius.focal}px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 20%, rgba(255,255,255,0.14), transparent 35%),
        linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01)),
        rgba(5, 6, 9, 0.3);
      box-shadow: ${shadows.focal};
      padding: 14px;
    }

    .focal-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      filter: saturate(1.08) contrast(1.03);
      transform: scale(${logo.arcadeScale});
    }

    .arcade-back {
      background:
        radial-gradient(circle at 76% 22%, rgba(255, 92, 184, 0.15), transparent 24%),
        radial-gradient(circle at 22% 18%, rgba(92, 215, 255, 0.14), transparent 26%),
        linear-gradient(145deg, #07090d 0%, #11131d 48%, #090b11 100%);
    }

    .arcade-back::before {
      content: "";
      position: absolute;
      inset: auto 80px 76px 80px;
      height: 2px;
      background: linear-gradient(90deg, rgba(92, 215, 255, 0.05), rgba(255, 92, 184, 0.42), rgba(92, 215, 255, 0.05));
      box-shadow: ${shadows.dividerGlow};
      pointer-events: none;
    }
  `;
}

function previewDocument(cards: CardExport[]) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Business Card Preview</title>
      <style>${baseCss()}</style>
    </head>
    <body class="preview">
      ${cards
        .map(
          (card) => `
            <section class="preview-frame">
              <div class="preview-label">${escapeHtml(card.title)}</div>
              ${card.html}
            </section>
          `,
        )
        .join("")}
    </body>
  </html>`;
}

function exportDocument(card: CardExport) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(card.title)}</title>
      <style>${baseCss()}</style>
    </head>
    <body class="export">
      ${card.html}
    </body>
  </html>`;
}

function cardGuidesHtml() {
  return `
    <div class="trim-area" style="${safeAreaStyle()}"></div>
    <div class="safe-area" style="${safeAreaStyle()}"></div>
    <div class="bleed-label">Bleed Canvas</div>
    <div class="safe-label">Trim + Safe Area</div>
    <div class="trim-corners" aria-hidden="true">
      <span class="tl"></span>
      <span class="tr"></span>
      <span class="bl"></span>
      <span class="br"></span>
    </div>
  `;
}

function buildWorkFrontHtml(
  copy: CopySet,
  assets: AssetBundle,
  brandConfig: BrandConfig,
) {
  const [name, title, , ...taglineLines] = copy.workFront;
  const boxes = cardBoxes["work-with-me-front"];

  return `
    <article class="card" data-card-id="work-with-me-front">
      ${cardGuidesHtml()}
      <div class="box" style="${boxStyle(boxes.name)}">
        <div class="eyebrow">${escapeHtml(brandConfig.labels.workWithMe)}</div>
        <div class="name">${escapeHtml(name ?? "")}</div>
      </div>
      <div class="box title" style="${boxStyle(boxes.title)}">${escapeHtml(title ?? "")}</div>
      <div class="box tagline" style="${boxStyle(boxes.tagline)}">${toParagraphs(taglineLines)}</div>
      <div class="box work-front-logo-wrap" style="${boxStyle(boxes.logo)}">
        <img class="logo-mark" src="${assets.logoDataUrl}" alt="" />
      </div>
    </article>
  `;
}

function buildWorkBackHtml(copy: CopySet, assets: AssetBundle) {
  const boxes = cardBoxes["work-with-me-back"];
  const { url, email, intro, bullets } = splitWorkBack(copy.workBack);

  return `
    <article class="card" data-card-id="work-with-me-back">
      <div class="work-back-stripe"></div>
      ${cardGuidesHtml()}
      <div class="box url" style="${boxStyle(boxes.url)}">${escapeHtml(url)}</div>
      <div class="box email" style="${boxStyle(boxes.email)}">${escapeHtml(email)}</div>
      <div class="box quiet-copy" style="${boxStyle(boxes.services)}">
        <div class="service-intro">${escapeHtml(intro)}</div>
        <ul class="bullets">
          ${bullets.map((bullet) => `<li>${escapeHtml(bullet.replace(/^-+\s*/, ""))}</li>`).join("")}
        </ul>
      </div>
      <div class="box qr-wrap" style="${boxStyle(boxes.qr)}">
        <img src="${assets.workQrDataUrl}" alt="QR code linking to the Work With Me page" />
      </div>
    </article>
  `;
}

function buildArcadeFrontHtml(
  copy: CopySet,
  assets: AssetBundle,
  brandConfig: BrandConfig,
) {
  const [title, , ...descriptorLines] = copy.arcadeFront;
  const boxes = cardBoxes["arcadeghosts-front"];

  return `
    <article class="card arcade-front" data-card-id="arcadeghosts-front">
      ${cardGuidesHtml()}
      <div class="box focal-wrap" style="${boxStyle(boxes.focal)}">
        <img src="${assets.logoDataUrl}" alt="" />
      </div>
      <div class="box" style="${boxStyle(boxes.title)}">
        <div class="eyebrow" style="color: var(--cyan)">${escapeHtml(brandConfig.labels.arcade)}</div>
        <div class="arcade-title">${escapeHtml(title ?? "")}</div>
      </div>
      <div class="box arcade-descriptor" style="${boxStyle(boxes.descriptor)}">${toParagraphs(
        descriptorLines,
      )}</div>
    </article>
  `;
}

function buildArcadeBackHtml(copy: CopySet, assets: AssetBundle) {
  const boxes = cardBoxes["arcadeghosts-back"];
  const { url, descriptor } = splitArcadeBack(copy.arcadeBack);

  return `
    <article class="card arcade-back" data-card-id="arcadeghosts-back">
      ${cardGuidesHtml()}
      <div class="box url" style="${boxStyle(boxes.url)}">${escapeHtml(url)}</div>
      <div class="box arcade-back-descriptor" style="${boxStyle(boxes.descriptor)}">${toParagraphs(
        descriptor,
      )}</div>
      <div class="box qr-wrap" style="${boxStyle(boxes.qr)}">
        <img src="${assets.arcadeQrDataUrl}" alt="QR code linking to ArcadeGhosts" />
      </div>
    </article>
  `;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readCopyLines(primaryPath: string, fallbackPath: string) {
  if (await fileExists(primaryPath)) {
    return readLines(primaryPath);
  }
  return readLines(fallbackPath);
}

async function resolveBrandRootDir(brandId: string) {
  const normalizedId = brandId.toLowerCase();
  const candidateDir = path.join(brandsRootDir, normalizedId);
  if (await fileExists(candidateDir)) {
    return candidateDir;
  }

  return path.join(brandsRootDir, "arcadeghosts");
}

async function loadCopy(brandId: string): Promise<CopySet> {
  const brandRootDir = await resolveBrandRootDir(brandId);
  const workFrontPath = path.join(brandRootDir, "copy", "front-copy.txt");
  const workBackPath = path.join(brandRootDir, "copy", "back-copy.txt");
  const arcadeFrontPath = path.join(brandRootDir, "copy", "front-copy.txt");
  const arcadeBackPath = path.join(brandRootDir, "copy", "back-copy.txt");

  return {
    workFront: await readCopyLines(
      workFrontPath,
      path.join(rootDir, "work-with-me", "front-copy.txt"),
    ),
    workBack: await readCopyLines(
      workBackPath,
      path.join(rootDir, "work-with-me", "back-copy.txt"),
    ),
    arcadeFront: await readCopyLines(
      arcadeFrontPath,
      path.join(rootDir, "arcadeghosts", "front-copy.txt"),
    ),
    arcadeBack: await readCopyLines(
      arcadeBackPath,
      path.join(rootDir, "arcadeghosts", "back-copy.txt"),
    ),
  };
}

async function ensureDirectories() {
  await fs.mkdir(path.join(rootDir, "work-with-me", "exports"), {
    recursive: true,
  });
  await fs.mkdir(path.join(rootDir, "arcadeghosts", "exports"), {
    recursive: true,
  });
  await fs.mkdir(generatorDir, { recursive: true });
}

async function loadAssets(brandId: string): Promise<AssetBundle> {
  const brandRootDir = await resolveBrandRootDir(brandId);
  const brandAssetsDir = path.join(brandRootDir, "assets");
  const logoPath = path.join(brandAssetsDir, "logo.png");
  const fallbackLogoPath = path.join(sharedDir, "logo.png");
  const workQrPath = path.join(brandAssetsDir, "qr-work-with-me.svg");
  const fallbackWorkQrPath = path.join(sharedDir, "qr-work-with-me.svg");
  const arcadeQrPath = path.join(brandAssetsDir, "qr-arcadeghosts.svg");
  const fallbackArcadeQrPath = path.join(sharedDir, "qr-arcadeghosts.svg");

  const resolvedLogoPath = (await fileExists(logoPath))
    ? logoPath
    : fallbackLogoPath;
  const resolvedWorkQrPath = (await fileExists(workQrPath))
    ? workQrPath
    : fallbackWorkQrPath;
  const resolvedArcadeQrPath = (await fileExists(arcadeQrPath))
    ? arcadeQrPath
    : fallbackArcadeQrPath;

  await Promise.all([
    requireAsset(resolvedLogoPath, "logo.png"),
    requireAsset(resolvedWorkQrPath, "qr-work-with-me.svg"),
    requireAsset(resolvedArcadeQrPath, "qr-arcadeghosts.svg"),
  ]);

  const [logoDataUrl, workQrDataUrl, arcadeQrDataUrl] = await Promise.all([
    readAssetAsDataUrl(resolvedLogoPath),
    readAssetAsDataUrl(resolvedWorkQrPath),
    readAssetAsDataUrl(resolvedArcadeQrPath),
  ]);

  return { logoDataUrl, workQrDataUrl, arcadeQrDataUrl };
}

function parseOptions(argv: string[]): ExportOptions {
  let guides = false;
  let pdf = false;
  let brandId = "arcadeghosts";
  let outputType = "business-cards";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--guides") {
      guides = true;
    } else if (arg === "--pdf") {
      pdf = true;
    } else if (arg === "--brand") {
      brandId = argv[index + 1] ?? brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      brandId = arg.slice("--brand=".length);
    } else if (arg === "--output") {
      outputType = argv[index + 1] ?? outputType;
      index += 1;
    } else if (arg.startsWith("--output=")) {
      outputType = arg.slice("--output=".length);
    }
  }

  return {
    guides,
    pdf,
    brandId,
    outputType,
  };
}

function withVariantSuffix(filePath: string, guides: boolean) {
  const suffix = guides ? "-guides" : "";
  if (!suffix) {
    return filePath;
  }

  const ext = path.extname(filePath);
  return filePath.replace(new RegExp(`${ext}$`), `${suffix}${ext}`);
}

function readPngDimensions(buffer: Buffer) {
  if (buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("Expected PNG output.");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function verifyPng(filePath: string) {
  const png = await fs.readFile(filePath);
  return readPngDimensions(png);
}

async function verifyFileExists(filePath: string) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function buildCards(brandConfig: BrandConfig): Promise<CardExport[]> {
  const [copy, assets] = await Promise.all([
    loadCopy(brandConfig.id),
    loadAssets(brandConfig.id),
  ]);

  return [
    {
      id: "work-with-me-front",
      title: `${brandConfig.labels.workWithMe} Front`,
      exportPath: path.join(
        rootDir,
        "work-with-me",
        "exports",
        "front-final.png",
      ),
      html: buildWorkFrontHtml(copy, assets, brandConfig),
    },
    {
      id: "work-with-me-back",
      title: `${brandConfig.labels.workWithMe} Back`,
      exportPath: path.join(
        rootDir,
        "work-with-me",
        "exports",
        "back-final.png",
      ),
      html: buildWorkBackHtml(copy, assets),
    },
    {
      id: "arcadeghosts-front",
      title: `${brandConfig.labels.arcade} Front`,
      exportPath: path.join(
        rootDir,
        "arcadeghosts",
        "exports",
        "front-final.png",
      ),
      html: buildArcadeFrontHtml(copy, assets, brandConfig),
    },
    {
      id: "arcadeghosts-back",
      title: `${brandConfig.labels.arcade} Back`,
      exportPath: path.join(
        rootDir,
        "arcadeghosts",
        "exports",
        "back-final.png",
      ),
      html: buildArcadeBackHtml(copy, assets),
    },
  ];
}

async function writePreview(cards: CardExport[]) {
  const previewPath = path.join(generatorDir, "cards.html");
  await fs.writeFile(previewPath, previewDocument(cards), "utf8");
}

async function exportCardVariant(
  pageHtml: string,
  exportPath: string,
  guides: boolean,
  pdf: boolean,
) {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: exportSize.width, height: exportSize.height },
      deviceScaleFactor: 1,
    });

    await page.setContent(pageHtml, { waitUntil: "load" });
    await page.evaluate((guidesOn) => {
      document.body.classList.toggle("guides-on", guidesOn);
    }, guides);

    await page.screenshot({
      path: exportPath,
      type: "png",
    });

    if (pdf) {
      const pdfPath = exportPath.replace(/\.png$/, ".pdf");
      await page.pdf({
        path: pdfPath,
        printBackground: true,
        width: exportSize.pdfWidth,
        height: exportSize.pdfHeight,
        margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" },
        preferCSSPageSize: false,
      });
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function exportCards(cards: CardExport[], options: ExportOptions) {
  const manifestByFolder = new Map<string, ManifestEntry[]>();
  const timestamp = new Date().toISOString();

  for (const card of cards) {
    const cleanPngPath = withVariantSuffix(card.exportPath, false);
    await exportCardVariant(exportDocument(card), cleanPngPath, false, false);

    const cleanDimensions = await verifyPng(cleanPngPath);
    if (
      cleanDimensions.width !== exportSize.width ||
      cleanDimensions.height !== exportSize.height
    ) {
      throw new Error(
        `${card.title} clean PNG failed validation: expected ${exportSize.width}x${exportSize.height}, got ${cleanDimensions.width}x${cleanDimensions.height}`,
      );
    }

    const cleanFolder = path.dirname(cleanPngPath);
    const cleanEntries = manifestByFolder.get(cleanFolder) ?? [];
    cleanEntries.push({
      cardId: card.id,
      outputPath: cleanPngPath,
      width: cleanDimensions.width,
      height: cleanDimensions.height,
      hasGuides: false,
      pdfGenerated: false,
      timestamp,
    });
    manifestByFolder.set(cleanFolder, cleanEntries);

    if (options.guides) {
      const guidePngPath = withVariantSuffix(card.exportPath, true);
      await exportCardVariant(
        exportDocument(card),
        guidePngPath,
        true,
        options.pdf,
      );

      const guideDimensions = await verifyPng(guidePngPath);
      if (
        guideDimensions.width !== exportSize.width ||
        guideDimensions.height !== exportSize.height
      ) {
        throw new Error(
          `${card.title} guide PNG failed validation: expected ${exportSize.width}x${exportSize.height}, got ${guideDimensions.width}x${guideDimensions.height}`,
        );
      }

      const guideFolder = path.dirname(guidePngPath);
      const guideEntries = manifestByFolder.get(guideFolder) ?? [];
      guideEntries.push({
        cardId: card.id,
        outputPath: guidePngPath,
        width: guideDimensions.width,
        height: guideDimensions.height,
        hasGuides: true,
        pdfGenerated: options.pdf,
        timestamp,
      });
      manifestByFolder.set(guideFolder, guideEntries);
    } else if (options.pdf) {
      await exportCardVariant(exportDocument(card), cleanPngPath, false, true);
      const folderEntries = manifestByFolder.get(cleanFolder) ?? [];
      const last = folderEntries[folderEntries.length - 1];
      if (last) {
        last.pdfGenerated = true;
      }
      manifestByFolder.set(cleanFolder, folderEntries);
    }
  }

  for (const [folderPath, entries] of Array.from(manifestByFolder.entries())) {
    const manifestPath = path.join(folderPath, "export-manifest.json");
    await fs.writeFile(
      manifestPath,
      `${JSON.stringify(entries, null, 2)}\n`,
      "utf8",
    );
  }
}

async function logOutputs(cards: CardExport[], options: ExportOptions) {
  for (const card of cards) {
    const cleanPngPath = withVariantSuffix(card.exportPath, false);
    const cleanDimensions = await verifyPng(cleanPngPath);
    console.log(
      `${card.title}: ${path.relative(rootDir, cleanPngPath)} ${cleanDimensions.width}x${cleanDimensions.height}`,
    );

    if (options.guides) {
      const guidePngPath = withVariantSuffix(card.exportPath, true);
      const guideDimensions = await verifyPng(guidePngPath);
      console.log(
        `${card.title} Guides: ${path.relative(rootDir, guidePngPath)} ${guideDimensions.width}x${guideDimensions.height}`,
      );

      if (options.pdf) {
        const guidePdfPath = guidePngPath.replace(/\.png$/, ".pdf");
        const bytes = await verifyFileExists(guidePdfPath);
        console.log(
          `${card.title} Guides PDF: ${path.relative(rootDir, guidePdfPath)} ${bytes} bytes`,
        );
      }
    } else if (options.pdf) {
      const cleanPdfPath = cleanPngPath.replace(/\.png$/, ".pdf");
      const bytes = await verifyFileExists(cleanPdfPath);
      console.log(
        `${card.title} PDF: ${path.relative(rootDir, cleanPdfPath)} ${bytes} bytes`,
      );
    }
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brandConfig = getBrandConfig(options.brandId);

  await ensureDirectories();
  const cards = await buildCards(brandConfig);
  await writePreview(cards);
  await exportCards(cards, options);
  await logOutputs(cards, options);

  console.log(`Brand: ${brandConfig.displayName}`);
  console.log(`Output: ${options.outputType}`);
  console.log(
    `Preview written to ${path.relative(process.cwd(), path.join(generatorDir, "cards.html"))}`,
  );

  if (options.guides) {
    console.log(
      "Guides mode enabled: trim/safe area overlays were included in proof exports only.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
