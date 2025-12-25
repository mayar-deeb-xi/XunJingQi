import { Body, Controller, Post } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { QuoteRequestDto } from './dto/quote.dto';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly pathFinderService: AggregatorService) {}

  @Post()
  async getQuote(@Body() body: QuoteRequestDto) {
    return this.pathFinderService.findBestRoute(body);
  }
}
