import { Module } from '@nestjs/common';
import { RpcModule } from '../../lib/rpc/rpc.module';
import { UniswapRouterService } from './uniswap-router.service';

@Module({
  imports: [RpcModule],
  providers: [UniswapRouterService],
  exports: [UniswapRouterService],
})
export class UniswapRouterModule {}
