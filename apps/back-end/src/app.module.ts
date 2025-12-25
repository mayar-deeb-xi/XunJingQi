import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env-validation.schema';

import { Erc20Module } from './lib/erc20/erc20.module';
import { RpcModule } from './lib/rpc/rpc.module';
import { MetricsModule } from './metrics/metrics.module';
import { AggregatorModule } from './swap-router/aggregator/aggregator.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    RpcModule,
    Erc20Module,
    MetricsModule,
    AggregatorModule,
    TokenModule,
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true, // Make config available globally
    }),
  ],
})
export class AppModule {}
