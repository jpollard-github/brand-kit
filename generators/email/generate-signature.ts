import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import { getClientCollateralConfig } from "../../design-system/client-collateral";
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
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeXml(brand.displayName)} Email Signature</title>
    <style>
      :root {
        --bg: ${brand.palette.backgroundDeep};
        --panel: ${brand.palette.background};
        --border: ${brand.palette.border};
        --text: ${brand.palette.text};
        --muted: ${brand.palette.textMuted};
        --amber: ${brand.palette.amber};
        --teal: ${brand.palette.teal};
        --pink: ${brand.palette.pink};
      }

      body {
        margin: 0;
        padding: 24px;
        background: #f4f0e8;
        font-family: ${brand.typography.fontStack};
      }

      .signature {
        width: 720px;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(100, 213, 207, 0.15), transparent 28%),
          radial-gradient(circle at top right, rgba(245, 119, 162, 0.16), transparent 24%),
          linear-gradient(135deg, ${brand.palette.backgroundDeep} 0%, ${brand.palette.background} 100%);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 26px 28px;
        display: grid;
        grid-template-columns: 148px 1fr;
        gap: 22px;
        box-shadow: 0 20px 50px rgba(8, 10, 16, 0.18);
      }

      .mark {
        background: rgba(7, 10, 14, 0.62);
        border: 1px solid rgba(248, 239, 227, 0.08);
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 148px;
        position: relative;
        overflow: hidden;
      }

      .mark::before,
      .mark::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        border: 2px solid transparent;
      }

      .mark::before {
        width: 116px;
        height: 116px;
        border-color: rgba(100, 213, 207, 0.32);
      }

      .mark::after {
        width: 86px;
        height: 86px;
        border-color: rgba(240, 191, 108, 0.22);
      }

      .mark img {
        width: 94px;
        height: 94px;
        object-fit: contain;
        position: relative;
        z-index: 1;
      }

      .eyebrow {
        color: var(--amber);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .name {
        font-size: 32px;
        font-weight: 800;
        line-height: 1.05;
        margin: 0 0 8px;
      }

      .role {
        color: var(--muted);
        font-size: 17px;
        line-height: 1.35;
        margin: 0 0 16px;
        max-width: 470px;
      }

      .service-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0 0 14px;
      }

      .service-tag {
        color: var(--text);
        background: rgba(100, 213, 207, 0.12);
        border: 1px solid rgba(100, 213, 207, 0.18);
        border-radius: 999px;
        padding: 7px 11px;
        font-size: 13px;
        font-weight: 700;
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 0 0 18px;
      }

      .chip {
        color: var(--text);
        text-decoration: none;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(7, 10, 14, 0.62);
        border: 1px solid rgba(248, 239, 227, 0.08);
        font-size: 14px;
        font-weight: 650;
      }

      .subline {
        color: var(--muted);
        font-size: 15px;
        line-height: 1.45;
        max-width: 520px;
      }
    </style>
  </head>
  <body>
    <div class="signature">
      <div class="mark">
        <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" />
      </div>
      <div>
        <div class="eyebrow">${escapeXml(brand.labels.workWithMe)}</div>
        <h1 class="name">${escapeXml(brand.metadata.contactName)}</h1>
        <p class="role">${escapeXml(collateral.positioning.primaryRole)}</p>
        <div class="service-row">
          ${serviceChips
            .map(
              (service) =>
                `<span class="service-tag">${escapeXml(service)}</span>`,
            )
            .join("")}
        </div>
        <div class="links">
          <a class="chip" href="mailto:${escapeXml(brand.metadata.contactEmail)}">${escapeXml(brand.metadata.contactEmail)}</a>
          <a class="chip" href="${escapeXml(brand.metadata.homeUrl)}">${escapeXml(brand.metadata.homeUrl.replace(/^https:\/\//, ""))}</a>
          <a class="chip" href="${escapeXml(brand.metadata.workWithMeUrl)}">${escapeXml(collateral.ctas.primaryCTA.label)}</a>
        </div>
        <div class="subline">${escapeXml(collateral.positioning.tagline ?? collateral.positioning.oneLiner)} ${escapeXml(collateral.positioning.problemSummary ?? collateral.positioning.shortPromise)}</div>
      </div>
    </div>
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
