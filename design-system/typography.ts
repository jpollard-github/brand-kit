export type DesignTypography = {
  fontStack: string;
  eyebrow: {
    fontSize: number;
    lineHeight: number;
    letterSpacing: string;
    fontWeight: number;
  };
  name: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  workTitle: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  tagline: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  url: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  email: { fontSize: number; lineHeight: number; fontWeight: number };
  serviceIntro: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  bullets: { fontSize: number; lineHeight: number };
  quietCopy: { fontSize: number; lineHeight: number };
  previewLabel: { fontSize: number; letterSpacing: string };
  arcadeTitle: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  arcadeDescriptor: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
  };
  arcadeBackDescriptor: {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: string;
  };
  guideLabel: { fontSize: number; letterSpacing: string; fontWeight: number };
};

export const defaultTypography: DesignTypography = {
  fontStack:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  eyebrow: {
    fontSize: 15,
    lineHeight: 1.2,
    letterSpacing: "0.16em",
    fontWeight: 700,
  },
  name: {
    fontSize: 72,
    lineHeight: 0.94,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  workTitle: {
    fontSize: 28,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  tagline: {
    fontSize: 35,
    lineHeight: 1.12,
    fontWeight: 560,
    letterSpacing: "-0.02em",
  },
  url: {
    fontSize: 32,
    lineHeight: 1.18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  email: { fontSize: 23, lineHeight: 1.22, fontWeight: 600 },
  serviceIntro: {
    fontSize: 18,
    lineHeight: 1.35,
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  bullets: { fontSize: 19, lineHeight: 1.45 },
  quietCopy: { fontSize: 20, lineHeight: 1.48 },
  previewLabel: { fontSize: 14, letterSpacing: "0.12em" },
  arcadeTitle: {
    fontSize: 59,
    lineHeight: 0.96,
    fontWeight: 760,
    letterSpacing: "-0.045em",
  },
  arcadeDescriptor: { fontSize: 21, lineHeight: 1.32, fontWeight: 500 },
  arcadeBackDescriptor: {
    fontSize: 25,
    lineHeight: 1.42,
    fontWeight: 560,
    letterSpacing: "-0.01em",
  },
  guideLabel: { fontSize: 12, letterSpacing: "0.12em", fontWeight: 700 },
};
