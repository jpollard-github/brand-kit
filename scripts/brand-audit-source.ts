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
const allowedFiles = new Set([
  "design-system/brands/arcadeghosts.ts",
]);
const allowedPatterns = [
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
const scanExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

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

async function auditFile(filePath: string) {
  const relativePath = path.relative(repoRootDir, filePath).replaceAll("\\", "/");
  const contents = await fs.readFile(filePath, "utf8");
  const findings: Array<{ label: string; count: number }> = [];

  for (const pattern of allowedPatterns) {
    const matches = contents.match(pattern.matcher);
    if (matches?.length) {
      findings.push({ label: pattern.label, count: matches.length });
    }
  }

  if (!findings.length) {
    return [];
  }

  return findings.map((finding) => ({
    path: relativePath,
    ...finding,
  }));
}

async function main() {
  const files = (
    await Promise.all(
      scanRoots.map((root) => collectFiles(path.join(repoRootDir, root))),
    )
  ).flat();

  const findings = (await Promise.all(files.map((filePath) => auditFile(filePath))))
    .flat();

  if (!findings.length) {
    console.log("Source audit passed: no ArcadeGhosts-specific strings found in reusable code.");
    return;
  }

  console.warn("Source audit warnings:");
  for (const finding of findings) {
    console.warn(
      `- ${finding.path}: ${finding.label} (${finding.count})`,
    );
  }
  console.warn(
    "Warnings are non-blocking for now. Future TODO: promote reusable-code violations to build failures once a second brand validates the abstraction.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
