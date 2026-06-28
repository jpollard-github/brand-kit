export type BrandMetadata = {
  summary: string;
  homeUrl: string;
  workWithMeUrl: string;
  canonicalDomain: string;
  contactEmail: string;
  contactName: string;
  toneRules: string[];
  sourceReference: string;
};

export function createMetadata(
  overrides: Partial<BrandMetadata> = {},
): BrandMetadata {
  return {
    summary: "A flexible brand system for generators and export workflows.",
    homeUrl: "https://example.com",
    workWithMeUrl: "https://example.com/work-with-me",
    canonicalDomain: "example.com",
    contactEmail: "hello@example.com",
    contactName: "Example Contact",
    toneRules: ["clear", "distinctive", "human"],
    sourceReference: "brands/example/site-reference.md",
    ...overrides,
  };
}

export function toDisplayUrl(url: string) {
  const parsed = new URL(url);
  return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, "");
}
