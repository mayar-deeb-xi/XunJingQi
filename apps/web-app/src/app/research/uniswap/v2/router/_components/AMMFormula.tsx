'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acme/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@acme/ui/form';
import { Input } from '@acme/ui/input';
import { useForm } from 'react-hook-form';
import { useReadContract } from 'wagmi';
import { v2routerAbi, v2routerAddress } from '~/_config/uniswap/v2/router';

type FormValues = {
  amountIn: string;
  reserveIn: string;
  reserveOut: string;
};

export function AMMFormula() {
  const form = useForm<FormValues>({
    defaultValues: {
      amountIn: '',
      reserveIn: '',
      reserveOut: '',
    },
  });

  const amountIn = form.watch('amountIn');
  const reserveIn = form.watch('reserveIn');
  const reserveOut = form.watch('reserveOut');

  // Helper function to safely convert string to BigInt
  const toBigInt = (value: string): bigint | null => {
    if (!value || value.trim() === '') return null;
    try {
      return BigInt(value);
    } catch {
      return null;
    }
  };

  // Convert inputs to BigInt
  const reserveInBig = toBigInt(reserveIn);
  const reserveOutBig = toBigInt(reserveOut);
  const amountInBig = toBigInt(amountIn);

  const {
    data: amountOut,
    isLoading,
    error,
  } = useReadContract({
    abi: v2routerAbi,
    address: v2routerAddress,
    functionName: 'getAmountOut',
    args: amountInBig && reserveInBig && reserveOutBig ? [amountInBig, reserveInBig, reserveOutBig] : undefined,
    query: {
      enabled: !!amountInBig && !!reserveInBig && !!reserveOutBig,
    },
  });

  // Calculate constant product k = x * y using BigInt
  const calculateK = (x: bigint | null, y: bigint | null): bigint | null => {
    if (x === null || y === null) return null;
    try {
      return x * y;
    } catch {
      return null;
    }
  };

  // Calculate initial constant product
  const initialK = calculateK(reserveInBig, reserveOutBig);

  // Calculate new reserves after swap using BigInt
  const newReserveIn = amountInBig && reserveInBig ? reserveInBig + amountInBig : null;
  const newReserveOut = amountOut && reserveOutBig ? reserveOutBig - amountOut : null;

  // Calculate new constant product using BigInt
  const newK = calculateK(newReserveIn, newReserveOut);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AMM Formula (Constant Product)</CardTitle>
        <CardDescription>Uniswap V2 uses the constant product formula: x × y = k</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="reserveIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserve In (x)</FormLabel>
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
                    <FormLabel>Reserve Out (y)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., 2000000000000000000000" {...field} />
                    </FormControl>
                    <FormDescription>Reserve of output token in the pair</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amountIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount In</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., 1000000000000000000" {...field} />
                    </FormControl>
                    <FormDescription>Amount of input token to swap</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isLoading && <div className="text-sm text-muted-foreground">Calculating...</div>}

            {error && (
              <div className="text-sm text-destructive">Error: {error instanceof Error ? error.message : 'Failed to calculate amount out'}</div>
            )}

            {reserveInBig && reserveOutBig && (
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Initial State</div>
                  <div className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-md">
                    k = x × y = {reserveInBig.toString()} × {reserveOutBig.toString()} = {initialK?.toString() || 'N/A'}
                  </div>
                </div>

                {amountInBig && amountOut && newReserveIn && newReserveOut && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">After Swap</div>
                    <div className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-md space-y-1">
                      <div>
                        New Reserve In (x') = {reserveInBig.toString()} + {amountInBig.toString()} = {newReserveIn.toString()}
                      </div>
                      <div>
                        New Reserve Out (y') = {reserveOutBig.toString()} - {amountOut.toString()} = {newReserveOut.toString()}
                      </div>
                      <div className="pt-2 border-t">
                        k' = x' × y' = {newReserveIn.toString()} × {newReserveOut.toString()} = {newK?.toString() || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}

                {amountOut !== undefined && amountOut !== null && (
                  <div className="space-y-1 pt-2 border-t">
                    <div className="text-sm text-muted-foreground">Amount Out</div>
                    <div className="text-2xl font-semibold">{amountOut.toString()}</div>
                    <div className="text-sm text-muted-foreground">Raw value (wei)</div>
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

