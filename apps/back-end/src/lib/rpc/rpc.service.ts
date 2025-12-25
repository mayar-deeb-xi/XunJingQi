import { Injectable } from '@nestjs/common';

@Injectable()
export class RpcService {
  private readonly rpcUrls: Map<number, string>;

  constructor() {
    this.rpcUrls = new Map();

    // Read all environment variables matching the pattern RPC_URL_*
    // Expected format: RPC_URL_1=https://..., RPC_URL_11155111=https://...
    const rpcUrlPattern = /^RPC_URL_(\d+)$/;

    for (const [key, value] of Object.entries(process.env)) {
      const match = key.match(rpcUrlPattern);
      if (match && value) {
        const chainId = parseInt(match[1], 10);
        if (isNaN(chainId)) {
          throw new Error(`Invalid chain ID in environment variable ${key}`);
        }
        const rpcUrl = value.trim();
        if (!rpcUrl) {
          throw new Error(`Empty RPC URL for chain ${chainId} in ${key}`);
        }
        this.rpcUrls.set(chainId, rpcUrl);
      }
    }

    if (this.rpcUrls.size === 0) {
      throw new Error(
        'No RPC URLs configured. Please set environment variables like RPC_URL_1, RPC_URL_11155111, etc.',
      );
    }
  }

  /**
   * Get RPC URL for a specific chain ID
   * @param chainId The chain ID to get the RPC URL for
   * @returns The RPC URL for the chain
   * @throws Error if the chain ID is not configured
   */
  getRpcUrl(chainId: number): string {
    const rpcUrl = this.rpcUrls.get(chainId);
    if (!rpcUrl) {
      throw new Error(`RPC URL not configured for chain ID: ${chainId}`);
    }
    return rpcUrl;
  }

  /**
   * Check if an RPC URL is configured for a specific chain ID
   * @param chainId The chain ID to check
   * @returns True if the chain ID has an RPC URL configured
   */
  hasRpcUrl(chainId: number): boolean {
    return this.rpcUrls.has(chainId);
  }

  /**
   * Get all configured chain IDs
   * @returns Array of chain IDs that have RPC URLs configured
   */
  getConfiguredChainIds(): number[] {
    return Array.from(this.rpcUrls.keys());
  }
}
