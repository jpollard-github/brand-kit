import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildHeroCompositionData,
  renderHeroBase,
  renderHeroDefs,
  renderSvgToPng,
  repoRootDir,
} from "../social/hero-composition";
import { createBrandOutputName, resolveBrandId } from "../shared/cli";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(repoRootDir, "generators", "outputs", "documents");

const documentSize = {
  width: 2550,
  height: 3300,
};

type StationeryArgs = {
  brandId: string;
  sceneId?: string;
  invoiceName: string;
  letterheadName: string;
};

function parseArgs(argv: string[]): StationeryArgs {
  const defaultBrandId = resolveBrandId(argv);
  const args: StationeryArgs = {
    brandId: defaultBrandId,
    sceneId: "work-with-me-hero",
    invoiceName: createBrandOutputName(
      defaultBrandId,
      "invoice",
      process.env.BRAND_THEME,
    ),
    letterheadName: createBrandOutputName(
      defaultBrandId,
      "letterhead",
      process.env.BRAND_THEME,
    ),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--brand") {
      args.brandId = argv[index + 1] ?? args.brandId;
      index += 1;
    } else if (arg.startsWith("--brand=")) {
      args.brandId = arg.slice("--brand=".length);
    } else if (arg === "--scene") {
      args.sceneId = argv[index + 1] ?? args.sceneId;
      index += 1;
    } else if (arg.startsWith("--scene=")) {
      args.sceneId = arg.slice("--scene=".length);
    } else if (arg === "--invoice-output") {
      args.invoiceName = argv[index + 1] ?? args.invoiceName;
      index += 1;
    } else if (arg.startsWith("--invoice-output=")) {
      args.invoiceName = arg.slice("--invoice-output=".length);
    } else if (arg === "--letterhead-output") {
      args.letterheadName = argv[index + 1] ?? args.letterheadName;
      index += 1;
    } else if (arg.startsWith("--letterhead-output=")) {
      args.letterheadName = arg.slice("--letterhead-output=".length);
    }
  }

  return args;
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

function renderLetterhead(
  data: Awaited<ReturnType<typeof buildHeroCompositionData>>,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${documentSize.width}" height="${documentSize.height}" viewBox="0 0 ${documentSize.width} ${documentSize.height}">
  ${renderHeroDefs(data.brand, 52, "#15101f")}
  <rect width="${documentSize.width}" height="${documentSize.height}" fill="#f4f0e8" />
  <rect x="0" y="0" width="${documentSize.width}" height="760" fill="url(#bg)" />
  <rect x="0" y="0" width="${documentSize.width}" height="760" fill="url(#tealGlow)" opacity="0.8" />
  <rect x="0" y="0" width="${documentSize.width}" height="760" fill="url(#pinkGlow)" opacity="0.7" />
  <rect x="0" y="0" width="${documentSize.width}" height="760" fill="url(#grid)" opacity="0.22" />
  <rect x="120" y="120" width="2310" height="3060" rx="52" fill="none" stroke="rgba(15, 18, 24, 0.08)" stroke-width="4" />

  <rect x="164" y="164" width="2222" height="640" rx="42" fill="rgba(10, 13, 18, 0.5)" stroke="${data.brand.palette.border}" stroke-width="3" />
  <circle cx="474" cy="484" r="176" fill="rgba(7, 10, 14, 0.66)" stroke="rgba(248,239,227,0.08)" stroke-width="3" />
  <circle cx="474" cy="484" r="136" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="12" />
  <circle cx="474" cy="484" r="104" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${data.logoDataUrl}" x="314" y="324" width="320" height="320" preserveAspectRatio="xMidYMid meet" />

  <text x="740" y="324" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="10">${data.kicker.toUpperCase()}</text>
  <text x="740" y="446" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="122" font-weight="790" letter-spacing="-4">${data.brand.metadata.contactName}</text>
  <text x="740" y="526" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="42" font-weight="520">Web apps, automations, AI workflows, and technical cleanup.</text>
  <text x="740" y="594" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="36" font-weight="520">${data.brand.displayName} stationery template built from the Work With Me scene.</text>

  <rect x="740" y="640" width="1440" height="84" rx="26" fill="rgba(7, 10, 14, 0.72)" stroke="rgba(248,239,227,0.08)" stroke-width="2" />
  <text x="812" y="696" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="30" font-weight="650">${data.brand.metadata.contactEmail}</text>
  <text x="1466" y="696" text-anchor="middle" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="30" font-weight="700">${data.displayUrl}</text>
  <text x="2100" y="696" text-anchor="end" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="30" font-weight="650">Work With Me</text>

  <text x="228" y="980" fill="#171b21" font-family="${data.fontStack}" font-size="36" font-weight="700" letter-spacing="6">LETTERHEAD</text>
  <text x="228" y="1064" fill="#7d766d" font-family="${data.fontStack}" font-size="34" font-weight="520">Use this page as a client-facing proposal, note, or cover letter shell.</text>

  <line x1="228" y1="1160" x2="2322" y2="1160" stroke="rgba(21, 27, 34, 0.12)" stroke-width="4" />

  <text x="228" y="1310" fill="#171b21" font-family="${data.fontStack}" font-size="44" font-weight="650">Date</text>
  <text x="560" y="1310" fill="#7d766d" font-family="${data.fontStack}" font-size="44" font-weight="520">June 28, 2026</text>

  <text x="228" y="1450" fill="#171b21" font-family="${data.fontStack}" font-size="44" font-weight="650">To</text>
  <text x="560" y="1450" fill="#7d766d" font-family="${data.fontStack}" font-size="44" font-weight="520">Client Name / Company</text>

  <text x="228" y="1660" fill="#171b21" font-family="${data.fontStack}" font-size="46" font-weight="720">Subject</text>
  <text x="228" y="1740" fill="#171b21" font-family="${data.fontStack}" font-size="64" font-weight="780">Project proposal or follow-up note</text>

  <text x="228" y="1950" fill="#3a342d" font-family="${data.fontStack}" font-size="42" font-weight="520">Hello,</text>
  <text x="228" y="2070" fill="#4d4640" font-family="${data.fontStack}" font-size="38" font-weight="520">This template keeps the top of the page recognizably ArcadeGhosts while leaving the body calm and practical.</text>
  <text x="228" y="2140" fill="#4d4640" font-family="${data.fontStack}" font-size="38" font-weight="520">Use it for proposals, short deliverables, technical notes, invoices with more explanation, or lightweight client-facing letters.</text>
  <text x="228" y="2280" fill="#4d4640" font-family="${data.fontStack}" font-size="38" font-weight="520">The body intentionally moves back toward paper-friendly neutrals instead of pushing the full neon mood onto every paragraph.</text>
  <text x="228" y="2420" fill="#4d4640" font-family="${data.fontStack}" font-size="38" font-weight="520">That should help it feel professional but still unmistakably tied to the same brand system as the site, cards, and social assets.</text>

  <text x="228" y="2710" fill="#171b21" font-family="${data.fontStack}" font-size="42" font-weight="650">${data.brand.metadata.contactName}</text>
  <text x="228" y="2780" fill="#7d766d" font-family="${data.fontStack}" font-size="36" font-weight="520">${data.brand.displayName}</text>

  <line x1="228" y1="3008" x2="2322" y2="3008" stroke="rgba(21, 27, 34, 0.12)" stroke-width="4" />
  <text x="228" y="3098" fill="#7d766d" font-family="${data.fontStack}" font-size="30" font-weight="520">Letterhead preview generated from the Work With Me scene.</text>
</svg>`;
}

function renderInvoice(
  data: Awaited<ReturnType<typeof buildHeroCompositionData>>,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${documentSize.width}" height="${documentSize.height}" viewBox="0 0 ${documentSize.width} ${documentSize.height}">
  ${renderHeroDefs(data.brand, 52, "#15101f")}
  <rect width="${documentSize.width}" height="${documentSize.height}" fill="#f4f0e8" />
  <rect x="0" y="0" width="${documentSize.width}" height="720" fill="url(#bg)" />
  <rect x="0" y="0" width="${documentSize.width}" height="720" fill="url(#tealGlow)" opacity="0.82" />
  <rect x="0" y="0" width="${documentSize.width}" height="720" fill="url(#pinkGlow)" opacity="0.72" />
  <rect x="0" y="0" width="${documentSize.width}" height="720" fill="url(#grid)" opacity="0.2" />
  <rect x="120" y="120" width="2310" height="3060" rx="52" fill="none" stroke="rgba(15, 18, 24, 0.08)" stroke-width="4" />

  <rect x="164" y="164" width="1030" height="588" rx="42" fill="rgba(10, 13, 18, 0.54)" stroke="${data.brand.palette.border}" stroke-width="3" />
  <circle cx="456" cy="460" r="166" fill="rgba(7, 10, 14, 0.66)" stroke="rgba(248,239,227,0.08)" stroke-width="3" />
  <circle cx="456" cy="460" r="128" fill="none" stroke="${data.brand.palette.teal}" stroke-opacity="0.24" stroke-width="12" />
  <circle cx="456" cy="460" r="98" fill="none" stroke="${data.brand.palette.amber}" stroke-opacity="0.16" stroke-width="8" />
  <image href="${data.logoDataUrl}" x="304" y="308" width="304" height="304" preserveAspectRatio="xMidYMid meet" />

  <text x="688" y="316" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="32" font-weight="700" letter-spacing="9">INVOICE</text>
  <text x="688" y="434" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="110" font-weight="790" letter-spacing="-4">${data.brand.displayName}</text>
  <text x="688" y="506" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="38" font-weight="520">Small projects. Clear problems. Personal attention.</text>
  <text x="688" y="620" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="34" font-weight="700">${data.brand.metadata.contactEmail}</text>
  <text x="688" y="676" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="34" font-weight="650">${data.displayUrl}</text>

  <rect x="1308" y="164" width="1078" height="588" rx="42" fill="rgba(255,255,255,0.78)" stroke="rgba(15, 18, 24, 0.08)" stroke-width="3" />
  <text x="1398" y="296" fill="#171b21" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="5">BILL TO</text>
  <text x="1398" y="388" fill="#171b21" font-family="${data.fontStack}" font-size="66" font-weight="760">Client Name</text>
  <text x="1398" y="458" fill="#6f685f" font-family="${data.fontStack}" font-size="38" font-weight="520">Company Name</text>
  <text x="1398" y="526" fill="#6f685f" font-family="${data.fontStack}" font-size="36" font-weight="520">client@example.com</text>

  <text x="1398" y="642" fill="#171b21" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="5">DETAILS</text>
  <text x="1398" y="700" fill="#6f685f" font-family="${data.fontStack}" font-size="34" font-weight="520">Invoice #: AG-2026-001</text>
  <text x="1784" y="700" fill="#6f685f" font-family="${data.fontStack}" font-size="34" font-weight="520">Date: June 28, 2026</text>
  <text x="2188" y="700" text-anchor="end" fill="#6f685f" font-family="${data.fontStack}" font-size="34" font-weight="520">Due: July 12, 2026</text>

  <text x="228" y="936" fill="#171b21" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="5">SERVICES</text>
  <rect x="228" y="1004" width="2094" height="116" rx="24" fill="#131821" />
  <text x="278" y="1074" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="30" font-weight="700" letter-spacing="4">DESCRIPTION</text>
  <text x="1480" y="1074" text-anchor="end" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="30" font-weight="700" letter-spacing="4">HOURS</text>
  <text x="1750" y="1074" text-anchor="end" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="30" font-weight="700" letter-spacing="4">RATE</text>
  <text x="2236" y="1074" text-anchor="end" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="30" font-weight="700" letter-spacing="4">AMOUNT</text>

  <rect x="228" y="1148" width="2094" height="186" rx="28" fill="#ffffff" stroke="rgba(15, 18, 24, 0.08)" stroke-width="2" />
  <text x="278" y="1238" fill="#171b21" font-family="${data.fontStack}" font-size="42" font-weight="650">Website cleanup and automation pass</text>
  <text x="278" y="1304" fill="#6f685f" font-family="${data.fontStack}" font-size="32" font-weight="520">Technical cleanup, workflow fixes, deployment notes, and practical polish.</text>
  <text x="1480" y="1268" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">8.0</text>
  <text x="1750" y="1268" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">$125</text>
  <text x="2236" y="1268" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="750">$1,000</text>

  <rect x="228" y="1376" width="2094" height="186" rx="28" fill="#ffffff" stroke="rgba(15, 18, 24, 0.08)" stroke-width="2" />
  <text x="278" y="1466" fill="#171b21" font-family="${data.fontStack}" font-size="42" font-weight="650">AI workflow setup and documentation</text>
  <text x="278" y="1532" fill="#6f685f" font-family="${data.fontStack}" font-size="32" font-weight="520">Structured prompts, automation notes, and client handoff guidance.</text>
  <text x="1480" y="1496" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">4.0</text>
  <text x="1750" y="1496" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">$125</text>
  <text x="2236" y="1496" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="750">$500</text>

  <rect x="228" y="1604" width="2094" height="186" rx="28" fill="#ffffff" stroke="rgba(15, 18, 24, 0.08)" stroke-width="2" />
  <text x="278" y="1694" fill="#171b21" font-family="${data.fontStack}" font-size="42" font-weight="650">Follow-up support and final polish</text>
  <text x="278" y="1760" fill="#6f685f" font-family="${data.fontStack}" font-size="32" font-weight="520">Launch-adjacent QA, polish, and documentation updates.</text>
  <text x="1480" y="1724" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">2.0</text>
  <text x="1750" y="1724" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="650">$125</text>
  <text x="2236" y="1724" text-anchor="end" fill="#171b21" font-family="${data.fontStack}" font-size="38" font-weight="750">$250</text>

  <rect x="1458" y="1948" width="864" height="516" rx="36" fill="#131821" />
  <text x="1534" y="2062" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="30" font-weight="650" letter-spacing="4">SUBTOTAL</text>
  <text x="2236" y="2062" text-anchor="end" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="40" font-weight="720">$1,750</text>
  <text x="1534" y="2168" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="30" font-weight="650" letter-spacing="4">TAX</text>
  <text x="2236" y="2168" text-anchor="end" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="40" font-weight="720">$0</text>
  <line x1="1534" y1="2242" x2="2236" y2="2242" stroke="rgba(248,239,227,0.12)" stroke-width="3" />
  <text x="1534" y="2358" fill="${data.brand.palette.amber}" font-family="${data.fontStack}" font-size="34" font-weight="760" letter-spacing="4">TOTAL DUE</text>
  <text x="2236" y="2358" text-anchor="end" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="60" font-weight="800">$1,750</text>

  <text x="228" y="2072" fill="#171b21" font-family="${data.fontStack}" font-size="36" font-weight="700" letter-spacing="5">NOTES</text>
  <text x="228" y="2160" fill="#4d4640" font-family="${data.fontStack}" font-size="36" font-weight="520">Thank you for the work. Payment details can be replaced with Stripe, ACH, Zelle, or another real collection method.</text>
  <text x="228" y="2226" fill="#4d4640" font-family="${data.fontStack}" font-size="36" font-weight="520">This is intentionally a branded invoice shell rather than a full accounting system.</text>

  <text x="228" y="2484" fill="#171b21" font-family="${data.fontStack}" font-size="34" font-weight="700" letter-spacing="5">PAYMENT DETAILS</text>
  <rect x="228" y="2554" width="1004" height="318" rx="32" fill="#ffffff" stroke="rgba(15, 18, 24, 0.08)" stroke-width="2" />
  <text x="288" y="2654" fill="#171b21" font-family="${data.fontStack}" font-size="34" font-weight="650">Preferred payment method</text>
  <text x="288" y="2724" fill="#6f685f" font-family="${data.fontStack}" font-size="32" font-weight="520">Replace with your real Stripe, ACH, or payment instructions.</text>
  <text x="288" y="2808" fill="#131821" font-family="${data.fontStack}" font-size="30" font-weight="700">${data.brand.metadata.contactEmail}</text>

  <line x1="228" y1="3008" x2="2322" y2="3008" stroke="rgba(21, 27, 34, 0.12)" stroke-width="4" />
  <text x="228" y="3098" fill="#7d766d" font-family="${data.fontStack}" font-size="30" font-weight="520">Invoice preview generated from the Work With Me scene.</text>
</svg>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  const data = await buildHeroCompositionData(args.brandId, args.sceneId);

  const letterheadSvg = renderLetterhead(data);
  const invoiceSvg = renderInvoice(data);

  const letterheadSvgPath = path.join(outputDir, `${args.letterheadName}.svg`);
  const invoiceSvgPath = path.join(outputDir, `${args.invoiceName}.svg`);
  await fs.writeFile(letterheadSvgPath, letterheadSvg, "utf8");
  await fs.writeFile(invoiceSvgPath, invoiceSvg, "utf8");

  const letterheadPngPath = await renderSvgToPng(
    letterheadSvg,
    documentSize,
    path.join(outputDir, `${args.letterheadName}.png`),
  );
  const invoicePngPath = await renderSvgToPng(
    invoiceSvg,
    documentSize,
    path.join(outputDir, `${args.invoiceName}.png`),
  );

  console.log(
    `Letterhead SVG written to ${path.relative(process.cwd(), letterheadSvgPath)}`,
  );
  console.log(
    `Letterhead PNG written to ${path.relative(process.cwd(), letterheadPngPath)}`,
  );
  console.log(
    `Invoice SVG written to ${path.relative(process.cwd(), invoiceSvgPath)}`,
  );
  console.log(
    `Invoice PNG written to ${path.relative(process.cwd(), invoicePngPath)}`,
  );
  console.log(`Brand: ${data.brand.displayName}`);
  console.log(`Scene: ${data.scene.label}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
