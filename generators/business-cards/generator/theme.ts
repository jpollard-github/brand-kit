import {
  DEFAULT_BRAND_ID,
  getBrandConfig,
} from "../../../design-system/brand-config";

export const CARD_WIDTH = 1110;
export const CARD_HEIGHT = 660;
export const TRIM_WIDTH = 1050;
export const TRIM_HEIGHT = 600;
export const BLEED_X = (CARD_WIDTH - TRIM_WIDTH) / 2;
export const BLEED_Y = (CARD_HEIGHT - TRIM_HEIGHT) / 2;

const brandConfig = getBrandConfig();

export const exportSize = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  pdfWidth: "3.7in",
  pdfHeight: "2.2in",
};

export const WORK_WITH_ME_FRONT_CARD_ID = "work-with-me-front" as const;
export const WORK_WITH_ME_BACK_CARD_ID = "work-with-me-back" as const;
export const BRAND_FRONT_CARD_ID = `${DEFAULT_BRAND_ID}-front` as const;
export const BRAND_BACK_CARD_ID = `${DEFAULT_BRAND_ID}-back` as const;

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CardId =
  | typeof WORK_WITH_ME_FRONT_CARD_ID
  | typeof WORK_WITH_ME_BACK_CARD_ID
  | typeof BRAND_FRONT_CARD_ID
  | typeof BRAND_BACK_CARD_ID;

export const fontStack = brandConfig.typography.fontStack;

export const palette = brandConfig.palette;

export const typography = brandConfig.typography;

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
  arcadeTitleGlow:
    "0 0 12px rgba(255, 92, 184, 0.22), 0 0 28px rgba(92, 215, 255, 0.1)",
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
  [WORK_WITH_ME_FRONT_CARD_ID]: {
    name: { x: 10, y: 16, w: 62, h: 20 },
    title: { x: 10, y: 34, w: 52, h: 10 },
    tagline: { x: 10, y: 56, w: 58, h: 18 },
    logo: { x: 74, y: 12, w: 14, h: 20 },
  },
  [WORK_WITH_ME_BACK_CARD_ID]: {
    url: { x: 10, y: 16, w: 52, h: 10 },
    email: { x: 10, y: 28, w: 42, h: 10 },
    services: { x: 10, y: 46, w: 48, h: 30 },
    qr: { x: 66, y: 28, w: 20, h: 38 },
  },
  [BRAND_FRONT_CARD_ID]: {
    title: { x: 10, y: 58, w: 54, h: 16 },
    descriptor: { x: 10, y: 74, w: 58, h: 14 },
    focal: { x: 52, y: 10, w: 34, h: 42 },
  },
  [BRAND_BACK_CARD_ID]: {
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
