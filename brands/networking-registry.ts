import type { NetworkingConfig } from "../design-system/networking";
import { arcadeghostsNetworking } from "./arcadeghosts/networking";

export const networkingRegistry: Record<string, NetworkingConfig> = {
  arcadeghosts: arcadeghostsNetworking,
};
