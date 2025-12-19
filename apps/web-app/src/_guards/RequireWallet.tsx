'use client';

import { Card, CardContent } from '@acme/ui/card';
import { Wallet } from 'lucide-react';
import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '../_components/common/ConnectWallet';

type RequireWalletProps = {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
};

/**
 * Component that requires wallet connection before rendering children
 * Shows a connect wallet message if wallet is not connected
 */
export function RequireWallet({ children, fallback, message }: RequireWalletProps) {
  const { isConnected, address: walletAddress } = useAccount();

  if (!isConnected || !walletAddress) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-4 md:p-6 flex-1">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">{message || 'Please connect your wallet to continue.'}</p>
            <ConnectWallet />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
