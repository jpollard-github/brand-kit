import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(currentDir, "..");
const execFileAsync = promisify(execFile);

type InventoryRow = {
  asset: string;
  variant: string;
  filesToInspect: string[];
  maturity: string;
  manualProofingNeeded: string;
  notes: string;
};

const sourceDocs = [
  "README.md",
  "TODO.md",
  "docs/CLIENT-COLLATERAL.md",
  "docs/PRODUCTION-CHECKLIST.md",
  "docs/BUSINESS-LINKS-CONTRACT.md",
  "docs/OUTPUTS-AND-REVIEW-PACKETS.md",
  "docs/FIRST-CLIENT-CHECKLIST.md",
  "docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md",
  "docs/EMAIL-SIGNATURE-PROOFING.md",
];

const sourceConfig = [
  "design-system/client-collateral.ts",
  "brands/arcadeghosts/client-collateral.ts",
  "brands/arcadeghosts/copy/work-with-me/front-copy.txt",
  "brands/arcadeghosts/copy/work-with-me/spec.md",
];

const sourceGenerators = [
  "generators/email/README.md",
  "generators/email/generate-signature.ts",
  "generators/email/manifest.ts",
  "generators/email/verify-email-signature.ts",
  "generators/client-collateral/generate-client-collateral.ts",
  "generators/client-collateral/manifest.ts",
  "generators/client-collateral/verify-capability-sheet.ts",
  "generators/business-cards/generator/export-cards.ts",
  "generators/business-cards/generator/verification.ts",
  "generators/business-cards/generator/verify-brand.ts",
];

const invoiceThemes = [
  "default",
  "conference",
  "holiday",
  "minimal-print",
  "synthwave",
  "winter",
] as const;

function currentDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function currentTimeStamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}${minutes}`;
}

function zipFileName(dateStamp: string, timeStamp: string) {
  return `brand-kit-client-collateral-${dateStamp}-${timeStamp}.zip`;
}

function packetFolderName(timeStamp: string) {
  return `client-collateral-${timeStamp}`;
}

function formatVariantLabel(variant: string) {
  return variant === "default" ? "default" : variant.replace(/-/g, " ");
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
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
      parsed.ext
        ? `${parsed.name}-${suffix}${parsed.ext}`
        : `${parsed.base}-${suffix}`,
    );

    if (!(await pathExists(candidate))) {
      return candidate;
    }

    suffix += 1;
  }
}

async function copyFileToPacket(
  sourceRelativePath: string,
  packetRoot: string,
  targetRelativePath: string,
) {
  const sourcePath = path.join(repoRootDir, sourceRelativePath);
  if (!(await pathExists(sourcePath))) {
    return false;
  }

  const targetPath = path.join(packetRoot, targetRelativePath);
  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function copyDirToPacket(
  sourceRelativePath: string,
  packetRoot: string,
  targetRelativePath: string,
) {
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

async function discoverEmailSignatureVariants() {
  const emailOutputDir = path.join(repoRootDir, "generators/outputs/email");
  const entries = await fs.readdir(emailOutputDir, { withFileTypes: true });
  const variants = new Set<string>();

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    if (!entry.name.startsWith("arcadeghosts-email-signature")) {
      continue;
    }
    if (!entry.name.endsWith(".html") && !entry.name.endsWith(".png")) {
      continue;
    }

    const suffix = entry.name
      .replace(/^arcadeghosts-email-signature/, "")
      .replace(/\.(html|png)$/, "");

    variants.add(suffix === "" ? "default" : suffix.replace(/^-/, ""));
  }

  return [...variants].sort((left, right) => {
    if (left === "default") return -1;
    if (right === "default") return 1;
    return left.localeCompare(right);
  });
}

async function copyReviewOutputs(packetRoot: string) {
  await copyDirToPacket(
    "generators/business-cards/work-with-me/exports",
    packetRoot,
    "outputs/business-cards/work-with-me",
  );
  await copyDirToPacket(
    "generators/business-cards/arcadeghosts/exports",
    packetRoot,
    "outputs/business-cards/arcadeghosts-general",
  );

  const emailVariants = await discoverEmailSignatureVariants();
  for (const variant of emailVariants) {
    const suffix = variant === "default" ? "" : `-${variant}`;
    await copyFileToPacket(
      `generators/outputs/email/arcadeghosts-email-signature${suffix}.html`,
      packetRoot,
      `outputs/email-signatures/${variant}/arcadeghosts-email-signature${suffix}.html`,
    );
    await copyFileToPacket(
      `generators/outputs/email/arcadeghosts-email-signature${suffix}.png`,
      packetRoot,
      `outputs/email-signatures/${variant}/arcadeghosts-email-signature${suffix}.png`,
    );

    await copyFileToPacket(
      `generators/outputs/email/arcadeghosts-email-signature${suffix}.manifest.json`,
      packetRoot,
      `outputs/email-signatures/${variant}/arcadeghosts-email-signature${suffix}.manifest.json`,
    );

    if (variant === "default") {
      await copyFileToPacket(
        "generators/outputs/email/arcadeghosts-email-signature.manifest.json",
        packetRoot,
        "outputs/email-signatures/default/arcadeghosts-email-signature.manifest.json",
      );
    }
  }

  const clientCollateralFiles = [
    ["generators/outputs/client-collateral/arcadeghosts-capability-sheet.html", "outputs/capability-sheet/arcadeghosts-capability-sheet.html"],
    ["generators/outputs/client-collateral/arcadeghosts-capability-sheet.pdf", "outputs/capability-sheet/arcadeghosts-capability-sheet.pdf"],
    ["generators/outputs/client-collateral/arcadeghosts-capability-sheet.png", "outputs/capability-sheet/arcadeghosts-capability-sheet.png"],
    ["generators/outputs/client-collateral/arcadeghosts-capability-sheet.manifest.json", "outputs/capability-sheet/arcadeghosts-capability-sheet.manifest.json"],
    ["generators/outputs/client-collateral/arcadeghosts-proposal-cover.html", "outputs/proposal-cover/arcadeghosts-proposal-cover.html"],
    ["generators/outputs/client-collateral/arcadeghosts-proposal-cover.pdf", "outputs/proposal-cover/arcadeghosts-proposal-cover.pdf"],
    ["generators/outputs/client-collateral/arcadeghosts-proposal-cover.png", "outputs/proposal-cover/arcadeghosts-proposal-cover.png"],
    ["generators/outputs/client-collateral/arcadeghosts-discovery-call.html", "outputs/discovery-guide/arcadeghosts-discovery-call.html"],
    ["generators/outputs/client-collateral/arcadeghosts-discovery-call.pdf", "outputs/discovery-guide/arcadeghosts-discovery-call.pdf"],
    ["generators/outputs/client-collateral/arcadeghosts-discovery-call.png", "outputs/discovery-guide/arcadeghosts-discovery-call.png"],
    ["generators/outputs/client-collateral/arcadeghosts-case-study-template.html", "outputs/case-study-template/arcadeghosts-case-study-template.html"],
    ["generators/outputs/client-collateral/arcadeghosts-case-study-template.pdf", "outputs/case-study-template/arcadeghosts-case-study-template.pdf"],
    ["generators/outputs/client-collateral/arcadeghosts-case-study-template.png", "outputs/case-study-template/arcadeghosts-case-study-template.png"],
  ] as const;

  for (const [source, target] of clientCollateralFiles) {
    await copyFileToPacket(source, packetRoot, target);
  }

  for (const theme of invoiceThemes) {
    const suffix = theme === "default" ? "" : `-${theme}`;
    await copyFileToPacket(
      `generators/outputs/documents/arcadeghosts-invoice${suffix}.png`,
      packetRoot,
      `outputs/invoice/${theme}/arcadeghosts-invoice${suffix}.png`,
    );
    await copyFileToPacket(
      `generators/outputs/documents/arcadeghosts-invoice${suffix}.svg`,
      packetRoot,
      `outputs/invoice/${theme}/arcadeghosts-invoice${suffix}.svg`,
    );
  }

  const miniFlyerFiles = [
    "generators/outputs/posters/arcadeghosts-mini-flyer.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer.svg",
    "generators/outputs/posters/arcadeghosts-mini-flyer-conference.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer-conference.svg",
    "generators/outputs/posters/arcadeghosts-mini-flyer-holiday.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer-holiday.svg",
    "generators/outputs/posters/arcadeghosts-mini-flyer-minimal-print.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer-minimal-print.svg",
    "generators/outputs/posters/arcadeghosts-mini-flyer-synthwave.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer-synthwave.svg",
    "generators/outputs/posters/arcadeghosts-mini-flyer-winter.png",
    "generators/outputs/posters/arcadeghosts-mini-flyer-winter.svg",
  ];

  for (const file of miniFlyerFiles) {
    await copyFileToPacket(file, packetRoot, `outputs/mini-flyer/${path.basename(file)}`);
  }

  return { emailVariants };
}

async function copyReviewSources(packetRoot: string) {
  for (const file of sourceDocs) {
    const target = file.startsWith("docs/") ? file.replace(/^docs\//, "") : file;
    await copyFileToPacket(file, packetRoot, `source/docs/${target}`);
  }

  for (const file of sourceConfig) {
    await copyFileToPacket(file, packetRoot, `source/config/${file}`);
  }

  for (const file of sourceGenerators) {
    const target = file.replace(/^generators\//, "");
    await copyFileToPacket(file, packetRoot, `source/generators/${target}`);
  }
}

async function buildInventory(packetRoot: string, emailVariants: string[]) {
  const rows: InventoryRow[] = [
    {
      asset: "Work With Me business card",
      variant: "default",
      filesToInspect: [
        "outputs/business-cards/work-with-me/front-final-guides.pdf",
        "outputs/business-cards/work-with-me/back-final-guides.pdf",
      ],
      maturity: "Production Ready workflow",
      manualProofingNeeded:
        "Final URL/QR/email/title check, MOO proof, iPhone/Android QR scans, paper choice",
      notes:
        "Upload candidates: `front-final.png`, `back-final.png`, and clean no-guide PDFs if generated. Guide files are review-only.",
    },
    {
      asset: "ArcadeGhosts general business card",
      variant: "default",
      filesToInspect: [
        "outputs/business-cards/arcadeghosts-general/front-final-guides.pdf",
        "outputs/business-cards/arcadeghosts-general/back-final-guides.pdf",
      ],
      maturity: "Production Ready workflow",
      manualProofingNeeded:
        "Front/back pairing, QR/domain check, MOO proof, iPhone/Android QR scans, paper choice",
      notes:
        "Broader personal-brand card. Upload candidates: `front-final.png` and `back-final.png`. Guide files are review-only.",
    },
  ];

  for (const variant of emailVariants) {
    const suffix = variant === "default" ? "" : `-${variant}`;
    rows.push({
      asset: variant === "default" ? "Email signature" : "Email signature themed variant",
      variant: formatVariantLabel(variant),
      filesToInspect: [
        `outputs/email-signatures/${variant}/arcadeghosts-email-signature${suffix}.html`,
        `outputs/email-signatures/${variant}/arcadeghosts-email-signature${suffix}.png`,
      ],
      maturity: "Production Candidate",
      manualProofingNeeded:
        variant === "default"
          ? "Outlook mobile, one non-Outlook client, sent-email rendering, reply/forward behavior"
          : "Review only after default is accepted; spot-check theme readability",
      notes:
        variant === "default"
          ? "Primary outreach signature. Use the HTML output for installation."
          : "Secondary themed option. Visual variation only; business messaging should stay aligned with default.",
    });
  }

  rows.push(
    {
      asset: "Capability sheet",
      variant: "default",
      filesToInspect: [
        "outputs/capability-sheet/arcadeghosts-capability-sheet.pdf",
        "outputs/capability-sheet/arcadeghosts-capability-sheet.png",
      ],
      maturity: "Production Candidate",
      manualProofingNeeded:
        "PDF readability, footer legibility, CTA clarity, one-page fit in real review",
      notes: "High-priority warm-lead follow-up asset.",
    },
    {
      asset: "Proposal cover",
      variant: "default",
      filesToInspect: ["outputs/proposal-cover/arcadeghosts-proposal-cover.pdf"],
      maturity: "Production Candidate",
      manualProofingNeeded: "Visual review in proposal context and PDF readability check",
      notes: "Useful next after the core first-client stack.",
    },
    {
      asset: "Discovery guide",
      variant: "default",
      filesToInspect: ["outputs/discovery-guide/arcadeghosts-discovery-call.pdf"],
      maturity: "Production Candidate",
      manualProofingNeeded: "Real pre-call or post-call review for usefulness and readability",
      notes: "Useful once a prospect is interested enough for a real conversation.",
    },
    {
      asset: "Invoice",
      variant: "default",
      filesToInspect: ["outputs/invoice/default/arcadeghosts-invoice.png"],
      maturity: "Production Candidate",
      manualProofingNeeded: "Confirm billing readability and real client-delivery context",
      notes: "Useful next, but not part of first-touch outreach.",
    },
  );

  if (await pathExists(path.join(packetRoot, "outputs/case-study-template/arcadeghosts-case-study-template.pdf"))) {
    rows.push({
      asset: "Case study template",
      variant: "default",
      filesToInspect: ["outputs/case-study-template/arcadeghosts-case-study-template.pdf"],
      maturity: "Proof of Concept",
      manualProofingNeeded: "Needs real client work before promotion beyond template review",
      notes: "Present for later, not part of the first outreach stack.",
    });
  }

  if (await pathExists(path.join(packetRoot, "outputs/mini-flyer/arcadeghosts-mini-flyer.png"))) {
    rows.push({
      asset: "Mini flyer",
      variant: "default",
      filesToInspect: ["outputs/mini-flyer/arcadeghosts-mini-flyer.png"],
      maturity: "Prototype",
      manualProofingNeeded: "Only if a real local leave-behind use case appears",
      notes: "Deferred. Low priority unless real use shows up.",
    });
  }

  return rows;
}

function renderInventoryTable(rows: InventoryRow[]) {
  const header = [
    "| Asset | Variant | File(s) to inspect | Maturity | Manual proofing needed | Notes |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  const body = rows.map((row) => {
    const files = row.filesToInspect.map((file) => `\`${file}\``).join("<br>");
    return `| ${row.asset} | ${row.variant} | ${files} | ${row.maturity} | ${row.manualProofingNeeded} | ${row.notes} |`;
  });
  return [...header, ...body].join("\n");
}

async function writeReviewMd(packetRoot: string, inventoryRows: InventoryRow[]) {
  const cleanWorkPdfExists = await pathExists(
    path.join(packetRoot, "outputs/business-cards/work-with-me/front-final.pdf"),
  );
  const cleanArcadePdfExists = await pathExists(
    path.join(packetRoot, "outputs/business-cards/arcadeghosts-general/front-final.pdf"),
  );
  const reviewPath = path.join(packetRoot, "REVIEW.md");
  const contents = `# Review

Reference: ${currentDateStamp()} EDT

## Start Here

1. Review business card PDFs.
2. Review default email signature.
3. Review capability sheet PDF.
4. Review proposal cover.
5. Review discovery guide.
6. Review invoice.
7. Review themed signatures only after the default is accepted.

## Packet Layout

- visual review and likely production assets are under \`outputs/\`
- docs, config, and generators are under \`source/\`
- \`REVIEW.md\` is the top-level guide for this packet

## File Types In This Packet

- visual review files:
  PDFs, PNG previews, HTML previews, manifests, and any guide-marked proofs
- upload or production candidates:
  clean business-card PNGs, installed email-signature HTML, capability-sheet PDF, and other clean deliverables
- source, config, and reference:
  everything under \`source/\`
- guide or proof files only:
  \`*-guides.png\` and \`*-guides.pdf\` business-card outputs

## Business Card Upload Vs Review

Upload or production candidates:

- Work With Me:
  \`outputs/business-cards/work-with-me/front-final.png\`
- Work With Me:
  \`outputs/business-cards/work-with-me/back-final.png\`
- ArcadeGhosts general:
  \`outputs/business-cards/arcadeghosts-general/front-final.png\`
- ArcadeGhosts general:
  \`outputs/business-cards/arcadeghosts-general/back-final.png\`
${cleanWorkPdfExists ? "- Work With Me clean PDF:\n  `outputs/business-cards/work-with-me/front-final.pdf` and matching back PDF" : "- Clean no-guide Work With Me PDFs are not present in this packet. Generate them intentionally if you want PDF uploads without guides."}
${cleanArcadePdfExists ? "- ArcadeGhosts clean PDF:\n  `outputs/business-cards/arcadeghosts-general/front-final.pdf` and matching back PDF" : "- Clean no-guide ArcadeGhosts PDFs are not present in this packet. Generate them intentionally if you want PDF uploads without guides."}

Review only:

- \`outputs/business-cards/work-with-me/front-final-guides.png\`
- \`outputs/business-cards/work-with-me/back-final-guides.png\`
- \`outputs/business-cards/work-with-me/front-final-guides.pdf\`
- \`outputs/business-cards/work-with-me/back-final-guides.pdf\`
- \`outputs/business-cards/arcadeghosts-general/front-final-guides.png\`
- \`outputs/business-cards/arcadeghosts-general/back-final-guides.png\`
- \`outputs/business-cards/arcadeghosts-general/front-final-guides.pdf\`
- \`outputs/business-cards/arcadeghosts-general/back-final-guides.pdf\`

## Maturity Summary

- Business Cards: Production Ready workflow, manual order-time checks still required
- Email Signature: Production Candidate
- Capability Sheet: Production Candidate
- Proposal Cover: Production Candidate
- Discovery Guide: Production Candidate
- Invoice: Production Candidate
- Case Study: Proof of Concept if present
- Mini Flyer: Prototype and deferred unless a real use case appears

## Asset Inventory

${renderInventoryTable(inventoryRows)}

## Remaining Manual Proofing

- Work With Me business card:
  final URL, QR destination, email, title, front/back pairing, upload-file choice, MOO trim/bleed/safe-area review, and iPhone/Android QR scans
- ArcadeGhosts general business card:
  front/back pairing, home URL QR behavior, upload-file choice, and MOO trim/bleed/safe-area review
- email signature default:
  Outlook mobile, one non-Outlook client, sent-email rendering, and reply/forward behavior
- capability sheet:
  PDF readability, footer legibility, CTA clarity, and one-page fit in a real review pass
`;
  await fs.writeFile(reviewPath, contents, "utf8");
}

async function writePacketMetadata(packetRoot: string) {
  const metadataPath = path.join(packetRoot, "PACKET-INFO.txt");
  const contents = [
    `Generated: ${new Date().toISOString()}`,
    "Purpose: client-collateral review packet",
    "Use REVIEW.md first.",
  ].join("\n");
  await fs.writeFile(metadataPath, `${contents}\n`, "utf8");
}

async function refreshLatestCopy(sourcePacketRoot: string) {
  const latestRoot = path.join(repoRootDir, "review-packets", "latest-client-collateral");
  await fs.rm(latestRoot, { recursive: true, force: true });
  await fs.cp(sourcePacketRoot, latestRoot, { recursive: true });
}

async function main() {
  const dateStamp = currentDateStamp();
  const timeStamp = currentTimeStamp();
  const reviewPacketsRoot = path.join(repoRootDir, "review-packets");
  const dayRoot = path.join(reviewPacketsRoot, dateStamp);
  const packetRoot = await ensureUniquePath(path.join(dayRoot, packetFolderName(timeStamp)));
  const zipPath = await ensureUniquePath(path.join(reviewPacketsRoot, zipFileName(dateStamp, timeStamp)));

  await ensureDir(packetRoot);
  const { emailVariants } = await copyReviewOutputs(packetRoot);
  await copyReviewSources(packetRoot);
  const inventoryRows = await buildInventory(packetRoot, emailVariants);
  await writeReviewMd(packetRoot, inventoryRows);
  await writePacketMetadata(packetRoot);
  await refreshLatestCopy(packetRoot);
  await zipPacketDirectory(packetRoot, zipPath);

  console.log(`Client collateral packet folder written to ${path.relative(process.cwd(), packetRoot)}`);
  console.log(`Client collateral packet zip written to ${path.relative(process.cwd(), zipPath)}`);
  console.log("Latest convenience copy refreshed at review-packets/latest-client-collateral");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
