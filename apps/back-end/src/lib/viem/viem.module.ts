import { Global, Module } from '@nestjs/common';
import { ViemPublicClientService } from './viem.service';

@Global()
@Module({
  providers: [ViemPublicClientService],
  exports: [ViemPublicClientService],
})
export class ViemModule {}
