'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@acme/ui/select';
import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { abi, address } from '~/_config/1inch/off-chain-oracle';

// Popular Ethereum mainnet token addresses
const TOKENS = [
  { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as const, decimals: 18 },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const, decimals: 6 },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const, decimals: 6 },
  { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as const, decimals: 18 },
  { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as const, decimals: 8 },
  { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' as const, decimals: 18 },
] as const;

export function TokenRateSelector() {
  const [selectedToken, setSelectedToken] = useState<string>('');

  const {
    data: rate,
    isLoading,
    error,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: 'getRateToEth',
    args: selectedToken ? [selectedToken as `0x${string}`, true] : undefined,
    query: {
      enabled: !!selectedToken,
    },
  });

  const selectedTokenInfo = TOKENS.find((token) => token.address === selectedToken);

  const getRate = () => {
    if (!selectedTokenInfo?.decimals || !rate) {
      return;
    }

    const numerator = 10 ** selectedTokenInfo.decimals;
    const denominator = 1e18; // ETH decimals
    const price = (Number(rate) * numerator) / denominator / 1e18;
    return price;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Rate to ETH</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Token</label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a token" />
            </SelectTrigger>
            <SelectContent>
              {TOKENS.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedToken && (
          <div className="space-y-2">
            {isLoading && <div className="text-sm">Loading rate...</div>}
            {error && <div className="text-sm text-destructive">Error: {error instanceof Error ? error.message : 'Failed to fetch rate'}</div>}

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Exchange Rate</div>
              {rate && (
                <div className="text-2xl font-semibold">
                  1 {selectedTokenInfo?.symbol || 'Token'} = {getRate()} ETH
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
