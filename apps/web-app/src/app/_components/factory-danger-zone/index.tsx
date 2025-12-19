'use client';

import { useFactoryInfo } from '@acme/client/services/factory/useFactoryInfo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@acme/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acme/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ChangeAdminAddressSection } from './ChangeAdminAddressSection';
import { PauseUnpauseFactorySection } from './PauseUnpauseFactorySection';
import { UpgradeBeaconSection } from './UpgradeBeaconSection';

export function FactoryDangerZone() {
  const { address: userAddress } = useAccount();
  const { ownerAddress, adminAddress, paused, isLoading } = useFactoryInfo();

  // Check permissions
  const isOwner = !!(userAddress && ownerAddress && userAddress.toLowerCase() === ownerAddress.toLowerCase());
  const isAdmin = !!(userAddress && adminAddress && userAddress.toLowerCase() === adminAddress.toLowerCase());
  return (
    <Card className="border-destructive/50  py-0 ">
      <Accordion type="single" collapsible className="w-full pt-0 ">
        <AccordionItem value="danger-zone" className=" mt-0">
          <AccordionTrigger className="hover:no-underline  px-6 ">
            <CardHeader className="  flex-1 p-0">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="pt-2">Irreversible and destructive actions. Use with extreme caution.</CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4 pt-0 pb-3">
              {/* Warning Alert */}
              <div className="flex gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive mb-1">
                    <strong>Warning:</strong> The actions below are irreversible and can have serious consequences.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please ensure you understand the implications before proceeding. These operations can affect all tokens created through this
                    factory and may result in permanent loss of functionality or access.
                  </p>
                </div>
              </div>

              <PauseUnpauseFactorySection paused={!!paused} isLoading={!!isLoading} isOwner={isOwner} />

              <UpgradeBeaconSection isLoading={!!isLoading} isOwner={isOwner} />

              <ChangeAdminAddressSection isLoading={!!isLoading} isOwner={isOwner} />
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
