import { promises as fs } from "node:fs";
import path from "node:path";

import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
  getBrandThemeVariant,
} from "../../design-system/brand-config";
import { getClientCollateralConfig } from "../../design-system/client-collateral";
import { createThemedOutputName } from "../../design-system/themes";
import { repoRootDir } from "../social/hero-composition";
import { readPngDimensions, toDisplayUrl } from "../shared/output-manifest";
import type { EmailSignatureManifest } from "./manifest";

function escapeHtmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type VerificationItem = {
  label: string;
  detail: string;
};

type VerificationReport = {
  passed: VerificationItem[];
  failed: VerificationItem[];
};

type VerifyOptions = {
  brandId: string;
  profile: "business" | "personal";
  themeId?: string;
};

const outputDir = path.join(repoRootDir, "generators", "outputs", "email");

function addPass(report: VerificationReport, label: string, detail: string) {
  report.passed.push({ label, detail });
}

function addFail(report: VerificationReport, label: string, detail: string) {
  report.failed.push({ label, detail });
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseOptions(argv: string[]): VerifyOptions {
  let brandId = DEFAULT_BRAND_ID;
  let profile: "business" | "personal" = "business";
  let themeId = process.env.BRAND_THEME;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      brandId = argv[index + 1] ?? brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      brandId = arg.slice("--brand=".length);
    } else if (arg === "--profile") {
      const nextProfile = argv[index + 1];
      if (nextProfile === "business" || nextProfile === "personal") {
        profile = nextProfile;
      }
      index += 1;
    } else if (arg.startsWith("--profile=")) {
      const nextProfile = arg.slice("--profile=".length);
      if (nextProfile === "business" || nextProfile === "personal") {
        profile = nextProfile;
      }
    } else if (arg === "--theme") {
      themeId = argv[index + 1] ?? themeId;
      index += 1;
    } else if (arg.startsWith("--theme=")) {
      themeId = arg.slice("--theme=".length);
    }
  }

  return { brandId, profile, themeId };
}

async function readManifest(manifestPath: string) {
  const contents = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(contents) as EmailSignatureManifest;
}

function logVerificationReport(title: string, report: VerificationReport) {
  console.log(title);
  for (const item of report.passed) {
    console.log(`  [pass] ${item.label}: ${item.detail}`);
  }
  for (const item of report.failed) {
    console.log(`  [fail] ${item.label}: ${item.detail}`);
  }
}

function assertVerificationPassed(report: VerificationReport) {
  if (report.failed.length > 0) {
    throw new Error(`Email signature verification failed with ${report.failed.length} issue(s).`);
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const brand = getBrandConfig(options.brandId);
  const collateral = getClientCollateralConfig(options.brandId);
  const themeVariant = getBrandThemeVariant(options.brandId, options.themeId);
  const outputBaseName =
    options.profile === "personal"
      ? `${brand.id}-email-signature-personal`
      : `${brand.id}-email-signature`;
  const outputName = createThemedOutputName(outputBaseName, themeVariant.id);
  const manifestPath = path.join(outputDir, `${outputName}.manifest.json`);
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  if (!(await fileExists(manifestPath))) {
    addFail(report, "email signature manifest", `${path.relative(process.cwd(), manifestPath)} missing`);
    logVerificationReport("Email signature manifest and preflight verification", report);
    assertVerificationPassed(report);
    return;
  }

  const manifest = await readManifest(manifestPath);

  if (manifest.generatorFamily !== "email") {
    addFail(report, "email manifest family", `expected email, found ${manifest.generatorFamily}`);
  } else {
    addPass(report, "email manifest family", manifest.generatorFamily);
  }

  if (manifest.outputKind !== "email-signature") {
    addFail(report, "email manifest kind", `expected email-signature, found ${manifest.outputKind}`);
  } else {
    addPass(report, "email manifest kind", manifest.outputKind);
  }

  if (manifest.profile !== options.profile) {
    addFail(report, "email manifest profile", `expected ${options.profile}, found ${manifest.profile}`);
  } else {
    addPass(report, "email manifest profile", manifest.profile);
  }

  if (manifest.brandId !== brand.id) {
    addFail(report, "email manifest brand", `expected ${brand.id}, found ${manifest.brandId}`);
  } else {
    addPass(report, "email manifest brand", manifest.brandId);
  }

  if (manifest.themeId !== themeVariant.id) {
    addFail(report, "email manifest theme", `expected ${themeVariant.id}, found ${manifest.themeId}`);
  } else {
    addPass(report, "email manifest theme", manifest.themeId);
  }

  const htmlPath = path.resolve(process.cwd(), manifest.outputs.htmlPath);
  const pngPath = path.resolve(process.cwd(), manifest.outputs.pngPath);
  const [htmlExists, pngExists] = await Promise.all([
    fileExists(htmlPath),
    fileExists(pngPath),
  ]);

  if (!htmlExists || !pngExists) {
    addFail(
      report,
      "email output completeness",
      `expected html and png outputs, found html=${htmlExists}, png=${pngExists}`,
    );
  } else {
    addPass(
      report,
      "email output completeness",
      `${manifest.outputs.htmlPath} and ${manifest.outputs.pngPath} present`,
    );
  }

  if (pngExists) {
    const dimensions = await readPngDimensions(pngPath);
    if (
      dimensions.width !== manifest.dimensions.width ||
      dimensions.height !== manifest.dimensions.height
    ) {
      addFail(
        report,
        "email PNG dimensions",
        `expected ${manifest.dimensions.width}x${manifest.dimensions.height}, found ${dimensions.width}x${dimensions.height}`,
      );
    } else {
      addPass(
        report,
        "email PNG dimensions",
        `${dimensions.width}x${dimensions.height}`,
      );
    }

    if (dimensions.width > 380) {
      addFail(
        report,
        "email mobile-first width",
        `expected width <= 380px for phone-friendly rendering, found ${dimensions.width}px`,
      );
    } else {
      addPass(
        report,
        "email mobile-first width",
        `${dimensions.width}px`,
      );
    }
  }

  if (htmlExists) {
    const html = await fs.readFile(htmlPath, "utf8");
    const requiredHtmlFields = [brand.metadata.contactName, brand.metadata.homeUrl];

    if (options.profile === "business") {
      requiredHtmlFields.push(
        brand.displayName,
        collateral.email?.roleLine ?? collateral.positioning.primaryRole,
        brand.metadata.contactEmail,
        brand.metadata.workWithMeUrl,
        collateral.ctas.primaryCTA.label,
      );

      if (brand.metadata.linkedinUrl) {
        requiredHtmlFields.push("LinkedIn");
      }

      const subline =
        collateral.email?.subline ??
        `${collateral.positioning.tagline ?? collateral.positioning.oneLiner} ${collateral.positioning.problemSummary ?? collateral.positioning.shortPromise}`;

      if (subline) {
        requiredHtmlFields.push(subline);
      }
    }

    const missingFields = requiredHtmlFields.filter(
      (field) => !html.includes(escapeHtmlText(field)),
    );
    if (options.profile === "personal") {
      const logoAlt = `${brand.displayName} logo`;
      if (!html.includes(`alt="${escapeHtmlText(logoAlt)}"`)) {
        missingFields.push(logoAlt);
      }
    }
    if (missingFields.length > 0) {
      addFail(
        report,
        "email required HTML fields",
        `missing ${missingFields.join(", ")}`,
      );
    } else {
      addPass(
        report,
        "email required HTML fields",
        options.profile === "personal"
          ? "name, home URL, and logo present"
          : "brand, name, role, email, Work With Me link, tagline, and optional LinkedIn present",
      );
    }
  }

  const expectedDisplayUrl = toDisplayUrl(brand.metadata.homeUrl);
  if (manifest.preflight.expectedDisplayUrl !== expectedDisplayUrl) {
    addFail(
      report,
      "email expected display URL",
      `expected ${expectedDisplayUrl}, found ${manifest.preflight.expectedDisplayUrl}`,
    );
  } else {
    addPass(report, "email expected display URL", manifest.preflight.expectedDisplayUrl);
  }

  if (manifest.preflight.expectedHomeUrl !== brand.metadata.homeUrl) {
    addFail(
      report,
      "email home URL",
      `expected ${brand.metadata.homeUrl}, found ${manifest.preflight.expectedHomeUrl}`,
    );
  } else {
    addPass(report, "email home URL", manifest.preflight.expectedHomeUrl);
  }

  if (
    options.profile === "business" &&
    manifest.preflight.expectedWorkWithMeUrl !== brand.metadata.workWithMeUrl
  ) {
    addFail(
      report,
      "email Work With Me URL",
      `expected ${brand.metadata.workWithMeUrl}, found ${manifest.preflight.expectedWorkWithMeUrl}`,
    );
  } else if (options.profile === "business") {
    addPass(report, "email Work With Me URL", manifest.preflight.expectedWorkWithMeUrl ?? "");
  }

  if (
    !manifest.preflight.assetExistenceVerified ||
    !manifest.preflight.outputCompletenessVerified ||
    !manifest.preflight.dimensionsVerified ||
    !manifest.preflight.requiredFieldsVerified
  ) {
    addFail(report, "email preflight flags", JSON.stringify(manifest.preflight));
  } else {
    addPass(
      report,
      "email preflight flags",
      "asset existence, output completeness, dimensions, and required fields verified",
    );
  }

  if (manifest.vendorReadiness !== "production-candidate") {
    addFail(
      report,
      "email vendor readiness",
      `expected production-candidate, found ${manifest.vendorReadiness}`,
    );
  } else {
    addPass(report, "email vendor readiness", manifest.vendorReadiness);
  }

  logVerificationReport("Email signature manifest and preflight verification", report);
  assertVerificationPassed(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
