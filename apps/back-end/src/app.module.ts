import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env-validation.schema';

import { ViemModule } from './lib/viem/viem.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ViemModule,
    MetricsModule,
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true, // Make config available globally
    }),
  ],
})
export class AppModule {}
