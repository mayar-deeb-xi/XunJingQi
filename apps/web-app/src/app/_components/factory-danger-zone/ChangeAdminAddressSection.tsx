'use client';

import { useSetAdmin } from '@acme/client/services/factory/useSetAdmin';
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
import { AlertTriangle, Loader2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address } from 'viem';
import { setAdminSchema, type SetAdminFormSchema } from './_libs/validationSchemas';

type ChangeAdminAddressSectionProps = {
  isLoading: boolean;
  isOwner: boolean;
};

export function ChangeAdminAddressSection({ isLoading, isOwner }: ChangeAdminAddressSectionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { setAdmin, isPending: isSettingAdmin, transactionReceipt } = useSetAdmin();

  const isPending = isSettingAdmin || transactionReceipt?.isLoading;

  const form = useForm<SetAdminFormSchema>({
    resolver: yupResolver(setAdminSchema),
    defaultValues: {
      adminAddress: '',
    },
  });

  const handleSubmit = (data: SetAdminFormSchema) => {
    setOpenDialog(false);
    setAdmin(data.adminAddress as Address, {
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
            <h4 className="font-medium text-sm mb-1">Change Admin Address</h4>
            <p className="text-sm text-muted-foreground">
              Update the admin address. This will change who can create and delete tokens. Only the owner can perform this action.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setOpenDialog(true)} disabled={!isOwner || isLoading || isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isSettingAdmin ? 'Approving...' : 'Confirming...'}
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Change Admin
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
              <AlertDialogTitle>Change Admin Address</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4 space-y-3">
              <p className="font-medium text-foreground">Are you sure you want to change the admin address?</p>
              <div className="space-y-2 text-sm">
                <p>Changing the admin address will:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Transfer admin privileges to the new address</li>
                  <li>Allow the new admin to create and delete tokens</li>
                  <li>Revoke admin privileges from the current admin</li>
                </ul>
                <p className="pt-2 font-medium text-destructive">This action is reversible, but will require another transaction to change back.</p>
              </div>
            </AlertDialogDescription>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="adminAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="New admin address (0x...)" {...field} disabled={isPending} />
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
                <Settings className="h-4 w-4 mr-2" />
                Change Admin
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
