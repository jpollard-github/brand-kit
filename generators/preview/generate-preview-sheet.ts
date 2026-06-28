import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig } from "../../design-system/brand-config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "../..");
const outputDir = path.join(repoRootDir, "generators", "outputs", "preview");

type PreviewArgs = {
  brandId: string;
  outputName: string;
};

function parseArgs(argv: string[]): PreviewArgs {
  const args: PreviewArgs = {
    brandId: "arcadeghosts",
    outputName: "arcadeghosts-preview-sheet",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      args.brandId = argv[index + 1] ?? args.brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      args.brandId = arg.slice("--brand=".length);
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

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const brand = getBrandConfig(args.brandId);
  await ensureOutputDir();

  const previewPath = path.join(outputDir, `${args.outputName}.html`);
  const assets = [
    {
      title: "Work With Me Front",
      path: path.join(
        repoRootDir,
        "generators",
        "business-cards",
        "work-with-me",
        "exports",
        "front-final.png",
      ),
      caption: "Client-facing tone and contact-first clarity.",
      wide: false,
    },
    {
      title: "Work With Me Back",
      path: path.join(
        repoRootDir,
        "generators",
        "business-cards",
        "work-with-me",
        "exports",
        "back-final.png",
      ),
      caption: "Service framing with QR-driven next step.",
      wide: false,
    },
    {
      title: "ArcadeGhosts Front",
      path: path.join(
        repoRootDir,
        "generators",
        "business-cards",
        "arcadeghosts",
        "exports",
        "front-final.png",
      ),
      caption: "The more expressive side of the brand.",
      wide: false,
    },
    {
      title: "ArcadeGhosts Back",
      path: path.join(
        repoRootDir,
        "generators",
        "business-cards",
        "arcadeghosts",
        "exports",
        "back-final.png",
      ),
      caption: "Invitation into the world, not just a contact point.",
      wide: false,
    },
    {
      title: "Sticker Set",
      path: path.join(
        repoRootDir,
        "generators",
        "outputs",
        "stickers",
        `${brand.id}-sticker-set.svg`,
      ),
      caption: "Bold, compact, and legible at small sizes.",
      wide: false,
    },
    {
      title: "Mug Wrap",
      path: path.join(
        repoRootDir,
        "generators",
        "outputs",
        "mugs",
        `${brand.id}-mug-wrap.svg`,
      ),
      caption: "Low-risk Printify starter with logo side and phrase side.",
      wide: true,
    },
    {
      title: "Shirt Front",
      path: path.join(
        repoRootDir,
        "generators",
        "outputs",
        "shirts",
        `${brand.id}-shirt-front.svg`,
      ),
      caption: "Small, wearable left-chest mark.",
      wide: false,
    },
    {
      title: "Shirt Back",
      path: path.join(
        repoRootDir,
        "generators",
        "outputs",
        "shirts",
        `${brand.id}-shirt-back.svg`,
      ),
      caption: "Upper-back phrase treatment with signal energy.",
      wide: false,
    },
  ];

  const cardsHtml = await Promise.all(
    assets.map(async (asset) => {
      const exists = await fileExists(asset.path);
      const relativePath = path
        .relative(outputDir, asset.path)
        .split(path.sep)
        .join("/");

      if (!exists) {
        return `<article class="card ${asset.wide ? "wide" : ""}">
  <div class="missing">Missing: ${escapeHtml(asset.title)}</div>
  <p>${escapeHtml(asset.caption)}</p>
</article>`;
      }

      return `<article class="card ${asset.wide ? "wide" : ""}">
  <div class="thumb"><img src="${escapeHtml(relativePath)}" alt="${escapeHtml(asset.title)}" /></div>
  <h2>${escapeHtml(asset.title)}</h2>
  <p>${escapeHtml(asset.caption)}</p>
</article>`;
    }),
  );

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(brand.displayName)} Preview Sheet</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: ${brand.palette.backgroundDeep};
        --panel: ${brand.palette.background};
        --panel-soft: ${brand.palette.backgroundSoft};
        --text: ${brand.palette.text};
        --muted: ${brand.palette.textMuted};
        --amber: ${brand.palette.amber};
        --teal: ${brand.palette.teal};
        --border: ${brand.palette.border};
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: ${brand.typography.fontStack};
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(100, 213, 207, 0.12), transparent 24%),
          radial-gradient(circle at top right, rgba(240, 191, 108, 0.12), transparent 28%),
          linear-gradient(180deg, #07090c 0%, #0b0f14 100%);
      }

      main {
        max-width: 1480px;
        margin: 0 auto;
        padding: 48px 28px 72px;
      }

      .hero {
        padding: 28px 28px 32px;
        border: 1px solid var(--border);
        border-radius: 28px;
        background: rgba(10, 13, 17, 0.78);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
      }

      .eyebrow {
        margin: 0 0 14px;
        color: var(--amber);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 14px;
        font-size: clamp(2.3rem, 5vw, 4.4rem);
        line-height: 0.96;
      }

      .summary {
        max-width: 820px;
        margin: 0 0 22px;
        color: var(--muted);
        font-size: 1.08rem;
        line-height: 1.55;
      }

      .rules {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .rule {
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text);
        font-size: 0.95rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 18px;
        margin-top: 24px;
      }

      .card {
        grid-column: span 4;
        min-height: 100%;
        padding: 18px;
        border-radius: 24px;
        border: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(17, 22, 28, 0.96), rgba(10, 13, 17, 0.96));
      }

      .card.wide {
        grid-column: span 8;
      }

      .thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        padding: 12px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.02);
        overflow: hidden;
      }

      .thumb img {
        width: 100%;
        height: auto;
        display: block;
      }

      h2 {
        margin: 16px 0 8px;
        font-size: 1.08rem;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.5;
      }

      .missing {
        min-height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        border: 1px dashed var(--border);
        color: var(--amber);
        text-align: center;
        padding: 18px;
      }

      @media (max-width: 1100px) {
        .card,
        .card.wide {
          grid-column: span 6;
        }
      }

      @media (max-width: 760px) {
        main {
          padding: 24px 16px 40px;
        }

        .card,
        .card.wide {
          grid-column: span 12;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">Brand Cohesion Preview</p>
        <h1>${escapeHtml(brand.displayName)}</h1>
        <p class="summary">${escapeHtml(brand.metadata.summary)}</p>
        <div class="rules">
          ${brand.metadata.toneRules
            .map((rule) => `<span class="rule">${escapeHtml(rule)}</span>`)
            .join("")}
        </div>
      </section>
      <section class="grid">
        ${cardsHtml.join("\n")}
      </section>
    </main>
  </body>
</html>`;

  await fs.writeFile(previewPath, html, "utf8");
  console.log(`Preview sheet written to ${path.relative(process.cwd(), previewPath)}`);
  console.log(`Brand: ${brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
