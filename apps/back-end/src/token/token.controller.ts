import { Controller, Get, Param, SerializeOptions } from '@nestjs/common';
import { BaseResponseDTO } from '../lib/base.dto';
import { TokenEntity } from './entities/token.entity';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('swappable/:chainId')
  @SerializeOptions({ type: BaseResponseDTO(TokenEntity) })
  async getTokens(@Param('chainId') chainId: number) {
    return this.tokenService.getSwappableTokens(chainId);
  }
}
