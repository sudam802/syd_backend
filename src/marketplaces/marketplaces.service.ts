import { Injectable } from '@nestjs/common';
import { EbayAdapter } from './adapters/ebay.adapter';

@Injectable()
export class MarketplacesService {
  constructor(private readonly ebayAdapter: EbayAdapter) {}

  async search(keyword: string) {
    return this.ebayAdapter.search(keyword);
  }
}