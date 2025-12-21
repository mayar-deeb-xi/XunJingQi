'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';
import { useReadContract } from 'wagmi';
import { abi, address } from '~/_config/1inch/off-chain-oracle';

// Oracle type mapping based on enum values
const ORACLE_TYPES: Record<number, string> = {
  0: 'Unknown',
  1: 'Chainlink',
  2: 'UniswapV3',
  3: 'UniswapV2',
  4: 'Balancer',
  5: 'Curve',
  6: '1inch',
} as const;

export function OracleList() {
  const {
    data: oracleData,
    isLoading,
    error,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: 'oracles',
  });

  const [allOracles, oracleTypes] = oracleData || [[], []];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Oracle List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading oracles...</div>}

        {error && <div className="text-sm text-destructive">Error: {error instanceof Error ? error.message : 'Failed to fetch oracles'}</div>}

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Total: {allOracles.length} oracle{allOracles.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2 flex flex-wrap gap-x-3 gap-y-2">
            {allOracles.map((oracleAddress, index) => {
              return (
                <div
                  key={`${oracleAddress}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono text-muted-foreground break-all">{oracleAddress as string}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
