export const CARD_WIDTH = 1110;
export const CARD_HEIGHT = 660;
export const TRIM_WIDTH = 1050;
export const TRIM_HEIGHT = 600;
export const BLEED_X = (CARD_WIDTH - TRIM_WIDTH) / 2;
export const BLEED_Y = (CARD_HEIGHT - TRIM_HEIGHT) / 2;

export const exportSize = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  pdfWidth: "3.7in",
  pdfHeight: "2.2in",
};

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CardId =
  | "work-with-me-front"
  | "work-with-me-back"
  | "arcadeghosts-front"
  | "arcadeghosts-back";

export const fontStack =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';

export const palette = {
  background: "#0a0d11",
  backgroundSoft: "#11161c",
  backgroundDeep: "#05070a",
  text: "#f5efe4",
  textMuted: "#c6c0b5",
  amber: "#f0bf6c",
  teal: "#64d5cf",
  cyan: "#5cd7ff",
  pink: "#ff5cb8",
  violet: "#8f7bff",
  border: "rgba(255, 255, 255, 0.12)",
};

export const typography = {
  eyebrow: { fontSize: 15, lineHeight: 1.2, letterSpacing: "0.16em", fontWeight: 700 },
  name: { fontSize: 72, lineHeight: 0.94, fontWeight: 700, letterSpacing: "-0.04em" },
  workTitle: { fontSize: 28, lineHeight: 1.2, fontWeight: 600, letterSpacing: "0.02em" },
  tagline: { fontSize: 35, lineHeight: 1.12, fontWeight: 560, letterSpacing: "-0.02em" },
  url: { fontSize: 32, lineHeight: 1.18, fontWeight: 700, letterSpacing: "-0.02em" },
  email: { fontSize: 23, lineHeight: 1.22, fontWeight: 600 },
  serviceIntro: { fontSize: 18, lineHeight: 1.35, fontWeight: 700, letterSpacing: "0.1em" },
  bullets: { fontSize: 19, lineHeight: 1.45 },
  quietCopy: { fontSize: 20, lineHeight: 1.48 },
  previewLabel: { fontSize: 14, letterSpacing: "0.12em" },
  arcadeTitle: { fontSize: 59, lineHeight: 0.96, fontWeight: 760, letterSpacing: "-0.045em" },
  arcadeDescriptor: { fontSize: 21, lineHeight: 1.32, fontWeight: 500 },
  arcadeBackDescriptor: { fontSize: 25, lineHeight: 1.42, fontWeight: 560, letterSpacing: "-0.01em" },
  guideLabel: { fontSize: 12, letterSpacing: "0.12em", fontWeight: 700 },
};

export const radius = {
  card: 34,
  safeArea: 24,
  trimArea: 26,
  qr: 28,
  qrImage: 12,
  focal: 36,
  logo: 24,
  pill: 999,
};

export const shadows = {
  card: "inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 18px 48px rgba(0, 0, 0, 0.34)",
  qr: "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 24px rgba(0,0,0,0.2)",
  focal: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 24px 38px rgba(0,0,0,0.3)",
  logoFrame: "0 0 0 1px rgba(255,255,255,0.08)",
  arcadeTitleGlow: "0 0 12px rgba(255, 92, 184, 0.22), 0 0 28px rgba(92, 215, 255, 0.1)",
  dividerGlow: "0 0 18px rgba(255, 92, 184, 0.34)",
};

export const qr = {
  maxWidth: 185,
  padding: 22,
  imagePadding: 10,
  borderRadius: radius.qr,
  imageBorderRadius: radius.qrImage,
};

export const logo = {
  workFrontOpacity: 0.88,
  workFrontBrightness: 0.88,
  workFrontSaturation: 0.84,
  arcadeScale: 1.1,
};

export const cardBoxes: Record<CardId, Record<string, Box>> = {
  "work-with-me-front": {
    name: { x: 10, y: 16, w: 62, h: 20 },
    title: { x: 10, y: 34, w: 52, h: 10 },
    tagline: { x: 10, y: 56, w: 58, h: 18 },
    logo: { x: 74, y: 12, w: 14, h: 20 },
  },
  "work-with-me-back": {
    url: { x: 10, y: 16, w: 52, h: 10 },
    email: { x: 10, y: 28, w: 42, h: 10 },
    services: { x: 10, y: 46, w: 48, h: 30 },
    qr: { x: 66, y: 28, w: 20, h: 38 },
  },
  "arcadeghosts-front": {
    title: { x: 10, y: 58, w: 54, h: 16 },
    descriptor: { x: 10, y: 74, w: 58, h: 14 },
    focal: { x: 52, y: 10, w: 34, h: 42 },
  },
  "arcadeghosts-back": {
    url: { x: 10, y: 16, w: 46, h: 10 },
    descriptor: { x: 10, y: 37, w: 48, h: 30 },
    qr: { x: 66, y: 30, w: 20, h: 38 },
  },
};

export function px(value: number, total: number) {
  return Math.round((value / 100) * total);
}

export function boxStyle(box: Box) {
  return [
    `left:${px(box.x, CARD_WIDTH)}px`,
    `top:${px(box.y, CARD_HEIGHT)}px`,
    `width:${px(box.w, CARD_WIDTH)}px`,
    `height:${px(box.h, CARD_HEIGHT)}px`,
  ].join(";");
}

export function safeAreaStyle() {
  return [
    `left:${BLEED_X}px`,
    `top:${BLEED_Y}px`,
    `width:${TRIM_WIDTH}px`,
    `height:${TRIM_HEIGHT}px`,
  ].join(";");
}
