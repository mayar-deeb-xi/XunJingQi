'use client';

import { useFactoryInfo } from '@acme/client/services/factory/useFactoryInfo';
import { getChainUIName } from '@acme/client/utils';
import { Badge } from '@acme/ui/badge';
import { ExplorerLink } from '@acme/ui/bootstrapped/explorer-address-link';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';
import { useAccount, useChainId } from 'wagmi';
import { env } from '~/env';

export function FactoryDetailsGrid() {
  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  const { beaconAddress, ownerAddress, adminAddress, paused, isLoading } = useFactoryInfo();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Factory Address</label>
            <div className="mt-1">
              <ExplorerLink hash={env.NEXT_PUBLIC_FACTORY_ADDRESS} chainId={chainId} showFull />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Chain</label>
            <p className="text-base mt-1">
              <Badge variant="secondary">{getChainUIName(chainId)}</Badge>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <p className="text-base mt-1">
              <Badge variant={paused ? 'destructive' : 'default'}>{paused ? 'Paused' : 'Active'}</Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Owner Address</label>
            <div className="mt-1 flex items-center gap-2">
              {ownerAddress ? (
                <>
                  <ExplorerLink hash={ownerAddress} chainId={chainId} showFull />
                  {userAddress && ownerAddress.toLowerCase() === userAddress.toLowerCase() && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Beacon Address</label>
            <div className="mt-1 flex items-center gap-2">
              {beaconAddress ? (
                <>
                  <ExplorerLink hash={beaconAddress} chainId={chainId} showFull />
                  {userAddress && beaconAddress.toLowerCase() === userAddress.toLowerCase() && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Admin Address</label>
            <div className="mt-1 flex items-center gap-2">
              {adminAddress ? (
                <>
                  <ExplorerLink hash={adminAddress} chainId={chainId} showFull />
                  {userAddress && adminAddress.toLowerCase() === userAddress.toLowerCase() && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
