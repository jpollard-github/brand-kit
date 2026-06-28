import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "..");

const scanRoots = ["design-system", "generators"];
const excludedSegments = new Set([
  "generators/outputs/",
  "generators/business-cards/arcadeghosts/",
  "generators/business-cards/work-with-me/",
  "archive/",
  "vschats/",
]);
const allowedFiles = new Set(["design-system/brands/arcadeghosts.ts"]);
const scanExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

type AuditPattern = {
  label: string;
  matcher: RegExp;
};

type AuditClassification =
  | "acceptable brand-specific reference"
  | "docs-only reference"
  | "reusable-code leak"
  | "false positive";

type AuditSeverity = "high" | "medium" | "low";

type AuditFinding = {
  path: string;
  label: string;
  count: number;
};

type ClassifiedFinding = AuditFinding & {
  classification: AuditClassification;
  severity: AuditSeverity;
  note: string;
};

type ClassificationRule = {
  match: (finding: AuditFinding) => boolean;
  classification: AuditClassification;
  severity: AuditSeverity;
  note: string;
};

const auditPatterns: AuditPattern[] = [
  {
    label: "ArcadeGhosts display name",
    matcher: /\bArcadeGhosts\b/g,
  },
  {
    label: "ArcadeGhosts id/domain fragment",
    matcher: /\barcadeghosts\b/gi,
  },
  {
    label: "ArcadeGhosts canonical domain",
    matcher: /\barcadeghosts\.org\b/gi,
  },
  {
    label: "ArcadeGhosts contact email",
    matcher: /\bjason@arcadeghosts\.org\b/gi,
  },
];

const entrypointDefaults = new Set([
  "generators/mugs/generate-mugs.ts",
  "generators/newsletter/generate-header.ts",
  "generators/posters/generate-mini-flyer.ts",
  "generators/presentations/generate-cover.ts",
  "generators/projects/generate-cover.ts",
  "generators/shirts/generate-shirts.ts",
  "generators/stickers/generate-sticker-sheet.ts",
  "generators/video/generate-stream-thumbnail.ts",
  "generators/wallpapers/generate-wallpapers.ts",
  "generators/website/generate-hero-image.ts",
  "generators/website/prepare-handoff.ts",
  "generators/preview/generate-theme-preview-sheets.ts",
]);

const classificationRules: ClassificationRule[] = [
  {
    match: (finding) => finding.path === "design-system/brand-config.ts",
    classification: "acceptable brand-specific reference",
    severity: "low",
    note: "Registry/default-brand wiring intentionally references the first live brand.",
  },
  {
    match: (finding) =>
      finding.path === "generators/business-cards/generator/verification.ts",
    classification: "acceptable brand-specific reference",
    severity: "low",
    note: "Business-card verification labels still name the current brand surfaces explicitly.",
  },
  {
    match: (finding) =>
      finding.path === "generators/preview/generate-preview-sheet.ts",
    classification: "acceptable brand-specific reference",
    severity: "medium",
    note: "Preview copy intentionally names the current brand examples, but this review layer is still brand-weighted.",
  },
  {
    match: (finding) => entrypointDefaults.has(finding.path),
    classification: "acceptable brand-specific reference",
    severity: "medium",
    note: "Generator entrypoint defaults still seed from ArcadeGhosts and should be generalized as each family matures.",
  },
  {
    match: (finding) =>
      finding.path === "generators/business-cards/generator/export-cards.ts" ||
      finding.path === "generators/business-cards/generator/theme.ts" ||
      finding.path === "generators/business-cards/generator/verify-brand.ts",
    classification: "reusable-code leak",
    severity: "high",
    note: "Legacy business-card workflow still hard-codes ArcadeGhosts-specific IDs, slots, or fallback paths.",
  },
  {
    match: () => true,
    classification: "reusable-code leak",
    severity: "high",
    note: "Reusable code still contains ArcadeGhosts-specific strings that should eventually come from brand config or brand data.",
  },
];

function shouldExclude(relativePath: string) {
  if (allowedFiles.has(relativePath)) {
    return true;
  }

  for (const segment of excludedSegments) {
    if (relativePath.startsWith(segment)) {
      return true;
    }
  }

  return false;
}

async function collectFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(repoRootDir, fullPath).replaceAll("\\", "/");

    if (shouldExclude(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (scanExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function auditFile(filePath: string): Promise<AuditFinding[]> {
  const relativePath = path.relative(repoRootDir, filePath).replaceAll("\\", "/");
  const contents = await fs.readFile(filePath, "utf8");
  const findings: AuditFinding[] = [];

  for (const pattern of auditPatterns) {
    const matches = contents.match(pattern.matcher);
    if (matches?.length) {
      findings.push({
        path: relativePath,
        label: pattern.label,
        count: matches.length,
      });
    }
  }

  return findings;
}

function classifyFinding(finding: AuditFinding): ClassifiedFinding {
  const matchedRule =
    classificationRules.find((rule) => rule.match(finding)) ??
    classificationRules[classificationRules.length - 1];

  return {
    ...finding,
    classification: matchedRule.classification,
    severity: matchedRule.severity,
    note: matchedRule.note,
  };
}

function severityOrder(severity: AuditSeverity) {
  return {
    high: 0,
    medium: 1,
    low: 2,
  }[severity];
}

function classificationOrder(classification: AuditClassification) {
  return {
    "reusable-code leak": 0,
    "acceptable brand-specific reference": 1,
    "docs-only reference": 2,
    "false positive": 3,
  }[classification];
}

function printSummary(findings: ClassifiedFinding[]) {
  const severitySummary = new Map<AuditSeverity, { files: Set<string>; matches: number }>();
  const classificationSummary = new Map<
    AuditClassification,
    { files: Set<string>; matches: number }
  >();

  for (const finding of findings) {
    const severityBucket = severitySummary.get(finding.severity) ?? {
      files: new Set<string>(),
      matches: 0,
    };
    severityBucket.files.add(finding.path);
    severityBucket.matches += finding.count;
    severitySummary.set(finding.severity, severityBucket);

    const classificationBucket = classificationSummary.get(finding.classification) ?? {
      files: new Set<string>(),
      matches: 0,
    };
    classificationBucket.files.add(finding.path);
    classificationBucket.matches += finding.count;
    classificationSummary.set(finding.classification, classificationBucket);
  }

  console.warn("Source audit summary:");
  for (const severity of ["high", "medium", "low"] as const) {
    const bucket = severitySummary.get(severity);
    const fileCount = bucket?.files.size ?? 0;
    const matchCount = bucket?.matches ?? 0;
    console.warn(`- ${severity}: ${fileCount} files, ${matchCount} matches`);
  }

  console.warn("Classification summary:");
  for (const classification of [
    "reusable-code leak",
    "acceptable brand-specific reference",
    "docs-only reference",
    "false positive",
  ] as const) {
    const bucket = classificationSummary.get(classification);
    const fileCount = bucket?.files.size ?? 0;
    const matchCount = bucket?.matches ?? 0;
    console.warn(`- ${classification}: ${fileCount} files, ${matchCount} matches`);
  }
}

function printGroupedFindings(findings: ClassifiedFinding[]) {
  const grouped = new Map<string, ClassifiedFinding[]>();

  for (const finding of findings) {
    const groupKey = `${finding.severity}|${finding.classification}`;
    const current = grouped.get(groupKey) ?? [];
    current.push(finding);
    grouped.set(groupKey, current);
  }

  const sortedGroups = [...grouped.entries()].sort(([leftKey], [rightKey]) => {
    const [leftSeverity, leftClassification] = leftKey.split("|") as [
      AuditSeverity,
      AuditClassification,
    ];
    const [rightSeverity, rightClassification] = rightKey.split("|") as [
      AuditSeverity,
      AuditClassification,
    ];

    return (
      severityOrder(leftSeverity) - severityOrder(rightSeverity) ||
      classificationOrder(leftClassification) -
        classificationOrder(rightClassification)
    );
  });

  for (const [groupKey, groupFindings] of sortedGroups) {
    const [severity, classification] = groupKey.split("|") as [
      AuditSeverity,
      AuditClassification,
    ];
    console.warn(`${severity.toUpperCase()} / ${classification}`);

    const sortedFindings = [...groupFindings].sort((left, right) => {
      return left.path.localeCompare(right.path) || left.label.localeCompare(right.label);
    });

    for (const finding of sortedFindings) {
      console.warn(
        `- ${finding.path}: ${finding.label} (${finding.count})`,
      );
      console.warn(`  note: ${finding.note}`);
    }
  }
}

async function main() {
  const files = (
    await Promise.all(
      scanRoots.map((root) => collectFiles(path.join(repoRootDir, root))),
    )
  ).flat();

  const rawFindings = (await Promise.all(files.map((filePath) => auditFile(filePath))))
    .flat();

  if (!rawFindings.length) {
    console.log("Source audit passed: no ArcadeGhosts-specific strings found in reusable code.");
    return;
  }

  const classifiedFindings = rawFindings.map(classifyFinding);

  console.warn("Source audit warnings:");
  printSummary(classifiedFindings);
  printGroupedFindings(classifiedFindings);
  console.warn(
    "Warnings remain non-blocking for now. High-severity reusable-code leaks should shrink before stricter enforcement is considered.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
