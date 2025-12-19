import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { Env } from '../../config/env-validation.schema';

/**
 * Get chain configuration based on chain ID
 */
function getChain(chainId: number) {
  switch (chainId) {
    case sepolia.id:
      return sepolia;
    case mainnet.id:
      return mainnet;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

@Injectable()
export class ViemPublicClientService implements OnModuleInit {
  private _client: PublicClient | null = null;
  private readonly chainId: number;
  private readonly rpcUrl: string;

  constructor(private readonly configService: ConfigService<Env>) {
    this.chainId =
      this.configService.get('CHAIN_ID', { infer: true }) ?? 11155111;
    this.rpcUrl =
      this.configService.get('CHAIN_RPC_URL', { infer: true }) ?? '';

    if (!this.rpcUrl) {
      throw new Error('CHAIN_RPC_URL environment variable is required');
    }
  }

  onModuleInit() {
    this._client = createPublicClient({
      chain: getChain(this.chainId),
      transport: http(this.rpcUrl),
    });
  }

  get client(): PublicClient {
    if (!this._client) {
      throw new Error('ViemPublicClient not initialized');
    }
    return this._client;
  }

  getChainId(): number {
    return this.chainId;
  }
}
