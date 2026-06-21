import { Controller, Get, Query } from '@nestjs/common';
import { MarketplacesService } from './marketplaces.service';

@Controller('marketplaces')
export class MarketplacesController {
  constructor(private readonly marketplacesService: MarketplacesService) {}

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.marketplacesService.search(keyword);
  }
}