import { Global, Module } from '@nestjs/common';
import { Erc20Service } from './erc20.service';

@Global()
@Module({
  providers: [Erc20Service],
  exports: [Erc20Service],
})
export class Erc20Module {}

