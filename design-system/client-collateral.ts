import { clientCollateralRegistry } from "../brands/client-collateral-registry";
import type { BrandMetadata } from "./metadata";
import { DEFAULT_BRAND_ID, listBrandIds } from "./brand-config";

export type ClientCollateralService = {
  name: string;
  summary: string;
  highlights?: string[];
};

export type ClientCollateralCtaKey =
  | "primaryCTA"
  | "secondaryCTA"
  | "contactCTA"
  | "proposalCTA"
  | "discoveryCTA";

export type ClientCollateralLinkKey =
  | "website"
  | "workWithMe"
  | "projectInquiry"
  | "discoverySession"
  | "contactEmail"
  | "github"
  | "linkedin"
  | "qrTarget";

export type ClientCollateralCta = {
  label: string;
  description: string;
  linkKey: ClientCollateralLinkKey;
};

export type ClientCollateralConfig = {
  positioning: {
    primaryRole: string;
    oneLiner: string;
    serviceLine?: string;
    footerLine?: string;
    shortPromise: string;
    promiseOptions?: string[];
    tagline?: string;
    problemSummary?: string;
    audience: string[];
  };
  email?: {
    roleLine?: string;
    roleLineOptions?: string[];
    subline?: string;
    sublineOptions?: string[];
  };
  ctas: Record<ClientCollateralCtaKey, ClientCollateralCta>;
  services: ClientCollateralService[];
  proofSignals: string[];
  proposal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    footerNote: string;
  };
  capability: {
    eyebrow: string;
    title: string;
    intro: string;
    outcomes: string[];
    problemPatterns: string[];
    engagementModes: string[];
    processNotes?: string[];
    howToStart: string[];
    ctaHeadline?: string;
    ctaHeadlineOptions?: string[];
    processDiagramExamples?: string[][];
    codebaseSupport?: {
      title: string;
      summary: string;
      stacks: string[];
    };
  };
  discovery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    agenda: string[];
    prepQuestions: string[];
    nextStep: string;
  };
  caseStudy: {
    eyebrow: string;
    title: string;
    intro: string;
    sections: Array<{
      label: string;
      prompt: string;
    }>;
    metricPrompts: string[];
    quotePrompt: string;
  };
};

export function resolveClientCollateralLink(
  metadata: BrandMetadata,
  linkKey: ClientCollateralLinkKey,
) {
  switch (linkKey) {
    case "website":
      return metadata.homeUrl;
    case "workWithMe":
      return metadata.workWithMeUrl;
    case "contactEmail":
      return `mailto:${metadata.contactEmail}`;
    case "github":
      if (!metadata.githubUrl) {
        throw new Error("Client collateral link key \"github\" requires brand metadata.githubUrl.");
      }
      return metadata.githubUrl;
    case "linkedin":
      if (!metadata.linkedinUrl) {
        throw new Error("Client collateral link key \"linkedin\" requires brand metadata.linkedinUrl.");
      }
      return metadata.linkedinUrl;
    default:
      throw new Error(
        `Client collateral link key "${linkKey}" needs consumer-provided business-link data before it can be resolved in Brand Kit.`,
      );
  }
}

function normalizeBrandId(brandId: string) {
  return brandId.trim().toLowerCase();
}

export function getClientCollateralConfig(
  brandId = DEFAULT_BRAND_ID,
): ClientCollateralConfig {
  const normalized = normalizeBrandId(brandId);
  const config = clientCollateralRegistry[normalized];
  if (!config) {
    throw new Error(
      `Unknown client collateral config for brand ID "${brandId}". Known brand IDs: ${listBrandIds().join(", ")}`,
    );
  }
  return config;
}
