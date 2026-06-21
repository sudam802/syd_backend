import { Module } from '@nestjs/common';
import { MarketplacesController } from './marketplaces.controller';
import { MarketplacesService } from './marketplaces.service';
import { EbayAdapter } from './adapters/ebay.adapter';

@Module({
  controllers: [MarketplacesController],
  providers: [MarketplacesService, EbayAdapter],
})
export class MarketplacesModule {}