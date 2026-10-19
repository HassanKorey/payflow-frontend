import { config, explorerBase } from "@/lib/config";
import { shortAddress } from "@/lib/format";

/**
 * Values injected at build time via next.config.mjs env config.
 */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
export const COMMIT_HASH = process.env.NEXT_PUBLIC_COMMIT_HASH ?? "";

export const REPO_URL = "https://github.com/MMM-pay/payflow-frontend";

/**
 * Format an app version string with a leading "v" if not already present.
 * Blank or empty versions return an empty string.
 */
export function formatVersion(version?: string): string {
  if (!version) return "";
  const trimmed = version.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("v") ? trimmed : `v${trimmed}`;
}

/**
 * Format a git commit hash to its short 7-character prefix.
 */
export function formatCommit(hash?: string): string {
  if (!hash) return "";
  const trimmed = hash.trim();
  if (!trimmed) return "";
  return trimmed.slice(0, 7);
}

/**
 * Build a GitHub URL pointing to the specified commit.
 */
export function getCommitUrl(hash?: string, repoUrl: string = REPO_URL): string | null {
  const short = formatCommit(hash);
  if (!short) return null;
  return `${repoUrl}/commit/${short}`;
}

/**
 * Build the Stellar Expert explorer link for a contract ID.
 */
export function getContractUrl(contractId?: string, base: string = explorerBase): string | null {
  if (!contractId) return null;
  const trimmed = contractId.trim();
  if (!trimmed) return null;
  return `${base}/contract/${trimmed}`;
}

export interface ContractLinkItem {
  name: string;
  id: string;
  shortId: string;
  url: string | null;
}

/**
 * Generate the contract link metadata for the three protocol contracts
 * (Plan registry, Vault, and Subscription).
 */
export function getProtocolContractLinks(
  contracts: {
    planRegistry?: string;
    vault?: string;
    subscription?: string;
  } = config.contracts,
  base: string = explorerBase,
): ContractLinkItem[] {
  const definitions = [
    { name: "Plan registry", id: contracts.planRegistry ?? "" },
    { name: "Vault", id: contracts.vault ?? "" },
    { name: "Subscription", id: contracts.subscription ?? "" },
  ];

  return definitions.map(({ name, id }) => {
    const trimmedId = id.trim();
    return {
      name,
      id: trimmedId,
      shortId: trimmedId ? shortAddress(trimmedId, 4) : "",
      url: getContractUrl(trimmedId, base),
    };
  });
}
