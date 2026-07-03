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
  const primaryCtaUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.primaryCTA.linkKey,
  );
  const primaryCtaDisplayLabel = "View services";
  const contactEmailUrl = resolveClientCollateralLink(
    brand.metadata,
    collateral.ctas.contactCTA.linkKey,
  );
  const linkedinUrl = brand.metadata.linkedinUrl
    ? resolveClientCollateralLink(brand.metadata, "linkedin")
    : undefined;
  const linkedinDisplayUrl = linkedinUrl
    ? linkedinUrl
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
    : undefined;
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
        width: 356px;
      }

      table {
        border-collapse: collapse;
      }
    </style>
  </head>
  <body>
    <table class="signature" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:356px;max-width:356px;background:#fbf8f3;border:1px solid #ddd3c5;color:#1b1f24;font-family:${brand.typography.fontStack};">
      <tr>
        <td style="width:4px;background:#2f6770;font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:14px 16px 14px 14px;vertical-align:top;">
          <div style="color:#8d6730;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">${escapeXml(brand.displayName)}</div>
          <div style="color:#1b1f24;font-size:20px;font-weight:800;line-height:1.15;margin:0 0 5px 0;">${escapeXml(brand.metadata.contactName)}</div>
          <div style="color:#2c3642;font-size:15px;line-height:1.35;margin:0 0 8px 0;">${escapeXml(roleLine)}</div>
          <div style="color:#5f6974;font-size:13px;line-height:1.45;margin:0 0 12px 0;">${escapeXml(subline)}</div>
          <div style="color:#2c3642;font-size:14px;line-height:1.5;margin:0 0 6px 0;">
            <span style="font-weight:700;color:#1b1f24;">Email:</span>
            <a href="${escapeXml(contactEmailUrl)}" style="color:#2c3642;text-decoration:none;">${escapeXml(brand.metadata.contactEmail)}</a>
          </div>
          <div style="color:#2c3642;font-size:14px;line-height:1.5;margin:0 0 6px 0;">
            <span style="font-weight:700;color:#1b1f24;">${escapeXml(collateral.ctas.primaryCTA.label)}:</span>
            <a href="${escapeXml(primaryCtaUrl)}" style="color:#2c3642;text-decoration:none;">${escapeXml(primaryCtaDisplayLabel)}</a>
          </div>
          ${
            linkedinUrl
              ? `<div style="color:#2c3642;font-size:14px;line-height:1.5;margin:0;">
            <span style="font-weight:700;color:#1b1f24;">LinkedIn:</span>
            <a href="${escapeXml(linkedinUrl)}" style="color:#2c3642;text-decoration:none;">${escapeXml(linkedinDisplayUrl ?? linkedinUrl)}</a>
          </div>`
              : ""
          }
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
