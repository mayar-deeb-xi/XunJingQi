import { JsonRpcProvider } from '@ethersproject/providers';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Currency,
  CurrencyAmount,
  Ether,
  Percent,
  SUPPORTED_CHAINS,
  SupportedChainsType,
  Token,
  TradeType,
} from '@uniswap/sdk-core';
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
} from '@uniswap/smart-order-router';
import { getAddress, parseUnits } from 'ethers/lib/utils';
import { BaseResponse } from '../../lib/base.dto';
import { Erc20Service } from '../../lib/erc20/erc20.service';
import { RpcService } from '../../lib/rpc/rpc.service';

import {
  QuoteRequestDto,
  QuoteTradeType,
  TokenInputDto,
} from '../aggregator/dto/quote.dto';
import { FormattedAmount, QuoteResponse } from './dto/path-response.dto';

const NATIVE_TOKEN_PLACEHOLDER = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

@Injectable()
export class UniswapRouterService {
  private readonly defaultSlippageBps = 50; // 0.50%
  private readonly defaultDeadlineSeconds = 60 * 15; // 15 minutes

  constructor(
    private readonly rpcService: RpcService,
    private readonly erc20Service: Erc20Service,
  ) {}

  async findBestRoute(
    dto: QuoteRequestDto,
  ): Promise<BaseResponse<QuoteResponse>> {
    const requestChainId = dto.chainId;

    // Validate that the requested chain ID is supported
    if (!SUPPORTED_CHAINS.includes(requestChainId as SupportedChainsType)) {
      throw new BadRequestException(
        `Chain ${requestChainId} is not supported by the router`,
      );
    }

    // Create router for the requested chain
    const rpcUrl = this.rpcService.getRpcUrl(requestChainId);
    const provider = new JsonRpcProvider(rpcUrl, requestChainId);
    const router = new AlphaRouter({
      chainId: requestChainId as SupportedChainsType,
      provider: provider,
    });

    const tradeType =
      dto.tradeType === QuoteTradeType.EXACT_OUTPUT
        ? TradeType.EXACT_OUTPUT
        : TradeType.EXACT_INPUT;

    const inputCurrency = await this.toCurrency(dto.fromToken, requestChainId);
    const outputCurrency = await this.toCurrency(dto.toToken, requestChainId);

    const specifiedCurrency =
      tradeType === TradeType.EXACT_INPUT ? inputCurrency : outputCurrency;
    const quoteCurrency =
      tradeType === TradeType.EXACT_INPUT ? outputCurrency : inputCurrency;

    const amountSpecified = this.toCurrencyAmount(
      specifiedCurrency,
      dto.amount,
    );

    const swapOptions: SwapOptionsSwapRouter02 = {
      type: SwapType.SWAP_ROUTER_02,
      recipient: dto.recipient,
      slippageTolerance: new Percent(
        dto.slippageToleranceBps ?? this.defaultSlippageBps,
        10_000,
      ),
      deadline:
        Math.floor(Date.now() / 1000) +
        (dto.deadlineSeconds ?? this.defaultDeadlineSeconds),
    };

    const route = await router.route(
      amountSpecified,
      quoteCurrency,
      tradeType,
      swapOptions,
    );

    if (!route) {
      throw new BadRequestException('No route found for the requested swap');
    }

    return {
      data: this.mapRouteToResponse(route),
    };
  }

  private mapRouteToResponse(route: SwapRoute): QuoteResponse {
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

  private formatRoutePath(route: SwapRoute['route']): string[][] {
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

  private async toCurrency(
    token: TokenInputDto,
    chainId: number,
  ): Promise<Currency> {
    const normalized = token.address.toLowerCase();
    if (normalized === NATIVE_TOKEN_PLACEHOLDER) {
      return Ether.onChain(chainId as SupportedChainsType);
    }

    const checksumAddress = getAddress(normalized);
    const tokenMetadata = await this.erc20Service.getTokenMetadata(
      checksumAddress,
      chainId,
    );

    if (tokenMetadata.decimals === undefined) {
      throw new BadRequestException(
        `Decimals not provided for token ${checksumAddress}`,
      );
    }

    return new Token(
      chainId as SupportedChainsType,
      checksumAddress,
      tokenMetadata.decimals,
      tokenMetadata.symbol,
      tokenMetadata.name,
    );
  }

  private toCurrencyAmount(
    currency: Currency,
    amount: string,
  ): CurrencyAmount<Currency> {
    const parsed = parseUnits(amount, currency.decimals);
    if (parsed.lte(0)) {
      throw new BadRequestException('amount must be greater than zero');
    }
    return CurrencyAmount.fromRawAmount(currency, parsed.toString());
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
