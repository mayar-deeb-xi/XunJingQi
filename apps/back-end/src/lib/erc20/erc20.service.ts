import { JsonRpcProvider } from '@ethersproject/providers';
import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { RpcService } from '../rpc/rpc.service';

// ERC20 standard ABI for token metadata
const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export interface TokenMetadata {
  decimals?: number;
  symbol: string;
  name: string;
}

@Injectable()
export class Erc20Service {
  constructor(private readonly rpcService: RpcService) {}

  /**
   * Get token metadata (decimals, symbol, name) from chain via RPC
   * @param address Token contract address
   * @param chainId Chain ID
   * @returns Token metadata fetched from the blockchain
   */
  async getTokenMetadata(
    address: string,
    chainId: number,
  ): Promise<TokenMetadata> {
    const rpcUrl = this.rpcService.getRpcUrl(chainId);
    const provider = new JsonRpcProvider(rpcUrl, chainId);
    const tokenContract = new Contract(address, ERC20_ABI, provider);

    const metadata: {
      decimals?: number;
      symbol?: string;
      name?: string;
    } = {};

    try {
      // Fetch decimals
      try {
        metadata.decimals = await tokenContract.decimals();
      } catch (error) {
        // Some tokens might not have decimals() function
        // Will throw error later if still undefined
      }

      // Fetch symbol
      try {
        metadata.symbol = await tokenContract.symbol();
      } catch (error) {
        metadata.symbol = 'TKN';
      }

      // Fetch name
      try {
        metadata.name = await tokenContract.name();
      } catch (error) {
        metadata.name = metadata.symbol || 'Token';
      }
    } catch (error) {
      // If RPC call fails, use fallback values
      if (!metadata.symbol) metadata.symbol = 'TKN';
      if (!metadata.name) metadata.name = metadata.symbol || 'Token';
    }

    return {
      decimals: metadata.decimals,
      symbol: metadata.symbol || 'TKN',
      name: metadata.name || metadata.symbol || 'Token',
    };
  }
}
