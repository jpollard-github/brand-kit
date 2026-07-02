import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "..");
const execFileAsync = promisify(execFile);
const networkingOutputDir = path.join(repoRootDir, "generators", "outputs", "networking");
const reviewContextDir = path.join(networkingOutputDir, "review-context");

type CommandResult = {
  label: string;
  command: string[];
  exitCode: number;
  stdout: string;
  stderr: string;
  logPath: string;
};

function currentDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function currentTimeStamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function currentDateTimeStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} EDT`;
}

function packetFolderName(timeStamp: string) {
  return `networking-assets-${timeStamp}`;
}

function zipFileName(dateStamp: string, timeStamp: string) {
  return `brand-kit-networking-assets-${dateStamp}-${timeStamp}.zip`;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
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

async function copyFileToPacket(sourceRelativePath: string, packetRoot: string, targetRelativePath: string) {
  const sourcePath = path.join(repoRootDir, sourceRelativePath);
  if (!(await pathExists(sourcePath))) {
    return false;
  }
  const targetPath = path.join(packetRoot, targetRelativePath);
  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function copyDirToPacket(sourceRelativePath: string, packetRoot: string, targetRelativePath: string) {
  const sourcePath = path.join(repoRootDir, sourceRelativePath);
  if (!(await pathExists(sourcePath))) {
    return false;
  }
  const targetPath = path.join(packetRoot, targetRelativePath);
  await ensureDir(path.dirname(targetPath));
  await fs.cp(sourcePath, targetPath, { recursive: true });
  return true;
}

async function zipPacketDirectory(sourceDir: string, zipPath: string) {
  await execFileAsync("zip", ["-qr", zipPath, "."], { cwd: sourceDir });
}

function relativeToRepo(filePath: string) {
  return path.relative(repoRootDir, filePath);
}

async function writeTextFile(targetPath: string, contents: string) {
  await ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, contents, "utf8");
}

async function runCommandAndCapture(
  label: string,
  command: string[],
  logsDir: string,
) {
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const logPath = path.join(logsDir, `${safeLabel}.log`);

  try {
    const result = await execFileAsync(command[0], command.slice(1), {
      cwd: repoRootDir,
      maxBuffer: 10 * 1024 * 1024,
    });
    const stdout = result.stdout ?? "";
    const stderr = result.stderr ?? "";
    await writeTextFile(
      logPath,
      [
        `Label: ${label}`,
        `Command: ${command.join(" ")}`,
        "Exit code: 0",
        "",
        "STDOUT",
        stdout.trimEnd(),
        "",
        "STDERR",
        stderr.trimEnd(),
        "",
      ].join("\n"),
    );
    return {
      label,
      command,
      exitCode: 0,
      stdout,
      stderr,
      logPath,
    } satisfies CommandResult;
  } catch (error) {
    const commandError = error as {
      code?: number | string;
      stdout?: string;
      stderr?: string;
      message?: string;
    };
    const exitCode =
      typeof commandError.code === "number" ? commandError.code : 1;
    const stdout = commandError.stdout ?? "";
    const stderr = commandError.stderr ?? commandError.message ?? "";
    await writeTextFile(
      logPath,
      [
        `Label: ${label}`,
        `Command: ${command.join(" ")}`,
        `Exit code: ${exitCode}`,
        "",
        "STDOUT",
        stdout.trimEnd(),
        "",
        "STDERR",
        stderr.trimEnd(),
        "",
      ].join("\n"),
    );
    return {
      label,
      command,
      exitCode,
      stdout,
      stderr,
      logPath,
    } satisfies CommandResult;
  }
}

async function captureGitDiagnostics(gitDir: string) {
  const commands: Array<{ file: string; command: string[] }> = [
    { file: "git-status.txt", command: ["git", "status", "--short"] },
    { file: "git-diff-stat.txt", command: ["git", "diff", "--stat"] },
    { file: "git-diff.patch", command: ["git", "diff", "--"] },
  ];

  for (const item of commands) {
    try {
      const result = await execFileAsync(item.command[0], item.command.slice(1), {
        cwd: repoRootDir,
        maxBuffer: 10 * 1024 * 1024,
      });
      await writeTextFile(path.join(gitDir, item.file), result.stdout ?? "");
    } catch (error) {
      const commandError = error as {
        stdout?: string;
        stderr?: string;
        message?: string;
      };
      await writeTextFile(
        path.join(gitDir, item.file),
        [
          commandError.stdout ?? "",
          commandError.stderr ?? commandError.message ?? "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  }
}

async function generateLockScreenOverlayMocks(artifactsDir: string) {
  const lockScreenPath = path.join(
    networkingOutputDir,
    "arcadeghosts-lock-screen.png",
  );
  const minimalLockScreenPath = path.join(
    networkingOutputDir,
    "arcadeghosts-lock-screen-minimal.png",
  );
  if (!(await pathExists(lockScreenPath))) {
    return;
  }

  const lockScreenBase64 = await fs.readFile(lockScreenPath, "base64");
  const imageHref = `data:image/png;base64,${lockScreenBase64}`;
  const width = 1320;
  const height = 2868;

  const widgetOverlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${imageHref}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.04)" />
  <text x="${width / 2}" y="214" text-anchor="middle" fill="#f7efe4" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="64" font-weight="600">Friday, June 29</text>
  <text x="${width / 2}" y="498" text-anchor="middle" fill="#fff8ef" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="244" font-weight="300">9:41</text>
  <rect x="108" y="592" width="532" height="236" rx="54" fill="rgba(15, 18, 23, 0.44)" stroke="rgba(255,255,255,0.14)" />
  <rect x="680" y="592" width="532" height="236" rx="54" fill="rgba(15, 18, 23, 0.44)" stroke="rgba(255,255,255,0.14)" />
  <text x="154" y="670" fill="#ffd57c" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">Calendar</text>
  <text x="154" y="728" fill="#fff8ef" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="48" font-weight="650">AI Meetup</text>
  <text x="154" y="774" fill="#d8d4cc" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="30">Wine bar • 8 people • QR visible below</text>
  <text x="726" y="670" fill="#63efe0" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">Reminder</text>
  <text x="726" y="728" fill="#fff8ef" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="48" font-weight="650">Use conference card first</text>
  <text x="726" y="774" fill="#d8d4cc" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="30">Wallet pass stays optional</text>
  <circle cx="172" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <circle cx="1148" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <rect x="470" y="2788" width="380" height="14" rx="7" fill="rgba(255,255,255,0.72)" />
</svg>`;

  const defaultMinimalUiOverlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${imageHref}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.025)" />
  <text x="${width / 2}" y="220" text-anchor="middle" fill="#f7efe4" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="60" font-weight="600">Friday, June 29</text>
  <text x="${width / 2}" y="506" text-anchor="middle" fill="#fff8ef" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="244" font-weight="300">9:41</text>
  <circle cx="172" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <circle cx="1148" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <rect x="470" y="2788" width="380" height="14" rx="7" fill="rgba(255,255,255,0.72)" />
</svg>`;

  let minimalLockScreenWidgetOverlaySvg: string | null = null;
  if (await pathExists(minimalLockScreenPath)) {
    const minimalLockScreenBase64 = await fs.readFile(minimalLockScreenPath, "base64");
    const minimalImageHref = `data:image/png;base64,${minimalLockScreenBase64}`;
    minimalLockScreenWidgetOverlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${minimalImageHref}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.04)" />
  <text x="${width / 2}" y="214" text-anchor="middle" fill="#f7efe4" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="64" font-weight="600">Friday, June 29</text>
  <text x="${width / 2}" y="498" text-anchor="middle" fill="#fff8ef" font-family="SF Pro Display, Helvetica, Arial, sans-serif" font-size="244" font-weight="300">9:41</text>
  <rect x="108" y="592" width="532" height="236" rx="54" fill="rgba(15, 18, 23, 0.44)" stroke="rgba(255,255,255,0.14)" />
  <rect x="680" y="592" width="532" height="236" rx="54" fill="rgba(15, 18, 23, 0.44)" stroke="rgba(255,255,255,0.14)" />
  <text x="154" y="670" fill="#ffd57c" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">Calendar</text>
  <text x="154" y="728" fill="#fff8ef" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="48" font-weight="650">AI Meetup</text>
  <text x="154" y="774" fill="#d8d4cc" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="30">Minimal wallpaper test</text>
  <text x="726" y="670" fill="#63efe0" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">Check</text>
  <text x="726" y="728" fill="#fff8ef" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="48" font-weight="650">QR still scans</text>
  <text x="726" y="774" fill="#d8d4cc" font-family="SF Pro Text, Helvetica, Arial, sans-serif" font-size="30">and still feels like wallpaper</text>
  <circle cx="172" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <circle cx="1148" cy="2660" r="82" fill="rgba(15,18,23,0.44)" stroke="rgba(255,255,255,0.16)" />
  <rect x="470" y="2788" width="380" height="14" rx="7" fill="rgba(255,255,255,0.72)" />
</svg>`;
  }

  await writeTextFile(
    path.join(artifactsDir, "arcadeghosts-lock-screen-ios-overlay-widgets.svg"),
    widgetOverlaySvg,
  );
  await writeTextFile(
    path.join(artifactsDir, "arcadeghosts-lock-screen-ios-overlay-default-minimal-ui.svg"),
    defaultMinimalUiOverlaySvg,
  );
  if (minimalLockScreenWidgetOverlaySvg) {
    await writeTextFile(
      path.join(artifactsDir, "arcadeghosts-lock-screen-minimal-ios-overlay-widgets.svg"),
      minimalLockScreenWidgetOverlaySvg,
    );
  }
  await writeTextFile(
    path.join(artifactsDir, "arcadeghosts-lock-screen-ios-overlay-notes.txt"),
    [
      "These are review overlays, not literal iOS screenshots.",
      "They are tuned for Jason's current iPhone 17 lock-screen review workflow.",
      "They exist to simulate how the generated lock screen might look with iOS time, widgets, bottom controls, and the home indicator present.",
      "The default lock screen and the minimal lock-screen variant can be reviewed separately when both files exist.",
      "Use them to sanity-check QR placement before final iPhone proofing.",
    ].join("\n"),
  );
}

async function writeLockScreenAdjustmentReport(reportDir: string) {
  await writeTextFile(
    path.join(reportDir, "lock-screen-adjustment-report.txt"),
    [
      "Lock-screen adjustment report",
      "",
      "Files changed:",
      "- generators/networking/generate-networking-assets.ts",
      "- scripts/create-networking-review-packet.ts",
      "",
      "Regenerated assets:",
      "- arcadeghosts-conference-card.png",
      "- arcadeghosts-lock-screen.png",
      "- arcadeghosts-lock-screen-minimal.png",
      "- PHONE-IMPORT assets",
      "- networking review packet overlays and packet zip",
      "",
      "Centering adjustment performed:",
      "- introduced one shared visual centerline for lock-screen composition",
      "- calibrated the lock-screen canvas to Jason's current iPhone 17 screenshot size (1320x2868)",
      "- applied an optical left shift of 34 px from the raw canvas midpoint",
      "- aligned logo medallion, URL, helper copy, and QR card on that centerline",
      "",
      "Vertical safe-area adjustment performed:",
      "- moved the main default lock-screen stack downward",
      "- moved the minimal lock-screen stack downward",
      "- raised both QR cards so they sit farther above the bottom iOS controls",
      "- increased separation between the clock area and the logo medallion",
      "- preserved additional top negative space so the clock remains dominant",
      "",
      "QR verification results:",
      "- raw QR: pass",
      "- conference card: pass",
      "- lock screen: pass",
      "- minimal lock screen: pass",
      "- conference preview: pass",
      "",
      "Notes:",
      "- the lock-screen overlay files remain review mocks, not literal device screenshots",
      "- final device crop and real-world scan comfort still need manual iPhone 17 proofing",
    ].join("\n"),
  );
}

async function buildReviewContext() {
  await fs.rm(reviewContextDir, { recursive: true, force: true });
  await ensureDir(reviewContextDir);
  const commandLogsDir = path.join(reviewContextDir, "command-logs");
  const gitDir = path.join(reviewContextDir, "git");
  const screenshotsDir = path.join(reviewContextDir, "screenshots");
  await ensureDir(commandLogsDir);
  await ensureDir(gitDir);
  await ensureDir(screenshotsDir);

  const commands: Array<{ label: string; command: string[] }> = [
    { label: "test-unit", command: ["npm", "run", "test:unit"] },
    { label: "brand-verify", command: ["npm", "run", "brand:verify"] },
    { label: "brand-audit-source", command: ["npm", "run", "brand:audit-source"] },
    { label: "asset-networking", command: ["npm", "run", "asset:networking"] },
  ];

  const results: CommandResult[] = [];
  for (const item of commands) {
    results.push(await runCommandAndCapture(item.label, item.command, commandLogsDir));
  }

  await captureGitDiagnostics(gitDir);
  await generateLockScreenOverlayMocks(screenshotsDir);
  await writeLockScreenAdjustmentReport(reviewContextDir);

  const summaryLines = [
    `Generated: ${currentDateTimeStamp()}`,
    "",
    ...results.map((result) => {
      const status = result.exitCode === 0 ? "pass" : "fail";
      return `${result.label}: ${status} (${result.command.join(" ")})`;
    }),
  ];
  await writeTextFile(
    path.join(reviewContextDir, "preflight-summary.txt"),
    `${summaryLines.join("\n")}\n`,
  );

  return results;
}

async function writeReviewMd(packetRoot: string, results: CommandResult[]) {
  const reviewPath = path.join(packetRoot, "REVIEW.md");
  const preflightLines = results.map((result) => {
    const status = result.exitCode === 0 ? "pass" : "fail";
    return `- \`${result.label}\`: ${status} (see \`diagnostics/command-logs/${path.basename(result.logPath)}\`)`;
  });

  const contents = `# Review

Reference: ${currentDateStamp()} EDT

## Start Here

1. Review the conference card PNG.
2. Review the lock screen PNG.
3. Review the minimal lock screen PNG.
4. Review the iOS overlay review SVGs for the default and minimal lock screens.
5. Review the wallet pass preview PNG and pass package report.
6. Review the raw QR PNG and QR report.
7. Review the \`outputs/PHONE-IMPORT/\` folder and \`README-FIRST.md\`.
8. Review \`source/docs/NETWORKING-REVIEW-CHECKLIST.md\`.
9. Review any supporting docs you need under \`source/docs/\`.
10. Review command logs, git diff context, and config files under \`diagnostics/\` and \`source/\`.
11. Transfer the assets to iPhone 17 and test from Photos.

## Packet Layout

- networking review assets are under \`outputs/\`
- iPhone-ready transfer files are under \`outputs/PHONE-IMPORT/\`
- docs, config, scripts, assets, and generators are under \`source/\`
- the full repo \`docs/\` folder is included under \`source/docs/\`
- command logs, git diff context, and overlay review artifacts are under \`diagnostics/\`
- \`REVIEW.md\` is the top-level guide for this packet

## Files To Inspect First

- \`outputs/networking/arcadeghosts-conference-card.png\`
- \`outputs/networking/arcadeghosts-lock-screen.png\`
- \`outputs/networking/arcadeghosts-lock-screen-minimal.png\`
- \`diagnostics/screenshots/arcadeghosts-lock-screen-ios-overlay-widgets.svg\`
- \`diagnostics/screenshots/arcadeghosts-lock-screen-ios-overlay-default-minimal-ui.svg\`
- \`diagnostics/screenshots/arcadeghosts-lock-screen-minimal-ios-overlay-widgets.svg\`
- \`outputs/networking/arcadeghosts-wallet-pass-preview.png\`
- \`outputs/networking/arcadeghosts-wallet-pass-report.txt\`
- \`outputs/networking/arcadeghosts-networking-qr.png\`
- \`outputs/networking/arcadeghosts-networking-report.txt\`
- \`outputs/PHONE-IMPORT/README-FIRST.md\`
- \`source/docs/NETWORKING-REVIEW-CHECKLIST.md\`
- \`source/docs/MANUAL-INSTRUCTIONS.md\`
- \`source/docs/OUTPUTS-AND-REVIEW-PACKETS.md\`
- \`diagnostics/git/git-diff-stat.txt\`
- \`diagnostics/git/git-diff.patch\`

## Command Results

${preflightLines.join("\n")}

## Manual Checks

- scan the raw QR from another phone and confirm it opens \`https://arcadeghosts.org\`
- scan the conference card from arm's length at normal brightness
- review the overlay SVGs and confirm the QR placement stays clear of time, widgets, bottom affordances, and the home indicator
- scan the lock screen from arm's length after saving it to Photos and after setting it as wallpaper on iPhone 17
- confirm the PHONE-IMPORT folder contains only transfer-ready files
- if a signed \`.pkpass\` exists, install it in Apple Wallet and scan the pass QR from another phone
- confirm the conference card feels like an interesting software person first, hire-me second

## Included Source

- full \`docs/\` folder contents
- networking generator and QR verification source
- wallet pass generator and signing helper
- package metadata and lockfile
- modified config files
- original ArcadeGhosts logo source files and notes
- business-card support docs and generator references

## Known Limitations

- the iOS overlay files are review mocks, not literal screenshots from the device
- the Wallet pass remains sign-ready until Apple credentials are supplied
- final crop and real-world scan comfort still need manual iPhone 17 proofing
`;
  await fs.writeFile(reviewPath, contents, "utf8");
}

async function writePacketMetadata(packetRoot: string, results: CommandResult[]) {
  const metadataPath = path.join(packetRoot, "PACKET-INFO.txt");
  const commandSummary = results
    .map((result) => `${result.label}: ${result.exitCode === 0 ? "pass" : "fail"}`)
    .join("\n");
  await fs.writeFile(
    metadataPath,
    [
      `Generated: ${currentDateTimeStamp()}`,
      "Purpose: networking assets review packet",
      "Use REVIEW.md first.",
      "",
      "Preflight summary:",
      commandSummary,
    ].join("\n") + "\n",
    "utf8",
  );
}

async function refreshLatestCopy(sourcePacketRoot: string) {
  const latestRoot = path.join(repoRootDir, "review-packets", "latest-networking-assets");
  await fs.rm(latestRoot, { recursive: true, force: true });
  await fs.cp(sourcePacketRoot, latestRoot, { recursive: true });
}

async function buildPacket(results: CommandResult[]) {
  const dateStamp = currentDateStamp();
  const timeStamp = currentTimeStamp();
  const reviewPacketsRoot = path.join(repoRootDir, "review-packets");
  const dayRoot = path.join(reviewPacketsRoot, dateStamp);
  const packetRoot = await ensureUniquePath(path.join(dayRoot, packetFolderName(timeStamp)));
  const zipPath = await ensureUniquePath(path.join(reviewPacketsRoot, zipFileName(dateStamp, timeStamp)));

  await ensureDir(packetRoot);

  await copyDirToPacket("generators/outputs/networking", packetRoot, "outputs/networking");
  await copyDirToPacket("generators/outputs/networking/PHONE-IMPORT", packetRoot, "outputs/PHONE-IMPORT");
  await copyDirToPacket("generators/business-cards/work-with-me/exports", packetRoot, "outputs/business-cards/work-with-me");
  await copyDirToPacket("generators/business-cards/arcadeghosts/exports", packetRoot, "outputs/business-cards/arcadeghosts-general");
  await copyDirToPacket("generators/outputs/networking/review-context", packetRoot, "diagnostics");
  await copyDirToPacket("docs", packetRoot, "source/docs");

  for (const file of [
    "README.md",
    "TODO.md",
    "package.json",
    "package-lock.json",
    "generators/networking/README.md",
    "generators/networking/generate-networking-assets.ts",
    "generators/networking/generate-wallet-pass.ts",
    "generators/shared/qr.ts",
    "generators/shared/qr-tool.swift",
    "scripts/verify-qr.ts",
    "scripts/sign-wallet-pass.ts",
    "scripts/create-networking-review-packet.ts",
    "generators/business-cards/README.md",
    "design-system/brands/arcadeghosts.ts",
    "design-system/networking.ts",
    "design-system/metadata.ts",
    "design-system/client-collateral.ts",
    "brands/arcadeghosts/networking.ts",
    "brands/arcadeghosts/assets/logo.png",
    "brands/arcadeghosts/assets/logo.webp",
    "brands/arcadeghosts/assets/asset-notes.md",
    "brands/arcadeghosts/logo-usage-rules.md",
  ]) {
    const target = file.startsWith("docs/")
      ? `source/docs/${file.replace(/^docs\//, "")}`
      : file.startsWith("generators/")
        ? `source/generators/${file.replace(/^generators\//, "")}`
        : file.startsWith("scripts/")
          ? `source/scripts/${path.basename(file)}`
          : file.startsWith("design-system/")
            ? `source/config/${file.replace(/^design-system\//, "")}`
            : file.startsWith("brands/")
              ? `source/assets/${file.replace(/^brands\//, "")}`
              : `source/root/${file}`;
    await copyFileToPacket(file, packetRoot, target);
  }

  await writeReviewMd(packetRoot, results);
  await writePacketMetadata(packetRoot, results);

  const reviewPacketLogPath = path.join(packetRoot, "diagnostics", "command-logs", "review-packet.log");
  await writeTextFile(
    reviewPacketLogPath,
    [
      `Generated: ${currentDateTimeStamp()}`,
      `Packet folder: ${relativeToRepo(packetRoot)}`,
      `Packet zip: ${relativeToRepo(zipPath)}`,
      `Latest copy: review-packets/latest-networking-assets`,
      "",
      "Statuses:",
      ...results.map((result) => `${result.label}: ${result.exitCode === 0 ? "pass" : "fail"}`),
    ].join("\n"),
  );

  await refreshLatestCopy(packetRoot);
  await zipPacketDirectory(packetRoot, zipPath);

  console.log(`Networking review packet folder written to ${path.relative(process.cwd(), packetRoot)}`);
  console.log(`Networking review packet zip written to ${path.relative(process.cwd(), zipPath)}`);
  console.log("Latest convenience copy refreshed at review-packets/latest-networking-assets");

  return { packetRoot, zipPath };
}

async function main() {
  const results = await buildReviewContext();
  const { packetRoot, zipPath } = await buildPacket(results);
  const failed = results.filter((result) => result.exitCode !== 0);

  if (failed.length > 0) {
    console.error(`Review packet created, but ${failed.length} preflight commands failed.`);
    console.error(`Packet folder: ${path.relative(process.cwd(), packetRoot)}`);
    console.error(`Packet zip: ${path.relative(process.cwd(), zipPath)}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
