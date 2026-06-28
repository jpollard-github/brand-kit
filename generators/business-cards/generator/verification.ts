import { promises as fs } from "node:fs";
import path from "node:path";

import type { BrandConfig } from "../../../design-system/brand-config";
import { CARD_HEIGHT, CARD_WIDTH } from "./theme";

export type CopySet = {
  workFront: string[];
  workBack: string[];
  arcadeFront: string[];
  arcadeBack: string[];
};

export type AssetPaths = {
  logoPath: string;
  workQrPath: string;
  arcadeQrPath: string;
};

export type VerificationItem = {
  label: string;
  detail: string;
};

export type VerificationReport = {
  passed: VerificationItem[];
  failed: VerificationItem[];
};

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, "");
}

function normalizeDisplayUrl(value: string) {
  return value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function readWorkBack(lines: string[]) {
  return {
    url: lines[0] ?? "",
    email: lines[1] ?? "",
  };
}

function readArcadeBack(lines: string[]) {
  return {
    url: lines[0] ?? "",
  };
}

function addPass(report: VerificationReport, label: string, detail: string) {
  report.passed.push({ label, detail });
}

function addFail(report: VerificationReport, label: string, detail: string) {
  report.failed.push({ label, detail });
}

async function readSvgDesc(filePath: string) {
  const svg = await fs.readFile(filePath, "utf8");
  const match = svg.match(/<desc>([^<]+)<\/desc>/i);
  return match?.[1]?.trim() ?? "";
}

function validateUrlHost(
  report: VerificationReport,
  label: string,
  urlValue: string,
  expectedDomain: string,
) {
  try {
    const parsed = new URL(urlValue);
    const actualDomain = normalizeHostname(parsed.hostname);
    const normalizedExpected = normalizeHostname(expectedDomain);

    if (actualDomain !== normalizedExpected) {
      addFail(
        report,
        label,
        `expected host ${normalizedExpected}, found ${actualDomain} in ${urlValue}`,
      );
      return;
    }

    addPass(report, label, `${urlValue} uses ${normalizedExpected}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown URL parse error";
    addFail(report, label, `could not parse ${urlValue}: ${message}`);
  }
}

function validateDisplayUrl(
  report: VerificationReport,
  label: string,
  actual: string,
  expected: string,
) {
  if (normalizeDisplayUrl(actual) !== normalizeDisplayUrl(expected)) {
    addFail(report, label, `expected ${expected}, found ${actual}`);
    return;
  }

  addPass(report, label, `${actual} matches expected printed URL`);
}

function validateExactValue(
  report: VerificationReport,
  label: string,
  actual: string,
  expected: string,
) {
  if (actual.trim() !== expected.trim()) {
    addFail(report, label, `expected ${expected}, found ${actual}`);
    return;
  }

  addPass(report, label, `${actual} matches expected value`);
}

export async function verifyBusinessCardSources(
  brandConfig: BrandConfig,
  copy: CopySet,
  assets: AssetPaths,
) {
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  validateUrlHost(
    report,
    "Home URL domain",
    brandConfig.metadata.homeUrl,
    brandConfig.metadata.canonicalDomain,
  );
  validateUrlHost(
    report,
    "Work With Me URL domain",
    brandConfig.metadata.workWithMeUrl,
    brandConfig.metadata.canonicalDomain,
  );

  const workBack = readWorkBack(copy.workBack);
  const arcadeBack = readArcadeBack(copy.arcadeBack);
  const expectedHomeDisplay = normalizeDisplayUrl(brandConfig.metadata.homeUrl);
  const expectedWorkDisplay = normalizeDisplayUrl(
    brandConfig.metadata.workWithMeUrl,
  );

  validateDisplayUrl(
    report,
    "Printed Work With Me URL",
    workBack.url,
    expectedWorkDisplay,
  );
  validateExactValue(
    report,
    "Printed email",
    workBack.email,
    brandConfig.metadata.contactEmail,
  );
  validateDisplayUrl(
    report,
    "Printed ArcadeGhosts URL",
    arcadeBack.url,
    expectedHomeDisplay,
  );

  const [workQrTarget, arcadeQrTarget] = await Promise.all([
    readSvgDesc(assets.workQrPath),
    readSvgDesc(assets.arcadeQrPath),
  ]);

  validateExactValue(
    report,
    "Work With Me QR target",
    workQrTarget,
    brandConfig.metadata.workWithMeUrl,
  );
  validateExactValue(
    report,
    "ArcadeGhosts QR target",
    arcadeQrTarget,
    brandConfig.metadata.homeUrl,
  );

  validateDisplayUrl(
    report,
    "Printed Work With Me URL matches QR",
    workBack.url,
    workQrTarget,
  );
  validateDisplayUrl(
    report,
    "Printed ArcadeGhosts URL matches QR",
    arcadeBack.url,
    arcadeQrTarget,
  );

  return report;
}

export async function verifyExportArtifacts(
  exportPaths: string[],
  options: { guides: boolean; pdf: boolean },
) {
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  for (const exportPath of exportPaths) {
    const variants = [exportPath];
    if (options.guides) {
      variants.push(exportPath.replace(/\.png$/, "-guides.png"));
    }

    for (const filePath of variants) {
      try {
        const buffer = await fs.readFile(filePath);
        const isPng = buffer.toString("ascii", 1, 4) === "PNG";
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);

        if (!isPng) {
          addFail(report, "PNG export", `${filePath} is not a PNG file`);
        } else if (width !== CARD_WIDTH || height !== CARD_HEIGHT) {
          addFail(
            report,
            "PNG dimensions",
            `${filePath} expected ${CARD_WIDTH}x${CARD_HEIGHT}, found ${width}x${height}`,
          );
        } else {
          addPass(
            report,
            "PNG export",
            `${path.relative(process.cwd(), filePath)} ${width}x${height}`,
          );
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown read error";
        addFail(report, "PNG export", `${filePath} missing or unreadable: ${message}`);
      }
    }

    if (options.pdf) {
      const pdfPath = options.guides
        ? exportPath.replace(/\.png$/, "-guides.pdf")
        : exportPath.replace(/\.png$/, ".pdf");

      try {
        const stats = await fs.stat(pdfPath);
        addPass(
          report,
          "PDF export",
          `${path.relative(process.cwd(), pdfPath)} ${stats.size} bytes`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown stat error";
        addFail(report, "PDF export", `${pdfPath} missing or unreadable: ${message}`);
      }
    }
  }

  return report;
}

export function assertVerificationPassed(report: VerificationReport) {
  if (report.failed.length === 0) {
    return;
  }

  const message = report.failed
    .map((item) => `${item.label}: ${item.detail}`)
    .join("\n");
  throw new Error(`Brand verification failed:\n${message}`);
}

export function logVerificationReport(title: string, report: VerificationReport) {
  console.log(title);

  for (const item of report.passed) {
    console.log(`  [pass] ${item.label}: ${item.detail}`);
  }

  for (const item of report.failed) {
    console.log(`  [fail] ${item.label}: ${item.detail}`);
  }
}
