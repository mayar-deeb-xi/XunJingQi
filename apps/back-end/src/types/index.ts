export interface FormattedAmount {
  amount: string;
  amountRaw: string;
  decimals: number;
  symbol: string;
  currencyAddress?: string;
  isNative: boolean;
}

export interface MethodParametersSummary {
  calldata: string;
  value: string;
  to: string;
}

export interface FormattedSwapRoute {
  quote: FormattedAmount;
  quoteGasAdjusted?: FormattedAmount;
  estimatedGasUsed: string;
  estimatedGasUsedQuoteToken?: FormattedAmount;
  estimatedGasUsedUSD?: FormattedAmount;
  gasPriceWei: string;
  blockNumber: string;
  methodParameters?: MethodParametersSummary;
  simulationStatus?: number;
  routePath: string[][];
  portionAmount?: FormattedAmount;
}
