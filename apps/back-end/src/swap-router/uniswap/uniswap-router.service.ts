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
  SwapOptionsUniversalRouter,
  SwapType,
} from '@uniswap/smart-order-router';
import { getAddress, parseUnits } from 'ethers/lib/utils';
import { Erc20Service } from '../../lib/erc20/erc20.service';
import { RpcService } from '../../lib/rpc/rpc.service';

import { RouterName, UniversalRouterVersion } from '../../enums';
import {
  QuoteTradeType,
  SwapRouteRequestDto,
  TokenInputDto,
} from '../aggregator/dto/swap-route.dto';
import { SwapRouteEntity } from '../aggregator/entities/swap-route.entity';
import { RouteFormatterService } from './route-formatter.service';

const NATIVE_TOKEN_PLACEHOLDER = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

@Injectable()
export class UniswapRouterService {
  private readonly defaultSlippageBps = 50; // 0.50%
  private readonly defaultDeadlineSeconds = 60 * 15; // 15 minutes

  constructor(
    private readonly rpcService: RpcService,
    private readonly erc20Service: Erc20Service,
    private readonly routeFormatterService: RouteFormatterService,
  ) {}

  async findSwapRoute(dto: SwapRouteRequestDto): Promise<SwapRouteEntity> {
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

    const { route, router: routerName } = await this.executeRoute(
      router,
      amountSpecified,
      quoteCurrency,
      tradeType,
      dto,
    );

    if (!route) {
      throw new BadRequestException('No route found for the requested swap');
    }

    return {
      router: routerName,
      route: this.routeFormatterService.mapRouteToResponse(route),
    };
  }

  private async executeRoute(
    router: AlphaRouter,
    amountSpecified: CurrencyAmount<Currency>,
    quoteCurrency: Currency,
    tradeType: TradeType,
    dto: SwapRouteRequestDto,
  ) {
    // Try Universal Router V2
    try {
      const swapOptions: SwapOptionsUniversalRouter = {
        type: SwapType.UNIVERSAL_ROUTER,
        version: UniversalRouterVersion.V2_0,
        recipient: dto.recipient,
        slippageTolerance: new Percent(
          dto.slippageToleranceBps ?? this.defaultSlippageBps,
          10_000,
        ),
        deadlineOrPreviousBlockhash:
          Math.floor(Date.now() / 1000) +
          (dto.deadlineSeconds ?? this.defaultDeadlineSeconds),
      };

      return {
        router: RouterName.UNISWAP_UniversalRouterV2_0,
        route: await router.route(
          amountSpecified,
          quoteCurrency,
          tradeType,
          swapOptions,
        ),
      };
    } catch (error) {
      console.warn('Universal Router V2 failed, attempting V1.2:', error);
    }

    // Try Universal Router V1.2
    try {
      const swapOptions: SwapOptionsUniversalRouter = {
        type: SwapType.UNIVERSAL_ROUTER,
        version: UniversalRouterVersion.V1_2,
        recipient: dto.recipient,
        slippageTolerance: new Percent(
          dto.slippageToleranceBps ?? this.defaultSlippageBps,
          10_000,
        ),
        deadlineOrPreviousBlockhash:
          Math.floor(Date.now() / 1000) +
          (dto.deadlineSeconds ?? this.defaultDeadlineSeconds),
      };

      return {
        router: RouterName.UNISWAP_UniversalRouterV1_2,
        route: await router.route(
          amountSpecified,
          quoteCurrency,
          tradeType,
          swapOptions,
        ),
      };
    } catch (error) {
      console.warn(
        'Universal Router V1.2 failed, attempting SwapRouter02:',
        error,
      );
    }

    // Fallback to SwapRouter02
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

    return {
      router: RouterName.UNISWAP_SWAP_ROUTER_02,
      route: await router.route(
        amountSpecified,
        quoteCurrency,
        tradeType,
        swapOptions,
      ),
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
}
