import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

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
import {
  createBrandOutputName,
  parseCliFlag,
  resolveBrandId,
} from "../shared/cli";
import { readAssetAsDataUrl } from "../shared/assets";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "networking");
const execFileAsync = promisify(execFile);

const iconSize = { width: 87, height: 87 };
const icon2xSize = { width: 58, height: 58 };
const icon1xSize = { width: 29, height: 29 };
const logo2xSize = { width: 320, height: 100 };
const logo1xSize = { width: 160, height: 50 };
const previewSize = { width: 1032, height: 336 };

type WalletArgs = {
  brandId: string;
  sceneId?: string;
  qrTarget?: string;
};

type WalletPreviewLayout = {
  visualCenterX: number;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  logoX: number;
  logoY: number;
  logoSize: number;
  contentLeftX: number;
  labelY: number;
  brandNameY: number;
  roleLineY: number;
  displayUrlY: number;
  qrTargetY: number;
  previewPanelX: number;
  previewPanelY: number;
  previewPanelSize: number;
};

function rgbHexToWalletString(hex: string) {
  const cleaned = hex.replace("#", "");
  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function currentDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function createWalletPreviewLayout(): WalletPreviewLayout {
  const canvasCenterX = Math.round(previewSize.width / 2);
  const opticalCenterOffsetX = -8;
  const visualCenterX = canvasCenterX + opticalCenterOffsetX;
  const cardWidth = 996;
  const cardHeight = 300;
  const cardX = visualCenterX - cardWidth / 2;
  const previewPanelSize = 170;
  return {
    visualCenterX,
    cardX,
    cardY: 18,
    cardWidth,
    cardHeight,
    logoX: cardX + 30,
    logoY: 52,
    logoSize: 132,
    contentLeftX: cardX + 194,
    labelY: 88,
    brandNameY: 146,
    roleLineY: 188,
    displayUrlY: 230,
    qrTargetY: 270,
    previewPanelX: cardX + cardWidth - 210,
    previewPanelY: 54,
    previewPanelSize,
  };
}

function parseArgs(argv: string[]): WalletArgs {
  return {
    brandId: resolveBrandId(argv),
    sceneId: parseCliFlag(argv, "--scene"),
    qrTarget: parseCliFlag(argv, "--qr-target"),
  };
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function makeDirClean(dirPath: string) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

function relativePath(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

function buildIconSvg(logoDataUrl: string, palette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"], size: { width: number; height: number }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  ${renderHeroDefs({ palette } as never, 16, "#110b18")}
  ${renderHeroBase(size.width, size.height, 0.2)}
  <rect x="1" y="1" width="${size.width - 2}" height="${size.height - 2}" rx="${Math.round(size.width * 0.22)}" fill="rgba(8, 11, 15, 0.76)" stroke="${palette.border}" stroke-width="2" />
  <image href="${logoDataUrl}" x="${Math.round(size.width * 0.15)}" y="${Math.round(size.height * 0.15)}" width="${Math.round(size.width * 0.7)}" height="${Math.round(size.height * 0.7)}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

function buildLogoSvg(logoDataUrl: string, palette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"], size: { width: number; height: number }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <rect width="${size.width}" height="${size.height}" rx="${Math.round(size.height * 0.28)}" fill="rgba(8, 11, 15, 0.0)" />
  <image href="${logoDataUrl}" x="0" y="0" width="${size.width}" height="${size.height}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

function buildPreviewSvg(args: {
  logoDataUrl: string;
  fontStack: string;
  palette: Awaited<ReturnType<typeof buildHeroCompositionData>>["brand"]["palette"];
  brandName: string;
  passLabel: string;
  displayUrl: string;
  roleLine: string;
  qrTarget: string;
}) {
  const { logoDataUrl, fontStack, palette, brandName, passLabel, displayUrl, roleLine, qrTarget } = args;
  const layout = createWalletPreviewLayout();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${previewSize.width}" height="${previewSize.height}" viewBox="0 0 ${previewSize.width} ${previewSize.height}">
  ${renderHeroDefs({ palette } as never, 32, "#110b18")}
  ${renderHeroBase(previewSize.width, previewSize.height, 0.18)}
  <rect x="${layout.cardX}" y="${layout.cardY}" width="${layout.cardWidth}" height="${layout.cardHeight}" rx="34" fill="rgba(8, 11, 15, 0.82)" stroke="${palette.border}" stroke-width="2" />
  <image href="${logoDataUrl}" x="${layout.logoX}" y="${layout.logoY}" width="${layout.logoSize}" height="${layout.logoSize}" preserveAspectRatio="xMidYMid meet" />
  <text x="${layout.contentLeftX}" y="${layout.labelY}" fill="${palette.amber}" font-family="${fontStack}" font-size="18" font-weight="700" letter-spacing="4">${escapeXml(passLabel.toUpperCase())}</text>
  <text x="${layout.contentLeftX}" y="${layout.brandNameY}" fill="${palette.text}" font-family="${fontStack}" font-size="42" font-weight="780">${escapeXml(brandName)}</text>
  <text x="${layout.contentLeftX}" y="${layout.roleLineY}" fill="${palette.textMuted}" font-family="${fontStack}" font-size="20" font-weight="600">${escapeXml(roleLine)}</text>
  <text x="${layout.contentLeftX}" y="${layout.displayUrlY}" fill="${palette.teal}" font-family="${fontStack}" font-size="22" font-weight="720">${escapeXml(displayUrl)}</text>
  <text x="${layout.contentLeftX}" y="${layout.qrTargetY}" fill="${palette.textMuted}" font-family="${fontStack}" font-size="16" font-weight="520">${escapeXml(qrTarget)}</text>
  <rect x="${layout.previewPanelX}" y="${layout.previewPanelY}" width="${layout.previewPanelSize}" height="${layout.previewPanelSize}" rx="24" fill="rgba(248,239,227,0.08)" stroke="rgba(248,239,227,0.14)" stroke-width="2" />
  <text x="${layout.previewPanelX + layout.previewPanelSize / 2}" y="126" text-anchor="middle" fill="${palette.text}" font-family="${fontStack}" font-size="20" font-weight="700">Wallet</text>
  <text x="${layout.previewPanelX + layout.previewPanelSize / 2}" y="154" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="16" font-weight="520">QR in pass</text>
  <text x="${layout.previewPanelX + layout.previewPanelSize / 2}" y="182" text-anchor="middle" fill="${palette.textMuted}" font-family="${fontStack}" font-size="16" font-weight="520">Generated</text>
</svg>`;
}

async function writePngFromSvg(svg: string, size: { width: number; height: number }, outputPath: string) {
  await fs.writeFile(outputPath.replace(/\.png$/, ".svg"), svg, "utf8");
  await renderSvgToPng(svg, size, outputPath);
  await fs.access(outputPath);
}

async function sha1ForFile(filePath: string) {
  const buffer = await fs.readFile(filePath);
  return createHash("sha1").update(buffer).digest("hex");
}

async function zipUnsignedPass(packageDir: string, zipPath: string) {
  await execFileAsync("zip", ["-qr", zipPath, "."], { cwd: packageDir });
}

async function generateWalletPass(args: WalletArgs) {
  const brand = getBrandConfig(args.brandId);
  const networking = getNetworkingConfig(args.brandId);
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const qrTarget =
    args.qrTarget ??
    resolveNetworkingUrl(brand.metadata, networking.qrLinkKey ?? "website");
  const displayUrl = networking.displayUrl ?? toDisplayUrl(qrTarget);

  const passFolderName = createBrandOutputName(args.brandId, "wallet-pass", process.env.BRAND_THEME);
  const packageDir = path.join(outputDir, passFolderName);
  await makeDirClean(packageDir);

  const logoDataUrl = await readAssetAsDataUrl(path.join(repoRootDir, brand.logo.fallbackAsset));

  const files: Array<{ relative: string; absolute: string }> = [];

  for (const [fileName, size] of [
    ["icon.png", icon1xSize],
    ["icon@2x.png", icon2xSize],
    ["icon@3x.png", iconSize],
  ] as const) {
    const svg = buildIconSvg(logoDataUrl, data.brand.palette, size);
    const absolute = path.join(packageDir, fileName);
    await writePngFromSvg(svg, size, absolute);
    files.push({ relative: fileName, absolute });
  }

  for (const [fileName, size] of [
    ["logo.png", logo1xSize],
    ["logo@2x.png", logo2xSize],
  ] as const) {
    const svg = buildLogoSvg(logoDataUrl, data.brand.palette, size);
    const absolute = path.join(packageDir, fileName);
    await writePngFromSvg(svg, size, absolute);
    files.push({ relative: fileName, absolute });
  }

  const previewPngPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "wallet-pass-preview", process.env.BRAND_THEME)}.png`,
  );
  const previewSvg = buildPreviewSvg({
    logoDataUrl,
    fontStack: data.fontStack,
    palette: data.brand.palette,
    brandName: brand.displayName,
    passLabel: networking.walletPassLabel ?? brand.displayName,
    displayUrl,
    roleLine: networking.roleLine,
    qrTarget,
  });
  await renderSvgToPng(previewSvg, previewSize, previewPngPath);

  const passTypeIdentifier =
    process.env.APPLE_PASS_TYPE_IDENTIFIER ??
    "pass.com.example.brand.networking";
  const teamIdentifier =
    process.env.APPLE_TEAM_IDENTIFIER ?? "TEAMID";

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier,
    serialNumber: `${args.brandId}-networking-${currentDateStamp()}`,
    teamIdentifier,
    organizationName:
      networking.walletPassOrganizationName ?? brand.displayName,
    description:
      networking.walletPassDescription ??
      `${brand.displayName} networking pass`,
    logoText: networking.walletPassLabel ?? brand.displayName,
    foregroundColor: rgbHexToWalletString(data.brand.palette.text),
    backgroundColor: rgbHexToWalletString(data.brand.palette.backgroundDeep),
    labelColor: rgbHexToWalletString(data.brand.palette.amber),
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: qrTarget,
        messageEncoding: "iso-8859-1",
        altText: displayUrl,
      },
    ],
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "Name",
          value: brand.metadata.contactName,
        },
      ],
      secondaryFields: [
        {
          key: "role",
          label: "Role",
          value: networking.roleLine,
        },
        {
          key: "site",
          label: "Website",
          value: displayUrl,
        },
      ],
      auxiliaryFields: [
        {
          key: "email",
          label: "Email",
          value: brand.metadata.contactEmail,
        },
        ...(brand.metadata.githubUrl
          ? [
              {
                key: "github",
                label: "GitHub",
                value: brand.metadata.githubUrl,
              },
            ]
          : []),
        ...(brand.metadata.linkedinUrl
          ? [
              {
                key: "linkedin",
                label: "LinkedIn",
                value: brand.metadata.linkedinUrl,
              },
            ]
          : []),
      ],
      backFields: [
        {
          key: "summary",
          label: "Summary",
          value:
            networking.tagline ??
            brand.metadata.summary,
        },
        {
          key: "url",
          label: "QR Target",
          value: qrTarget,
        },
        {
          key: "work",
          label: "Work With Me",
          value: brand.metadata.workWithMeUrl,
        },
      ],
    },
  };

  const passJsonPath = path.join(packageDir, "pass.json");
  await fs.writeFile(passJsonPath, `${JSON.stringify(passJson, null, 2)}\n`, "utf8");
  files.push({ relative: "pass.json", absolute: passJsonPath });

  const manifest: Record<string, string> = {};
  for (const file of files) {
    manifest[file.relative] = await sha1ForFile(file.absolute);
  }

  const manifestPath = path.join(packageDir, "manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const signingReadmePath = path.join(packageDir, "SIGNING-README.md");
  await fs.writeFile(
    signingReadmePath,
    [
      "# Wallet Pass Signing",
      "",
      "This package is sign-ready but not yet installable as a real `.pkpass` file.",
      "",
      "To create a real Wallet pass you need:",
      "",
      "- a registered Apple Wallet pass type identifier",
      "- an Apple team identifier",
      "- a pass-signing certificate exported as `.p12`",
      "- the Apple WWDR certificate",
      "",
      "Suggested next step:",
      "",
      "- run `npm run asset:wallet-pass:sign` after setting the required environment variables",
      "",
      "Required environment variables:",
      "",
      "- `APPLE_PASS_TYPE_IDENTIFIER`",
      "- `APPLE_TEAM_IDENTIFIER`",
      "- `APPLE_WALLET_CERT_P12_PATH`",
      "- `APPLE_WALLET_CERT_PASSWORD`",
      "- `APPLE_WWDR_CERT_PATH`",
    ].join("\n"),
    "utf8",
  );

  const unsignedZipPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "wallet-pass-unsigned", process.env.BRAND_THEME)}.pkpass.zip`,
  );
  await fs.rm(unsignedZipPath, { force: true });
  await zipUnsignedPass(packageDir, unsignedZipPath);

  const reportPath = path.join(
    outputDir,
    `${createBrandOutputName(args.brandId, "wallet-pass-report", process.env.BRAND_THEME)}.txt`,
  );
  await fs.writeFile(
    reportPath,
    [
      `Generated: ${new Date().toISOString()}`,
      `Brand: ${brand.displayName}`,
      `Wallet pass package folder: ${relativePath(packageDir)}`,
      `Unsigned wallet pass zip: ${relativePath(unsignedZipPath)}`,
      `Preview PNG: ${relativePath(previewPngPath)}`,
      `Barcode target: ${qrTarget}`,
      `Pass type identifier: ${passTypeIdentifier}`,
      `Team identifier: ${teamIdentifier}`,
      "Signing status: unsigned",
    ].join("\n"),
    "utf8",
  );

  console.log(`Wallet pass package folder written to ${relativePath(packageDir)}`);
  console.log(`Wallet pass unsigned zip written to ${relativePath(unsignedZipPath)}`);
  console.log(`Wallet pass preview PNG written to ${relativePath(previewPngPath)}`);
  console.log(`Wallet pass report written to ${relativePath(reportPath)}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  await generateWalletPass(args);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
