import type { HeroCompositionData } from "./hero-composition";

export type Rect = { x: number; y: number; width: number; height: number };
export type FormatLayout = {
  id: "jasonpollard-og" | "jasonpollard-linkedin" | "brandkit-project-cover";
  canvas: { width: number; height: number };
  contentBounds: Rect;
  textBounds: Record<string, Rect>;
  safeAreas: Record<string, Rect>;
  requiredCopy: readonly string[];
};

export const jasonPollardOgLayout: FormatLayout = {
  id: "jasonpollard-og",
  canvas: { width: 1200, height: 630 },
  contentBounds: { x: 72, y: 72, width: 1056, height: 486 },
  textBounds: {
    label: { x: 72, y: 72, width: 1056, height: 34 },
    headline: { x: 72, y: 190, width: 970, height: 230 },
    footer: { x: 72, y: 520, width: 1056, height: 38 },
  },
  safeAreas: {},
  requiredCopy: [
    "Jason Pollard · Software Engineer & Architect",
    "I build, repair, modernize, and explain difficult software systems.",
    "20+ years · AI-enabled engineering",
    "jasonpollard.com",
  ],
};

export const jasonPollardLinkedInLayout: FormatLayout = {
  id: "jasonpollard-linkedin",
  canvas: { width: 1584, height: 396 },
  contentBounds: { x: 56, y: 38, width: 1472, height: 320 },
  textBounds: {
    label: { x: 260, y: 42, width: 1120, height: 24 },
    headline: { x: 260, y: 88, width: 1100, height: 112 },
    positioning: { x: 300, y: 276, width: 860, height: 34 },
    domain: { x: 300, y: 332, width: 260, height: 30 },
  },
  safeAreas: {
    profilePhoto: { x: 0, y: 210, width: 286, height: 186 },
    centeredMobileCrop: { x: 198, y: 0, width: 1188, height: 396 },
  },
  requiredCopy: [
    "Staff / Principal Software Engineer · Solutions Architect",
    "I build, repair, modernize, and explain difficult software systems.",
    "20+ years · AI-enabled engineering",
    "jasonpollard.com",
  ],
};

export const brandKitProjectCoverLayout: FormatLayout = {
  id: "brandkit-project-cover",
  canvas: { width: 1280, height: 720 },
  contentBounds: { x: 72, y: 64, width: 1136, height: 592 },
  textBounds: {
    label: { x: 72, y: 64, width: 760, height: 30 },
    title: { x: 72, y: 148, width: 650, height: 96 },
    summary: { x: 72, y: 274, width: 920, height: 100 },
    workflow: { x: 72, y: 456, width: 1136, height: 154 },
  },
  safeAreas: {},
  requiredCopy: [
    "INDEPENDENT ENGINEERING · TYPESCRIPT + NODE.JS",
    "BrandKit",
    "Source-driven, verified brand assets across distinct identities.",
    "Brand inputs · Format rules · Shared generation · Automated checks · Human approval",
  ],
};

export function isWithinCanvas(rect: Rect, canvas: { width: number; height: number }) {
  return rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= canvas.width && rect.y + rect.height <= canvas.height;
}

function grid(palette: HeroCompositionData["brand"]["palette"]) {
  return `<defs><pattern id="siteGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${palette.border}" stroke-width="1" /></pattern></defs>`;
}

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderJasonPollardOg(data: HeroCompositionData) {
  const copy = jasonPollardOgLayout.requiredCopy;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">Jason Pollard Open Graph image</title><desc id="desc">${xml(copy.join(" | "))}</desc>
  <rect width="1200" height="630" fill="${data.brand.palette.background}" />
  <rect width="1200" height="14" fill="${data.brand.palette.teal}" />
  <text x="72" y="96" fill="${data.brand.palette.teal}" font-family="${data.fontStack}" font-size="24" letter-spacing="4">JASON POLLARD · SOFTWARE ENGINEER &amp; ARCHITECT</text>
  <text x="72" y="250" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="70" font-weight="700" letter-spacing="-2.5">
    <tspan x="72" dy="0">I build, repair, modernize, and</tspan><tspan x="72" dy="76">explain difficult software systems.</tspan>
  </text>
  <text x="72" y="558" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="25">20+ years · AI-enabled engineering</text>
  <text x="1128" y="558" text-anchor="end" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="25">jasonpollard.com</text>
</svg>`;
}

export function renderJasonPollardLinkedIn(data: HeroCompositionData) {
  const copy = jasonPollardLinkedInLayout.requiredCopy;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396" role="img" aria-labelledby="title desc">
  <title id="title">Jason Pollard LinkedIn banner</title><desc id="desc">${copy.join(" | ")}</desc>
  ${grid(data.brand.palette)}
  <rect width="1584" height="396" fill="${data.brand.palette.background}" /><rect width="1584" height="396" fill="url(#siteGrid)" opacity="0.24" /><rect width="1584" height="12" fill="${data.brand.palette.teal}" />
  <image href="${data.logoDataUrl}" x="56" y="46" width="112" height="112" preserveAspectRatio="xMidYMid meet" />
  <line x1="56" y1="184" x2="214" y2="184" stroke="${data.brand.palette.amber}" stroke-width="5" />
  <text x="260" y="60" fill="${data.brand.palette.cyan}" font-family="ui-monospace, SFMono-Regular, Consolas, monospace" font-size="16" font-weight="700" letter-spacing="2.5">STAFF / PRINCIPAL SOFTWARE ENGINEER · SOLUTIONS ARCHITECT</text>
  <text x="260" y="126" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="48" font-weight="700" letter-spacing="-1.8">
    <tspan x="260" dy="0">I build, repair, modernize, and explain</tspan><tspan x="260" dy="54">difficult software systems.</tspan>
  </text>
  <text x="300" y="300" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="23">20+ years · AI-enabled engineering</text>
  <line x1="300" y1="322" x2="1520" y2="322" stroke="${data.brand.palette.border}" />
  <text x="300" y="360" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="21" font-weight="700">jasonpollard.com</text>
</svg>`;
}

export function renderBrandKitProjectCover(data: HeroCompositionData) {
  const steps = ["Brand inputs", "Format rules", "Shared generation", "Automated checks", "Human approval"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-labelledby="title desc">
  <title id="title">BrandKit project cover</title><desc id="desc">${brandKitProjectCoverLayout.requiredCopy.join(" | ")}</desc>
  ${grid(data.brand.palette)}
  <rect width="1280" height="720" fill="${data.brand.palette.background}" /><rect width="1280" height="720" fill="url(#siteGrid)" opacity="0.24" /><rect width="14" height="720" fill="${data.brand.palette.teal}" />
  <text x="72" y="86" fill="${data.brand.palette.cyan}" font-family="ui-monospace, SFMono-Regular, Consolas, monospace" font-size="18" font-weight="700" letter-spacing="3">INDEPENDENT ENGINEERING · TYPESCRIPT + NODE.JS</text>
  <text x="72" y="220" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="92" font-weight="700" letter-spacing="-4">BrandKit</text>
  <text x="72" y="310" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="34"><tspan x="72">Source-driven, verified brand assets</tspan><tspan x="72" dy="44">across distinct identities.</tspan></text>
  <line x1="72" y1="424" x2="1208" y2="424" stroke="${data.brand.palette.border}" />
  ${steps.map((step, index) => { const x = 72 + index * 227; return `<g><text x="${x}" y="478" fill="${data.brand.palette.copper}" font-family="ui-monospace, monospace" font-size="16" font-weight="700">0${index + 1}</text><text x="${x}" y="528" fill="${data.brand.palette.text}" font-family="${data.fontStack}" font-size="22" font-weight="700">${step}</text>${index < steps.length - 1 ? `<line x1="${x + 174}" y1="502" x2="${x + 210}" y2="502" stroke="${data.brand.palette.teal}" stroke-width="3" /><path d="M${x + 210} 502l-10-6v12z" fill="${data.brand.palette.teal}" />` : ""}</g>`; }).join("")}
  <text x="72" y="650" fill="${data.brand.palette.textMuted}" font-family="${data.fontStack}" font-size="21">Brand inputs · Format rules · Shared generation · Automated checks · Human approval</text>
</svg>`;
}
