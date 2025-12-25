'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acme/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@acme/ui/form';
import { Input } from '@acme/ui/input';
import { useForm } from 'react-hook-form';
import { useReadContract } from 'wagmi';
import { v2routerAbi, v2routerAddress } from '~/_config/uniswap/v2/router';

type FormValues = {
  amountOut: string;
  reserveIn: string;
  reserveOut: string;
};

export function GetAmountIn() {
  const form = useForm<FormValues>({
    defaultValues: {
      amountOut: '',
      reserveIn: '',
      reserveOut: '',
    },
  });

  const amountOut = form.watch('amountOut');
  const reserveIn = form.watch('reserveIn');
  const reserveOut = form.watch('reserveOut');

  const {
    data: amountIn,
    isLoading,
    error,
  } = useReadContract({
    abi: v2routerAbi,
    address: v2routerAddress,
    functionName: 'getAmountIn',
    args: amountOut && reserveIn && reserveOut ? [BigInt(amountOut), BigInt(reserveIn), BigInt(reserveOut)] : undefined,
    query: {
      enabled: !!amountOut && !!reserveIn && !!reserveOut,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Amount In</CardTitle>

        <CardDescription>Calculate the amount of input token required to receive a desired amount of output token.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="amountOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Out (desired output)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., 1000000000000000000" {...field} />
                  </FormControl>
                  <FormDescription>Amount of output token you want to receive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reserveIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reserve In</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., 1000000000000000000000" {...field} />
                  </FormControl>
                  <FormDescription>Reserve of input token in the pair</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reserveOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reserve Out</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., 2000000000000000000000" {...field} />
                  </FormControl>
                  <FormDescription>Reserve of output token in the pair</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading && <div className="text-sm text-muted-foreground">Calculating...</div>}

            {error && (
              <div className="text-sm text-destructive">Error: {error instanceof Error ? error.message : 'Failed to calculate amount in'}</div>
            )}

            {amountIn !== undefined && amountIn !== null && (
              <div className="space-y-1 pt-2 border-t">
                <div className="text-sm text-muted-foreground">Amount In Required</div>
                <div className="text-2xl font-semibold">{amountIn.toString()}</div>
                <div className="text-sm text-muted-foreground">Raw value (wei)</div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
