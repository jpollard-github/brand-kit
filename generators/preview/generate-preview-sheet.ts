import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getBrandConfig,
  getBrandPalette,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import {
  createThemedOutputName,
  getRequestedThemeVariantId,
} from "../../design-system/themes";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.join(currentDir, "../..");
const outputDir = path.join(repoRootDir, "generators", "outputs", "preview");

type PreviewArgs = {
  brandId: string;
  outputName: string;
  themeId?: string;
};

type PreviewAsset = {
  title: string;
  path: string;
  caption: string;
  wide: boolean;
};

type PreviewSection = {
  title: string;
  intro: string;
  assets: PreviewAsset[];
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
    } else if (arg === "--theme") {
      args.themeId = argv[index + 1] ?? args.themeId;
      index += 1;
    } else if (arg.startsWith("--theme=")) {
      args.themeId = arg.slice("--theme=".length);
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

async function renderAssetCard(asset: PreviewAsset) {
  const exists = await fileExists(asset.path);
  const relativePath = path.relative(outputDir, asset.path).split(path.sep).join("/");

  if (!exists) {
    return `<article class="card ${asset.wide ? "wide" : ""}">
  <div class="missing">Missing: ${escapeHtml(asset.title)}</div>
  <h3>${escapeHtml(asset.title)}</h3>
  <p>${escapeHtml(asset.caption)}</p>
</article>`;
  }

  return `<article class="card ${asset.wide ? "wide" : ""}">
  <div class="thumb"><img src="${escapeHtml(relativePath)}" alt="${escapeHtml(asset.title)}" /></div>
  <h3>${escapeHtml(asset.title)}</h3>
  <p>${escapeHtml(asset.caption)}</p>
</article>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const brand = getBrandConfig(args.brandId);
  const themeId = getRequestedThemeVariantId(args.themeId);
  const palette = getBrandPalette(args.brandId, themeId);
  const themeVariant = getBrandThemeVariant(args.brandId, themeId);
  await ensureOutputDir();

  const previewPath = path.join(
    outputDir,
    `${createThemedOutputName(args.outputName, themeId)}.html`,
  );
  const themedAssetName = (baseName: string) =>
    createThemedOutputName(baseName, themeId);
  const sections: PreviewSection[] = [
    {
      title: "Print / Contact",
      intro: "Business-card surfaces and contact-first artifacts.",
      assets: [
        {
          title: "Work With Me Front",
          path: path.join(repoRootDir, "generators", "business-cards", "work-with-me", "exports", "front-final.png"),
          caption: "Client-facing tone and contact-first clarity.",
          wide: false,
        },
        {
          title: "Work With Me Back",
          path: path.join(repoRootDir, "generators", "business-cards", "work-with-me", "exports", "back-final.png"),
          caption: "Service framing with QR-driven next step.",
          wide: false,
        },
        {
          title: "ArcadeGhosts Front",
          path: path.join(repoRootDir, "generators", "business-cards", "arcadeghosts", "exports", "front-final.png"),
          caption: "The more expressive side of the brand.",
          wide: false,
        },
        {
          title: "ArcadeGhosts Back",
          path: path.join(repoRootDir, "generators", "business-cards", "arcadeghosts", "exports", "back-final.png"),
          caption: "Invitation into the world, not just a contact point.",
          wide: false,
        },
        {
          title: "Conference Badge",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "badges",
            `${themedAssetName(`${brand.id}-conference-badge`)}.png`,
          ),
          caption: "Portrait badge preview for events, meetups, or conference handoffs.",
          wide: false,
        },
        {
          title: "Letterhead",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "documents",
            `${themedAssetName(`${brand.id}-letterhead`)}.png`,
          ),
          caption: "Client-facing stationery shell that keeps the top of the page branded and the body print-friendly.",
          wide: true,
        },
        {
          title: "Invoice",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "documents",
            `${themedAssetName(`${brand.id}-invoice`)}.png`,
          ),
          caption: "Branded invoice shell for side-hustle work without pretending to be a full accounting system.",
          wide: true,
        },
        {
          title: "Email Signature",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "email",
            `${themedAssetName(`${brand.id}-email-signature`)}.png`,
          ),
          caption: "Professional contact signature preview built from brand tokens and the Work With Me scene.",
          wide: true,
        },
      ],
    },
    {
      title: "Merch / Vendor",
      intro: "Physical product surfaces and upload-friendly merch artifacts.",
      assets: [
        {
          title: "Sticker Set",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "stickers",
            `${themedAssetName(`${brand.id}-sticker-set`)}.svg`,
          ),
          caption: "Bold, compact, and legible at small sizes.",
          wide: false,
        },
        {
          title: "Sticker Sheet",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "stickers",
            `${themedAssetName(`${brand.id}-sticker-sheet`)}.png`,
          ),
          caption: "Printable six-up sheet derived from the sticker artwork with simple cut guides.",
          wide: true,
        },
        {
          title: "Mug Wrap",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "mugs",
            `${themedAssetName(`${brand.id}-mug`)}-wrap.svg`,
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
            `${themedAssetName(`${brand.id}-shirt`)}-front.svg`,
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
            `${themedAssetName(`${brand.id}-shirt`)}-back.svg`,
          ),
          caption: "Upper-back phrase treatment with signal energy.",
          wide: false,
        },
        {
          title: "Tote Front",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "totes",
            `${themedAssetName(`${brand.id}-tote`)}-front.svg`,
          ),
          caption: "Front-facing tote art with a darker brand-world treatment.",
          wide: false,
        },
        {
          title: "Tote Back",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "totes",
            `${themedAssetName(`${brand.id}-tote`)}-back.svg`,
          ),
          caption: "Secondary tote side for simpler vendor mockup or two-sided products.",
          wide: false,
        },
      ],
    },
    {
      title: "Hero Composition Family",
      intro: "Shared-scene web, social, and presentation surfaces derived from the same composition language.",
      assets: [
        {
          title: "OG / Social Image",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "social",
            `${themedAssetName(`${brand.id}-og-image`)}.png`,
          ),
          caption: "First shareable web surface, now with a PNG handoff for website and GitHub use.",
          wide: true,
        },
        {
          title: "LinkedIn Banner",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "social",
            `${themedAssetName(`${brand.id}-linkedin-banner`)}.png`,
          ),
          caption: "Wide social banner with a safe lower-left area for profile-photo overlap.",
          wide: true,
        },
        {
          title: "GitHub Social",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "social",
            `${themedAssetName(`${brand.id}-github-social`)}.png`,
          ),
          caption: "Repository and profile social art derived from the same hero composition as OG and LinkedIn.",
          wide: true,
        },
        {
          title: "Website Hero",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "website",
            `${themedAssetName(`${brand.id}-website-hero`)}.png`,
          ),
          caption: "Wide website-facing hero derived from the same canonical ArcadeGhosts Hero composition.",
          wide: true,
        },
        {
          title: "Newsletter Header",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "newsletter",
            `${themedAssetName(`${brand.id}-newsletter-header`)}.png`,
          ),
          caption: "Wide brand-led header for newsletters or email campaigns.",
          wide: true,
        },
        {
          title: "Project Cover",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "projects",
            `${themedAssetName(`${brand.id}-project-cover`)}.png`,
          ),
          caption: "Repo or project cover art using the same scene system as the other web assets.",
          wide: true,
        },
        {
          title: "Presentation Cover",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "presentations",
            `${themedAssetName(`${brand.id}-presentation-cover`)}.png`,
          ),
          caption: "16:9 slide or deck title image derived from the same shared scene system.",
          wide: true,
        },
        {
          title: "Mini Flyer",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "posters",
            `${themedAssetName(`${brand.id}-mini-flyer`)}.png`,
          ),
          caption: "Small poster or flyer surface using the same hero-driven brand language.",
          wide: false,
        },
        {
          title: "Wallpaper Desktop",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "wallpapers",
            `${themedAssetName(`${brand.id}-wallpaper`)}-desktop.png`,
          ),
          caption: "Desktop wallpaper variant for the ArcadeGhosts scene system.",
          wide: true,
        },
        {
          title: "Wallpaper Mobile",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "wallpapers",
            `${themedAssetName(`${brand.id}-wallpaper`)}-mobile.png`,
          ),
          caption: "Mobile wallpaper variant with a tighter vertical composition.",
          wide: false,
        },
        {
          title: "Stream Thumbnail",
          path: path.join(
            repoRootDir,
            "generators",
            "outputs",
            "video",
            `${themedAssetName(`${brand.id}-stream-thumbnail`)}.png`,
          ),
          caption: "Stream or video thumbnail built from the same scene system as the other web surfaces.",
          wide: true,
        },
      ],
    },
  ];

  const sectionHtml = await Promise.all(
    sections.map(async (section) => {
      const cards = await Promise.all(section.assets.map(renderAssetCard));
      return `<section class="section">
  <div class="section-head">
    <h2 class="section-title">${escapeHtml(section.title)}</h2>
    <p class="section-intro">${escapeHtml(section.intro)}</p>
  </div>
  <div class="grid">
    ${cards.join("\n")}
  </div>
</section>`;
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
        --bg: ${palette.backgroundDeep};
        --panel: ${palette.background};
        --text: ${palette.text};
        --muted: ${palette.textMuted};
        --amber: ${palette.amber};
        --border: ${palette.border};
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

      .section {
        margin-top: 28px;
      }

      .section-head {
        margin-bottom: 14px;
      }

      .section-title {
        margin: 0 0 6px;
        font-size: 1.35rem;
      }

      .section-intro {
        margin: 0;
        color: var(--muted);
        line-height: 1.5;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 18px;
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

      h3 {
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
        <p class="summary">${escapeHtml(brand.metadata.summary)} Theme: ${escapeHtml(themeVariant.label)}.</p>
        <div class="rules">
          ${brand.metadata.toneRules
            .map((rule) => `<span class="rule">${escapeHtml(rule)}</span>`)
            .join("")}
        </div>
      </section>
      ${sectionHtml.join("\n")}
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
