import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "..");
const execFileAsync = promisify(execFile);

type OutputRecord = {
  relativePath: string;
  size: number;
  modifiedAt: string;
};

type ReadinessVerdict = {
  asset: string;
  exists: boolean;
  currentStatus: string;
  clientSendable: string;
  blockingIssue: string;
};

type TodoSectionSummary = {
  sectionText: string;
  openCount: number;
  doneCount: number;
  immediateOpen: string[];
  nearTermOpen: string[];
  laterOpen: string[];
};

const reviewedDocs = [
  "README.md",
  "TODO.md",
  "docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md",
  "docs/CLIENT-COLLATERAL.md",
  "docs/PRODUCTION-CHECKLIST.md",
  "docs/MANUAL-INSTRUCTIONS.md",
  "docs/BUSINESS-LINKS-CONTRACT.md",
  "docs/OUTPUTS-AND-REVIEW-PACKETS.md",
];

const generatorStatusFiles = [
  "generators/client-collateral/generate-client-collateral.ts",
  "generators/client-collateral/verify-capability-sheet.ts",
  "generators/website/prepare-handoff.ts",
  "generators/email/generate-signature.ts",
  "generators/email/verify-email-signature.ts",
  "generators/business-cards/generator/export-cards.ts",
];

const outputCopies = [
  "generators/outputs/client-collateral/arcadeghosts-capability-sheet.html",
  "generators/outputs/client-collateral/arcadeghosts-capability-sheet.pdf",
  "generators/outputs/client-collateral/arcadeghosts-capability-sheet.png",
  "generators/outputs/client-collateral/arcadeghosts-capability-sheet.manifest.json",
  "generators/outputs/client-collateral/arcadeghosts-proposal-cover.html",
  "generators/outputs/client-collateral/arcadeghosts-proposal-cover.pdf",
  "generators/outputs/client-collateral/arcadeghosts-proposal-cover.png",
  "generators/outputs/client-collateral/arcadeghosts-discovery-call.html",
  "generators/outputs/client-collateral/arcadeghosts-discovery-call.pdf",
  "generators/outputs/client-collateral/arcadeghosts-discovery-call.png",
  "generators/outputs/client-collateral/arcadeghosts-case-study-template.html",
  "generators/outputs/client-collateral/arcadeghosts-case-study-template.pdf",
  "generators/outputs/client-collateral/arcadeghosts-case-study-template.png",
  "generators/outputs/email/arcadeghosts-email-signature.html",
  "generators/outputs/email/arcadeghosts-email-signature.png",
  "generators/outputs/email/arcadeghosts-email-signature.manifest.json",
  "generators/business-cards/work-with-me/exports/front-final.png",
  "generators/business-cards/work-with-me/exports/back-final.png",
  "generators/business-cards/work-with-me/exports/front-final-guides.png",
  "generators/business-cards/work-with-me/exports/back-final-guides.png",
  "generators/business-cards/work-with-me/exports/front-final-guides.pdf",
  "generators/business-cards/work-with-me/exports/back-final-guides.pdf",
];

const sourceBundle =
  "consulting-business/repo-todos/brand-kit/2026-07-02-211756/";
const acceptedWorkOrders = [
  "BK-WO-001 - Capability Sheet Warm-Lead Refresh",
  "BK-WO-002 - First-Touch Asset Alignment",
  "BK-WO-003 - Discovery Guide Post-Interest Alignment (narrow scope)",
];
const deferredWorkOrders = [
  "BK-WO-004 - Work-With-Me Handoff Pack",
  "BK-WO-005 - First-Client Asset Proofing",
  "BK-WO-006 - Proposal Cover Later-Stage Alignment",
];

function createTimestamp(now = new Date()): string {
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

function zipFileName(timestamp: string): string {
  return `brand-kit-work-with-me-review-packet-${timestamp}.zip`;
}

async function ensureDir(targetPath: string) {
  await fs.mkdir(targetPath, { recursive: true });
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureUniquePath(targetPath: string) {
  if (!(await pathExists(targetPath))) {
    return targetPath;
  }

  let suffix = 2;
  while (true) {
    const parsed = path.parse(targetPath);
    const candidate = path.join(
      parsed.dir,
      parsed.ext ? `${parsed.name}-${suffix}${parsed.ext}` : `${parsed.base}-${suffix}`,
    );

    if (!(await pathExists(candidate))) {
      return candidate;
    }

    suffix += 1;
  }
}

async function readText(relativePath: string) {
  const absolutePath = path.join(repoRootDir, relativePath);
  return fs.readFile(absolutePath, "utf8");
}

async function copyFileIfPresent(sourceRelativePath: string, packetRoot: string) {
  const sourcePath = path.join(repoRootDir, sourceRelativePath);
  if (!(await pathExists(sourcePath))) {
    return false;
  }

  const targetPath = path.join(packetRoot, "artifacts", sourceRelativePath);
  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function copyDirIfPresent(sourceRelativePath: string, packetRoot: string) {
  const sourcePath = path.join(repoRootDir, sourceRelativePath);
  if (!(await pathExists(sourcePath))) {
    return false;
  }

  const targetPath = path.join(packetRoot, "artifacts", sourceRelativePath);
  await ensureDir(path.dirname(targetPath));
  await fs.cp(sourcePath, targetPath, { recursive: true });
  return true;
}

async function zipPacketDirectory(sourceDir: string, zipPath: string) {
  await execFileAsync("zip", ["-qr", zipPath, "."], { cwd: sourceDir });
}

async function runGit(args: string[]) {
  try {
    const { stdout } = await execFileAsync("git", args, { cwd: repoRootDir });
    return stdout.trim();
  } catch (error) {
    return `git command failed: ${String(error)}`;
  }
}

function extractSection(content: string, heading: string) {
  const startMarker = `## ${heading}`;
  const startIndex = content.indexOf(startMarker);

  if (startIndex === -1) {
    return "";
  }

  const remainder = content.slice(startIndex + startMarker.length);
  const endMatch = remainder.match(/\n##\s+/);
  const endIndex = endMatch?.index ?? remainder.length;
  return `${startMarker}${remainder.slice(0, endIndex)}`.trim();
}

function parseTodoSection(sectionText: string): TodoSectionSummary {
  const lines = sectionText.split(/\r?\n/);
  const openCount = lines.filter((line) => line.trim().startsWith("- [ ]")).length;
  const doneCount = lines.filter((line) => line.trim().startsWith("- [x]")).length;

  let currentBucket: "Immediate" | "Near-term" | "Later" | "" = "";
  const immediateOpen: string[] = [];
  const nearTermOpen: string[] = [];
  const laterOpen: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "### Immediate") {
      currentBucket = "Immediate";
      continue;
    }

    if (line === "### Near-term") {
      currentBucket = "Near-term";
      continue;
    }

    if (line === "### Later") {
      currentBucket = "Later";
      continue;
    }

    if (!line.startsWith("- [ ]")) {
      continue;
    }

    const task = line.replace(/^- \[ \]\s*/, "");
    if (currentBucket === "Immediate") {
      immediateOpen.push(task);
    } else if (currentBucket === "Near-term") {
      nearTermOpen.push(task);
    } else if (currentBucket === "Later") {
      laterOpen.push(task);
    }
  }

  return {
    sectionText,
    openCount,
    doneCount,
    immediateOpen,
    nearTermOpen,
    laterOpen,
  };
}

async function collectOutputRecords(relativePaths: string[]) {
  const records: OutputRecord[] = [];

  for (const relativePath of relativePaths) {
    const absolutePath = path.join(repoRootDir, relativePath);
    if (!(await pathExists(absolutePath))) {
      continue;
    }

    const stats = await fs.stat(absolutePath);
    records.push({
      relativePath,
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    });
  }

  return records;
}

async function collectRecentOutputs() {
  const roots = [
    "generators/outputs/client-collateral",
    "generators/outputs/email",
    "generators/business-cards/work-with-me/exports",
  ];

  const collected: OutputRecord[] = [];

  for (const root of roots) {
    const absoluteRoot = path.join(repoRootDir, root);
    if (!(await pathExists(absoluteRoot))) {
      continue;
    }

    const entries = await fs.readdir(absoluteRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || entry.name === ".DS_Store") {
        continue;
      }

      const absolutePath = path.join(absoluteRoot, entry.name);
      const stats = await fs.stat(absolutePath);
      collected.push({
        relativePath: path.relative(repoRootDir, absolutePath),
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      });
    }
  }

  return collected
    .sort((left, right) => right.modifiedAt.localeCompare(left.modifiedAt))
    .slice(0, 15);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function hasOpenTask(todoSummary: TodoSectionSummary, pattern: string) {
  const normalizedPattern = pattern.toLowerCase();
  return [...todoSummary.immediateOpen, ...todoSummary.nearTermOpen, ...todoSummary.laterOpen].some((task) =>
    task.toLowerCase().includes(normalizedPattern),
  );
}

function hasOutput(outputRecords: OutputRecord[], suffix: string) {
  return outputRecords.some((record) => record.relativePath.endsWith(suffix));
}

function buildReadinessVerdicts(todoSummary: TodoSectionSummary, outputRecords: OutputRecord[]): ReadinessVerdict[] {
  const emailSignatureExists = hasOutput(outputRecords, "arcadeghosts-email-signature.html");
  const capabilitySheetExists = hasOutput(outputRecords, "arcadeghosts-capability-sheet.pdf");
  const workCardExists =
    outputRecords.some((record) => record.relativePath.endsWith("work-with-me/exports/front-final.png")) &&
    outputRecords.some((record) => record.relativePath.endsWith("work-with-me/exports/back-final.png"));
  const proposalCoverExists = hasOutput(outputRecords, "arcadeghosts-proposal-cover.pdf");
  const discoveryCallExists = hasOutput(outputRecords, "arcadeghosts-discovery-call.pdf");

  return [
    {
      asset: "Email Signature",
      exists: emailSignatureExists,
      currentStatus: emailSignatureExists ? "Production Candidate" : "missing",
      clientSendable: emailSignatureExists ? "yes / after mail-client proofing" : "no / missing output",
      blockingIssue: emailSignatureExists
        ? "real sent-email, mobile, and reply/forward proofing still required"
        : "email-signature output missing",
    },
    {
      asset: "Capability Sheet PDF",
      exists: capabilitySheetExists,
      currentStatus: capabilitySheetExists ? "Production Candidate" : "missing",
      clientSendable: capabilitySheetExists && !hasOpenTask(todoSummary, "capability sheet") ? "yes" : "no / needs proofing",
      blockingIssue: capabilitySheetExists
        ? "warm-lead copy and real outreach proofing not yet validated"
        : "capability-sheet PDF output missing",
    },
    {
      asset: "Work With Me Business Card",
      exists: workCardExists,
      currentStatus: workCardExists ? "Production Candidate" : "missing",
      clientSendable: workCardExists ? "yes / after checklist proofing" : "no / missing output",
      blockingIssue: workCardExists
        ? "QR, safe area, bleed, legibility, and print-readiness still require checklist proofing"
        : "Work-With-Me business-card outputs missing",
    },
    {
      asset: "Proposal Cover PDF",
      exists: proposalCoverExists,
      currentStatus: proposalCoverExists ? "Deferred" : "missing",
      clientSendable: proposalCoverExists ? "no / needs alignment" : "no / missing output",
      blockingIssue: proposalCoverExists
        ? "not yet aligned into the first-conversation collateral packet"
        : "proposal-cover PDF output missing",
    },
    {
      asset: "Discovery Call PDF",
      exists: discoveryCallExists,
      currentStatus: discoveryCallExists ? "Implementation Complete / Production Candidate" : "missing",
      clientSendable: discoveryCallExists ? "yes / after proofing in scheduled-call use" : "no / missing output",
      blockingIssue: discoveryCallExists
        ? "post-interest proofing and packet review still required"
        : "discovery-call PDF output missing",
    },
  ];
}

function summarizeDocHeadings(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("#"))
    .map((line) => line.replace(/^#+\s*/, ""))
    .slice(0, 5);
}

async function writeReadme(packetRoot: string, timestamp: string) {
  const contents = [
    "# Work-With-Me Review Packet",
    "",
    `Generated: ${timestamp}`,
    "Purpose: focused review packet for Work-With-Me / first-client collateral progress.",
    "",
    `Source bundle: \`${sourceBundle}\``,
    "",
    "Targeted work orders:",
    ...acceptedWorkOrders.map((workOrder) => `- ${workOrder}`),
    "",
    "Deferred work orders:",
    ...deferredWorkOrders.map((workOrder) => `- ${workOrder}`),
    "",
    "Files:",
    "- executive-summary.md",
    "- todo-status.md",
    "- collateral-status.md",
    "- generated-output-summary.md",
    "- gaps-and-risks.md",
    "- next-actions.md",
    "",
    "Artifacts copied when present:",
    "- key client-collateral outputs",
    "- default email signature outputs",
    "- Work-With-Me business-card export folder",
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "README.md"), `${contents}\n`, "utf8");
}

async function writeExecutiveSummary(
  packetRoot: string,
  todoSummary: TodoSectionSummary,
  generatorFilesPresent: string[],
  outputRecords: OutputRecord[],
  gitStatus: string,
  latestCommit: string,
) {
  const contents = [
    "# Executive Summary",
    "",
    "This packet reviews the current Work-With-Me / first-client collateral workstream in `brand-kit`.",
    "",
    "## Review Scope",
    "",
    `- Source bundle: \`${sourceBundle}\``,
    ...acceptedWorkOrders.map((workOrder) => `- Targeted: ${workOrder}`),
    ...deferredWorkOrders.map((workOrder) => `- Deferred: ${workOrder}`),
    "",
    "## Current Status",
    "",
    `- Work-With-Me open tasks in the dedicated TODO section: ${todoSummary.openCount}`,
    `- Completed tasks in that section: ${todoSummary.doneCount}`,
    `- Immediate open items: ${todoSummary.immediateOpen.length}`,
    `- Near-term open items: ${todoSummary.nearTermOpen.length}`,
    `- Later open items: ${todoSummary.laterOpen.length}`,
    `- Relevant generator/source files detected: ${generatorFilesPresent.length}/${generatorStatusFiles.length}`,
    `- Reviewed collateral outputs present: ${outputRecords.length}`,
    `- Git worktree currently dirty: ${gitStatus.length > 0 ? "yes" : "no"}`,
    "",
    "## Latest Commit",
    "",
    "```text",
    latestCommit || "No commit information available.",
    "```",
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "executive-summary.md"), `${contents}\n`, "utf8");
}

async function writeTodoStatus(packetRoot: string, todoSummary: TodoSectionSummary) {
  const contents = [
    "# TODO Status",
    "",
    `- Open tasks: ${todoSummary.openCount}`,
    `- Completed tasks: ${todoSummary.doneCount}`,
    "",
    "## Immediate Open Tasks",
    "",
    ...(todoSummary.immediateOpen.length > 0 ? todoSummary.immediateOpen.map((task) => `- ${task}`) : ["- None."]),
    "",
    "## Near-term Open Tasks",
    "",
    ...(todoSummary.nearTermOpen.length > 0 ? todoSummary.nearTermOpen.map((task) => `- ${task}`) : ["- None."]),
    "",
    "## Later Open Tasks",
    "",
    ...(todoSummary.laterOpen.length > 0 ? todoSummary.laterOpen.map((task) => `- ${task}`) : ["- None."]),
    "",
    "## Source Section Snapshot",
    "",
    "```md",
    todoSummary.sectionText || "Work-With-Me / First Client Collateral section not found.",
    "```",
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "todo-status.md"), `${contents}\n`, "utf8");
}

async function writeCollateralStatus(
  packetRoot: string,
  generatorFilesPresent: string[],
  docsSummary: Array<{ path: string; headings: string[] }>,
  gitStatus: string,
) {
  const contents = [
    "# Collateral Status",
    "",
    "## Relevant Generator / Workflow Files Present",
    "",
    ...generatorStatusFiles.map((file) => `- ${file}: ${generatorFilesPresent.includes(file) ? "present" : "missing"}`),
    "",
    "## Relevant Docs / Headings",
    "",
    ...docsSummary.flatMap((doc) => [
      `- \`${doc.path}\``,
      ...(doc.headings.length > 0 ? doc.headings.map((heading) => `  - ${heading}`) : ["  - No headings found."]),
    ]),
    "",
    "## Current Git Status",
    "",
    "```text",
    gitStatus || "Working tree clean.",
    "```",
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "collateral-status.md"), `${contents}\n`, "utf8");
}

async function writeGeneratedOutputSummary(
  packetRoot: string,
  outputRecords: OutputRecord[],
  recentOutputs: OutputRecord[],
  readinessVerdicts: ReadinessVerdict[],
) {
  const contents = [
    "# Generated Output Summary",
    "",
    "## Client-Sendable Readiness Verdict",
    "",
    "| Asset | Exists | Current Status | Client-Sendable? | Blocking Issue |",
    "| --- | --- | --- | --- | --- |",
    ...readinessVerdicts.map(
      (verdict) =>
        `| ${verdict.asset} | ${verdict.exists ? "yes" : "no"} | ${verdict.currentStatus} | ${verdict.clientSendable} | ${verdict.blockingIssue} |`,
    ),
    "",
    "## Key Work-With-Me / First-Client Outputs Present",
    "",
    ...(outputRecords.length > 0
      ? outputRecords.map(
          (record) =>
            `- \`${record.relativePath}\` | ${formatBytes(record.size)} | modified ${record.modifiedAt}`,
        )
      : ["- No key collateral outputs detected."]),
    "",
    "## Recent Relevant Output Activity",
    "",
    ...(recentOutputs.length > 0
      ? recentOutputs.map(
          (record) =>
            `- \`${record.relativePath}\` | ${formatBytes(record.size)} | modified ${record.modifiedAt}`,
        )
      : ["- No recent output activity detected in the reviewed paths."]),
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "generated-output-summary.md"), `${contents}\n`, "utf8");
}

async function writeGapsAndRisks(
  packetRoot: string,
  todoSummary: TodoSectionSummary,
  outputRecords: OutputRecord[],
  gitStatus: string,
) {
  const risks: string[] = [];

  if (todoSummary.immediateOpen.length > 0) {
    risks.push("Immediate Work-With-Me collateral items are still open, so the highest-priority outreach-support work is not complete yet.");
  }

  if (!outputRecords.some((record) => record.relativePath.endsWith("arcadeghosts-capability-sheet.pdf"))) {
    risks.push("Capability-sheet PDF output is missing, which blocks review of the core warm-lead leave-behind.");
  }

  if (!outputRecords.some((record) => record.relativePath.endsWith("arcadeghosts-email-signature.html"))) {
    risks.push("Email-signature HTML output is missing, which blocks review of the primary first-touch support asset.");
  }

  if (!outputRecords.some((record) => record.relativePath.endsWith("arcadeghosts-proposal-cover.pdf"))) {
    risks.push("Proposal-cover PDF output is missing, which weakens the first-conversation collateral family review.");
  }

  if (!outputRecords.some((record) => record.relativePath.endsWith("arcadeghosts-discovery-call.pdf"))) {
    risks.push("Discovery-call PDF output is missing, which limits review of the full first-conversation packet.");
  }

  if (gitStatus.length > 0) {
    risks.push("The git worktree has local changes, so packet conclusions should be read against an in-progress source state.");
  }

  const contents = [
    "# Gaps And Risks",
    "",
    ...(risks.length > 0 ? risks.map((risk) => `- ${risk}`) : ["- No obvious additional gaps detected beyond the open TODO items."]),
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "gaps-and-risks.md"), `${contents}\n`, "utf8");
}

async function writeNextActions(packetRoot: string, todoSummary: TodoSectionSummary) {
  const contents = [
    "# Next Actions",
    "",
    "Recommended next implementation actions from the current Work-With-Me TODO section:",
    "",
    ...(todoSummary.immediateOpen.length > 0
      ? todoSummary.immediateOpen.map((task) => `- Immediate: ${task}`)
      : ["- Immediate: no open immediate tasks detected."]),
    "",
    ...(todoSummary.nearTermOpen.length > 0
      ? todoSummary.nearTermOpen.map((task) => `- Near-term: ${task}`)
      : ["- Near-term: no open near-term tasks detected."]),
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "next-actions.md"), `${contents}\n`, "utf8");
}

async function writePacketMetadata(packetRoot: string) {
  const contents = [
    `Generated: ${new Date().toISOString()}`,
    "Purpose: Work-With-Me / first-client collateral review packet",
    "Use executive-summary.md first.",
  ].join("\n");

  await fs.writeFile(path.join(packetRoot, "PACKET-INFO.txt"), `${contents}\n`, "utf8");
}

async function refreshLatestCopy(sourcePacketRoot: string) {
  const latestRoot = path.join(repoRootDir, "review-packets", "latest-work-with-me");
  await fs.rm(latestRoot, { recursive: true, force: true });
  await fs.cp(sourcePacketRoot, latestRoot, { recursive: true });
}

async function main() {
  const timestamp = createTimestamp();
  const reviewPacketsRoot = path.join(repoRootDir, "review-packets");
  const packetRoot = await ensureUniquePath(path.join(reviewPacketsRoot, "work-with-me", timestamp));
  const zipPath = await ensureUniquePath(path.join(reviewPacketsRoot, zipFileName(timestamp)));

  await ensureDir(packetRoot);

  const todoContent = await readText("TODO.md");
  const todoSection = extractSection(todoContent, "Work-With-Me / First Client Collateral");
  const todoSummary = parseTodoSection(todoSection);

  const docsSummary = await Promise.all(
    reviewedDocs.map(async (relativePath) => {
      const content = await readText(relativePath);
      return {
        path: relativePath,
        headings: summarizeDocHeadings(content),
      };
    }),
  );

  const generatorFilesPresent = (
    await Promise.all(
      generatorStatusFiles.map(async (relativePath) =>
        (await pathExists(path.join(repoRootDir, relativePath))) ? relativePath : null,
      ),
    )
  ).filter((value): value is string => Boolean(value));

  const outputRecords = await collectOutputRecords(outputCopies);
  const recentOutputs = await collectRecentOutputs();
  const readinessVerdicts = buildReadinessVerdicts(todoSummary, outputRecords);

  for (const relativePath of outputCopies) {
    await copyFileIfPresent(relativePath, packetRoot);
  }
  await copyDirIfPresent("generators/business-cards/work-with-me/exports", packetRoot);

  const gitStatus = await runGit(["status", "--short"]);
  const latestCommit = await runGit(["log", "-1", "--stat", "--oneline"]);

  await writeReadme(packetRoot, timestamp);
  await writeExecutiveSummary(packetRoot, todoSummary, generatorFilesPresent, outputRecords, gitStatus, latestCommit);
  await writeTodoStatus(packetRoot, todoSummary);
  await writeCollateralStatus(packetRoot, generatorFilesPresent, docsSummary, gitStatus);
  await writeGeneratedOutputSummary(packetRoot, outputRecords, recentOutputs, readinessVerdicts);
  await writeGapsAndRisks(packetRoot, todoSummary, outputRecords, gitStatus);
  await writeNextActions(packetRoot, todoSummary);
  await writePacketMetadata(packetRoot);
  await refreshLatestCopy(packetRoot);
  await zipPacketDirectory(packetRoot, zipPath);

  console.log(`Work-With-Me review packet folder written to ${path.relative(process.cwd(), packetRoot)}`);
  console.log(`Work-With-Me review packet zip written to ${path.relative(process.cwd(), zipPath)}`);
  console.log("Latest convenience copy refreshed at review-packets/latest-work-with-me");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
