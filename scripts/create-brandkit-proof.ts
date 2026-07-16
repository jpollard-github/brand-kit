import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderSvgToPng } from "../generators/social/hero-composition";
import { readAssetAsDataUrl } from "../generators/shared/assets";
import {
  renderBrandKitSystemPreview,
  renderLinkedInCombinedGuide,
  renderLinkedInDesktopGuide,
  renderLinkedInMobileGuide,
  renderOgComparison,
} from "../generators/portfolio/brandkit-proof-visuals";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packetRoot = path.join(repoRoot, "review-packets", "brandkit-proof");
const generatedAt = new Date();
const timestamp = generatedAt.toISOString().replace(/:/g, "").replace(/\.\d{3}Z$/, "Z");
const packetDir = path.join(packetRoot, timestamp);
const archivePath = path.join(packetRoot, `brandkit-proof-${timestamp}.zip`);
const evidenceDir = path.join(packetDir, "architecture-evidence");
const candidatesDir = path.join(packetDir, "human-visual-approval-candidates");
const reviewDir = path.join(packetDir, "review-only-overlays");
const statusValues = ["generated", "verified", "human-review-required", "approved", "rejected"] as const;

function run(script: string, brandId: string) {
  const result = spawnSync(process.execPath, ["--import", "tsx", script, "--brand", brandId], { cwd: repoRoot, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Failed: ${script}`);
  return { brandId, script, passed: true };
}

async function writeSvgAndPng(svg: string, basePath: string, size: { width: number; height: number }) {
  const svgPath = `${basePath}.svg`;
  const pngPath = `${basePath}.png`;
  await fs.writeFile(svgPath, svg, "utf8");
  await renderSvgToPng(svg, size, pngPath);
  return { svgPath, pngPath };
}

async function copy(source: string, destination: string) {
  await fs.copyFile(path.join(repoRoot, source), destination);
  return destination;
}

async function main() {
  await fs.mkdir(packetRoot, { recursive: true });
  await Promise.all([evidenceDir, candidatesDir, reviewDir].map((dir) => fs.mkdir(dir, { recursive: true })));

  const validation = [
    run("generators/social/generate-og-image.ts", "jasonpollard"),
    run("generators/social/generate-linkedin-banner.ts", "jasonpollard"),
    run("generators/projects/generate-cover.ts", "jasonpollard"),
    run("generators/social/generate-og-image.ts", "arcadeghosts"),
  ];

  const candidateSources = {
    og: "generators/outputs/social/jasonpollard-og-image.png",
    linkedIn: "generators/outputs/social/jasonpollard-linkedin-banner.png",
    project: "generators/outputs/projects/jasonpollard-project-cover.png",
    contrast: "generators/outputs/social/arcadeghosts-og-image.png",
  };
  const candidatePaths = {
    og: await copy(candidateSources.og, path.join(candidatesDir, "jasonpollard-og-image.png")),
    linkedIn: await copy(candidateSources.linkedIn, path.join(candidatesDir, "jasonpollard-linkedin-banner.png")),
    project: await copy(candidateSources.project, path.join(candidatesDir, "brandkit-project-cover.png")),
    process: await copy("docs/brandkit-architecture.svg", path.join(candidatesDir, "brandkit-process.svg")),
  };

  const images = {
    jasonOg: await readAssetAsDataUrl(path.join(repoRoot, candidateSources.og)),
    jasonLinkedIn: await readAssetAsDataUrl(path.join(repoRoot, candidateSources.linkedIn)),
    projectCover: await readAssetAsDataUrl(path.join(repoRoot, candidateSources.project)),
    arcadeGhostsOg: await readAssetAsDataUrl(path.join(repoRoot, candidateSources.contrast)),
  };
  const preview = await writeSvgAndPng(renderBrandKitSystemPreview(images), path.join(candidatesDir, "brandkit-system-preview"), { width: 1600, height: 1100 });

  const desktopGuide = await writeSvgAndPng(renderLinkedInDesktopGuide(images.jasonLinkedIn), path.join(reviewDir, "linkedin-desktop-overlap-guide-review-only"), { width: 1584, height: 396 });
  const mobileGuide = await writeSvgAndPng(renderLinkedInMobileGuide(images.jasonLinkedIn), path.join(reviewDir, "linkedin-mobile-crop-guide-review-only"), { width: 1188, height: 396 });
  const desktopGuideUrl = await readAssetAsDataUrl(desktopGuide.pngPath);
  const mobileGuideUrl = await readAssetAsDataUrl(mobileGuide.pngPath);
  const combinedGuide = await writeSvgAndPng(renderLinkedInCombinedGuide(desktopGuideUrl, mobileGuideUrl), path.join(reviewDir, "linkedin-combined-review-only"), { width: 1600, height: 1080 });
  const ogComparison = await writeSvgAndPng(renderOgComparison(images.jasonOg), path.join(reviewDir, "og-site-comparison-review-only"), { width: 1600, height: 980 });

  const comparisonPath = path.join(evidenceDir, "site-source-comparison.md");
  await fs.writeFile(comparisonPath, `# Jason Pollard site-source comparison

Reviewed: 2026-07-16

The fixed-format work uses the public site palette, Arial/Helvetica typography, monospace technical labels, and the source JP icon. The Open Graph layout intentionally follows the production 1200 × 630 composition: 14px teal top rule, 72px padding, upper label, centered headline, and balanced footer row.

LinkedIn and project-cover geometry are deliberate collateral variations. LinkedIn uses the upper-left for nonessential identity structure while keeping essential copy outside the lower-left profile-photo overlap. The project cover uses the site identity to explain BrandKit rather than repeating the personal homepage hero.

All visual candidates remain human-review-required. Generation and automated verification do not imply publication approval.
`, "utf8");
  const validationPath = path.join(evidenceDir, "validation-summary.json");
  await fs.writeFile(validationPath, `${JSON.stringify({ generatedAt: generatedAt.toISOString(), validation, result: "verified", humanApproval: "human-review-required" }, null, 2)}\n`);
  const caseStudyPath = await copy("docs/PORTFOLIO-CASE-STUDY.md", path.join(evidenceDir, "portfolio-case-study-full.md"));

  const relative = (value: string) => path.relative(packetDir, value).split(path.sep).join("/");
  const manifest = {
    schemaVersion: 2,
    generatedAt: generatedAt.toISOString(),
    packetTimestamp: timestamp,
    statusValues,
    publicProofFamilies: ["open-graph", "linkedin-banner", "project-cover"],
    architectureEvidence: [comparisonPath, validationPath, caseStudyPath].map((asset) => ({ asset: relative(asset), status: "verified" })),
    humanVisualApprovalCandidates: [
      { asset: relative(preview.pngPath), status: "human-review-required" },
      { asset: relative(candidatePaths.process), status: "human-review-required" },
      { asset: relative(candidatePaths.og), status: "human-review-required" },
      { asset: relative(candidatePaths.linkedIn), status: "human-review-required" },
      { asset: relative(candidatePaths.project), status: "human-review-required" },
    ],
    reviewOnlyOverlays: [desktopGuide.svgPath, desktopGuide.pngPath, mobileGuide.svgPath, mobileGuide.pngPath, combinedGuide.svgPath, combinedGuide.pngPath, ogComparison.svgPath, ogComparison.pngPath].map((asset) => ({ asset: relative(asset), status: "generated", publicationEligible: false })),
    rejectedArtifactsRemoved: ["previous proof composite", "business-card proof"],
    validation,
  };
  await fs.writeFile(path.join(packetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  const candidateRows = manifest.humanVisualApprovalCandidates.map((item) => `<li><a href="${item.asset}">${path.basename(item.asset)}</a> — <strong>${item.status}</strong></li>`).join("");
  const html = `<!doctype html><meta charset="utf-8"><title>BrandKit human review</title><style>body{max-width:1180px;margin:0 auto;padding:48px 24px;background:#f4f1e9;color:#112033;font:17px/1.6 Arial,sans-serif}h1{font-size:52px;line-height:1.05}h2{margin-top:48px;border-top:1px solid #c9c5bb;padding-top:24px}a{color:#0c5e5b}strong{color:#a8532c}img{display:block;max-width:100%;margin:24px 0;border:1px solid #c9c5bb}</style><h1>BrandKit human review</h1><p>Generated and verified does not mean approved. Every new visual below requires Jason’s explicit review.</p><h2>Human visual approval candidates</h2><ul>${candidateRows}</ul><img src="human-visual-approval-candidates/brandkit-system-preview.png" alt="BrandKit system preview"><h2>Architecture evidence</h2><p>See the manifest, validation summary, full technical case study, and source-comparison note.</p><h2>Review-only overlays</h2><p>Crop guides and comparison images are inspection aids and are not publication candidates.</p>`;
  await fs.writeFile(path.join(packetDir, "index.html"), html);

  const zipResult = spawnSync("zip", ["-q", "-r", archivePath, timestamp], {
    cwd: packetRoot,
    encoding: "utf8",
  });
  if (zipResult.status !== 0) throw new Error(zipResult.stderr || zipResult.stdout || "Failed to create proof zip");
  const latest = {
    generatedAt: generatedAt.toISOString(),
    timestamp,
    packetFolder: timestamp,
    archive: path.basename(archivePath),
  };
  await fs.writeFile(path.join(packetRoot, "latest.json"), `${JSON.stringify(latest, null, 2)}\n`);
  console.log(`BrandKit proof packet: ${path.relative(repoRoot, packetDir)}`);
  console.log(`BrandKit proof zip: ${path.relative(repoRoot, archivePath)}`);
  console.log(`Latest pointer: ${path.relative(repoRoot, path.join(packetRoot, "latest.json"))}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
