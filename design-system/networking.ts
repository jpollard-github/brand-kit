import { networkingRegistry } from "../brands/networking-registry";
import { DEFAULT_BRAND_ID, listBrandIds } from "./brand-config";
import type { BrandMetadata } from "./metadata";

export type NetworkingLinkKey = "website" | "workWithMe" | "github" | "linkedin";

export type NetworkingConfig = {
  roleLine: string;
  tagline?: string;
  qrLinkKey?: NetworkingLinkKey;
  displayUrl?: string;
  conferenceCardLabel?: string;
  lockScreenLabel?: string;
  walletPassLabel?: string;
  walletPassDescription?: string;
  walletPassOrganizationName?: string;
  lockScreenSafeAreaNotes: string[];
  walletPassNotes: string[];
};

function normalizeBrandId(brandId: string) {
  return brandId.trim().toLowerCase();
}

export function getNetworkingConfig(
  brandId = DEFAULT_BRAND_ID,
): NetworkingConfig {
  const normalized = normalizeBrandId(brandId);
  const config = networkingRegistry[normalized];
  if (!config) {
    throw new Error(
      `Unknown networking config for brand ID "${brandId}". Known brand IDs: ${listBrandIds().join(", ")}`,
    );
  }
  return config;
}

export function resolveNetworkingUrl(
  metadata: BrandMetadata,
  linkKey: NetworkingLinkKey = "website",
) {
  switch (linkKey) {
    case "website":
      return metadata.homeUrl;
    case "workWithMe":
      return metadata.workWithMeUrl;
    case "github":
      return metadata.githubUrl ?? metadata.homeUrl;
    case "linkedin":
      return metadata.linkedinUrl ?? metadata.homeUrl;
    default:
      return metadata.homeUrl;
  }
}
