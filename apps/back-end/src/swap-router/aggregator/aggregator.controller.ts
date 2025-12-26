import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { BaseResponse, BaseResponseDTO } from 'src/lib/base.dto';
import { AggregatorService } from './aggregator.service';
import { SwapRouteRequestDto } from './dto/swap-route.dto';
import { SwapRouteEntity } from './entities/swap-route.entity';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Post('find-swap-route')
  @SerializeOptions({ type: BaseResponseDTO(SwapRouteEntity) })
  async findRoute(
    @Body() body: SwapRouteRequestDto,
  ): Promise<BaseResponse<SwapRouteEntity>> {
    return this.aggregatorService.findSwapRoute(body);
  }
}
