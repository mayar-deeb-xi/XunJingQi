import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import apiClient from '../apiClient';
import type { BaseResponse } from '../interfaces';

type UseSwappableTokensOptions = {
  chainId?: number;
  search?: string;
  enabled?: boolean;
};

export interface SwappableToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export const useSwappableTokens = ({ chainId, search, enabled = true }: UseSwappableTokensOptions) =>
  useQuery({
    queryKey: ['swappableTokens', chainId],
    queryFn: async ({ signal }) => {
      const response = await apiClient.get<BaseResponse<SwappableToken[]>>(`/api/token/swappable/${chainId}`, {
        signal,
      });
      return response.data.data;
    },
    enabled: enabled && !!chainId,
    select: (tokens) => {
      if (!search) return tokens;
      const searchLower = search.toLowerCase();
      return tokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchLower) ||
          token.name.toLowerCase().includes(searchLower) ||
          token.address.toLowerCase().includes(searchLower)
      );
    },
  });
