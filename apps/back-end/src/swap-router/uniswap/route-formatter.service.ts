import { Injectable } from '@nestjs/common';
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core';
import { SwapRoute as Uniswap_SwapRoute } from '@uniswap/smart-order-router';
import { FormattedAmount } from '../../types';
import { SwapRouteEntity } from '../aggregator/entities/swap-route.entity';

@Injectable()
export class RouteFormatterService {
  mapRouteToResponse(route: Uniswap_SwapRoute): SwapRouteEntity['route'] {
    return {
      quote: this.formatCurrencyAmount(route.quote)!,
      quoteGasAdjusted: this.formatCurrencyAmount(
        route.quoteGasAndPortionAdjusted,
      ),
      estimatedGasUsed: route.estimatedGasUsed.toString(),
      estimatedGasUsedQuoteToken: this.formatCurrencyAmount(
        route.estimatedGasUsedQuoteToken,
      ),
      estimatedGasUsedUSD: this.formatCurrencyAmount(route.estimatedGasUsedUSD),
      gasPriceWei: route.gasPriceWei.toString(),
      blockNumber: route.blockNumber.toString(),
      methodParameters: route.methodParameters && {
        calldata: route.methodParameters.calldata,
        value: route.methodParameters.value,
        to: route.methodParameters.to,
      },
      simulationStatus: route.simulationStatus,
      routePath: this.formatRoutePath(route.route),
      portionAmount: this.formatCurrencyAmount(route.portionAmount),
    };
  }

  private formatRoutePath(route: Uniswap_SwapRoute['route']): string[][] {
    return route.map((path) =>
      path.tokenPath.map((currency) => {
        const symbol = this.getCurrencySymbol(currency);
        const address = this.getCurrencyAddress(currency);
        return address ? `${symbol}:${address}` : symbol;
      }),
    );
  }

  private formatCurrencyAmount(
    amount?: CurrencyAmount<Currency> | null,
  ): FormattedAmount | undefined {
    if (!amount) return undefined;

    const currency = amount.currency;
    return {
      amount: amount.toExact(),
      amountRaw: amount.quotient.toString(),
      decimals: currency.decimals,
      symbol: this.getCurrencySymbol(currency),
      currencyAddress: this.getCurrencyAddress(currency),
      isNative: currency.isNative,
    };
  }

  private getCurrencyAddress(currency: Currency): string | undefined {
    if ((currency as Token).isToken) {
      return (currency as Token).address;
    }
    return undefined;
  }

  private getCurrencySymbol(currency: Currency): string {
    if ((currency as Token).isToken) {
      return (currency as Token).symbol ?? 'TOKEN';
    }

    return currency.symbol ?? 'NATIVE';
  }
}
