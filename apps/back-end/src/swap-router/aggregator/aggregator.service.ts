import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/lib/base.dto';
import { RpcService } from 'src/lib/rpc/rpc.service';
import { UniswapRouterService } from '../uniswap/uniswap-router.service';
import { SwapRouteRequestDto } from './dto/swap-route.dto';
import { SwapRouteEntity } from './entities/swap-route.entity';

@Injectable()
export class AggregatorService {
  constructor(
    private readonly rpcService: RpcService,
    private readonly uniswapRouterService: UniswapRouterService,
  ) {}

  async findSwapRoute(
    body: SwapRouteRequestDto,
  ): Promise<BaseResponse<SwapRouteEntity>> {
    const requestChainId = body.chainId;

    // Check if RPC URL is available for the requested chain
    if (!this.rpcService.hasRpcUrl(requestChainId)) {
      throw new BadRequestException(
        `RPC URL not configured for chain ${requestChainId}`,
      );
    }

    const results = await Promise.allSettled<[Promise<SwapRouteEntity>]>([
      this.uniswapRouterService.findSwapRoute(body),
      // Add more route finders here in the future
    ]);

    const fulfilledResults = results
      .filter((el) => el.status === 'fulfilled')
      .map((el) => el.value);

    if (fulfilledResults.length === 0) {
      throw new BadRequestException('No route found from available sources');
    }

    const bestRoute = this.selectBestRoute(fulfilledResults);

    return {
      data: {
        router: bestRoute.router,
        route: bestRoute.route,
      },
    };
  }

  private selectBestRoute(routes: SwapRouteEntity[]): SwapRouteEntity {
    return routes.reduce((best, current) => {
      const bestAmount = best.route.quoteGasAdjusted
        ? parseFloat(best.route.quoteGasAdjusted.amount)
        : parseFloat(best.route.quote.amount);

      const currentAmount = current.route.quoteGasAdjusted
        ? parseFloat(current.route.quoteGasAdjusted.amount)
        : parseFloat(current.route.quote.amount);

      // Return the route with the highest amount (best price)
      return currentAmount > bestAmount ? current : best;
    });
  }
}
