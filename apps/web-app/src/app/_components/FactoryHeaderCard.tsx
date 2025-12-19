'use client';

import { getExplorerUrl } from '@acme/client/utils';
import { Button } from '@acme/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@acme/ui/card';
import { ExternalLink, Factory } from 'lucide-react';
import { useChainId } from 'wagmi';
import { env } from '~/env';

export function FactoryHeaderCard() {
  const chainId = useChainId();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2 flex items-center gap-2">
              <Factory className="h-6 w-6" />
              Factory Contract
            </CardTitle>
            <CardDescription>General information about the Factory contract</CardDescription>
          </div>
          <Button asChild variant="outline">
            <a
              href={getExplorerUrl(env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              View on Explorer
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
