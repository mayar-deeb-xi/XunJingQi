'use client';

import { usePauseFactory, useUnpauseFactory } from '@acme/client/services/factory/usePauseFactory';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@acme/ui/alert-dialog';
import { Button } from '@acme/ui/button';
import { toast } from '@acme/ui/sonner';
import { AlertTriangle, Loader2, Pause, Play } from 'lucide-react';
import { useState } from 'react';

type PauseUnpauseFactorySectionProps = {
  paused: boolean;
  isLoading: boolean;
  isOwner: boolean;
};

export function PauseUnpauseFactorySection({ paused, isOwner }: PauseUnpauseFactorySectionProps) {
  const { pauseFactory, isPending: isPausing, transactionReceipt: pauseTx } = usePauseFactory();
  const { unpauseFactory, isPending: isUnpausing, transactionReceipt: unpauseTx } = useUnpauseFactory();

  const isPending = isPausing || isUnpausing || pauseTx.isLoading || unpauseTx.isLoading;

  const handlePause = () => {
    setOpenDialog(false);
    if (paused) {
      unpauseFactory({
        onSuccess: () => {
          toast.success('Transaction submitted, confirming...', {
            action: {
              label: 'Close',
              onClick: () => {},
            },
          });
        },
      });
    } else {
      pauseFactory({
        onSuccess: () => {
          toast.success('Transaction submitted, confirming...', {
            action: {
              label: 'Close',
              onClick: () => {},
            },
          });
        },
      });
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="space-y-2 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Pause / Unpause Factory</h4>
            <p className="text-sm text-muted-foreground">
              {paused
                ? 'Unpause the factory to allow new token creation.'
                : 'Pause the factory to halt all new token creation. This action can only be performed by the owner.'}
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setOpenDialog(true)} disabled={!isOwner || isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isPausing || isUnpausing ? 'Approving...' : 'Confirming...'}
              </>
            ) : paused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Unpause
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>
        </div>
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>{paused ? 'Unpause Factory' : 'Pause Factory'}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4 space-y-3">
              <p className="font-medium text-foreground">Are you sure you want to {paused ? 'unpause' : 'pause'} the factory?</p>
              {paused ? (
                <div className="space-y-2 text-sm">
                  <p>Unpausing the factory will:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Allow new token creation to resume</li>
                    <li>
                      Enable the <code className="bg-muted px-1 py-0.5 rounded text-xs">createBeaconProxy</code> function
                    </li>
                    <li>Restore normal factory operations</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>Pausing the factory will:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Immediately halt all new token creation</li>
                    <li>
                      Block the <code className="bg-muted px-1 py-0.5 rounded text-xs">createBeaconProxy</code> function
                    </li>
                    <li>Prevent any new tokens from being deployed through this factory</li>
                    <li>Not affect existing tokens or their functionality</li>
                  </ul>
                  <p className="pt-2 font-medium text-destructive">This action is reversible, but will require another transaction to unpause.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handlePause}>
                {paused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Unpause
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
