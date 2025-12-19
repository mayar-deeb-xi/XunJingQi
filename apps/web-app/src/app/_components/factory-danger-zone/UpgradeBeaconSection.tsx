'use client';

import { useUpgradeBeacon } from '@acme/client/services/factory/useUpgradeBeacon';
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@acme/ui/form';
import { Input } from '@acme/ui/input';
import { toast } from '@acme/ui/sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertTriangle, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address } from 'viem';
import { upgradeBeaconSchema, type UpgradeBeaconFormSchema } from './_libs/validationSchemas';

type UpgradeBeaconSectionProps = {
  isLoading: boolean;
  isOwner: boolean;
};

export function UpgradeBeaconSection({ isLoading, isOwner }: UpgradeBeaconSectionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { upgradeBeacon, isPending: isUpgrading, transactionReceipt } = useUpgradeBeacon();

  const isPending = isUpgrading || transactionReceipt?.isLoading;

  const form = useForm<UpgradeBeaconFormSchema>({
    resolver: yupResolver(upgradeBeaconSchema),
    defaultValues: {
      implementationAddress: '',
    },
  });

  const handleSubmit = (data: UpgradeBeaconFormSchema) => {
    setOpenDialog(false);
    upgradeBeacon(data.implementationAddress as Address, {
      onSuccess: () => {
        toast.success('Transaction submitted, confirming...', {
          action: {
            label: 'Close',
            onClick: () => {},
          },
        });
        form.reset();
      },
    });
  };

  return (
    <>
      <div className="space-y-2 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Upgrade Beacon</h4>
            <p className="text-sm text-muted-foreground">
              Upgrade the beacon implementation. This will affect all tokens created through this factory. Only the owner can perform this action.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setOpenDialog(true)} disabled={!isOwner || isLoading || isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUpgrading ? 'Approving...' : 'Confirming...'}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upgrade Beacon
              </>
            )}
          </Button>
        </div>
      </div>

      <AlertDialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Upgrade Beacon</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4 space-y-3">
              <p className="font-medium text-foreground">Are you sure you want to upgrade the beacon implementation?</p>
              <div className="space-y-2 text-sm">
                <p>Upgrading the beacon will:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Change the implementation for all tokens created through this factory</li>
                  <li>Affect all existing tokens that use this beacon</li>
                  <li>Update the beacon to point to the new implementation address</li>
                </ul>
                <p className="pt-2 font-medium text-destructive">This action is irreversible and will affect all tokens using this beacon.</p>
              </div>
            </AlertDialogDescription>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="implementationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="New implementation address (0x...)" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
                <Upload className="h-4 w-4 mr-2" />
                Upgrade Beacon
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
