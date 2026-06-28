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
  const serviceChips = collateral.services
    .slice(0, 3)
    .map((service) => service.name);
  const websiteUrl = resolveClientCollateralLink(brand.metadata, "website");
  const websiteDisplayUrl = brand.metadata.homeUrl.replace(/^https:\/\//, "");
  const primaryCtaUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.primaryCTA.linkKey,
  );
  const contactEmailUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.contactCTA.linkKey,
  );
  const roleLine = collateral.email?.roleLine ?? collateral.positioning.primaryRole;
  const subline =
    collateral.email?.subline ??
    `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`;
  const serviceTags = serviceChips
    .map(
      (service) => `<span style="display:inline-block;margin:0 8px 8px 0;padding:6px 10px;border-radius:999px;background:#16343b;border:1px solid #23545e;color:${brand.palette.text};font-size:12px;font-weight:700;line-height:1.2;">${escapeXml(service)}</span>`,
    )
    .join("");
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeXml(brand.displayName)} Email Signature</title>
    <style>
      body {
        margin: 0;
        padding: 24px;
        background: #f4f0e8;
        font-family: ${brand.typography.fontStack};
      }

      .signature {
        width: 760px;
      }

      table {
        border-collapse: separate;
      }
    </style>
  </head>
  <body>
    <table class="signature" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:760px;max-width:760px;background:${brand.palette.background};background-image:linear-gradient(135deg, ${brand.palette.backgroundDeep} 0%, ${brand.palette.background} 100%);border:1px solid ${brand.palette.border};border-radius:20px;color:${brand.palette.text};font-family:${brand.typography.fontStack};">
      <tr>
        <td style="padding:24px 22px 24px 24px;vertical-align:top;width:136px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:120px;height:120px;background:#11161c;border:1px solid rgba(248,239,227,0.08);border-radius:18px;">
            <tr>
              <td align="center" valign="middle" style="width:120px;height:120px;padding:8px;">
                <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" width="96" height="96" style="display:block;width:96px;height:96px;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:22px 24px 22px 0;vertical-align:top;">
          <div style="color:${brand.palette.amber};font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;margin:0 0 8px 0;">${escapeXml(brand.labels.workWithMe)}</div>
          <div style="color:${brand.palette.text};font-size:30px;font-weight:800;line-height:1.05;margin:0 0 8px 0;">${escapeXml(brand.metadata.contactName)}</div>
          <div style="color:${brand.palette.textMuted};font-size:16px;line-height:1.35;margin:0 0 14px 0;">${escapeXml(roleLine)}</div>
          <div style="margin:0 0 10px 0;line-height:1;">${serviceTags}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px 0;">
            <tr>
              <td style="padding:0 8px 8px 0;">
                <a href="${escapeXml(contactEmailUrl)}" style="display:inline-block;padding:9px 12px;border-radius:999px;background:#11161c;border:1px solid rgba(248,239,227,0.08);color:${brand.palette.text};font-size:13px;font-weight:650;line-height:1.2;text-decoration:none;">${escapeXml(brand.metadata.contactEmail)}</a>
              </td>
              <td style="padding:0 8px 8px 0;">
                <a href="${escapeXml(websiteUrl)}" style="display:inline-block;padding:9px 12px;border-radius:999px;background:#11161c;border:1px solid rgba(248,239,227,0.08);color:${brand.palette.text};font-size:13px;font-weight:650;line-height:1.2;text-decoration:none;">${escapeXml(websiteDisplayUrl)}</a>
              </td>
              <td style="padding:0 0 8px 0;">
                <a href="${escapeXml(primaryCtaUrl)}" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#1b454e;border:1px solid #327784;color:${brand.palette.text};font-size:13px;font-weight:800;line-height:1.2;text-decoration:none;">${escapeXml(collateral.ctas.primaryCTA.label)}</a>
              </td>
            </tr>
          </table>
          <div style="color:${brand.palette.textMuted};font-size:14px;line-height:1.45;">${escapeXml(subline)}</div>
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
      viewport: { width: 900, height: 420 },
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
