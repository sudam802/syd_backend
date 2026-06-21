import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProductResult } from '../interfaces/product-result.interface';

@Injectable()
export class EbayAdapter {
  private accessToken: string | null = null;

  async getAccessToken(): Promise<string> {
    const response = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.EBAY_CLIENT_ID!,
          password: process.env.EBAY_CLIENT_SECRET!,
        },
      },
    );

    this.accessToken = response.data.access_token;

    return this.accessToken!;
  }

  async search(keyword: string): Promise<ProductResult[]> {
    console.log('Searching eBay for:', keyword);
    const token =
      this.accessToken || (await this.getAccessToken());

    const response = await axios.get(
      'https://api.ebay.com/buy/browse/v1/item_summary/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: keyword,
          limit: 10,
        },
      },
    );

    return this.normalize(response.data);
  }

  private normalize(data: any): ProductResult[] {
    const items = data.itemSummaries || [];

    return items.map((item: any) => ({
      title: item.title,
      price: Number(item.price?.value || 0),
      currency: item.price?.currency || 'USD',
      imageUrl: item.image?.imageUrl || '',
      productUrl: item.itemWebUrl,
      store: 'eBay',
      shippingCost: 0,
    }));
  }
}