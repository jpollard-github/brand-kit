import { promises as fs } from "node:fs";
import path from "node:path";

import { getBrandConfig } from "../design-system/brand-config";
import { getNetworkingConfig, resolveNetworkingUrl } from "../design-system/networking";
import { createBrandOutputName, parseCliFlag, resolveBrandId } from "../generators/shared/cli";
import { verifyQrImage } from "../generators/shared/qr";
import { repoRootDir } from "../generators/social/hero-composition";

type VerificationRow = {
  asset: string;
  path: string;
  decodedUrl: string;
  matchesExpected: boolean;
};

function relativePath(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const brandId = resolveBrandId(argv);
  const brand = getBrandConfig(brandId);
  const networking = getNetworkingConfig(brandId);
  const qrTarget =
    parseCliFlag(argv, "--qr-target") ??
    resolveNetworkingUrl(brand.metadata, networking.qrLinkKey ?? "website");
  const outputDir = path.join(repoRootDir, "generators", "outputs", "networking");
  const targets = [
    {
      asset: "Raw QR",
      path: path.join(
        outputDir,
        `${createBrandOutputName(brandId, "networking-qr", process.env.BRAND_THEME)}.png`,
      ),
    },
    {
      asset: "Conference card",
      path: path.join(
        outputDir,
        `${createBrandOutputName(brandId, "conference-card", process.env.BRAND_THEME)}.png`,
      ),
    },
    {
      asset: "Lock screen",
      path: path.join(
        outputDir,
        `${createBrandOutputName(brandId, "lock-screen", process.env.BRAND_THEME)}.png`,
      ),
    },
    {
      asset: "Minimal lock screen",
      path: path.join(
        outputDir,
        `${createBrandOutputName(brandId, "lock-screen-minimal", process.env.BRAND_THEME)}.png`,
      ),
    },
    {
      asset: "Minimal installed-tuned lock screen",
      path: path.join(
        outputDir,
        `${createBrandOutputName(
          brandId,
          "lock-screen-minimal-installed-tuned",
          process.env.BRAND_THEME,
        )}.png`,
      ),
    },
    {
      asset: "Conference preview",
      path: path.join(
        outputDir,
        `${createBrandOutputName(brandId, "conference-card-preview", process.env.BRAND_THEME)}.png`,
      ),
    },
  ];

  const rows: VerificationRow[] = [];
  for (const target of targets) {
    if (!(await pathExists(target.path))) {
      continue;
    }
    const result = await verifyQrImage(target.path, qrTarget);
    rows.push({
      asset: target.asset,
      path: relativePath(target.path),
      decodedUrl: result.decodedUrl,
      matchesExpected: result.matchesExpected,
    });
  }

  if (rows.length === 0) {
    throw new Error(
      "No networking QR assets found to verify. Run `npm run asset:networking` first.",
    );
  }

  const failed = rows.find((row) => !row.matchesExpected);
  console.log(`QR target URL: ${qrTarget}`);
  for (const row of rows) {
    console.log(
      `${row.asset}: ${row.path} -> ${row.decodedUrl} [${row.matchesExpected ? "pass" : "fail"}]`,
    );
  }

  if (failed) {
    throw new Error(
      `QR verification failed for ${failed.asset}: expected ${qrTarget}, decoded ${failed.decodedUrl}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
