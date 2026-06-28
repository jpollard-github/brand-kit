export type DesignPalette = {
  background: string;
  backgroundSoft: string;
  backgroundDeep: string;
  text: string;
  textMuted: string;
  amber: string;
  teal: string;
  cyan: string;
  pink: string;
  violet: string;
  border: string;
};

export const defaultPalette: DesignPalette = {
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

export const arcadeghostsSitePalette: DesignPalette = {
  background: "#08090c",
  backgroundSoft: "#10131b",
  backgroundDeep: "#07080b",
  text: "#f8efe3",
  textMuted: "#cbbdae",
  amber: "#ffc66d",
  teal: "#29f0d4",
  cyan: "#29f0d4",
  pink: "#ff365f",
  violet: "#936cff",
  border: "rgba(248, 239, 227, 0.18)",
};

export function createPalette(
  overrides: Partial<DesignPalette> = {},
): DesignPalette {
  return { ...defaultPalette, ...overrides };
}
