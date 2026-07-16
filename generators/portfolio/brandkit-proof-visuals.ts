import type { Rect } from "../social/editorial-format-layouts";

export type EmbeddedProofImages = {
  jasonOg: string;
  jasonLinkedIn: string;
  projectCover: string;
  arcadeGhostsOg: string;
};

export const systemPreviewLayout = {
  canvas: { width: 1600, height: 1100 },
  header: { x: 72, y: 58, width: 1456, height: 126 },
  panels: {
    jasonOg: { x: 72, y: 230, width: 690, height: 362 },
    projectCover: { x: 838, y: 230, width: 690, height: 388 },
    linkedIn: { x: 72, y: 672, width: 940, height: 235 },
    contrast: { x: 1068, y: 672, width: 460, height: 242 },
  },
  evidence: { x: 72, y: 966, width: 1456, height: 82 },
} satisfies { canvas: { width: number; height: number }; header: Rect; panels: Record<string, Rect>; evidence: Rect };

const paper = "#f4f1e9";
const ink = "#112033";
const muted = "#56616d";
const teal = "#147d78";
const copper = "#a8532c";
const line = "#c9c5bb";
const white = "#fffdf8";

export function renderBrandKitSystemPreview(images: EmbeddedProofImages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" role="img" aria-labelledby="title desc">
  <title id="title">BrandKit system preview</title><desc id="desc">Large examples of Jason Pollard and ArcadeGhosts assets demonstrate distinct identities generated through one verified system.</desc>
  <defs><pattern id="previewGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${line}"/></pattern></defs>
  <rect width="1600" height="1100" fill="${paper}"/><rect width="1600" height="1100" fill="url(#previewGrid)" opacity=".24"/><rect width="1600" height="14" fill="${teal}"/>
  <text x="72" y="98" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700" letter-spacing="-2">BrandKit</text>
  <text x="72" y="150" fill="${muted}" font-family="Arial, Helvetica, sans-serif" font-size="27">One source system. Distinct identities. Verified outputs.</text>
  <line x1="72" y1="190" x2="1528" y2="190" stroke="${line}"/>

  <text x="72" y="218" fill="${teal}" font-family="ui-monospace, monospace" font-size="14" font-weight="700" letter-spacing="2">JASON POLLARD · OPEN GRAPH</text>
  <image href="${images.jasonOg}" x="72" y="230" width="690" height="362" preserveAspectRatio="xMidYMid meet"/>
  <text x="838" y="218" fill="${teal}" font-family="ui-monospace, monospace" font-size="14" font-weight="700" letter-spacing="2">BRANDKIT · PROJECT COVER</text>
  <image href="${images.projectCover}" x="838" y="230" width="690" height="388" preserveAspectRatio="xMidYMid meet"/>

  <text x="72" y="660" fill="${teal}" font-family="ui-monospace, monospace" font-size="14" font-weight="700" letter-spacing="2">JASON POLLARD · LINKEDIN</text>
  <image href="${images.jasonLinkedIn}" x="72" y="672" width="940" height="235" preserveAspectRatio="xMidYMid meet"/>
  <text x="1068" y="660" fill="${copper}" font-family="ui-monospace, monospace" font-size="14" font-weight="700" letter-spacing="2">CONTRAST PROOF · ARCADEGHOSTS</text>
  <image href="${images.arcadeGhostsOg}" x="1068" y="672" width="460" height="242" preserveAspectRatio="xMidYMid meet"/>

  <rect x="72" y="966" width="1456" height="82" fill="${ink}"/>
  <g fill="${white}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">
    <text x="112" y="1016">2 registered brands</text><text x="400" y="1016">3 intentionally designed fixed formats</text><text x="860" y="1016">Automated output checks</text><text x="1170" y="1016">Human approval before publication</text>
  </g>
</svg>`;
}

export function renderLinkedInDesktopGuide(linkedInDataUrl: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396"><image href="${linkedInDataUrl}" width="1584" height="396"/><rect x="0" y="210" width="286" height="186" fill="${copper}" fill-opacity=".18" stroke="${copper}" stroke-width="4"/><text x="24" y="250" fill="${ink}" font-family="Arial,sans-serif" font-size="19" font-weight="700">REVIEW ONLY · PROFILE-PHOTO OVERLAP</text></svg>`;
}

export function renderLinkedInMobileGuide(linkedInDataUrl: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1188" height="396" viewBox="198 0 1188 396"><image href="${linkedInDataUrl}" width="1584" height="396"/><rect x="198" y="0" width="1188" height="396" fill="none" stroke="${copper}" stroke-width="6"/><text x="222" y="382" fill="${ink}" font-family="Arial,sans-serif" font-size="17" font-weight="700">REVIEW ONLY · CENTERED 3:1 MOBILE CROP ASSUMPTION</text></svg>`;
}

export function renderLinkedInCombinedGuide(desktopDataUrl: string, mobileDataUrl: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1080" viewBox="0 0 1600 1080"><rect width="1600" height="1080" fill="${paper}"/><text x="64" y="72" fill="${ink}" font-family="Arial,sans-serif" font-size="38" font-weight="700">LinkedIn crop review · not for publication</text><text x="64" y="124" fill="${teal}" font-family="ui-monospace,monospace" font-size="18" font-weight="700">DESKTOP PROFILE-PHOTO OVERLAP</text><image href="${desktopDataUrl}" x="64" y="148" width="1472" height="368"/><text x="64" y="578" fill="${teal}" font-family="ui-monospace,monospace" font-size="18" font-weight="700">CENTERED 3:1 MOBILE CROP ASSUMPTION</text><image href="${mobileDataUrl}" x="206" y="614" width="1188" height="396"/></svg>`;
}

export function renderOgComparison(generatedDataUrl: string) {
  const reference = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'><rect width='1200' height='630' fill='${paper}'/><rect width='1200' height='14' fill='${teal}'/><text x='72' y='96' fill='${teal}' font-family='Arial,sans-serif' font-size='24' letter-spacing='4'>JASON POLLARD · SOFTWARE ENGINEER &amp; ARCHITECT</text><text x='72' y='250' fill='${ink}' font-family='Arial,sans-serif' font-size='70' font-weight='700'><tspan x='72'>I build, repair, modernize, and</tspan><tspan x='72' dy='76'>explain difficult software systems.</tspan></text><text x='72' y='558' fill='${ink}' font-family='Arial,sans-serif' font-size='25'>20+ years · AI-enabled engineering</text><text x='1128' y='558' text-anchor='end' fill='${ink}' font-family='Arial,sans-serif' font-size='25'>jasonpollard.com</text></svg>`;
  const referenceUrl = `data:image/svg+xml;base64,${Buffer.from(reference).toString("base64")}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="980" viewBox="0 0 1600 980"><rect width="1600" height="980" fill="${paper}"/><text x="64" y="72" fill="${ink}" font-family="Arial,sans-serif" font-size="38" font-weight="700">Open Graph composition comparison · review only</text><text x="64" y="122" fill="${teal}" font-family="ui-monospace,monospace" font-size="17" font-weight="700">CURRENT SITE REFERENCE</text><image href="${referenceUrl}" x="64" y="146" width="720" height="378"/><text x="816" y="122" fill="${teal}" font-family="ui-monospace,monospace" font-size="17" font-weight="700">BRANDKIT GENERATED OUTPUT</text><image href="${generatedDataUrl}" x="816" y="146" width="720" height="378"/><line x1="64" y1="576" x2="1536" y2="576" stroke="${line}"/><text x="64" y="638" fill="${muted}" font-family="Arial,sans-serif" font-size="24">Composition alignment target: 14px teal rule · 72px padding · technical label · centered headline · balanced footer row</text></svg>`;
}
