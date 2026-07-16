import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packetRoot = path.join(repoRoot, "review-packets", "brandkit-proof");
const requiredCandidates = [
  "human-visual-approval-candidates/brandkit-system-preview.png",
  "human-visual-approval-candidates/brandkit-process.svg",
  "human-visual-approval-candidates/jasonpollard-og-image.png",
  "human-visual-approval-candidates/jasonpollard-linkedin-banner.png",
  "human-visual-approval-candidates/brandkit-project-cover.png",
];

async function main() {
  const latest = JSON.parse(await fs.readFile(path.join(packetRoot, "latest.json"), "utf8"));
  const packetDir = path.join(packetRoot, latest.packetFolder);
  const archivePath = path.join(packetRoot, latest.archive);
  const manifest = JSON.parse(await fs.readFile(path.join(packetDir, "manifest.json"), "utf8"));
  const failures: string[] = [];
  if (path.isAbsolute(latest.packetFolder) || latest.packetFolder.includes("..")) failures.push("latest packet folder is unsafe");
  if (path.isAbsolute(latest.archive) || latest.archive.includes("..")) failures.push("latest archive path is unsafe");
  if (manifest.packetTimestamp !== latest.timestamp || latest.packetFolder !== latest.timestamp) failures.push("latest pointer and manifest timestamps do not match");
  if (latest.archive !== `brandkit-proof-${latest.timestamp}.zip`) failures.push("latest zip filename does not match its timestamp");
  try { await fs.access(archivePath); } catch { failures.push(`missing latest zip: ${latest.archive}`); }
  const candidates = manifest.humanVisualApprovalCandidates as Array<{ asset: string; status: string }>;
  const candidateNames = candidates.map((item) => item.asset);
  if (JSON.stringify(candidateNames) !== JSON.stringify(requiredCandidates)) failures.push("human-review candidate list does not match the five required artifacts");
  if (candidates.some((item) => item.status !== "human-review-required")) failures.push("new visual candidate is not human-review-required");
  if (manifest.publicProofFamilies.includes("business-cards/proof") || JSON.stringify(candidateNames).includes("business-card")) failures.push("business card appears in public proof lists");
  if (!manifest.statusValues.includes("approved") || !manifest.statusValues.includes("rejected")) failures.push("proof status model is incomplete");
  if (!manifest.reviewOnlyOverlays.every((item: { publicationEligible: boolean }) => item.publicationEligible === false)) failures.push("review-only overlay is publication eligible");
  if (!manifest.validation.every((item: { passed: boolean }) => item.passed)) failures.push("generation validation failed");

  const allAssets = [...manifest.architectureEvidence, ...candidates, ...manifest.reviewOnlyOverlays].map((item: { asset: string }) => item.asset);
  for (const asset of allAssets) {
    if (path.isAbsolute(asset) || asset.includes("..")) failures.push(`unsafe asset path: ${asset}`);
    try { await fs.access(path.join(packetDir, asset)); } catch { failures.push(`missing asset: ${asset}`); }
  }

  const [og, linkedIn, project, diagram, index] = await Promise.all([
    fs.readFile(path.join(repoRoot, "generators/outputs/social/jasonpollard-og-image.svg"), "utf8"),
    fs.readFile(path.join(repoRoot, "generators/outputs/social/jasonpollard-linkedin-banner.svg"), "utf8"),
    fs.readFile(path.join(repoRoot, "generators/outputs/projects/jasonpollard-project-cover.svg"), "utf8"),
    fs.readFile(path.join(packetDir, "human-visual-approval-candidates/brandkit-process.svg"), "utf8"),
    fs.readFile(path.join(packetDir, "index.html"), "utf8"),
  ]);
  const requiredOgCopy = ["Jason Pollard · Software Engineer &amp; Architect", "I build, repair, modernize, and explain difficult software systems.", "20+ years · AI-enabled engineering", "jasonpollard.com"];
  if (requiredOgCopy.some((copy) => !og.includes(copy))) failures.push("Open Graph required copy is incomplete");
  if (!linkedIn.includes("difficult software systems.") || /AVATAR/i.test(linkedIn)) failures.push("LinkedIn headline or placeholder check failed");
  if (!project.includes("BrandKit") || !project.includes("Source-driven, verified brand assets across distinct identities.")) failures.push("project cover is not BrandKit-specific");
  const bannedDiagramLabels = ["Registry + typed config", "Guardrails", "Generator family", "Human review packet"];
  if (bannedDiagramLabels.some((label) => diagram.includes(label))) failures.push("diagram contains rejected internal terminology");
  if (!diagram.includes("How BrandKit turns a brand into approved assets") || !diagram.includes("Brand ingredients + format rules + shared generation + verification = repeatable output")) failures.push("diagram plain-language title or summary missing");
  if (/2200|fullPage\s*:\s*true|object-fit\s*:\s*contain/.test(index)) failures.push("review index retains giant fixed screenshot composition");
  if (JSON.stringify(manifest).includes(repoRoot) || JSON.stringify(manifest).includes("/Users/")) failures.push("manifest contains an absolute workstation path");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`BrandKit proof verified: ${latest.packetFolder}; ${candidates.length} human-review candidates, ${manifest.reviewOnlyOverlays.length} review-only files, zero approved visuals.`);
  console.log(`Verified zip: ${latest.archive}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
