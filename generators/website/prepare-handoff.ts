import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getBrandConfig } from "../../design-system/brand-config";
import { repoRootDir } from "../social/hero-composition";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const websiteOutputDir = path.join(repoRootDir, "generators", "outputs", "website");

type HandoffArgs = {
  brandId: string;
  outputName: string;
};

type WebsiteHandoffBrandConfig = {
  repoPath: string;
  assetTargets: Record<string, string>;
};

type WebsiteHandoffConfig = Record<string, WebsiteHandoffBrandConfig>;

type HandoffAsset = {
  source: string;
  outputName: string;
  suggestedDestination: string;
  purpose: string;
  relatedRolePaths?: string[];
};

type HandoffTargetStatus = {
  configured: boolean;
  repoPath?: string;
  destinationPath?: string;
  destinationExists?: boolean;
  repoExists?: boolean;
  relatedExistingPaths?: string[];
  note?: string;
};

const integrationsDir = path.join(repoRootDir, "integrations");
const localConfigPath = path.join(integrationsDir, "website-handoff.local.json");
const exampleConfigPath = path.join(
  integrationsDir,
  "website-handoff.example.json",
);

function parseArgs(argv: string[]): HandoffArgs {
  const args: HandoffArgs = {
    brandId: "arcadeghosts",
    outputName: "website-handoff",
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

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function assertExists(filePath: string) {
  await fs.access(filePath);
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  if (!(await fileExists(filePath))) {
    return null;
  }

  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function loadWebsiteHandoffConfig() {
  const localConfig = await readJsonFile<WebsiteHandoffConfig>(localConfigPath);
  const exampleConfig = await readJsonFile<WebsiteHandoffConfig>(exampleConfigPath);

  return {
    localConfig,
    exampleConfig,
  };
}

async function getTargetStatus(
  brandId: string,
  asset: HandoffAsset,
  config: WebsiteHandoffConfig | null,
): Promise<HandoffTargetStatus> {
  const brandConfig = config?.[brandId];
  if (!brandConfig) {
    return {
      configured: false,
      note: `No local website handoff config found for brand '${brandId}'.`,
    };
  }

  const destinationPath = brandConfig.assetTargets[asset.outputName];
  if (!destinationPath) {
    return {
      configured: false,
      repoPath: brandConfig.repoPath,
      note: `No asset target configured for ${asset.outputName}.`,
    };
  }

  const repoExists = await fileExists(brandConfig.repoPath);
  const absoluteDestination = path.join(brandConfig.repoPath, destinationPath);
  const relatedExistingPaths: string[] = [];

  if (repoExists && asset.relatedRolePaths?.length) {
    for (const relatedPath of asset.relatedRolePaths) {
      const absoluteRelatedPath = path.join(brandConfig.repoPath, relatedPath);
      if (await fileExists(absoluteRelatedPath)) {
        relatedExistingPaths.push(relatedPath);
      }
    }
  }

  return {
    configured: true,
    repoPath: brandConfig.repoPath,
    destinationPath,
    repoExists,
    destinationExists: repoExists ? await fileExists(absoluteDestination) : false,
    relatedExistingPaths,
  };
}

async function copyAsset(targetDir: string, asset: HandoffAsset) {
  const destination = path.join(targetDir, asset.outputName);
  await fs.copyFile(asset.source, destination);
  return destination;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const brand = getBrandConfig(args.brandId);
  const targetDir = path.join(websiteOutputDir, args.outputName);
  await ensureDir(targetDir);
  const { localConfig } = await loadWebsiteHandoffConfig();

  const assets: HandoffAsset[] = [
    {
      source: path.join(repoRootDir, "generators", "outputs", "social", `${brand.id}-og-image.png`),
      outputName: "opengraph.png",
      suggestedDestination: "public/brand/opengraph.png",
      purpose: "Default shared-link preview image",
      relatedRolePaths: ["app/opengraph-image.tsx", "app/seo.ts"],
    },
    {
      source: path.join(repoRootDir, "generators", "outputs", "website", `${brand.id}-website-hero.png`),
      outputName: "website-hero.png",
      suggestedDestination: "public/brand/website-hero.png",
      purpose: "Homepage or brand-landing hero artwork",
      relatedRolePaths: ["app/home/HomeHero.tsx", "app/page.tsx"],
    },
    {
      source: path.join(repoRootDir, "generators", "outputs", "icons", `${brand.id}-icon.svg`),
      outputName: "icon.svg",
      suggestedDestination: "app/icon.svg or public/icon.svg",
      purpose: "Scalable app and favicon source",
      relatedRolePaths: ["app/favicon.ico", "app/layout.tsx"],
    },
    {
      source: path.join(repoRootDir, "generators", "outputs", "icons", `${brand.id}-apple-touch-icon.png`),
      outputName: "apple-touch-icon.png",
      suggestedDestination: "public/apple-touch-icon.png",
      purpose: "Apple touch icon",
      relatedRolePaths: ["app/layout.tsx", "app/seo.ts"],
    },
    {
      source: path.join(repoRootDir, "generators", "outputs", "icons", `${brand.id}-icon-192.png`),
      outputName: "icon-192.png",
      suggestedDestination: "public/icon-192.png",
      purpose: "Web manifest icon",
      relatedRolePaths: ["app/layout.tsx", "app/seo.ts"],
    },
    {
      source: path.join(repoRootDir, "generators", "outputs", "icons", `${brand.id}-icon-512.png`),
      outputName: "icon-512.png",
      suggestedDestination: "public/icon-512.png",
      purpose: "Web manifest icon",
      relatedRolePaths: ["app/layout.tsx", "app/seo.ts"],
    },
  ];

  for (const asset of assets) {
    await assertExists(asset.source);
  }

  const copiedAssets = [];
  for (const asset of assets) {
    const destination = await copyAsset(targetDir, asset);
    const targetStatus = await getTargetStatus(brand.id, asset, localConfig);
    copiedAssets.push({
      file: path.basename(destination),
      purpose: asset.purpose,
      suggestedDestination: asset.suggestedDestination,
      targetStatus,
    });
  }

  const manifest = {
    brandId: brand.id,
    brandName: brand.displayName,
    generatedAt: new Date().toISOString(),
    mode: "manual-handoff",
    config: {
      localConfigPath: path.relative(process.cwd(), localConfigPath),
      localConfigPresent: Boolean(localConfig),
      exampleConfigPath: path.relative(process.cwd(), exampleConfigPath),
    },
    notes: [
      "This folder is a staging export for the website repo.",
      "Copy assets intentionally into the website rather than wiring direct consumption yet.",
      "Regenerate here whenever brand scenes or icon art changes.",
    ],
    assets: copiedAssets,
  };

  const manifestPath = path.join(targetDir, "handoff-manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const checklist = `# Website Handoff Checklist

Brand: ${brand.displayName}
Mode: manual handoff

Config:

- Local config file: \`${path.relative(process.cwd(), localConfigPath)}\`
- Example config file: \`${path.relative(process.cwd(), exampleConfigPath)}\`
- Local config present: \`${localConfig ? "yes" : "no"}\`

Copy these staged files into the website repo:

- \`opengraph.png\` -> \`${assets[0].suggestedDestination}\`
- \`website-hero.png\` -> \`${assets[1].suggestedDestination}\`
- \`icon.svg\` -> \`${assets[2].suggestedDestination}\`
- \`apple-touch-icon.png\` -> \`${assets[3].suggestedDestination}\`
- \`icon-192.png\` -> \`${assets[4].suggestedDestination}\`
- \`icon-512.png\` -> \`${assets[5].suggestedDestination}\`

Configured target status:

${copiedAssets
  .map((asset) => {
    const status = asset.targetStatus as HandoffTargetStatus;
    if (!status.configured) {
      return `- \`${asset.file}\`: not configured yet (${status.note})`;
    }

    const related =
      status.relatedExistingPaths && status.relatedExistingPaths.length > 0
        ? `, similar-role files=${status.relatedExistingPaths.map((filePath) => `\`${filePath}\``).join(", ")}`
        : "";

    return `- \`${asset.file}\`: repo=\`${status.repoPath}\`, destination=\`${status.destinationPath}\`, exists=\`${status.destinationExists ? "yes" : "no"}\`${related}`;
  })
  .join("\n")}

Before publishing:

- If the local config is missing, add \`integrations/website-handoff.local.json\` first
- Verify the metadata image path points to \`opengraph.png\`
- Verify the website hero references \`website-hero.png\` if used
- Verify app/icon or manifest paths reference the copied icon assets
- Review changes in the website repo before committing anything
- Regenerate and repeat this handoff whenever the scene or logo changes
`;

  const checklistPath = path.join(targetDir, "README.md");
  await fs.writeFile(checklistPath, checklist, "utf8");

  console.log(`Website handoff staged in ${path.relative(process.cwd(), targetDir)}`);
  console.log(`Manifest written to ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Checklist written to ${path.relative(process.cwd(), checklistPath)}`);
  console.log(`Brand: ${brand.displayName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
