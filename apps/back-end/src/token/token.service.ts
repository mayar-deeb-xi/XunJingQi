import { Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/lib/base.dto';
import { TokenEntity } from './entities/token.entity';

type TokensByChain = Record<number, TokenEntity[]>;

@Injectable()
export class TokenService {
  // Mock token registry keyed by chain ID for quick filtering
  private readonly tokensByChain: TokensByChain = {
    1: [
      {
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
      },
      {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
      },
    ],
    11155111: [
      {
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
      },
      {
        address: '0xB179689962d3390bfFCbB0b20D56f2931171E216',
        symbol: 'AED',
        name: 'UAE Dirham',
        decimals: 6,
      },
    ],
  };

  async getSwappableTokens(
    chainId: number,
  ): Promise<BaseResponse<TokenEntity[]>> {
    return {
      data: this.tokensByChain[chainId] ?? [],
    };
  }
}
