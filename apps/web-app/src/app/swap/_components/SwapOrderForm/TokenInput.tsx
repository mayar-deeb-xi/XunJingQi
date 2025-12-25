'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/avatar';
import { Button } from '@acme/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@acme/ui/form';
import { Input } from '@acme/ui/input';
import { Control, ControllerProps, FieldPath, FieldValues, useController } from 'react-hook-form';
import { formatUnits } from 'viem';
import { useTokenBalance } from '~/services/erc20/useTokenBalance';
import { SwappableToken } from '~/services/token/useSwappableTokens';
import { SelectTokenDialog } from '../SelectTokenDialog';

export interface TokenInputProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  tokenFieldName: ControllerProps<TFieldValues, FieldPath<TFieldValues>, TTransformedValues>['name'];
  tokenAmountFieldName: ControllerProps<TFieldValues, FieldPath<TFieldValues>, TTransformedValues>['name'];

  disabled?: boolean;
  hidePercentageSelector?: boolean;
}

export const TokenInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: TokenInputProps<TFieldValues, TName, TTransformedValues>
) => {
  const { control, tokenFieldName, tokenAmountFieldName, disabled, hidePercentageSelector = false } = props;

  const tokenAmountField = useController({
    name: tokenAmountFieldName,
    control,
  });

  const tokenField = useController({
    name: tokenFieldName,
    control,
  });

  const tokenFieldValue = tokenField?.field?.value as SwappableToken | undefined;
  const { data, formatBalance } = useTokenBalance(tokenFieldValue?.address);

  const handlePercentageClick = (percentage: number) => {
    if (!data?.value || !tokenFieldValue || !data?.decimals) return;

    // Convert bigint to number considering token decimals
    const balance = Number(formatUnits(data.value, data.decimals));
    const amount = balance * (percentage / 100);
    tokenAmountField.field.onChange(amount > 0 ? amount : '');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className=" size-7 text-sm ">
            <AvatarImage src={tokenFieldValue?.logo} alt={tokenFieldValue?.symbol || 'token'} />
            <AvatarFallback>{tokenFieldValue?.symbol?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <SelectTokenDialog value={tokenFieldValue ?? null} onChange={(token) => tokenField.field.onChange(token)} disabled={disabled} />
        </div>
        <span className="text-sm text-muted-foreground">
          Balance: {formatBalance()} {tokenFieldValue?.symbol || ''}
        </span>
      </div>
      <FormField
        control={control as any}
        name={tokenAmountFieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="0.0" className="text-lg font-medium" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!hidePercentageSelector && (
        <div className="flex gap-2">
          {[25, 50, 75, 100].map((percentage) => (
            <Button
              key={percentage}
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => handlePercentageClick(percentage)}
              disabled={disabled || !data?.value || data.value === 0n}
            >
              {percentage === 100 ? 'MAX' : `${percentage}%`}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
