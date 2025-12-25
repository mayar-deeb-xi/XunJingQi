import { Module } from '@nestjs/common';
import { UniswapRouterModule } from '../uniswap/uniswap-router.module';
import { AggregatorController } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [UniswapRouterModule],
  controllers: [AggregatorController],
  providers: [AggregatorService],
})
export class AggregatorModule {}
