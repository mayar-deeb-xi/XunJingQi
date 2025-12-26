import { Module } from '@nestjs/common';
import { RpcModule } from '../../lib/rpc/rpc.module';
import { RouteFormatterService } from './route-formatter.service';
import { UniswapRouterService } from './uniswap-router.service';

@Module({
  imports: [RpcModule],
  providers: [UniswapRouterService, RouteFormatterService],
  exports: [UniswapRouterService],
})
export class UniswapRouterModule {}
