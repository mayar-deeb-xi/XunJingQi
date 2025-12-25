'use client';

import { Button } from '@acme/ui/button';
import { Form } from '@acme/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useChainId } from 'wagmi';
import { formSchema, type FormSchema } from './formSchema';
import { TokenInput } from './TokenInput';

export function SwapOrderForm() {
  const isPending = false;

  const form = useForm<FormSchema>({
    resolver: yupResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormSchema) => {
    console.log(data);
  };

  const handleSwap = () => {
    const currentFrom = form.getValues('fromToken');
    const currentTo = form.getValues('toToken');
    form.setValue('fromToken', currentTo);
    form.setValue('toToken', currentFrom);
    form.setValue('fromAmount', '');
    form.setValue('toAmount', '');
  };

  const chainId = useChainId();
  useEffect(() => {
    form.reset();
  }, [chainId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* From Token Section */}

        <TokenInput
          control={form.control}
          tokenFieldName="fromToken"
          tokenAmountFieldName="fromAmount"
          disabled={isPending}
        />

        {/* Swap Button */}
        <div className="flex justify-center my-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleSwap}
            disabled={isPending}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token Section */}
        <TokenInput
          control={form.control}
          tokenFieldName="toToken"
          tokenAmountFieldName="toAmount"
          hidePercentageSelector
          disabled={isPending}
        />

        {form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          Find Best Route
        </Button>
      </form>
    </Form>
  );
}
