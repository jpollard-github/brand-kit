import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import { getClientCollateralConfig } from "../../design-system/client-collateral";
import { writeCapabilitySheetManifest } from "./manifest";
import { buildHeroCompositionData, escapeXml, repoRootDir } from "../social/hero-composition";
import { createBrandOutputName, parseCliFlag, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "client-collateral");

const previewViewport = {
  width: 1275,
  height: 1650,
};

type AssetId =
  | "proposal-cover"
  | "capability-sheet"
  | "discovery-call"
  | "case-study-template";

type GeneratorArgs = {
  brandId: string;
  sceneId?: string;
  asset?: AssetId;
};

type AssetDefinition = {
  id: AssetId;
  outputName: string;
  title: string;
  html: string;
};

function parseArgs(argv: string[]): GeneratorArgs {
  const brandId = resolveBrandId(argv);
  const requestedAsset = parseCliFlag(argv, "--asset");

  const asset = (
    requestedAsset &&
    [
      "proposal-cover",
      "capability-sheet",
      "discovery-call",
      "case-study-template",
    ].includes(requestedAsset)
  )
    ? (requestedAsset as AssetId)
    : undefined;

  return {
    brandId,
    sceneId: parseCliFlag(argv, "--scene", "work-with-me-hero"),
    asset,
  };
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

function renderList(items: string[], className = "bullet-list") {
  return `<ul class="${className}">${items
    .map((item) => `<li>${escapeXml(item)}</li>`)
    .join("")}</ul>`;
}

function renderServiceCards(
  services: Array<{ name: string; summary: string }>,
  limit?: number,
) {
  return services
    .slice(0, limit)
    .map(
      (service) => `<article class="service-card">
  <h3>${escapeXml(service.name)}</h3>
  <p>${escapeXml(service.summary)}</p>
</article>`,
    )
    .join("");
}

function renderChipRow(items: string[]) {
  return `<div class="chip-row">${items
    .map((item) => `<span class="chip">${escapeXml(item)}</span>`)
    .join("")}</div>`;
}

function renderPageShell(
  title: string,
  bodyClass: string,
  data: Awaited<ReturnType<typeof buildHeroCompositionData>>,
  content: string,
) {
  const brand = data.brand;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeXml(title)}</title>
    <style>
      @page {
        size: Letter;
        margin: 0;
      }

      :root {
        --paper: #f4f0e8;
        --ink: #171b21;
        --muted: #6f685f;
        --panel: rgba(11, 14, 19, 0.76);
        --panel-soft: rgba(255, 255, 255, 0.9);
        --line: rgba(23, 27, 33, 0.1);
        --line-strong: ${brand.palette.border};
        --bg-deep: ${brand.palette.backgroundDeep};
        --bg: ${brand.palette.background};
        --bg-soft: ${brand.palette.backgroundSoft};
        --text: ${brand.palette.text};
        --text-muted: ${brand.palette.textMuted};
        --amber: ${brand.palette.amber};
        --teal: ${brand.palette.teal};
        --pink: ${brand.palette.pink};
        --font: ${brand.typography.fontStack};
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #d9d2c9;
        font-family: var(--font);
      }

      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .sheet {
        width: 8.5in;
        min-height: 11in;
        margin: 0 auto;
        background: var(--paper);
        color: var(--ink);
        position: relative;
        overflow: hidden;
      }

      .sheet::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 14%, rgba(100, 213, 207, 0.18), transparent 22%),
          radial-gradient(circle at 82% 10%, rgba(245, 119, 162, 0.14), transparent 20%),
          radial-gradient(circle at 72% 86%, rgba(240, 191, 108, 0.12), transparent 24%);
        pointer-events: none;
      }

      .hero-band {
        position: relative;
        background:
          linear-gradient(135deg, var(--bg-deep) 0%, var(--bg) 58%, #17101f 100%);
        color: var(--text);
        padding: 0.72in 0.72in 0.52in;
        overflow: hidden;
      }

      .hero-band::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 22% 22%, rgba(100, 213, 207, 0.28), transparent 24%),
          radial-gradient(circle at 82% 18%, rgba(245, 119, 162, 0.24), transparent 20%),
          linear-gradient(rgba(248, 239, 227, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(248, 239, 227, 0.06) 1px, transparent 1px);
        background-size: auto, auto, 42px 42px, 42px 42px;
        opacity: 0.85;
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1.25in 1fr;
        gap: 0.34in;
        align-items: center;
      }

      .logo-mark {
        width: 1.25in;
        height: 1.25in;
        border-radius: 999px;
        background: rgba(7, 10, 14, 0.64);
        border: 1px solid rgba(248, 239, 227, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .logo-mark::before,
      .logo-mark::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        border: 2px solid transparent;
      }

      .logo-mark::before {
        inset: 0.13in;
        border-color: rgba(100, 213, 207, 0.26);
      }

      .logo-mark::after {
        inset: 0.26in;
        border-color: rgba(240, 191, 108, 0.2);
      }

      .logo-mark img {
        width: 0.78in;
        height: 0.78in;
        object-fit: contain;
        position: relative;
        z-index: 1;
      }

      .eyebrow {
        color: var(--amber);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.12in;
        font-weight: 700;
        margin: 0 0 0.08in;
      }

      .hero-title {
        margin: 0 0 0.1in;
        font-size: 0.44in;
        line-height: 1.04;
        letter-spacing: -0.03em;
        font-weight: 800;
      }

      .hero-subtitle {
        margin: 0;
        font-size: 0.18in;
        line-height: 1.42;
        color: var(--text-muted);
        max-width: 5.6in;
      }

      .body {
        position: relative;
        z-index: 1;
        padding: 0.42in 0.72in 0.58in;
      }

      .meta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.12in;
        margin: 0 0 0.28in;
      }

      .meta-chip,
      .chip {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.08in 0.14in;
        font-size: 0.13in;
        font-weight: 650;
        line-height: 1;
      }

      .meta-chip {
        background: rgba(11, 14, 19, 0.06);
        color: var(--ink);
        border: 1px solid rgba(23, 27, 33, 0.08);
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.1in;
      }

      .chip {
        background: rgba(100, 213, 207, 0.12);
        color: #0f1a1f;
        border: 1px solid rgba(100, 213, 207, 0.18);
      }

      .grid.two {
        display: grid;
        grid-template-columns: 1.08fr 0.92fr;
        gap: 0.28in;
      }

      .grid.three {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.18in;
      }

      .section {
        margin: 0 0 0.26in;
      }

      .section h2 {
        margin: 0 0 0.1in;
        font-size: 0.2in;
        line-height: 1.15;
        font-weight: 760;
      }

      .section p {
        margin: 0;
        font-size: 0.15in;
        line-height: 1.5;
        color: var(--muted);
      }

      .panel {
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid var(--line);
        border-radius: 0.18in;
        padding: 0.18in 0.2in;
      }

      .panel.dark {
        background: var(--panel);
        color: var(--text);
        border-color: rgba(248, 239, 227, 0.1);
      }

      .panel.dark p,
      .panel.dark li,
      .panel.dark .service-card p,
      .panel.dark .mini-note {
        color: var(--text-muted);
      }

      .panel h3,
      .service-card h3 {
        margin: 0 0 0.08in;
        font-size: 0.16in;
        line-height: 1.2;
        font-weight: 760;
      }

      .bullet-list {
        margin: 0;
        padding-left: 0.22in;
      }

      .bullet-list li {
        margin: 0 0 0.08in;
        color: var(--muted);
        font-size: 0.145in;
        line-height: 1.42;
      }

      .service-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.14in;
      }

      .service-card {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(23, 27, 33, 0.08);
        border-radius: 0.16in;
        padding: 0.16in;
      }

      .service-card p {
        margin: 0;
        color: var(--muted);
        font-size: 0.14in;
        line-height: 1.42;
      }

      .footer-band {
        margin-top: 0.24in;
        padding-top: 0.18in;
        border-top: 1px solid rgba(23, 27, 33, 0.12);
        display: flex;
        justify-content: space-between;
        gap: 0.2in;
        align-items: center;
      }

      .footer-note,
      .footer-links {
        font-size: 0.125in;
        line-height: 1.4;
        color: var(--muted);
      }

      .footer-links strong {
        color: var(--ink);
      }

      .callout {
        border-left: 0.04in solid var(--teal);
        padding-left: 0.16in;
        margin: 0.18in 0;
      }

      .callout p {
        color: var(--ink);
        font-size: 0.16in;
      }

      .case-study-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.16in;
      }

      .how-to-start {
        margin-top: 0.14in;
      }

      .case-box {
        background: rgba(255, 255, 255, 0.88);
        border: 1px dashed rgba(23, 27, 33, 0.18);
        border-radius: 0.16in;
        padding: 0.16in;
        min-height: 1.38in;
      }

      .case-box p,
      .mini-note {
        margin: 0;
        color: var(--muted);
        font-size: 0.14in;
        line-height: 1.44;
      }

      .proposal-cover .body {
        padding-top: 0.55in;
      }

      .proposal-cover .center-stack {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 6.85in;
      }

      .proposal-cover .big-title {
        font-size: 0.58in;
        line-height: 1.02;
        letter-spacing: -0.035em;
        font-weight: 820;
        max-width: 5.9in;
        margin: 0 0 0.18in;
      }

      .proposal-cover .big-subtitle {
        font-size: 0.19in;
        line-height: 1.52;
        color: var(--muted);
        max-width: 5.4in;
        margin: 0 0 0.3in;
      }

      .proposal-cover .prepared-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.18in;
        max-width: 5.6in;
      }

      .proposal-cover .prepared-grid .panel {
        min-height: 1.15in;
      }

      .proposal-cover .mini-label {
        margin: 0 0 0.08in;
        color: var(--amber);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 0.11in;
        font-weight: 700;
      }

      .proposal-cover .panel strong {
        display: block;
        font-size: 0.22in;
        line-height: 1.15;
        margin-bottom: 0.06in;
      }

      .proposal-cover .bottom-row {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 0.18in;
        align-items: end;
      }

      .proposal-cover .service-stack {
        display: grid;
        gap: 0.12in;
      }

      .proposal-cover .service-strip {
        display: flex;
        justify-content: space-between;
        gap: 0.2in;
        padding: 0.13in 0.16in;
        border-radius: 0.14in;
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid rgba(23, 27, 33, 0.08);
      }

      .proposal-cover .service-strip span:first-child {
        color: var(--ink);
        font-weight: 700;
      }

      .proposal-cover .service-strip span:last-child {
        color: var(--muted);
        font-size: 0.135in;
      }
    </style>
  </head>
  <body class="${bodyClass}">
    <main class="sheet ${bodyClass}">
      ${content}
    </main>
  </body>
</html>`;
}

function buildAssets(
  data: Awaited<ReturnType<typeof buildHeroCompositionData>>,
) {
  const brand = data.brand;
  const collateral = getClientCollateralConfig(brand.id);
  const services = collateral.services;
  const footerLinks = `<strong>${escapeXml(brand.metadata.contactName)}</strong> · ${escapeXml(
    brand.metadata.contactEmail,
  )} · ${escapeXml(brand.metadata.workWithMeUrl.replace(/^https:\/\//, ""))}`;

  const proposalContent = `
    <section class="hero-band">
      <div class="hero-content">
        <div class="logo-mark">
          <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" />
        </div>
        <div>
          <p class="eyebrow">${escapeXml(collateral.proposal.eyebrow)}</p>
          <h1 class="hero-title">${escapeXml(brand.labels.workWithMe)}</h1>
          <p class="hero-subtitle">${escapeXml(collateral.positioning.oneLiner)}</p>
        </div>
      </div>
    </section>
    <section class="body">
      <div class="center-stack">
        <div>
          <div class="meta-row">
            <span class="meta-chip">${escapeXml(collateral.positioning.primaryRole)}</span>
            <span class="meta-chip">${escapeXml(brand.metadata.canonicalDomain)}</span>
          </div>
          <h2 class="big-title">${escapeXml(collateral.proposal.title)}</h2>
          <p class="big-subtitle">${escapeXml(collateral.proposal.subtitle)}</p>
          <div class="prepared-grid">
            <article class="panel">
              <p class="mini-label">Prepared For</p>
              <strong>Client Name</strong>
              <p>Company name, decision maker, or team lead.</p>
            </article>
            <article class="panel">
              <p class="mini-label">Prepared By</p>
              <strong>${escapeXml(brand.metadata.contactName)}</strong>
              <p>${escapeXml(collateral.positioning.primaryRole)}</p>
            </article>
          </div>
        </div>
        <div class="bottom-row">
          <div class="service-stack">
            ${services
              .slice(0, 3)
              .map(
                (service) => `<div class="service-strip"><span>${escapeXml(
                  service.name,
                )}</span><span>${escapeXml(service.summary)}</span></div>`,
              )
              .join("")}
          </div>
          <div class="panel dark">
            <h3>${escapeXml(collateral.positioning.shortPromise)}</h3>
            <p>${escapeXml(collateral.proposal.footerNote)}</p>
          </div>
        </div>
      </div>
      <div class="footer-band">
        <div class="footer-note">${escapeXml(
          data.scene.label,
        )} direction adapted for client-facing proposal material.</div>
        <div class="footer-links">${footerLinks}</div>
      </div>
    </section>`;

  const capabilityContent = `
    <section class="hero-band">
      <div class="hero-content">
        <div class="logo-mark">
          <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" />
        </div>
        <div>
          <p class="eyebrow">${escapeXml(collateral.capability.eyebrow)}</p>
          <h1 class="hero-title">${escapeXml(collateral.capability.title)}</h1>
          <p class="hero-subtitle">${escapeXml(collateral.capability.intro)}</p>
        </div>
      </div>
    </section>
    <section class="body">
      <div class="meta-row">
        <span class="meta-chip">${escapeXml(collateral.positioning.primaryRole)}</span>
        <span class="meta-chip">${escapeXml(collateral.positioning.shortPromise)}</span>
      </div>
      <div class="grid two">
        <div>
          <section class="section">
            <h2>${escapeXml(collateral.positioning.oneLiner)}</h2>
            <p>${escapeXml(brand.metadata.contactName)} works best with teams that need a practical fix, a calm technical partner, and a small project that can actually ship.</p>
          </section>
          <section class="section panel">
            <h3>Who this fits best</h3>
            ${renderList(collateral.positioning.audience)}
          </section>
          <section class="section panel dark">
            <h3>What tends to improve</h3>
            ${renderList(collateral.capability.outcomes)}
          </section>
          <section class="section panel">
            <h3>Problems I solve</h3>
            ${renderList(collateral.capability.problemPatterns)}
          </section>
        </div>
        <div>
          <section class="section">
            <div class="service-grid">
              ${renderServiceCards(services)}
            </div>
          </section>
          <section class="section panel">
            <h3>How Jason usually works</h3>
            ${renderChipRow(collateral.capability.engagementModes)}
          </section>
          <section class="section panel">
            <h3>Why clients tend to trust the process</h3>
            ${renderList(collateral.proofSignals)}
          </section>
          <section class="section panel dark how-to-start">
            <h3>How to start</h3>
            ${renderList(collateral.capability.howToStart)}
            <p class="mini-note" style="margin-top: 0.12in;">Primary CTA: ${escapeXml(
              collateral.ctas.primaryCTA.label,
            )} via ${escapeXml(brand.metadata.workWithMeUrl.replace(/^https:\/\//, ""))}</p>
          </section>
        </div>
      </div>
      <div class="callout">
        <p>${escapeXml(collateral.ctas.primaryCTA.description)}</p>
      </div>
      <div class="footer-band">
        <div class="footer-note">Use this as a referral leave-behind, warm-intro attachment, or fast overview before a call.</div>
        <div class="footer-links">${footerLinks}</div>
      </div>
    </section>`;

  const discoveryContent = `
    <section class="hero-band">
      <div class="hero-content">
        <div class="logo-mark">
          <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" />
        </div>
        <div>
          <p class="eyebrow">${escapeXml(collateral.discovery.eyebrow)}</p>
          <h1 class="hero-title">${escapeXml(collateral.discovery.title)}</h1>
          <p class="hero-subtitle">${escapeXml(collateral.discovery.subtitle)}</p>
        </div>
      </div>
    </section>
    <section class="body">
      <div class="meta-row">
        <span class="meta-chip">20-30 minute intro</span>
        <span class="meta-chip">Low pressure</span>
        <span class="meta-chip">Practical next steps</span>
      </div>
      <div class="grid two">
        <div>
          <section class="section panel dark">
            <h3>What we cover</h3>
            ${renderList(collateral.discovery.agenda)}
          </section>
          <section class="section panel">
            <h3>Useful prep questions</h3>
            ${renderList(collateral.discovery.prepQuestions)}
          </section>
        </div>
        <div>
          <section class="section panel">
            <h3>Common problem patterns</h3>
            ${renderList([
              "Requests disappear into email threads or shared spreadsheets.",
              "Approvals depend on manual follow-up and status-checking.",
              "Reports are assembled by hand every week or month.",
              "PDFs, forms, or intake details are hard to search and coordinate.",
            ])}
          </section>
          <section class="section panel dark">
            <h3>What happens after the call</h3>
            <p>${escapeXml(collateral.discovery.nextStep)}</p>
            <div class="callout">
              <p>You should leave the conversation with better clarity, even if we decide not to work together.</p>
            </div>
          </section>
        </div>
      </div>
      <div class="footer-band">
        <div class="footer-note">Good attachment for outreach, scheduling replies, or follow-up after a warm intro.</div>
        <div class="footer-links">${footerLinks}</div>
      </div>
    </section>`;

  const caseStudyContent = `
    <section class="hero-band">
      <div class="hero-content">
        <div class="logo-mark">
          <img src="${data.logoDataUrl}" alt="${escapeXml(brand.displayName)} logo" />
        </div>
        <div>
          <p class="eyebrow">${escapeXml(collateral.caseStudy.eyebrow)}</p>
          <h1 class="hero-title">${escapeXml(collateral.caseStudy.title)}</h1>
          <p class="hero-subtitle">${escapeXml(collateral.caseStudy.intro)}</p>
        </div>
      </div>
    </section>
    <section class="body">
      <div class="meta-row">
        <span class="meta-chip">Use after real client work exists</span>
        <span class="meta-chip">Keep it concrete</span>
        <span class="meta-chip">Prefer outcomes over hype</span>
      </div>
      <div class="case-study-grid">
        ${collateral.caseStudy.sections
          .map(
            (section) => `<article class="case-box">
  <h3>${escapeXml(section.label)}</h3>
  <p>${escapeXml(section.prompt)}</p>
</article>`,
          )
          .join("")}
      </div>
      <div class="grid two" style="margin-top: 0.18in;">
        <section class="section panel">
          <h3>Metric prompts</h3>
          ${renderChipRow(collateral.caseStudy.metricPrompts)}
          <p class="mini-note" style="margin-top: 0.12in;">Use only real numbers or clearly labeled estimates.</p>
        </section>
        <section class="section panel dark">
          <h3>Client quote</h3>
          <p>${escapeXml(collateral.caseStudy.quotePrompt)}</p>
        </section>
      </div>
      <section class="section panel" style="margin-top: 0.08in;">
        <h3>Suggested structure</h3>
        ${renderList([
          "Open with the business problem, not the technology stack.",
          "Show what changed in the day-to-day workflow.",
          "Keep screenshots secondary to the operational outcome.",
          "End with a short note on scope, timeline, or collaboration style if helpful.",
        ])}
      </section>
      <div class="footer-band">
        <div class="footer-note">Template asset for future proof once real engagements exist.</div>
        <div class="footer-links">${footerLinks}</div>
      </div>
    </section>`;

  return [
    {
      id: "proposal-cover",
      outputName: createBrandOutputName(brand.id, "proposal-cover", process.env.BRAND_THEME),
      title: `${brand.displayName} Proposal Cover`,
      html: renderPageShell(
        `${brand.displayName} Proposal Cover`,
        "proposal-cover",
        data,
        proposalContent,
      ),
    },
    {
      id: "capability-sheet",
      outputName: createBrandOutputName(brand.id, "capability-sheet", process.env.BRAND_THEME),
      title: `${brand.displayName} Capability Sheet`,
      html: renderPageShell(
        `${brand.displayName} Capability Sheet`,
        "capability-sheet",
        data,
        capabilityContent,
      ),
    },
    {
      id: "discovery-call",
      outputName: createBrandOutputName(brand.id, "discovery-call", process.env.BRAND_THEME),
      title: `${brand.displayName} Discovery Call Guide`,
      html: renderPageShell(
        `${brand.displayName} Discovery Call Guide`,
        "discovery-call",
        data,
        discoveryContent,
      ),
    },
    {
      id: "case-study-template",
      outputName: createBrandOutputName(brand.id, "case-study-template", process.env.BRAND_THEME),
      title: `${brand.displayName} Case Study Template`,
      html: renderPageShell(
        `${brand.displayName} Case Study Template`,
        "case-study-template",
        data,
        caseStudyContent,
      ),
    },
  ] satisfies AssetDefinition[];
}

async function renderAssetFiles(asset: AssetDefinition) {
  const htmlPath = path.join(outputDir, `${asset.outputName}.html`);
  const pngPath = path.join(outputDir, `${asset.outputName}.png`);
  const pdfPath = path.join(outputDir, `${asset.outputName}.pdf`);

  await fs.writeFile(htmlPath, asset.html, "utf8");

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: previewViewport,
      deviceScaleFactor: 1,
    });
    await page.setContent(asset.html, { waitUntil: "load" });
    await page.locator(".sheet").screenshot({
      path: pngPath,
      type: "png",
    });
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0in",
        right: "0in",
        bottom: "0in",
        left: "0in",
      },
    });
    await page.close();
  } finally {
    await browser.close();
  }

  return { htmlPath, pngPath, pdfPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);
  const assets = buildAssets(data).filter((asset) =>
    args.asset ? asset.id === args.asset : true,
  );

  for (const asset of assets) {
    const paths = await renderAssetFiles(asset);
    console.log(`${asset.title} HTML written to ${path.relative(process.cwd(), paths.htmlPath)}`);
    console.log(`${asset.title} PNG written to ${path.relative(process.cwd(), paths.pngPath)}`);
    console.log(`${asset.title} PDF written to ${path.relative(process.cwd(), paths.pdfPath)}`);

    if (asset.id === "capability-sheet") {
      const collateral = getClientCollateralConfig(data.brand.id);
      const manifestPath = await writeCapabilitySheetManifest({
        html: asset.html,
        collateral,
        data,
        outputName: asset.outputName,
        htmlPath: paths.htmlPath,
        pngPath: paths.pngPath,
        pdfPath: paths.pdfPath,
      });
      console.log(
        `Capability sheet manifest written to ${path.relative(process.cwd(), manifestPath)}`,
      );
    }
  }

  console.log(`Brand: ${data.brand.displayName}`);
  console.log(`Scene: ${data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
