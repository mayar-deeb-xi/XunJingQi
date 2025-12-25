import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcService } from 'src/lib/rpc/rpc.service';
import { UniswapRouterService } from '../uniswap/uniswap-router.service';
import { QuoteRequestDto } from './dto/quote.dto';

@Injectable()
export class AggregatorService {
  constructor(
    private readonly rpcService: RpcService,
    private readonly uniswapRouterService: UniswapRouterService,
  ) {}

  async findBestRoute(body: QuoteRequestDto) {
    const requestChainId = body.chainId;

    // Check if RPC URL is available for the requested chain
    if (!this.rpcService.hasRpcUrl(requestChainId)) {
      throw new BadRequestException(
        `RPC URL not configured for chain ${requestChainId}`,
      );
    }

    return this.uniswapRouterService.findBestRoute(body);
  }
}
