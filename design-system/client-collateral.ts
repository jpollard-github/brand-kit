import { clientCollateralRegistry } from "../brands/client-collateral-registry";
import { DEFAULT_BRAND_ID, listBrandIds } from "./brand-config";

export type ClientCollateralService = {
  name: string;
  summary: string;
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
    shortPromise: string;
    tagline?: string;
    problemSummary?: string;
    audience: string[];
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
    howToStart: string[];
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
