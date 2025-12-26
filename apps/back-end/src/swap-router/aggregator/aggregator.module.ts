import { Module } from '@nestjs/common';
import { RouteFormatterService } from '../uniswap/route-formatter.service';
import { UniswapRouterModule } from '../uniswap/uniswap-router.module';
import { AggregatorController } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [UniswapRouterModule],
  controllers: [AggregatorController],
  providers: [AggregatorService, RouteFormatterService],
})
export class AggregatorModule {}
