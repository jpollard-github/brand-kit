import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig } from "../../design-system/brand-config";
import {
  createThemedOutputName,
  getRequestedThemeVariantId,
  listThemeVariantIds,
} from "../../design-system/themes";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.join(currentDir, "../..");

type Args = {
  brandId: string;
  themeId?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    brandId: "arcadeghosts",
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
    }
  }

  return args;
}

function runScript(
  scriptPath: string,
  args: string[],
  themeId: string,
  brandId: string,
) {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", scriptPath, "--brand", brandId, ...args],
    {
      cwd: repoRootDir,
      stdio: "inherit",
      env: {
        ...process.env,
        BRAND_THEME: themeId,
      },
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const brand = getBrandConfig(args.brandId);
  const themeIds = args.themeId
    ? [getRequestedThemeVariantId(args.themeId)]
    : listThemeVariantIds(brand.themes);

  const themedCommands = [
    {
      script: "generators/stickers/generate-stickers.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-sticker-set`, themeId),
      ],
    },
    {
      script: "generators/stickers/generate-sticker-sheet.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-sticker-sheet`, themeId),
      ],
    },
    {
      script: "generators/mugs/generate-mugs.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-mug`, themeId),
      ],
    },
    {
      script: "generators/shirts/generate-shirts.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-shirt`, themeId),
      ],
    },
    {
      script: "generators/totes/generate-tote-bag.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-tote`, themeId),
      ],
    },
    {
      script: "generators/social/generate-og-image.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-og-image`, themeId),
      ],
    },
    {
      script: "generators/social/generate-linkedin-banner.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-linkedin-banner`, themeId),
      ],
    },
    {
      script: "generators/social/generate-github-social.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-github-social`, themeId),
      ],
    },
    {
      script: "generators/website/generate-hero-image.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-website-hero`, themeId),
      ],
    },
    {
      script: "generators/newsletter/generate-header.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-newsletter-header`, themeId),
      ],
    },
    {
      script: "generators/projects/generate-cover.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-project-cover`, themeId),
      ],
    },
    {
      script: "generators/presentations/generate-cover.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-presentation-cover`, themeId),
      ],
    },
    {
      script: "generators/badges/generate-conference-badge.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-conference-badge`, themeId),
      ],
    },
    {
      script: "generators/posters/generate-mini-flyer.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-mini-flyer`, themeId),
      ],
    },
    {
      script: "generators/wallpapers/generate-wallpapers.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-wallpaper`, themeId),
      ],
    },
    {
      script: "generators/video/generate-stream-thumbnail.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-stream-thumbnail`, themeId),
      ],
    },
    {
      script: "generators/documents/generate-stationery.ts",
      argsFor: (themeId: string) => [
        "--letterhead-output",
        createThemedOutputName(`${brand.id}-letterhead`, themeId),
        "--invoice-output",
        createThemedOutputName(`${brand.id}-invoice`, themeId),
      ],
    },
    {
      script: "generators/email/generate-signature.ts",
      argsFor: (themeId: string) => [
        "--output",
        createThemedOutputName(`${brand.id}-email-signature`, themeId),
      ],
    },
    {
      script: "generators/preview/generate-preview-sheet.ts",
      argsFor: (themeId: string) => ["--theme", themeId],
    },
  ];

  for (const themeId of themeIds) {
    console.log(`\n=== Theme: ${themeId} ===`);
    for (const command of themedCommands) {
      runScript(command.script, command.argsFor(themeId), themeId, brand.id);
    }
  }
}

main();
