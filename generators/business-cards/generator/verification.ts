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

type ManifestEntry = {
  cardId: string;
  outputPath: string;
  width: number;
  height: number;
  hasGuides: boolean;
  pdfGenerated: boolean;
  pdfPath?: string;
  timestamp: string;
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

function isIsoDate(value: string) {
  return !Number.isNaN(Date.parse(value));
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

export async function verifyExportManifests(
  exportPaths: string[],
  options: { guides: boolean; pdf: boolean },
) {
  const report: VerificationReport = {
    passed: [],
    failed: [],
  };

  const folderToExports = new Map<string, string[]>();
  for (const exportPath of exportPaths) {
    const folder = path.dirname(exportPath);
    const current = folderToExports.get(folder) ?? [];
    current.push(exportPath);
    folderToExports.set(folder, current);
  }

  for (const [folderPath, folderExports] of Array.from(folderToExports.entries())) {
    const manifestPath = path.join(folderPath, "export-manifest.json");
    let entries: ManifestEntry[];

    try {
      const contents = await fs.readFile(manifestPath, "utf8");
      entries = JSON.parse(contents) as ManifestEntry[];
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown read error";
      addFail(
        report,
        "Export manifest",
        `${path.relative(process.cwd(), manifestPath)} missing or unreadable: ${message}`,
      );
      continue;
    }

    if (!Array.isArray(entries) || entries.length === 0) {
      addFail(
        report,
        "Export manifest entries",
        `${path.relative(process.cwd(), manifestPath)} is empty or invalid`,
      );
      continue;
    }

    addPass(
      report,
      "Export manifest",
      `${path.relative(process.cwd(), manifestPath)} present with ${entries.length} entries`,
    );

    const expectedEntries = folderExports.flatMap((exportPath) => {
      const cleanRelative = path.relative(process.cwd(), exportPath);
      const entrySet = [
        {
          outputPath: cleanRelative,
          hasGuides: false,
          pdfGenerated: !options.guides && options.pdf,
          pdfPath:
            !options.guides && options.pdf
              ? cleanRelative.replace(/\.png$/, ".pdf")
              : undefined,
        },
      ];

      if (options.guides) {
        const guideRelative = cleanRelative.replace(/\.png$/, "-guides.png");
        entrySet.push({
          outputPath: guideRelative,
          hasGuides: true,
          pdfGenerated: options.pdf,
          pdfPath: options.pdf
            ? guideRelative.replace(/\.png$/, ".pdf")
            : undefined,
        });
      }

      return entrySet;
    });

    if (entries.length !== expectedEntries.length) {
      addFail(
        report,
        "Export manifest entry count",
        `${path.relative(process.cwd(), manifestPath)} expected ${expectedEntries.length} entries, found ${entries.length}`,
      );
    } else {
      addPass(
        report,
        "Export manifest entry count",
        `${path.relative(process.cwd(), manifestPath)} has expected entry count`,
      );
    }

    for (const expectedEntry of expectedEntries) {
      const actual = entries.find(
        (entry) =>
          entry.outputPath === expectedEntry.outputPath &&
          entry.hasGuides === expectedEntry.hasGuides,
      );

      if (!actual) {
        addFail(
          report,
          "Export manifest output",
          `${path.relative(process.cwd(), manifestPath)} missing ${expectedEntry.outputPath}`,
        );
        continue;
      }

      if (path.isAbsolute(actual.outputPath)) {
        addFail(
          report,
          "Export manifest path style",
          `${path.relative(process.cwd(), manifestPath)} stores absolute outputPath ${actual.outputPath}`,
        );
      } else {
        addPass(
          report,
          "Export manifest path style",
          `${actual.outputPath} is relative`,
        );
      }

      if (actual.width !== CARD_WIDTH || actual.height !== CARD_HEIGHT) {
        addFail(
          report,
          "Export manifest dimensions",
          `${actual.outputPath} expected ${CARD_WIDTH}x${CARD_HEIGHT}, found ${actual.width}x${actual.height}`,
        );
      } else {
        addPass(
          report,
          "Export manifest dimensions",
          `${actual.outputPath} ${actual.width}x${actual.height}`,
        );
      }

      if (actual.pdfGenerated !== expectedEntry.pdfGenerated) {
        addFail(
          report,
          "Export manifest PDF flag",
          `${actual.outputPath} expected pdfGenerated=${expectedEntry.pdfGenerated}, found ${actual.pdfGenerated}`,
        );
      } else {
        addPass(
          report,
          "Export manifest PDF flag",
          `${actual.outputPath} pdfGenerated=${actual.pdfGenerated}`,
        );
      }

      if (expectedEntry.pdfGenerated) {
        if (actual.pdfPath !== expectedEntry.pdfPath) {
          addFail(
            report,
            "Export manifest PDF path",
            `${actual.outputPath} expected pdfPath=${expectedEntry.pdfPath}, found ${actual.pdfPath ?? "missing"}`,
          );
        } else if (actual.pdfPath && path.isAbsolute(actual.pdfPath)) {
          addFail(
            report,
            "Export manifest PDF path style",
            `${actual.outputPath} stores absolute pdfPath ${actual.pdfPath}`,
          );
        } else {
          addPass(
            report,
            "Export manifest PDF path",
            `${actual.outputPath} -> ${actual.pdfPath}`,
          );
        }
      }

      if (!actual.cardId.trim()) {
        addFail(
          report,
          "Export manifest card id",
          `${actual.outputPath} is missing cardId`,
        );
      } else {
        addPass(
          report,
          "Export manifest card id",
          `${actual.outputPath} -> ${actual.cardId}`,
        );
      }

      if (!isIsoDate(actual.timestamp)) {
        addFail(
          report,
          "Export manifest timestamp",
          `${actual.outputPath} has invalid timestamp ${actual.timestamp}`,
        );
      } else {
        addPass(
          report,
          "Export manifest timestamp",
          `${actual.outputPath} ${actual.timestamp}`,
        );
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
