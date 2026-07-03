import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import {
  getClientCollateralConfig,
  resolveClientCollateralLink,
} from "../../design-system/client-collateral";
import { writeEmailSignatureManifest } from "./manifest";
import {
  buildHeroCompositionData,
  escapeXml,
  repoRootDir,
} from "../social/hero-composition";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "email");

type SignatureArgs = {
  brandId: string;
  sceneId?: string;
  outputName: string;
};

function parseArgs(argv: string[]): SignatureArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: SignatureArgs = {
    brandId: defaultBrandId,
    sceneId: "work-with-me-hero",
    outputName: createBrandOutputName(
      defaultBrandId,
      "email-signature",
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

async function writeSignatureFiles(args: SignatureArgs) {
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const brand = data.brand;
  const collateral = getClientCollateralConfig(brand.id);
  const serviceLine =
    collateral.positioning.footerLine ??
    collateral.positioning.tagline ??
    collateral.positioning.oneLiner;
  const websiteUrl = resolveClientCollateralLink(brand.metadata, "website");
  const websiteDisplayUrl = brand.metadata.homeUrl.replace(/^https:\/\//, "");
  const primaryCtaUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.primaryCTA.linkKey,
  );
  const primaryCtaDisplayUrl = primaryCtaUrl.replace(/^https:\/\//, "");
  const contactEmailUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.contactCTA.linkKey,
  );
  const roleLine = collateral.email?.roleLine ?? collateral.positioning.primaryRole;
  const subline =
    collateral.email?.subline ??
    `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeXml(brand.displayName)} Email Signature</title>
    <style>
      body {
        margin: 0;
        padding: 16px;
        background: #f4f0e8;
        font-family: ${brand.typography.fontStack};
      }

      .signature {
        width: 360px;
      }

      table {
        border-collapse: separate;
      }
    </style>
  </head>
  <body>
    <table class="signature" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:360px;max-width:360px;background:${brand.palette.background};background-image:linear-gradient(135deg, ${brand.palette.backgroundDeep} 0%, ${brand.palette.background} 100%);border:1px solid ${brand.palette.border};border-radius:18px;color:${brand.palette.text};font-family:${brand.typography.fontStack};">
      <tr>
        <td style="padding:18px 18px 0 18px;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td valign="top" style="width:68px;padding:0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:56px;height:56px;background:#11161c;border:1px solid rgba(248,239,227,0.08);border-radius:14px;">
                  <tr>
                    <td align="center" valign="middle" style="width:56px;height:56px;padding:5px;">
                      <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" width="42" height="42" style="display:block;width:42px;height:42px;border:0;outline:none;text-decoration:none;" />
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="top" style="padding:0;">
                <div style="color:${brand.palette.amber};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 5px 0;">${escapeXml(brand.labels.workWithMe)}</div>
                <div style="color:${brand.palette.text};font-size:19px;font-weight:800;line-height:1.15;margin:0 0 4px 0;">${escapeXml(brand.metadata.contactName)}</div>
                <div style="color:${brand.palette.textMuted};font-size:14px;line-height:1.35;margin:0 0 6px 0;">${escapeXml(roleLine)}</div>
                <div style="color:${brand.palette.textMuted};font-size:13px;line-height:1.4;margin:0;">${escapeXml(subline)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 18px 18px 18px;vertical-align:top;">
          <div style="color:${brand.palette.textMuted};font-size:12px;line-height:1.35;margin:0 0 10px 0;">${escapeXml(serviceLine)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;width:100%;">
            <tr>
              <td style="padding:0 0 7px 0;color:${brand.palette.textMuted};font-size:13px;line-height:1.4;">
                <span style="color:${brand.palette.text};font-weight:700;">Email:</span>
                <a href="${escapeXml(contactEmailUrl)}" style="color:${brand.palette.text};text-decoration:none;">${escapeXml(brand.metadata.contactEmail)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 12px 0;color:${brand.palette.textMuted};font-size:13px;line-height:1.4;">
                <span style="color:${brand.palette.text};font-weight:700;">Web:</span>
                <a href="${escapeXml(websiteUrl)}" style="color:${brand.palette.text};text-decoration:none;">${escapeXml(websiteDisplayUrl)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <div style="color:${brand.palette.textMuted};font-size:13px;line-height:1.4;margin:0 0 7px 0;">Start with a short conversation.</div>
                <a href="${escapeXml(primaryCtaUrl)}" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#1b454e;border:1px solid #327784;color:${brand.palette.text};font-size:14px;font-weight:800;line-height:1.2;text-decoration:none;">${escapeXml(collateral.ctas.primaryCTA.label)}</a>
                <div style="color:${brand.palette.textMuted};font-size:12px;line-height:1.35;margin:7px 0 0 0;">${escapeXml(primaryCtaDisplayUrl)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const htmlPath = path.join(outputDir, `${args.outputName}.html`);
  await fs.writeFile(htmlPath, html, "utf8");
  return { brand, collateral, data, html, htmlPath };
}

async function renderHtmlPreview(html: string, pngPath: string) {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 520, height: 520 },
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "load" });
    const signature = page.locator(".signature");
    await signature.screenshot({
      path: pngPath,
      type: "png",
      omitBackground: false,
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const result = await writeSignatureFiles(args);
  const pngPath = path.join(outputDir, `${args.outputName}.png`);
  await renderHtmlPreview(result.html, pngPath);
  const manifestPath = await writeEmailSignatureManifest({
    html: result.html,
    collateral: result.collateral,
    data: result.data,
    outputName: args.outputName,
    htmlPath: result.htmlPath,
    pngPath,
  });
  console.log(
    `Email signature HTML written to ${path.relative(process.cwd(), result.htmlPath)}`,
  );
  console.log(
    `Email signature PNG written to ${path.relative(process.cwd(), pngPath)}`,
  );
  console.log(
    `Email signature manifest written to ${path.relative(process.cwd(), manifestPath)}`,
  );
  console.log(`Brand: ${result.brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
